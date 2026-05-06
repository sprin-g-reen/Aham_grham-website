/**
 * Aham Grham Auth Helper
 * Manages authentication state, tokens, and UI updates across the site.
 */

const AUTH_CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api/users',
    TOKEN_KEY: 'aham_grham_token',
    USER_KEY: 'aham_grham_user'
};

const AuthHelper = {
    // --- Token Management ---
    saveAuth(token, user) {
        localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        localStorage.removeItem(AUTH_CONFIG.USER_KEY);
        window.location.href = 'index.html';
    },

    getToken() {
        return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    },

    getUser() {
        const user = localStorage.getItem(AUTH_CONFIG.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    isLoggedIn() {
        return !!this.getToken();
    },

    // --- UI Logic ---
    updateGlobalUI() {
        const user = this.getUser();
        const isLoggedIn = this.isLoggedIn();

        // 1. Handle Navbar Login Button
        const loginBtns = document.querySelectorAll('button.nav-btn, a.nav-btn');
        loginBtns.forEach(btn => {
            if (btn.textContent.toLowerCase().includes('login')) {
                if (isLoggedIn) {
                    btn.style.display = 'none';
                } else {
                    btn.style.display = 'block';
                }
            }
        });

        // 2. Handle Navbar CTA Button (Book Session)
        // This is handled via the click handler, but we can update the text if needed.

        // 3. Handle Account Details in book-session.html
        const accountSection = document.querySelector('.sidebar-footer');
        if (accountSection && isLoggedIn) {
            const userNameEl = document.getElementById('pass-user-name'); // From modal or other places
            // Update sidebar profile if it exists
            const accountBtn = accountSection.querySelector('.nav-item');
            if (accountBtn && user) {
                accountBtn.querySelector('span:last-child').textContent = user.name.toLowerCase();
            }

            // Add Logout Button if not present
            if (!document.getElementById('logout-btn')) {
                const logoutHTML = `
                    <div class="nav-item text-red-400 mt-2" id="logout-btn" onclick="AuthHelper.logout()">
                        <span class="material-symbols-outlined">logout</span>
                        <span>logout</span>
                    </div>
                `;
                accountSection.insertAdjacentHTML('beforeend', logoutHTML);
            }
        }
    },

    handleBookSession() {
        if (this.isLoggedIn()) {
            window.location.href = 'book-session.html';
        } else {
            window.location.href = 'auth.html';
        }
    }
};

// Auto-update UI on load
document.addEventListener('DOMContentLoaded', () => {
    AuthHelper.updateGlobalUI();
    
    // Override handleBookSessionClick if it exists
    window.handleBookSessionClick = (event) => {
        if (event) event.preventDefault();
        AuthHelper.handleBookSession();
    };
});

window.AuthHelper = AuthHelper;
