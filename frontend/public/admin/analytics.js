// ==========================================
// ADMIN ANALYTICS CONFIG
// ==========================================

const analyticsConfig = {
    apiBaseUrl: ''
};

// ==========================================
// STATE
// ==========================================

let currentRange = 'today';
let currentData = null;
let storedUsername = sessionStorage.getItem('menyu_admin_user') || '';
let storedPassword = sessionStorage.getItem('menyu_admin_pass') || '';
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
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if already authenticated in this session
    if (storedUsername && storedPassword) {
        unlockDashboard();
    } else {
        initLogin();
        initForgotPassword();
    }
});

// ==========================================
// LOGIN
// ==========================================

function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const captchaInput = document.getElementById('captchaInput');
    const loginError = document.getElementById('loginError');

    generateCaptcha();

    loginBtn.addEventListener('click', () => attemptLogin());

    // Allow Enter key to submit
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
    });

    // Focus the first empty field
    if (!usernameInput.value) {
        usernameInput.focus();
    } else {
        passwordInput.focus();
    }
}

async function attemptLogin() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const captchaInputEl = document.getElementById('captchaInput');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const captchaVal = captchaInputEl ? captchaInputEl.value.trim() : '';

    if (!username) {
        usernameInput.focus();
        return;
    }
    if (!password) {
        passwordInput.focus();
        return;
    }
    if (captchaInputEl && !captchaVal) {
        loginError.textContent = 'Please solve the math puzzle.';
        loginError.style.display = 'block';
        captchaInputEl.focus();
        return;
    }

    if (captchaInputEl && parseInt(captchaVal) !== currentCaptchaAnswer) {
        loginError.textContent = 'Incorrect math answer. Try again.';
        loginError.style.display = 'block';
        generateCaptcha();
        captchaInputEl.focus();
        return;
    }

    // Disable button while checking
    loginBtn.textContent = 'Checking...';
    loginBtn.disabled = true;

    try {
        // Test the credentials by making a request to the global admin endpoint
        const url = `${analyticsConfig.apiBaseUrl}/api/admin/analytics?range=today&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
        const response = await fetch(url);

        if (response.status === 401) {
            // Wrong password
            loginError.textContent = 'Incorrect username or password.';
            loginError.style.display = 'block';
            passwordInput.classList.add('shake');
            setTimeout(() => passwordInput.classList.remove('shake'), 400);
            passwordInput.value = '';
            passwordInput.focus();
            loginBtn.textContent = 'Unlock Dashboard';
            loginBtn.disabled = false;
            generateCaptcha();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Credentials correct — save and unlock
        storedUsername = username;
        storedPassword = password;
        sessionStorage.setItem('menyu_admin_user', username);
        sessionStorage.setItem('menyu_admin_pass', password);

        // Use the data we already fetched
        const data = await response.json();
        currentData = data;

        unlockDashboard(data);
    } catch (err) {
        console.error('Login failed:', err);
        loginError.textContent = 'Connection error. Try again.';
        loginError.style.display = 'block';
        loginBtn.textContent = 'Unlock Dashboard';
        loginBtn.disabled = false;
    }
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

function initForgotPassword() {
    const forgotPwLink = document.getElementById('forgotPwLink');
    const resetPwBtn = document.getElementById('resetPwBtn');

    const loginCard = document.querySelector('#loginOverlay .login-card:not([id])') || document.querySelector('#loginOverlay .login-card:first-child');
    const step2Card = document.getElementById('forgotStep2');

    let resetTarget = 'admin'; // Default fallback

    if (!forgotPwLink) return;

    // 1. Show Step 2 Directly (Bypass Step 1)
    forgotPwLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.style.display = 'none';
        step2Card.style.display = 'block';
        document.getElementById('forgotSecretCode').focus();
    });

    // 2. Back to Login (From Step 2)
    const backFromStep2Btn = document.createElement('button');
    backFromStep2Btn.className = 'login-btn btn-secondary';
    backFromStep2Btn.style.background = '#e5e7eb';
    backFromStep2Btn.style.color = '#374151';
    backFromStep2Btn.style.marginTop = '10px';
    backFromStep2Btn.textContent = 'Back';
    backFromStep2Btn.onclick = () => {
        step2Card.style.display = 'none';
        loginCard.style.display = 'block';
    };
    
    // Insert back button before the Change Password button or after the form
    resetPwBtn.parentNode.insertBefore(backFromStep2Btn, resetPwBtn.nextSibling);

    // 4. Reset Password
    resetPwBtn.addEventListener('click', async () => {
        const secretCode = document.getElementById('forgotSecretCode').value.trim();
        const newPassword = document.getElementById('forgotNewPw').value.trim();
        const confirmPw = document.getElementById('forgotConfirmPw').value.trim();
        const errorEl = document.getElementById('forgotError2');
        const successEl = document.getElementById('forgotSuccess');

        if (!secretCode || !newPassword || !confirmPw) {
            errorEl.textContent = 'Please fill in all fields.';
            errorEl.style.display = 'block';
            return;
        }

        if (newPassword !== confirmPw) {
            errorEl.textContent = 'Passwords do not match.';
            errorEl.style.display = 'block';
            return;
        }

        resetPwBtn.disabled = true;
        resetPwBtn.textContent = 'Changing...';
        errorEl.style.display = 'none';

        try {
            const response = await fetch(`${analyticsConfig.apiBaseUrl}/api/forgot-password/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretCode, newPassword, target: resetTarget })
            });

            const result = await response.json();

            if (!response.ok) {
                errorEl.textContent = result.message || 'Reset failed.';
                errorEl.style.display = 'block';
                return;
            }

            // Success
            successEl.style.display = 'block';
            setTimeout(() => {
                window.location.reload(); // Reload to start fresh
            }, 2000);

        } catch (err) {
            console.error('Reset error:', err);
            errorEl.textContent = 'Connection error. Try again.';
            errorEl.style.display = 'block';
        } finally {
            resetPwBtn.disabled = false;
            resetPwBtn.textContent = 'Change Password';
        }
    });
}

function unlockDashboard(initialData) {
    // Hide login, show dashboard
    document.getElementById('loginOverlay').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';

    // Initialize dashboard
    initFilterButtons();
    initCustomDatePicker();
    initLogoutButton();
    initChangePasswordModal();

    // If we already have data from login, render it. Otherwise fetch.
    if (initialData) {
        renderDashboard(initialData);
    } else {
        fetchAnalytics('today');
    }
}

// ==========================================
// LOGOUT
// ==========================================

function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn || logoutBtn.dataset.initialized) return;
    logoutBtn.dataset.initialized = 'true';

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('menyu_admin_user');
        sessionStorage.removeItem('menyu_admin_pass');
        storedUsername = '';
        storedPassword = '';
        document.getElementById('dashboardContent').style.display = 'none';
        document.getElementById('loginOverlay').style.display = 'flex';
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
        initLogin();
    });
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

function initChangePasswordModal() {
    const changePwBtn = document.getElementById('changePwBtn');
    const modal = document.getElementById('changePasswordModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('savePasswordBtn');
    
    const currentPwInput = document.getElementById('currentPassword');
    const newPwInput = document.getElementById('newPassword');
    const confirmPwInput = document.getElementById('confirmPassword');
    
    const errorMsg = document.getElementById('modalError');
    const successMsg = document.getElementById('modalSuccess');

    if (!changePwBtn) return;

    changePwBtn.addEventListener('click', () => {
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        currentPwInput.value = '';
        newPwInput.value = '';
        confirmPwInput.value = '';
        modal.style.display = 'flex';
        currentPwInput.focus();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => saveNewPassword());
}

async function saveNewPassword() {
    const currentPwInput = document.getElementById('currentPassword');
    const newPwInput = document.getElementById('newPassword');
    const confirmPwInput = document.getElementById('confirmPassword');
    const saveBtn = document.getElementById('savePasswordBtn');
    const errorMsg = document.getElementById('modalError');
    const successMsg = document.getElementById('modalSuccess');

    const currentPw = currentPwInput.value.trim();
    const newPw = newPwInput.value.trim();
    const confirmPw = confirmPwInput.value.trim();

    // 1. Validation
    if (!currentPw || !newPw || !confirmPw) {
        errorMsg.textContent = 'Please fill in all fields.';
        errorMsg.style.display = 'block';
        return;
    }

    if (newPw !== confirmPw) {
        errorMsg.textContent = 'New passwords do not match.';
        errorMsg.style.display = 'block';
        return;
    }

    if (newPw.length < 4) {
        errorMsg.textContent = 'New password must be at least 4 characters.';
        errorMsg.style.display = 'block';
        return;
    }

    // 2. API Call
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    errorMsg.style.display = 'none';

    try {
        const response = await fetch(`${analyticsConfig.apiBaseUrl}/api/admin/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: storedUsername,
                currentPassword: currentPw,
                newPassword: newPw
            })
        });

        const result = await response.json();

        if (!response.ok) {
            errorMsg.textContent = result.message || `Error ${response.status}: Failed to update password.`;
            errorMsg.style.display = 'block';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
            return;
        }

        // 3. Success
        successMsg.style.display = 'block';
        storedPassword = newPw;
        sessionStorage.setItem('menyu_admin_pass', newPw);

        setTimeout(() => {
            document.getElementById('changePasswordModal').style.display = 'none';
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
        }, 1500);

    } catch (err) {
        console.error('Change password error:', err);
        errorMsg.textContent = 'Network error or server unreachable. Please check your connection and try again.';
        errorMsg.style.display = 'block';
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Changes';
    }
}

// ==========================================
// FILTER BUTTONS
// ==========================================

function initFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const range = btn.dataset.range;

            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide custom date picker
            const customRow = document.getElementById('customDateRow');
            if (range === 'custom') {
                customRow.style.display = 'flex';
                return; // Don't fetch yet, wait for Apply
            } else {
                customRow.style.display = 'none';
            }

            currentRange = range;
            fetchAnalytics(range);
        });
    });
}

// ==========================================
// CUSTOM DATE PICKER
// ==========================================

function initCustomDatePicker() {
    const applyBtn = document.getElementById('applyCustomDate');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');

    // Default to today
    const today = new Date().toISOString().split('T')[0];
    dateFrom.value = today;
    dateTo.value = today;

    applyBtn.addEventListener('click', () => {
        const from = dateFrom.value;
        const to = dateTo.value;

        if (!from || !to) {
            alert('Please select both From and To dates.');
            return;
        }

        if (new Date(from) > new Date(to)) {
            alert('From date cannot be after To date.');
            return;
        }

        currentRange = 'custom';
        fetchAnalytics('custom', from, to);
    });
}

// ==========================================
// FETCH ANALYTICS
// ==========================================

async function fetchAnalytics(range, from, to) {
    showLoading(true);
    hideEmpty();
    hideTables();

    let url = `${analyticsConfig.apiBaseUrl}/api/admin/analytics?range=${range}&username=${encodeURIComponent(storedUsername)}&password=${encodeURIComponent(storedPassword)}`;
    if (range === 'custom' && from && to) {
        url += `&from=${from}&to=${to}`;
    }

    try {
        const response = await fetch(url);

        if (response.status === 401) {
            // Credentials expired or changed — force re-login
            sessionStorage.removeItem('menyu_admin_user');
            sessionStorage.removeItem('menyu_admin_pass');
            storedUsername = '';
            storedPassword = '';
            document.getElementById('dashboardContent').style.display = 'none';
            document.getElementById('loginOverlay').style.display = 'flex';
            document.getElementById('loginError').textContent = 'Session expired. Please log in again.';
            document.getElementById('loginError').style.display = 'block';
            showLoading(false);
            initLogin();
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        currentData = data;

        showLoading(false);
        renderDashboard(data);

        // Auto-refresh: Poll backend every 10s for live payments/orders updates.
        // We only start polling if we aren't currently custom ranging (for simplicity).
        if (window.analyticsPollInterval) clearInterval(window.analyticsPollInterval);

        if (range !== 'custom') {
            window.analyticsPollInterval = setInterval(async () => {
                try {
                    const pollRes = await fetch(url);
                    if (pollRes.ok) {
                        const pollData = await pollRes.json();
                        currentData = pollData;
                        renderDashboard(pollData); // Silent update (no loading spinner)
                    }
                } catch (e) {
                    console.error('Background polling failed:', e);
                }
            }, 10000);
        }

    } catch (err) {
        console.error('Failed to fetch admin analytics:', err);
        showLoading(false);
        showEmpty();
    }
}

// ==========================================
// RENDER DASHBOARD
// ==========================================

function renderDashboard(data) {
    const { summary, restaurants } = data;

    // Update global summary cards
    document.getElementById('totalScans').textContent = summary.totalScans.toLocaleString('en-IN');
    document.getElementById('totalOrders').textContent = summary.totalOrders.toLocaleString('en-IN');
    document.getElementById('totalPayments').textContent = summary.totalPayments.toLocaleString('en-IN');

    // Check if there's any data
    if (summary.totalScans === 0 && summary.totalOrders === 0 && summary.totalPayments === 0) {
        showEmpty();
        return;
    }

    // Render restaurant breakdown table
    if (restaurants && restaurants.length > 0) {

        // Filter out specific demo restaurants
        const filteredRestaurants = restaurants.filter(rest => {
            const name = rest.name.toLowerCase();
            return name !== 'chicken biryani' && name !== 'chicken bhiryani' && name !== 'kfc';
        });

        if (filteredRestaurants.length > 0) {
            document.getElementById('restaurantSection').style.display = 'block';
            document.getElementById('restaurantCount').textContent = filteredRestaurants.length + ' active';
            document.getElementById('totalVenues').textContent = filteredRestaurants.length.toLocaleString('en-IN');

            // Sort restaurants by order revenue descending
            const sortedRestaurants = [...filteredRestaurants].sort((a, b) => b.orderRevenue - a.orderRevenue);
            renderRestaurantTable(sortedRestaurants);
        } else {
            document.getElementById('restaurantSection').style.display = 'none';
        }
    }
}

// ==========================================
// RENDER RESTAURANT TABLE
// ==========================================

function renderRestaurantTable(restaurants) {
    const tbody = document.getElementById('restaurantBody');
    tbody.innerHTML = restaurants.map((rest, index) => {
        return `
            <tr>
                <td style="font-weight: 500;">${index + 1}</td>
                <td style="font-weight: 600; color: var(--color-primary-dark);">${rest.name}</td>
                <td>${rest.scans.toLocaleString('en-IN')}</td>
                <td>${rest.orders.toLocaleString('en-IN')}</td>
            </tr>
        `;
    }).join('');
}

// ==========================================
// UI STATE HELPERS
// ==========================================

function showLoading(show) {
    document.getElementById('loadingState').style.display = show ? 'flex' : 'none';
    if (show) {
        document.getElementById('summarySection').style.opacity = '0.5';
    } else {
        document.getElementById('summarySection').style.opacity = '1';
    }
}

function showEmpty() {
    document.getElementById('emptyState').style.display = 'flex';
    document.getElementById('summarySection').style.display = 'none';
}

function hideEmpty() {
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('summarySection').style.display = 'block';
}

function hideTables() {
    document.getElementById('restaurantSection').style.display = 'none';
}
