console.log("Starting server file")
require("dotenv/config")

const express = require("express")
const bcrypt = require("bcryptjs")
const cors = require("cors")
const { PrismaClient } = require("@prisma/client")
const { PrismaPg } = require("@prisma/adapter-pg")
const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")
const { decrypt } = require("./crypto-utils")

// Connect to Supabase PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const app = express()
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Menyu backend is alive")
})

app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is healthy" })
})

app.post("/admin/restaurants", async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ message: "Name is required" })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-")

    try {
        const restaurant = await prisma.restaurant.create({
            data: { name, slug }
        })
        res.json(restaurant)
    } catch (err) {
        res.status(400).json({ message: "Restaurant already exists" })
    }
})

// ==========================================
// ANALYTICS — EVENT LOGGING
// ==========================================

// Log an order event (customer clicked "Order via WhatsApp")
app.post("/api/:slug/order", async (req, res) => {
    try {
        const { slug } = req.params
        const { tableNumber, items, totalPrice } = req.body

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Items array is required" })
        }
        if (typeof totalPrice !== "number" || totalPrice <= 0) {
            return res.status(400).json({ message: "Valid totalPrice is required" })
        }

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Create order event
        const order = await prisma.orderEvent.create({
            data: {
                restaurantId: restaurant.id,
                tableNumber: tableNumber || "unknown",
                items: items,
                totalPrice: totalPrice
            }
        })

        res.status(201).json({ message: "Order logged", id: order.id })
    } catch (err) {
        console.error("Order logging error:", err)
        res.status(500).json({ message: "Failed to log order" })
    }
})

// Update payment status of an order (restaurant owner changes status)
app.patch("/api/:slug/orders/:orderId/status", async (req, res) => {
    try {
        const { slug } = req.params
        const { orderId } = req.params
        const { status, password } = req.body

        // Password protection
        const slugUpper = slug.toUpperCase().replace(/-/g, '_')
        const analyticsPassword = process.env[`${slugUpper}_ANALYTICS_PASSWORD`] || process.env.ANALYTICS_PASSWORD
        if (analyticsPassword) {
            const isPasswordValid = bcrypt.compareSync(password || "", analyticsPassword)
            const isUsernameValid = req.body.username === process.env.ANALYTICS_USERNAME
            if (!isPasswordValid || !isUsernameValid) {
                return res.status(401).json({ message: "Unauthorized. Invalid username or password." })
            }
        }

        // Validate status value
        const validStatuses = ["paid", "unpaid", "ignore"]
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be: paid, unpaid, or ignore" })
        }

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Update the order's payment status
        const updatedOrder = await prisma.orderEvent.update({
            where: { id: orderId },
            data: { paymentStatus: status }
        })

        res.json({ message: "Status updated", id: updatedOrder.id, paymentStatus: updatedOrder.paymentStatus })
    } catch (err) {
        console.error("Status update error:", err)
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Order not found" })
        }
        res.status(500).json({ message: "Failed to update status" })
    }
})

// Delete an order (restaurant owner removes an order from analytics)
app.delete("/api/:slug/orders/:orderId", async (req, res) => {
    try {
        const { slug, orderId } = req.params
        const { password } = req.body

        // Password protection
        const slugUpper = slug.toUpperCase().replace(/-/g, '_')
        const analyticsPassword = process.env[`${slugUpper}_ANALYTICS_PASSWORD`] || process.env.ANALYTICS_PASSWORD
        if (analyticsPassword) {
            const isPasswordValid = bcrypt.compareSync(password || "", analyticsPassword)
            const isUsernameValid = req.body.username === process.env.ANALYTICS_USERNAME
            if (!isPasswordValid || !isUsernameValid) {
                return res.status(401).json({ message: "Unauthorized. Invalid username or password." })
            }
        }

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Delete the order
        await prisma.orderEvent.delete({
            where: { id: orderId }
        })

        res.json({ message: "Order deleted", id: orderId })
    } catch (err) {
        console.error("Order delete error:", err)
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Order not found" })
        }
        res.status(500).json({ message: "Failed to delete order" })
    }
})

// Log a payment event (customer clicked "Pay The Bill")
app.post("/api/:slug/payment", async (req, res) => {
    try {
        const { slug } = req.params
        const { tableNumber, amount, items, orderIds } = req.body

        // Validate required fields
        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Valid amount is required" })
        }

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Create payment event
        const payment = await prisma.paymentEvent.create({
            data: {
                restaurantId: restaurant.id,
                tableNumber: tableNumber || "unknown",
                amount: amount,
                items: items || []
            }
        })

        res.status(201).json({ message: "Payment logged", id: payment.id })
    } catch (err) {
        console.error("Payment logging error:", err)
        res.status(500).json({ message: "Failed to log payment" })
    }
})

// ==========================================
// EVENTS — LOG QR SCAN
// ==========================================

app.post("/api/:slug/scan", async (req, res) => {
    try {
        const { slug } = req.params
        const { tableNumber } = req.body

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Create scan event
        await prisma.scanEvent.create({
            data: {
                restaurantId: restaurant.id,
                tableNumber: tableNumber ? String(tableNumber) : null
            }
        })

        res.status(200).json({ message: "Scan logged successfully" })
    } catch (err) {
        console.error("Scan logging error:", err)
        res.status(500).json({ message: "Failed to log scan" })
    }
})

// ==========================================
// ADMIN ANALYTICS — GLOBAL DASHBOARD
// ==========================================

app.get("/api/admin/analytics", async (req, res) => {
    try {
        const { range, from, to, password } = req.query

        // Password protection for admin analytics
        const analyticsPassword = process.env.ADMIN_ANALYTICS_PASSWORD || process.env.ANALYTICS_PASSWORD
        const analyticsUsername = process.env.ANALYTICS_USERNAME
        if (analyticsPassword || analyticsUsername) {
            const isPasswordValid = bcrypt.compareSync(password || "", analyticsPassword)
            const isUsernameValid = req.query.username === analyticsUsername
            if (!isPasswordValid || !isUsernameValid) {
                return res.status(401).json({ message: "Unauthorized. Invalid username or password." })
            }
        }

        // Calculate date range (IST = UTC+5:30)
        const now = new Date()
        let dateFrom, dateTo

        switch (range) {
            case "today": {
                dateFrom = new Date(now)
                dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                if (dateFrom > now) dateFrom.setDate(dateFrom.getDate() - 1)

                dateTo = new Date(dateFrom)
                dateTo.setDate(dateTo.getDate() + 1)
                break
            }
            case "week": {
                dateTo = new Date(now)
                dateFrom = new Date(now)
                dateFrom.setDate(now.getDate() - 7)
                dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                break
            }
            case "month": {
                dateTo = new Date(now)
                dateFrom = new Date(now)
                dateFrom.setDate(1)
                dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                break
            }
            case "year": {
                dateTo = new Date(now)
                dateFrom = new Date(now)
                dateFrom.setMonth(0, 1)
                dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                break
            }
            case "custom": {
                if (from && to) {
                    dateFrom = new Date(from)
                    dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                    dateTo = new Date(to)
                    dateTo.setUTCHours(23 - 5, 59 - 30, 59, 999)
                } else {
                    return res.status(400).json({ message: "Custom range format error" })
                }
                break
            }
            default: {
                dateFrom = new Date(now)
                dateFrom.setUTCHours(0 - 5, 30 - 30, 0, 0)
                if (dateFrom > now) dateFrom.setDate(dateFrom.getDate() - 1)
            dateTo = new Date(dateFrom)
                dateTo.setDate(dateTo.getDate() + 1)
            }
        }

        const dateFilter = {
            gte: dateFrom,
            lt: dateTo
        }

        // 1. Get all restaurants
        const restaurants = await prisma.restaurant.findMany({
            select: { id: true, name: true, slug: true }
        })

        // 2. Aggregate data grouped by restaurantId

        // Orders
        const orderGroups = await prisma.orderEvent.groupBy({
            by: ['restaurantId'],
            where: { createdAt: dateFilter },
            _count: { id: true },
            _sum: { totalPrice: true }
        })

        // Payments
        const paymentGroups = await prisma.paymentEvent.groupBy({
            by: ['restaurantId'],
            where: { createdAt: dateFilter },
            _count: { id: true },
            _sum: { amount: true }
        })

        // Scans
        const scanGroups = await prisma.scanEvent.groupBy({
            by: ['restaurantId'],
            where: { createdAt: dateFilter },
            _count: { id: true }
        })

        // 3. Process the aggregated data
        const globalSummary = {
            totalScans: 0,
            totalOrders: 0,
            totalPayments: 0,
            totalOrderAmount: 0,
            totalPaymentAmount: 0
        }

        const restaurantData = restaurants.map(rest => {
            const ord = orderGroups.find(g => g.restaurantId === rest.id) || { _count: { id: 0 }, _sum: { totalPrice: 0 } }
            const pay = paymentGroups.find(g => g.restaurantId === rest.id) || { _count: { id: 0 }, _sum: { amount: 0 } }
            const sc = scanGroups.find(g => g.restaurantId === rest.id) || { _count: { id: 0 } }

            // Add to global summary
            globalSummary.totalScans += sc._count.id
            globalSummary.totalOrders += ord._count.id
            globalSummary.totalPayments += pay._count.id
            globalSummary.totalOrderAmount += (ord._sum.totalPrice || 0)
            globalSummary.totalPaymentAmount += (pay._sum.amount || 0)

            return {
                name: rest.name,
                slug: rest.slug,
                scans: sc._count.id,
                orders: ord._count.id,
                payments: pay._count.id,
                orderRevenue: ord._sum.totalPrice || 0,
                paymentAmount: pay._sum.amount || 0
            }
        })

        res.json({
            summary: globalSummary,
            restaurants: restaurantData,
            dateRange: {
                from: dateFrom.toISOString(),
                to: dateTo.toISOString(),
                range: range || "today"
            }
        })
    } catch (err) {
        console.error("Admin analytics query error:", err)
        res.status(500).json({ message: "Failed to fetch admin analytics" })
    }
})

// ==========================================
// ANALYTICS — QUERY ENDPOINT
// ==========================================

app.get("/api/:slug/analytics", async (req, res) => {
    try {
        const { slug } = req.params
        const { range, from, to, password } = req.query

        // Password protection for analytics
        const slugUpper = slug.toUpperCase().replace(/-/g, '_')
        const analyticsPassword = process.env[`${slugUpper}_ANALYTICS_PASSWORD`] || process.env.ANALYTICS_PASSWORD
        const analyticsUsername = process.env.ANALYTICS_USERNAME
        if (analyticsPassword || analyticsUsername) {
            const isPasswordValid = bcrypt.compareSync(password || "", analyticsPassword)
            const isUsernameValid = req.query.username === analyticsUsername
            if (!isPasswordValid || !isUsernameValid) {
                return res.status(401).json({ message: "Unauthorized. Invalid username or password." })
            }
        }

        // Find restaurant
        const restaurant = await prisma.restaurant.findUnique({ where: { slug } })
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" })
        }

        // Calculate date range (IST = UTC+5:30)
        const now = new Date()
        let dateFrom, dateTo

        // Helper: get start of today in IST (UTC+5:30) using epoch math (timezone-independent)
        function getISTMidnightUTC(date) {
            const istOffsetMs = 5.5 * 60 * 60 * 1000
            const msPerDay = 24 * 60 * 60 * 1000
            const istNowMs = date.getTime() + istOffsetMs
            const istMidnightMs = istNowMs - (istNowMs % msPerDay)
            return new Date(istMidnightMs - istOffsetMs)
        }

        switch (range) {
            case "today": {
                dateFrom = getISTMidnightUTC(now)
                dateTo = now
                break
            }
            case "week": {
                dateFrom = new Date(now)
                dateFrom.setDate(dateFrom.getDate() - 7)
                dateTo = now
                break
            }
            case "month": {
                dateFrom = new Date(now)
                dateFrom.setMonth(dateFrom.getMonth() - 1)
                dateTo = now
                break
            }
            case "year": {
                dateFrom = new Date(now)
                dateFrom.setFullYear(dateFrom.getFullYear() - 1)
                dateTo = now
                break
            }
            case "custom": {
                if (!from || !to) {
                    return res.status(400).json({ message: "Custom range requires 'from' and 'to' query params" })
                }
                dateFrom = new Date(from)
                dateTo = new Date(to)
                // Set dateTo to end of that day
                dateTo.setHours(23, 59, 59, 999)
                break
            }
            default: {
                dateFrom = getISTMidnightUTC(now)
                dateTo = now
                break
            }
        }

        // Query orders
        const orders = await prisma.orderEvent.findMany({
            where: {
                restaurantId: restaurant.id,
                createdAt: { gte: dateFrom, lte: dateTo }
            },
            orderBy: { createdAt: "desc" }
        })

        // Query payments
        const payments = await prisma.paymentEvent.findMany({
            where: {
                restaurantId: restaurant.id,
                createdAt: { gte: dateFrom, lte: dateTo }
            },
            orderBy: { createdAt: "desc" }
        })

        // Build response
        res.json({
            restaurant: { name: restaurant.name, slug: restaurant.slug },
            dateRange: {
                from: dateFrom.toISOString(),
                to: dateTo.toISOString(),
                range: range || "today"
            },
            summary: {
                totalOrders: orders.length,
                totalOrderAmount: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalPrice, 0),
                totalPayments: payments.length,
                totalPaymentAmount: payments.reduce((sum, p) => sum + p.amount, 0),
                unpaidAmount: orders.filter(o => o.paymentStatus === "unpaid").reduce((sum, o) => sum + o.totalPrice, 0),
                ignoredAmount: orders.filter(o => o.paymentStatus === "ignore").reduce((sum, o) => sum + o.totalPrice, 0)
            },
            orders: orders.map((o, i) => ({
                sno: i + 1,
                id: o.id,
                items: o.items,
                totalPrice: o.totalPrice,
                tableNumber: o.tableNumber,
                time: o.createdAt,
                paymentStatus: o.paymentStatus
            })),
            payments: payments.map((p, i) => ({
                sno: i + 1,
                amount: p.amount,
                items: p.items,
                tableNumber: p.tableNumber,
                time: p.createdAt
            }))
        })
    } catch (err) {
        console.error("Analytics query error:", err)
        res.status(500).json({ message: "Failed to fetch analytics" })
    }
})

app.get("/:slug", async (req, res) => {
    const { slug } = req.params

    const restaurant = await prisma.restaurant.findUnique({
        where: { slug }
    })

    if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" })
    }

    res.json(restaurant)
})

// ==========================================
// SECURE REDIRECT ENDPOINTS
// ==========================================
// These endpoints decrypt sensitive data (WhatsApp, UPI) from
// encrypted .env values and return constructed URLs.
// Raw values are never sent in the response.

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

// Helper: get encrypted config for a restaurant slug
function getRestaurantSecrets(slug) {
    const slugUpper = slug.toUpperCase().replace(/-/g, '_')
    const whatsappEnc = process.env[`${slugUpper}_WHATSAPP_ENCRYPTED`]
    const upiEnc = process.env[`${slugUpper}_UPI_ENCRYPTED`]
    return { whatsappEnc, upiEnc }
}

// POST /api/:slug/whatsapp-redirect
// Body: { message: "formatted WhatsApp message" }
// Returns: { url: "https://wa.me/..." }
app.post("/api/:slug/whatsapp-redirect", (req, res) => {
    try {
        const { slug } = req.params
        const { message } = req.body

        if (!message) {
            return res.status(400).json({ message: "Message is required" })
        }

        if (!ENCRYPTION_KEY) {
            return res.status(500).json({ message: "Encryption not configured" })
        }

        const { whatsappEnc } = getRestaurantSecrets(slug)
        if (!whatsappEnc) {
            return res.status(404).json({ message: "Restaurant config not found" })
        }

        // Decrypt in memory — value exists only for this request
        const whatsappNumber = decrypt(whatsappEnc, ENCRYPTION_KEY)
        const encoded = encodeURIComponent(message)
        const url = `https://wa.me/${whatsappNumber}?text=${encoded}`

        res.json({ url })
    } catch (err) {
        console.error("WhatsApp redirect error:", err.message)
        res.status(500).json({ message: "Failed to generate redirect" })
    }
})

// POST /api/:slug/upi-redirect
// Body: { amount: 500, name: "Paradise" }
// Returns: { url: "upi://pay?pa=..." }
app.post("/api/:slug/upi-redirect", (req, res) => {
    try {
        const { slug } = req.params
        const { amount, name } = req.body

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Valid amount is required" })
        }

        if (!ENCRYPTION_KEY) {
            return res.status(500).json({ message: "Encryption not configured" })
        }

        const { upiEnc } = getRestaurantSecrets(slug)
        if (!upiEnc) {
            return res.status(404).json({ message: "Restaurant config not found" })
        }

        // Decrypt in memory — value exists only for this request
        const upiId = decrypt(upiEnc, ENCRYPTION_KEY)
        const url = `upi://pay?pa=${upiId}`
            + `&pn=${encodeURIComponent(name || slug)}`
            + `&am=${amount}`
            + `&cu=INR`

        res.json({ url })
    } catch (err) {
        console.error("UPI redirect error:", err.message)
        res.status(500).json({ message: "Failed to generate redirect" })
    }
})

// POST /api/admin/change-password
// Body: { username, currentPassword, newPassword }
app.post("/api/admin/change-password", async (req, res) => {
    console.log("Change password request received:", req.body.username);
    try {
        const { username, currentPassword, newPassword } = req.body

        if (!username || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" })
        }

        const analyticsUsername = process.env.ANALYTICS_USERNAME
        const analyticsPassword = process.env.ADMIN_ANALYTICS_PASSWORD || process.env.ANALYTICS_PASSWORD

        // 1. Validate current credentials
        const isUsernameValid = username === analyticsUsername
        const isPasswordValid = bcrypt.compareSync(currentPassword, analyticsPassword)

        if (!isUsernameValid || !isPasswordValid) {
            return res.status(401).json({ message: "Unauthorized. Invalid current username or password." })
        }

        // 2. Hash new password
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(newPassword, salt)

        // 3. Update .env file
        const envPath = path.join(__dirname, '.env')
        let envContent = fs.readFileSync(envPath, 'utf8')

        const adminPasswordRegex = /^ADMIN_ANALYTICS_PASSWORD=.*$/m
        if (envContent.match(adminPasswordRegex)) {
            envContent = envContent.replace(adminPasswordRegex, `ADMIN_ANALYTICS_PASSWORD="${passwordHash}"`)
        } else {
            envContent += `\nADMIN_ANALYTICS_PASSWORD="${passwordHash}"`
        }

        // Also update the legacy key for fallback
        const legacyPasswordRegex = /^ANALYTICS_PASSWORD=.*$/m
        if (envContent.match(legacyPasswordRegex)) {
            envContent = envContent.replace(legacyPasswordRegex, `ANALYTICS_PASSWORD="${passwordHash}"`)
        }

        fs.writeFileSync(envPath, envContent)

        // 4. Update in-memory values
        process.env.ADMIN_ANALYTICS_PASSWORD = passwordHash
        process.env.ANALYTICS_PASSWORD = passwordHash

        res.json({ message: "Password updated successfully" })
    } catch (err) {
        console.error("Change password error:", err)
        res.status(500).json({ message: "Failed to update password" })
    }
})

// ==========================================
// FORGOT PASSWORD FLOW
// ==========================================

// Step 1: Verify Restaurant Name + Phone Number
app.post("/api/forgot-password/verify", async (req, res) => {
    try {
        const { restaurantName, phoneNumber } = req.body

        if (!restaurantName || !phoneNumber) {
            return res.status(400).json({ message: "Username/Restaurant name and phone number are required" })
        }

        let whatsappEnc = null;
        let target = null;

        // 1. Check if it's the global Admin
        if (restaurantName.toLowerCase() === 'admin' || restaurantName.toLowerCase() === 'menyu@admin') {
            whatsappEnc = process.env.ADMIN_WHATSAPP_ENCRYPTED;
            target = 'admin';
        } else {
            // 2. Find restaurant by name
            const restaurant = await prisma.restaurant.findFirst({
                where: { name: { equals: restaurantName, mode: 'insensitive' } }
            })

            if (!restaurant) {
                return res.status(404).json({ message: "Restaurant or Admin user not found" })
            }

            const secrets = getRestaurantSecrets(restaurant.slug);
            whatsappEnc = secrets.whatsappEnc;
            target = restaurant.slug;
        }

        if (!whatsappEnc) {
            return res.status(404).json({ message: "Registered phone number config not found" })
        }

        // 3. Decrypt and verify
        const decryptedPhone = decrypt(whatsappEnc, ENCRYPTION_KEY)
        
        // Clean both numbers for comparison
        const cleanInput = phoneNumber.replace(/\D/g, '')
        const cleanStored = decryptedPhone.replace(/\D/g, '')

        if (!cleanInput || cleanInput !== cleanStored) {
            return res.status(401).json({ message: "Incorrect phone number" })
        }

        res.json({ message: "Verification successful", target })
    } catch (err) {
        console.error("Forgot password verify error:", err)
        res.status(500).json({ message: "Failed to verify details" })
    }
})

// Step 2: Reset Password with Secret Code
app.post("/api/forgot-password/reset", async (req, res) => {
    try {
        const { secretCode, newPassword, target } = req.body

        if (!secretCode || !newPassword || !target) {
            return res.status(400).json({ message: "Secret code, target, and new password are required" })
        }

        // 1. Validate fixed secret code
        if (secretCode !== "forgot@pw123") {
            return res.status(401).json({ message: "Invalid secret code" })
        }

        // 2. Hash new password
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(newPassword, salt)

        // 3. Update .env file
        const envPath = path.join(__dirname, '.env')
        let envContent = fs.readFileSync(envPath, 'utf8')

        const targetKey = target === 'admin' ? 'ADMIN_ANALYTICS_PASSWORD' : `${target.toUpperCase().replace(/-/g, '_')}_ANALYTICS_PASSWORD`
        const passwordRegex = new RegExp(`^${targetKey}=.*$`, 'm')
        
        if (envContent.match(passwordRegex)) {
            envContent = envContent.replace(passwordRegex, `${targetKey}="${passwordHash}"`)
        } else {
            envContent += `\n${targetKey}="${passwordHash}"`
        }

        // If updating admin, also update legacy key for compatibility
        if (target === 'admin') {
            const legacyPasswordRegex = /^ANALYTICS_PASSWORD=.*$/m
            if (envContent.match(legacyPasswordRegex)) {
                envContent = envContent.replace(legacyPasswordRegex, `ANALYTICS_PASSWORD="${passwordHash}"`)
            }
        }

        fs.writeFileSync(envPath, envContent)

        // 4. Update in-memory process.env
        process.env[targetKey] = passwordHash
        if (target === 'admin') process.env.ANALYTICS_PASSWORD = passwordHash

        res.json({ message: "Password updated successfully" })
    } catch (err) {
        console.error("Forgot password reset error:", err)
        res.status(500).json({ message: "Failed to reset password" })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})