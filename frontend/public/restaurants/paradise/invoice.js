// ==========================================
// RESTAURANT CONFIG
// ==========================================
const restaurantConfig = {
    name: 'Paradise',
    slug: 'paradise',
    apiBaseUrl: ''
};

// Local state
let invoiceCart = [];
let currentInvoiceId = ''; // Global ID for the active invoice preview
let currentCaptchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    currentCaptchaAnswer = num1 + num2;
    const promptEl = document.getElementById('captchaPrompt');
    if (promptEl) promptEl.textContent = `What is ${num1} + ${num2}?`;
    const inputEl = document.getElementById('captchaInput');
    if (inputEl) inputEl.value = '';
}

// ==========================================
// LOGIN GATE
// ==========================================

const INVOICE_CREDS = { username: 'invoice', password: '1111' };

function initInvoiceLogin() {
    const loginBtn = document.getElementById('invoiceLoginBtn');
    const usernameInput = document.getElementById('invoiceUsername');
    const passwordInput = document.getElementById('invoicePassword');
    const captchaInputEl = document.getElementById('captchaInput');
    const loginError = document.getElementById('invoiceLoginError');

    generateCaptcha();

    function attemptLogin() {
        const u = usernameInput.value.trim();
        const p = passwordInput.value.trim();
        const captchaVal = captchaInputEl ? captchaInputEl.value.trim() : '';

        if (!u) { usernameInput.focus(); return; }
        if (!p) { passwordInput.focus(); return; }
        
        if (captchaInputEl && !captchaVal) {
            loginError.textContent = 'Please solve the math puzzle.';
            loginError.style.display = 'block';
            captchaInputEl.focus();
            return;
        }

        if (captchaInputEl && parseInt(captchaVal) !== currentCaptchaAnswer) {
            loginError.textContent = 'Incorrect math answer.';
            loginError.style.display = 'block';
            generateCaptcha();
            captchaInputEl.focus();
            return;
        }

        if (u === INVOICE_CREDS.username && p === INVOICE_CREDS.password) {
            sessionStorage.setItem('invoice_auth', 'true');
            unlockInvoicePage();
        } else {
            loginError.textContent = 'Wrong username or password.';
            loginError.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
            generateCaptcha();
        }
    }

    loginBtn.addEventListener('click', attemptLogin);
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptLogin(); });
    });
    usernameInput.focus();
}

function unlockInvoicePage() {
    document.getElementById('invoiceLoginOverlay').style.display = 'none';
    document.getElementById('invoiceContent').style.display = 'block';
    initCategories();
    renderItems('all', '');
    setupEventListeners();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('invoice_auth') === 'true') {
        unlockInvoicePage();
    } else {
        initInvoiceLogin();
    }
});

// Render the category pills
function initCategories() {
    const pillsContainer = document.getElementById('categoryPills');
    if (!pillsContainer) return;

    // "All" is active by default in HTML
    
    foodCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-pill';
        btn.textContent = cat.title;
        btn.dataset.category = cat.key;
        btn.addEventListener('click', (e) => {
            // Update active state
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            
            // Re-render items
            const currentSearch = document.getElementById('itemSearch').value;
            renderItems(cat.key, currentSearch);
        });
        pillsContainer.appendChild(btn);
    });

    // Special click for "All"
    const allPill = pillsContainer.querySelector('[data-category="all"]');
    if (allPill) {
        allPill.addEventListener('click', () => {
            document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
            allPill.classList.add('active');
            const currentSearch = document.getElementById('itemSearch').value;
            renderItems('all', currentSearch);
        });
    }
}

// Render the menu items based on filters
function renderItems(category, search) {
    const listContainer = document.getElementById('invoiceItemsList');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    const filtered = menuItems.filter(item => {
        const matchesCategory = (category === 'all' || item.foodCategory === category);
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                             item.foodCategory.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        listContainer.innerHTML = '<div class="no-items">No items found matching your filter.</div>';
        return;
    }

    filtered.forEach(item => {
        const cartItem = invoiceCart.find(i => i.key === item.key);
        const quantity = cartItem ? cartItem.quantity : 0;

        const itemRow = document.createElement('div');
        itemRow.className = 'item-row' + (quantity > 0 ? ' selected' : '');
        
        itemRow.innerHTML = `
            <div class="col-name">
                <span class="item-title">${item.title}</span>
                <span class="item-category-label">${item.foodCategory}</span>
            </div>
            <div class="col-price">${item.price}</div>
            <div class="col-action">
                <div class="quantity-controls">
                    <button class="qty-btn minus" onclick="updateItemQuantity('${item.key}', -1)">–</button>
                    <span class="qty-count">${quantity}</span>
                    <button class="qty-btn plus" onclick="updateItemQuantity('${item.key}', 1)">+</button>
                </div>
            </div>
        `;
        listContainer.appendChild(itemRow);
    });
}

// Update quantity of an item in the invoice cart
window.updateItemQuantity = function(itemKey, change) {
    const item = menuItems.find(i => i.key === itemKey);
    if (!item) return;

    const existingIndex = invoiceCart.findIndex(i => i.key === itemKey);
    
    if (existingIndex > -1) {
        invoiceCart[existingIndex].quantity += change;
        if (invoiceCart[existingIndex].quantity <= 0) {
            invoiceCart.splice(existingIndex, 1);
        }
    } else if (change > 0) {
        // Parse numerical price (strip ₹)
        const numericPrice = parseInt(item.price.replace('₹', '')) || 0;
        invoiceCart.push({
            ...item,
            numericPrice,
            quantity: 1
        });
    }

    updateCartUI();
    
    // Partially re-render only the list to update counts or refresh everything (safer for small lists)
    const activeCategory = document.querySelector('.category-pill.active')?.dataset.category || 'all';
    const currentSearch = document.getElementById('itemSearch').value;
    renderItems(activeCategory, currentSearch);
};

// Update the bottom footer UI
function updateCartUI() {
    const summary = document.getElementById('invoiceCartSummary');
    const countDisplay = document.getElementById('totalItemCount');
    const amountDisplay = document.getElementById('totalAmount');

    if (invoiceCart.length === 0) {
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'flex';
    
    const totalCount = invoiceCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = invoiceCart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);

    countDisplay.textContent = `${totalCount} item${totalCount !== 1 ? 's' : ''} selected`;
    amountDisplay.textContent = `Subtotal: ₹${totalAmount}`;
}

// Setup search and other global listeners
function setupEventListeners() {
    const searchInput = document.getElementById('itemSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeCategory = document.querySelector('.category-pill.active')?.dataset.category || 'all';
            renderItems(activeCategory, e.target.value);
        });
    }

    const generateBtn = document.getElementById('goToInvoiceCart');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            if (invoiceCart.length === 0) return;
            showInvoiceModal();
        });
    }

    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', hideInvoiceModal);
    }

    const sendBtn = document.getElementById('sendWhatsApp');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendWhatsAppInvoice);
    }

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('invoiceModal');
        if (e.target === modal) hideInvoiceModal();
    });
}

async function showInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    const preview = document.getElementById('invoicePreviewContent');
    if (!modal || !preview) return;

    // Show loading state while we get the ID from backend (mirrors main menu behavior)
    preview.innerHTML = '<div class="loading-state">Generating unique Invoice ID...</div>';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const subtotal = invoiceCart.reduce((sum, item) => sum + (item.numericPrice * item.quantity), 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    // Log the waiter-generated invoice to backend to get a real unique UUID
    try {
        const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                tableNumber: 'Waiter-Generated', 
                items: invoiceCart.map(item => ({ name: item.title, qty: item.quantity, price: item.price })), 
                totalPrice: total 
            })
        });
        const data = await resp.json();
        currentInvoiceId = data.id || '';
    } catch (err) {
        console.error('Failed to log invoice:', err);
        currentInvoiceId = '';
    }

    // Format short ID (last 8 chars) just like in cart.js
    const shortId = currentInvoiceId ? '#INV-' + currentInvoiceId.slice(-8).toUpperCase() : '#INV-TEMP';

    let itemsHtml = `
        <div class="invoice-id-badge">Invoice ID: <strong>${shortId}</strong></div>
        <table class="invoice-preview-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="text-right">Qty</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    invoiceCart.forEach(item => {
        const itemTotal = item.numericPrice * item.quantity;
        itemsHtml += `
            <tr>
                <td>${item.title}</td>
                <td class="text-right">x${item.quantity}</td>
                <td class="text-right">₹${itemTotal}</td>
            </tr>
        `;
    });

    itemsHtml += `
            </tbody>
        </table>
        <div class="invoice-summary-box">
            <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="summary-row">
                <span>GST (5%)</span>
                <span>₹${gst}</span>
            </div>
            <div class="summary-row total">
                <span>Grand Total</span>
                <span>₹${total}</span>
            </div>
        </div>
    `;

    preview.innerHTML = itemsHtml;
}

function hideInvoiceModal() {
    const modal = document.getElementById('invoiceModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function sendWhatsAppInvoice() {
    if (invoiceCart.length === 0) return;

    const shortId = currentInvoiceId ? '#INV-' + currentInvoiceId.slice(-8).toUpperCase() : '#INV-TEMP';

    const restaurantPhone = '9381957903';
    const gstNumber = 'abcd1234';
    const fssaiNumber = '123456';

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let message = `*Paradise restaurant.*\n`;
    message += `📍Hyderabad.\n`;
    message += `📞Phone no: ${restaurantPhone}.\n`;
    message += `GST: ${gstNumber} (for now).\n`;
    message += `FSSAI: ${fssaiNumber} (for now).\n`;
    message += `*Invoice ID: ${shortId}*\n`;
    message += `📅Date: ${formattedDate} |                                    🕒Time: ${formattedTime}\n`;
    message += `----------------------\n`;
    
    let subtotal = 0;
    invoiceCart.forEach(item => {
        const lineTotal = item.numericPrice * item.quantity;
        subtotal += lineTotal;
        message += `${item.title} x ${item.quantity}:   ${item.quantity}x${item.numericPrice}     ₹${lineTotal}\n`;
    });
    
    const sgst = Number((subtotal * 0.025).toFixed(2));
    const cgst = Number((subtotal * 0.025).toFixed(2));
    const total = subtotal + sgst + cgst;
    
    message += `--------------------------\n`;
    message += `Subtotal:  ₹${subtotal.toFixed(2)}\n`;
    message += `SGST @2.5%: ₹${sgst.toFixed(2)}\n`;
    message += `CGST @2.5%: ₹${cgst.toFixed(2)}\n`;
    message += `*Grand Total:  ₹${total.toFixed(2)}*\n`;
    message += `--------------------------\n`;
    message += `Thank you for dining with us!\n`;
    message += `Visit again. 🙏\n`;
    message += `Have a nice day. 🎉\n`;
    message += `Leave your comments about your dining experience in our restaurant. 📝\n`;
    message += `We also accept home deliveries. 🛵`;

    try {
        const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/whatsapp-redirect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, isShare: true })
        });
        const data = await resp.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Failed to generate WhatsApp link. Check server logs.');
        }
    } catch (err) {
        console.error('WhatsApp redirect failed:', err);
        alert('Could not connect to server. Ensure backend is running.');
    }
}
