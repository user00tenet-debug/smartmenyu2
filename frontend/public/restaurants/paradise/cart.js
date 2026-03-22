// ==========================================
// RESTAURANT CONFIG
// ==========================================

const restaurantConfig = {
    name: 'Paradise',
    slug: 'paradise',
    apiBaseUrl: ''
};

// ==========================================
// CART PAGE — LOGIC
// ==========================================

function getCart() {
    try { return JSON.parse(localStorage.getItem('paradiseCart')) || []; }
    catch (e) { return []; }
}

function saveCart(cart) {
    localStorage.setItem('paradiseCart', JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const listEl = document.getElementById('cartItemsList');
    const emptyEl = document.getElementById('cartEmpty');
    const orderSection = document.getElementById('cartOrderSection');

    if (!listEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = '';
        if (emptyEl) emptyEl.style.display = 'block';
        if (orderSection) orderSection.style.display = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (orderSection) orderSection.style.display = 'block';

    listEl.innerHTML = cart.map((item, index) => {
        if (item.locked) {
            return `
                <div class="cart-item-card locked-item" data-index="${index}" style="opacity: 0.6; background-color: #f9f9f9;">
                    <div class="cart-item-info" style="pointer-events: none;">
                        <div class="cart-item-name">✅ ${item.name} <span style="font-size: 11px; color: #16a34a;">(Ordered)</span></div>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <div class="cart-qty-row" style="pointer-events: none;">
                        <span class="cart-qty-value" style="margin-right: 15px;">Qty: ${item.qty}</span>
                    </div>
                    <button class="cart-delete-btn" onclick="deleteItem(${index})" title="Remove item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4h6v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="cart-item-card" data-index="${index}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                    <div class="cart-qty-row">
                        <button class="cart-qty-btn" onclick="changeQty(${index}, -1)">−</button>
                        <span class="cart-qty-value">${item.qty}</span>
                        <button class="cart-qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <button class="cart-delete-btn" onclick="deleteItem(${index})" title="Remove item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4h6v2"></path>
                        </svg>
                    </button>
                </div>
            `;
        }
    }).join('');
}

function changeQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
    renderCart();
}

function deleteItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// Order button — build WhatsApp message
document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const orderBtn = document.getElementById('cartOrderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', async () => {
            const cart = getCart();

            // Filter for only unlocked (new) items
            const newItems = cart.filter(item => !item.locked);

            // Prevent empty or completely locked cart from ordering
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items first.');
                return;
            }
            if (newItems.length === 0) {
                alert('All items in your cart have already been ordered.');
                return;
            }

            // Read table number
            const tableNumber = localStorage.getItem('paradiseTable') || 'unknown';

            // Calculate total of ONLY new items (extract numeric value from price string like ₹210)
            const newTotal = newItems.reduce((sum, item) => {
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                return sum + (priceNum * item.qty);
            }, 0);

            // Log order event to analytics FIRST to get order ID
            let orderId = '';
            try {
                const orderResp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableNumber, items: newItems, totalPrice: newTotal })
                });
                const orderData = await orderResp.json();
                orderId = orderData.id || '';
            } catch (err) {
                console.log('Analytics log failed:', err);
            }

            // Format order ID for display (use last 8 chars of UUID, uppercase)
            const shortId = orderId ? '#' + orderId.slice(-8).toUpperCase() : '#--------';

            // Format date & time in IST
            const now = new Date();
            const day = now.toLocaleDateString('en-IN', { day: '2-digit' });
            const month = now.toLocaleDateString('en-IN', { month: 'long' });
            const year = now.toLocaleDateString('en-IN', { year: 'numeric' });
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 || 12;
            const dateTimeStr = `${day} ${month} ${year}, ${displayHour}:${minutes} ${ampm}`;

            // Emoji number prefixes
            const emojiNums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            // Build items list with numbered emojis
            let itemsList = '';
            newItems.forEach((item, i) => {
                const prefix = emojiNums[i] || `${i + 1}.`;
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                const lineTotal = priceNum * item.qty;
                itemsList += `${prefix} ${item.name} ×${item.qty} — ₹${lineTotal}\n`;
            });

            // Build the exact message
            let message = `🔴 NEW DINE-IN ORDER\n\n`;
            message += `Restaurant: ${restaurantConfig.name}\n`;
            message += `Order ID: ${shortId}\n`;
            message += `Table: ${tableNumber}\n`;
            message += `Date & Time: ${dateTimeStr}\n\n`;
            message += `-------------------------\n\n`;
            message += `ITEMS\n`;
            message += itemsList;
            message += `\n-------------------------\n\n`;
            message += `TOTAL: ₹${newTotal.toLocaleString('en-IN')}\n`;
            message += `PAYMENT STATUS: Pending\n\n`;
            message += `Please prepare this order for Table ${tableNumber}.`;

            // Get WhatsApp URL from backend (secure — no raw number in frontend)
            try {
                const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/whatsapp-redirect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                const data = await resp.json();

                // After successful order logic (or right before redirect), lock the items
                cart.forEach(item => item.locked = true);
                saveCart(cart);
                renderCart();

                if (data.url) window.location.href = data.url;
            } catch (err) {
                console.error('WhatsApp redirect failed:', err);
                alert('Could not open WhatsApp. Please try again.');
            }
        });
    }

    // Home Delivery button — WhatsApp with delivery message
    const deliveryBtn = document.getElementById('cartDeliveryBtn');
    if (deliveryBtn) {
        deliveryBtn.addEventListener('click', async () => {
            const cart = getCart();

            if (cart.length === 0) {
                alert('Your cart is empty. Please add items first.');
                return;
            }

            // Calculate total first
            const total = cart.reduce((sum, item) => {
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                return sum + (priceNum * item.qty);
            }, 0);

            // Log Home Delivery order to analytics FIRST to get real database order ID
            let orderId = '';
            try {
                const orderResp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tableNumber: 'Home Delivery', items: cart, totalPrice: total })
                });
                const orderData = await orderResp.json();
                orderId = orderData.id || '';
            } catch (err) {
                console.log('Analytics log failed:', err);
            }

            // Format order ID for display (use last 8 chars of backend UUID, uppercase)
            const shortId = orderId ? '#H' + orderId.slice(-8).toUpperCase() : '#H--------';

            // Format date & time in IST
            const now = new Date();
            const day = now.toLocaleDateString('en-IN', { day: '2-digit' });
            const month = now.toLocaleDateString('en-IN', { month: 'long' });
            const year = now.toLocaleDateString('en-IN', { year: 'numeric' });
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 || 12;
            const dateTimeStr = `${day} ${month} ${year}, ${displayHour}:${minutes} ${ampm}`;

            // Emoji number prefixes
            const emojiNums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

            // Build items list with numbered emojis
            let itemsList = '';
            cart.forEach((item, i) => {
                const prefix = emojiNums[i] || `${i + 1}.`;
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                const lineTotal = priceNum * item.qty;
                itemsList += `${prefix} ${item.name} ×${item.qty} — ₹${lineTotal}\n`;
            });

            // (Total already calculated above)

            // Build the exact message
            let message = `🟢 HOME DELIVERY ORDER\n\n`;
            message += `Restaurant: ${restaurantConfig.name}\n`;
            message += `Order ID: ${shortId}\n`;
            message += `Date & Time: ${dateTimeStr}\n\n`;
            message += `-------------------------\n\n`;
            message += `ITEMS\n`;
            message += itemsList;
            message += `\n-------------------------\n\n`;
            message += `TOTAL: ₹${total.toLocaleString('en-IN')}\n`;
            message += `PAYMENT STATUS: Pending\n\n`;
            message += `Please share the following details to proceed with delivery:\n\n`;
            message += `📍 Delivery Address\n`;
            message += `• Send text address, or\n`;
            message += `• Share 📍 Google Maps location\n\n`;
            message += `💳 Payment Receipt\n`;
            message += `• Please share the payment screenshot/receipt from your UPI app.\n\n`;
            message += `Thank you.`;

            // Get WhatsApp URL from backend (secure)
            try {
                const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/whatsapp-redirect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });
                const data = await resp.json();
                if (data.url) window.location.href = data.url;
            } catch (err) {
                console.error('WhatsApp redirect failed:', err);
                alert('Could not open WhatsApp. Please try again.');
            }
        });
    }

    // Pay The Bill button — UPI deep link via backend
    const payBtn = document.getElementById('cartPayBtn');
    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            const cart = getCart();

            if (cart.length === 0) {
                alert('Your cart is empty. Please add items first.');
                return;
            }

            // Calculate total
            const total = cart.reduce((sum, item) => {
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                return sum + (priceNum * item.qty);
            }, 0);

            // Log payment event to analytics (fire-and-forget)
            const tableNumber = localStorage.getItem('paradiseTable') || 'unknown';

            fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableNumber, amount: total, items: cart })
            }).catch(err => console.log('Analytics log failed:', err));

            // Clear cart after payment
            saveCart([]);
            renderCart();

            // Get UPI URL from backend (secure — no raw UPI ID in frontend)
            try {
                const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/upi-redirect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: total, name: restaurantConfig.name })
                });
                const data = await resp.json();
                if (data.url) window.location.href = data.url;
            } catch (err) {
                console.error('UPI redirect failed:', err);
                alert('Could not open UPI app. Please try again.');
            }
        });
    }
});

