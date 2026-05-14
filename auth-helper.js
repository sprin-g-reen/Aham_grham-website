/**
 * Aham Grham Auth Helper
 * Manages authentication state, tokens, and UI updates across the site.
 */

const AUTH_CONFIG = {
    API_BASE_URL: '/api/users',
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

        // 1. Handle Navbar Login Button (Removed)

        // 2. Handle Navbar CTA Button (Book Session)
        // This is handled via the click handler, but we can update the text if needed.

        // 3. Handle Account Details in book-session.html
        const accountSection = document.querySelector('.sidebar-footer');
        if (accountSection && isLoggedIn) {
            // Update "Account details" to the user's name
            const accountBtn = accountSection.querySelector('.nav-item');
            if (accountBtn && user && user.name) {
                const nameLabel = accountBtn.querySelector('span:last-child');
                if (nameLabel) {
                    nameLabel.textContent = user.name.toLowerCase();
                }
            }

            // Add Logout Button if not present
            if (!document.getElementById('logout-btn')) {
                const logoutDiv = document.createElement('div');
                logoutDiv.id = 'logout-btn';
                logoutDiv.className = 'nav-item text-red-400 mt-2 hover:bg-red-500/10 cursor-pointer';
                logoutDiv.style.color = '#f87171'; // Tailwind red-400
                logoutDiv.innerHTML = `
                    <span class="material-symbols-outlined">logout</span>
                    <span>logout</span>
                `;
                logoutDiv.onclick = () => AuthHelper.logout();
                accountSection.appendChild(logoutDiv);
            }
        }
    },

    handleBookSession() {
        window.location.href = 'https://calendly.com/aham_grham-salem';
    }
};

// Auto-update UI on load
document.addEventListener('DOMContentLoaded', () => {
    AuthHelper.updateGlobalUI();

    // Redirect if on book-session.html and not logged in
    if (window.location.pathname.includes('book-session.html') && !AuthHelper.isLoggedIn()) {
        window.location.href = 'auth.html';
    }
});

window.AuthHelper = AuthHelper;
