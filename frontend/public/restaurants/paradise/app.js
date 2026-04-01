// ==========================================
// RESTAURANT CONFIG
// ==========================================

const restaurantConfig = {
    name: 'Paradise',
    slug: 'paradise',
    apiBaseUrl: ''
};

// NOTE: menuItems and foodCategories are now loaded from menu-data.js

// ==========================================
// CART HELPERS (localStorage)
// ==========================================

function getCart() {
    try { return JSON.parse(localStorage.getItem('paradiseCart')) || []; }
    catch (e) { return []; }
}

function saveCart(cart) {
    localStorage.setItem('paradiseCart', JSON.stringify(cart));
}

function updateStickyCartBtn() {
    const btn = document.getElementById('stickyCartBtn');
    if (!btn) return;
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    if (total > 0) {
        btn.style.display = 'flex';
        btn.querySelector('.sticky-cart-count').textContent = total + ' item' + (total > 1 ? 's' : '');
    } else {
        btn.style.display = 'none';
    }
    initStickyPayBtn();
    updateScrollTopPosition();
}

function updateScrollTopPosition() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;
    const cartBtn = document.getElementById('stickyCartBtn');
    const payBtn = document.getElementById('stickyPayBtn');
    const cartVisible = cartBtn && cartBtn.style.display !== 'none';
    const payVisible = payBtn && payBtn.style.display !== 'none';
    scrollBtn.classList.toggle('raised', cartVisible || payVisible);
}

// ==========================================
// APP INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Paradise Restaurant App initialized');

    // Clear cart on first visit (new tab/window), preserve within session
    if (!sessionStorage.getItem('paradiseSessionActive')) {
        localStorage.removeItem('paradiseCart');
        sessionStorage.setItem('paradiseSessionActive', 'true');
    }

    readTableNumber();
    logScanEvent();

    initDietTypeSelector();
    initFoodCategoryDropdown();
    renderMenu();
    initItemModal();
    initAddSheet();
    updateStickyCartBtn();
    initStickyPayBtn();
    initScrollToTop();
    initCallWaiterBtn();
});

// Refresh cart/pay buttons when navigating back to this page
// Multiple listeners for cross-browser/mobile compatibility
window.addEventListener('pageshow', () => {
    updateStickyCartBtn();
});
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateStickyCartBtn();
    }
});
window.addEventListener('focus', () => {
    updateStickyCartBtn();
});

// ==========================================
// TABLE NUMBER (from QR URL)
// ==========================================

function readTableNumber() {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    const tableBadge = document.getElementById('tableBadge');

    // Only update if ?table= is present in URL (don't overwrite on redirects that strip it)
    if (tableParam) {
        localStorage.setItem('paradiseTable', tableParam);
        if (tableBadge) tableBadge.textContent = `Table ${tableParam}`;
        console.log('Table number set:', tableParam);
    } else {
        localStorage.setItem('paradiseTable', 'unknown');
        if (tableBadge) tableBadge.style.display = 'none';
    }
}

// ==========================================
// LOG SCAN EVENT (Analytics)
// ==========================================

function logScanEvent() {
    // Only log once per session to avoid spamming on refresh
    if (sessionStorage.getItem('scanLogged_paradise')) return;

    const tableNumber = localStorage.getItem('paradiseTable') || 'unknown';

    fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableNumber })
    })
        .then(() => sessionStorage.setItem('scanLogged_paradise', 'true'))
        .catch(err => console.log('Scan log failed:', err));
}


// ==========================================
// ACTIVE FILTERS STATE
// ==========================================

let activeFilters = {
    dietType: null,       // null | 'veg' | 'non-veg'
    foodCategory: null    // null | 'biryanis' | 'starters' | etc.
};

// ==========================================
// MENU RENDERING
// ==========================================

function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;

    // Filter items by diet type (hard filter)
    let filteredItems = menuItems;
    if (activeFilters.dietType) {
        filteredItems = menuItems.filter(item => item.dietType === activeFilters.dietType);
    }

    // Determine category display order (selected category floats to top)
    let orderedCategories = [...foodCategories];
    if (activeFilters.foodCategory) {
        const selectedIdx = orderedCategories.findIndex(c => c.key === activeFilters.foodCategory);
        if (selectedIdx > 0) {
            const [selected] = orderedCategories.splice(selectedIdx, 1);
            orderedCategories.unshift(selected);
        }
    }

    // Build HTML
    let html = '';
    orderedCategories.forEach(category => {
        const categoryItems = filteredItems.filter(item => item.foodCategory === category.key);
        if (categoryItems.length === 0) return; // Skip empty categories

        html += `
            <section class="menu-section" data-food-category="${category.key}">
                <div class="menu-header">
                    <img src="${category.icon}" alt="${category.title}" class="menu-category-icon"
                        onerror="this.style.display='none';">
                    <h2 class="menu-title">${category.title}</h2>
                </div>
                <ul class="menu-list">
                    ${categoryItems.map(item => renderMenuItem(item)).join('')}
                </ul>
            </section>
        `;
    });

    if (html === '') {
        html = `
            <div class="empty-state">
                <span class="empty-icon">🍽️</span>
                <p>No items found in this category yet.</p>
            </div>
        `;
    }

    container.innerHTML = html;

    // Re-bind click handlers for the newly rendered items
    bindItemClickHandlers();
}

function renderMenuItem(item) {
    const dietClass = item.dietType === 'veg' ? 'veg-indicator' : 'non-veg-indicator';
    return `
        <li class="menu-item clickable-item" data-item="${item.key}">
            <div class="item-info">
                <span class="item-name">
                    <span class="diet-dot ${dietClass}"></span>
                    ${item.title}
                </span>
                <div class="item-price-row">
                    <span class="item-price">${item.price}</span>
                    <button class="add-btn" onclick="openAddSheet(event, '${item.key}', '${item.title.replace(/'/g, "\\'").replace(/"/g, '&quot;')}', '${item.price}')">Add</button>
                </div>
            </div>
            <div class="item-thumbnail">
                <img src="assets/thumbnails/${item.key}.png" alt="${item.title}"
                    class="thumbnail-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="thumbnail-placeholder">Image Placeholder</div>
            </div>
        </li>
    `;
}

// ==========================================
// DIET TYPE SELECTOR
// ==========================================

function initDietTypeSelector() {
    const buttons = document.querySelectorAll('.diet-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const diet = btn.dataset.diet;

            if (activeFilters.dietType === diet) {
                // Deselect if already selected
                activeFilters.dietType = null;
                buttons.forEach(b => b.classList.remove('active'));
            } else {
                // Select this diet type
                activeFilters.dietType = diet;
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            }

            renderMenu();
            console.log('Diet filter:', activeFilters.dietType);
        });
    });
}

// ==========================================
// FOOD CATEGORY DROPDOWN
// ==========================================

function initFoodCategoryDropdown() {
    const dropdownBtn = document.getElementById('foodCategoryBtn');
    const dropdownList = document.getElementById('foodCategoryList');
    const dropdownText = dropdownBtn?.querySelector('.dropdown-text');
    const dropdownItems = document.querySelectorAll('#foodCategoryList .dropdown-item');

    if (!dropdownBtn || !dropdownList) return;

    // Toggle dropdown
    dropdownBtn.addEventListener('click', () => {
        dropdownBtn.classList.toggle('active');
        dropdownList.classList.toggle('open');
    });

    // Handle item selection
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const category = item.dataset.category;
            const categoryName = item.textContent.trim();

            if (category === 'all') {
                activeFilters.foodCategory = null;
                if (dropdownText) dropdownText.textContent = 'All Categories';
            } else {
                activeFilters.foodCategory = category;
                if (dropdownText) dropdownText.textContent = categoryName;
            }

            // Update selected state
            dropdownItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // Close dropdown
            dropdownBtn.classList.remove('active');
            dropdownList.classList.remove('open');

            renderMenu();
            console.log('Food category filter:', activeFilters.foodCategory);
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownList.contains(e.target)) {
            dropdownBtn.classList.remove('active');
            dropdownList.classList.remove('open');
        }
    });
}

// ==========================================
// ITEM MODAL
// ==========================================
let isMuted = true; // Global mute state — persists across items

function initItemModal() {
    const modal = document.getElementById('itemModal');
    const modalClose = document.getElementById('modalClose');

    if (!modal) return;

    // Close modal on X button
    if (modalClose) {
        modalClose.addEventListener('click', () => closeModal());
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Sound toggle button
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            soundToggle.classList.toggle('muted', isMuted);
            soundToggle.title = isMuted ? 'Unmute' : 'Mute';
            // Apply to all videos immediately
            const videos = document.querySelectorAll('#videosPanel video');
            videos.forEach(v => { v.muted = isMuted; });
        });
    }

    // Tab switching
    const tabs = document.querySelectorAll('.modal-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });

    // Carousel navigation
    const carouselArrows = document.querySelectorAll('.carousel-arrow');
    carouselArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const carouselType = arrow.dataset.carousel;
            const isPrev = arrow.classList.contains('carousel-prev');
            navigateCarousel(carouselType, isPrev ? -1 : 1);
        });
    });

    // Bind item clicks for initially rendered items
    bindItemClickHandlers();
}

function bindItemClickHandlers() {
    const modal = document.getElementById('itemModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    document.querySelectorAll('.clickable-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemKey = item.dataset.item;
            const data = menuItems.find(m => m.key === itemKey);
            if (!data) return;

            // Set modal content
            modalTitle.textContent = data.title;
            modalDescription.textContent = data.description;

            // Load item images
            document.getElementById('itemImage1').src = `assets/images/${itemKey}/${itemKey}_image_1.png`;
            document.getElementById('itemImage2').src = `assets/images/${itemKey}/${itemKey}_image_2.png`;
            document.getElementById('itemImage3').src = `assets/images/${itemKey}/${itemKey}_image_3.png`;

            // Load item videos
            document.getElementById('itemVideo1').src = `assets/videos/${itemKey}/${itemKey}_video_1.mp4`;
            document.getElementById('itemVideo2').src = `assets/videos/${itemKey}/${itemKey}_video_2.mp4`;
            document.getElementById('itemVideo3').src = `assets/videos/${itemKey}/${itemKey}_video_3.mp4`;

            // Populate Ingredients Tab
            const ingredientsList = document.getElementById('ingredientsList');
            if (ingredientsList) {
                if (data.ingredients && data.ingredients.length > 0) {
                    ingredientsList.innerHTML = data.ingredients.map(entry => {
                        if (entry.heading) {
                            return `<li class="info-item ingredient-heading">${entry.heading}</li>`;
                        }
                        return `<li class="info-item">${entry.item}</li>`;
                    }).join('');
                } else {
                    ingredientsList.innerHTML = '<li class="info-item">Ingredients coming soon</li>';
                }
            }

            // Populate Nutrients Tab
            const nutrientsList = document.getElementById('nutrientsList');
            if (nutrientsList) {
                if (data.nutrients && data.nutrients.length > 0) {
                    nutrientsList.innerHTML = data.nutrients.map(entry => {
                        return `<li class="info-item"><strong>${entry.label}:</strong> ${entry.value}</li>`;
                    }).join('');
                } else {
                    nutrientsList.innerHTML = '<li class="info-item">Nutritional info coming soon</li>';
                }
            }

            // Open modal
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            switchTab('images');
        });
    });
}

function closeModal() {
    const modal = document.getElementById('itemModal');
    modal.classList.remove('open');
    document.body.style.overflow = '';

    // Pause all videos
    const videos = modal.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.modal-tab');
    tabs.forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.modal-tab[data-tab="${tabName}"]`);
    if (activeTab) activeTab.classList.add('active');

    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`${tabName}Panel`);
    if (activePanel) activePanel.classList.add('active');

    // Handle video playback
    const videoPanel = document.getElementById('videosPanel');
    if (videoPanel) {
        const videos = videoPanel.querySelectorAll('video');
        if (tabName === 'videos') {
            const activeItem = videoPanel.querySelector('.carousel-item.active');
            if (activeItem) {
                const video = activeItem.querySelector('video');
                if (video) {
                    video.muted = isMuted;
                    video.play().catch(e => console.log('Auto-play prevented:', e));
                }
            }
        } else {
            videos.forEach(v => { v.pause(); v.currentTime = 0; });
        }
    }
}

function navigateCarousel(type, direction) {
    const panel = document.getElementById(`${type}Panel`);
    if (!panel) return;

    const items = panel.querySelectorAll('.carousel-item');
    const total = items.length;
    let currentIndex = 0;

    items.forEach((item, index) => {
        if (item.classList.contains('active')) currentIndex = index;
    });

    // Pause current video if in videos panel
    if (type === 'videos') {
        const currentVideo = items[currentIndex].querySelector('video');
        if (currentVideo) { currentVideo.pause(); currentVideo.currentTime = 0; }
    }

    // Calculate new index (infinite loop)
    let newIndex = (currentIndex + direction + total) % total;

    // Update active state
    items.forEach(item => item.classList.remove('active'));
    items[newIndex].classList.add('active');

    // Play new video if in videos panel
    if (type === 'videos') {
        const newVideo = items[newIndex].querySelector('video');
        if (newVideo) {
            newVideo.muted = isMuted;
            newVideo.play().catch(e => console.log('Auto-play prevented:', e));
        }
    }
}


// ==========================================
// ADD ITEM BOTTOM SHEET
// ==========================================

function openAddSheet(event, key, title, price) {
    event.stopPropagation();
    const overlay = document.getElementById('addSheetOverlay');
    if (!overlay) return;

    document.getElementById('addSheetName').textContent = title;
    document.getElementById('addSheetPrice').textContent = price;
    document.getElementById('qtyValue').textContent = '1';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAddSheet() {
    const overlay = document.getElementById('addSheetOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function initAddSheet() {
    const overlay = document.getElementById('addSheetOverlay');
    const closeBtn = document.getElementById('addSheetClose');
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');
    const qtyEl = document.getElementById('qtyValue');

    if (!overlay) return;

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAddSheet();
    });

    // Close on X button
    if (closeBtn) closeBtn.addEventListener('click', closeAddSheet);

    // Quantity controls
    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            const current = parseInt(qtyEl.textContent, 10);
            if (current > 1) qtyEl.textContent = current - 1;
        });
    }

    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            const current = parseInt(qtyEl.textContent, 10);
            qtyEl.textContent = current + 1;
        });
    }

    // Go to Cart button — save item to cart then navigate
    const orderBtn = document.getElementById('addSheetOrderBtn');
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            const name = document.getElementById('addSheetName').textContent;
            const price = document.getElementById('addSheetPrice').textContent;
            const qty = parseInt(document.getElementById('qtyValue').textContent, 10);

            const cart = getCart();
            // Find an existing item that is NOT locked yet
            const existing = cart.find(i => i.name === name && !i.locked);
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ name, price, qty });
            }
            saveCart(cart);
            updateStickyCartBtn();
            closeAddSheet();
        });
    }
}

// ==========================================
// STICKY PAY THE BILL BUTTON (menu page)
// ==========================================

function initStickyPayBtn() {
    const btn = document.getElementById('stickyPayBtn');
    if (!btn) return;

    // Show/hide based on cart
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    btn.style.display = total > 0 ? 'flex' : 'none';

    // Click handler (attach only once)
    if (!btn.dataset.initialized) {
        btn.addEventListener('click', async () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items first.');
                return;
            }

            const cartTotal = cart.reduce((sum, item) => {
                const priceNum = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
                return sum + (priceNum * item.qty);
            }, 0);

            // Log payment event to analytics (fire-and-forget)
            const tableNumber = localStorage.getItem('paradiseTable') || 'unknown';

            // Step 2: Retrieve order IDs from session to link payment to multiple orders
            let orderIds = [];
            try {
                const stored = sessionStorage.getItem('sessionOrderIds');
                if (stored) orderIds = JSON.parse(stored);
            } catch (e) { }

            fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableNumber, amount: cartTotal, items: cart, orderIds })
            }).catch(err => console.log('Analytics log failed:', err));

            saveCart([]);
            btn.style.display = 'none';
            const cartBtn = document.getElementById('stickyCartBtn');
            if (cartBtn) cartBtn.style.display = 'none';
            updateScrollTopPosition();

            // Step 3: Clear session order IDs so next customer starts fresh
            sessionStorage.removeItem('sessionOrderIds');

            // Get UPI URL from backend (secure — no raw UPI ID in frontend)
            try {
                const resp = await fetch(`${restaurantConfig.apiBaseUrl}/api/${restaurantConfig.slug}/upi-redirect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: cartTotal, name: restaurantConfig.name })
                });
                const data = await resp.json();
                if (data.url) window.location.href = data.url;
            } catch (err) {
                console.error('UPI redirect failed:', err);
                alert('Could not open UPI app. Please try again.');
            }
        });
        btn.dataset.initialized = 'true';
    }
}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

function initScrollToTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// CALL WAITER BUTTON
// ==========================================

function initCallWaiterBtn() {
    const btn = document.getElementById('callWaiterBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const tableNumber = localStorage.getItem('paradiseTable') || 'unknown';

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

        let message = `🔔 SERVICE REQUEST\n\n`;
        message += `Restaurant: ${restaurantConfig.name}\n`;
        message += `Table: ${tableNumber}\n`;
        message += `Date & Time: ${dateTimeStr}\n\n`;
        message += `Customer at Table ${tableNumber} needs assistance.`;

        // Get WhatsApp URL from backend (secure — no raw number in frontend)
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
