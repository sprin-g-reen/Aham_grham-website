/**
 * Aham Graham Authentication Logic
 * Handles UI interactions and Firebase Auth integration
 */

// Initialize Auth Modal on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Inject Auth Modal HTML if not already present
    if (!document.getElementById('authOverlay')) {
        const modalHTML = `
            <div id="authOverlay" class="auth-overlay">
                <div class="auth-modal">
                    <span class="material-symbols-outlined auth-close" onclick="closeAuthModal()">close</span>
                    
                    <div class="auth-header">
                        <img src="assets/logo_transparent.png" alt="Aham Graham" class="auth-logo" onerror="this.src='https://placehold.co/100x100/2c2c3a/white?text=AHAM'">
                        <h2 class="auth-title">Welcome Home</h2>
                        <p class="auth-subtitle">Begin your journey of transformation</p>
                    </div>

                    <div class="auth-tabs">
                        <div class="auth-tab active" id="tab-signin" onclick="switchTab('signin')">Sign In</div>
                        <div class="auth-tab" id="tab-signup" onclick="switchTab('signup')">Sign Up</div>
                    </div>

                    <!-- Sign In Form -->
                    <form id="form-signin" class="auth-form active" onsubmit="handleSignIn(event)">
                        <div class="input-group">
                            <label>Email or Username</label>
                            <input type="text" class="auth-input" id="signin-email" placeholder="Enter your email" required>
                        </div>
                        <div class="input-group">
                            <label>Password</label>
                            <input type="password" class="auth-input" id="signin-password" placeholder="••••••••" required>
                        </div>
                        <div id="signin-error" class="error-message">Invalid credentials. Please try again.</div>
                        <button type="submit" class="auth-btn">Sign In</button>
                    </form>

                    <!-- Sign Up Form -->
                    <form id="form-signup" class="auth-form" onsubmit="handleSignUp(event)">
                        <div class="input-group">
                            <label>Full Name</label>
                            <input type="text" class="auth-input" id="signup-name" placeholder="Your Name" required>
                        </div>
                        <div class="input-group">
                            <label>Email Address</label>
                            <input type="email" class="auth-input" id="signup-email" placeholder="name@example.com" required>
                        </div>
                        <div class="input-group">
                            <label>Create Password</label>
                            <input type="password" class="auth-input" id="signup-password" placeholder="••••••••" required>
                        </div>
                        <div class="input-group">
                            <label>Confirm Password</label>
                            <input type="password" class="auth-input" id="signup-confirm" placeholder="••••••••" required>
                        </div>
                        <div id="signup-error" class="error-message">Passwords do not match.</div>
                        <button type="submit" class="auth-btn">Create Account</button>
                    </form>

                    <div class="auth-divider">or continue with</div>

                    <div class="auth-social">
                        <button class="social-btn" onclick="handleGoogleSignIn()">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="social-icon">
                            Google
                        </button>
                    </div>
                    
                    <div id="auth-success" class="success-message">
                        Success! Redirecting to your dashboard...
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// UI Controls
function showAuthModal() {
    // Check if user is already logged in (to be implemented with Firebase)
    const overlay = document.getElementById('authOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeAuthModal() {
    const overlay = document.getElementById('authOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function switchTab(tab) {
    const tabSignin = document.getElementById('tab-signin');
    const tabSignup = document.getElementById('tab-signup');
    const formSignin = document.getElementById('form-signin');
    const formSignup = document.getElementById('form-signup');

    if (tab === 'signin') {
        tabSignin.classList.add('active');
        tabSignup.classList.remove('active');
        formSignin.classList.add('active');
        formSignup.classList.remove('active');
    } else {
        tabSignin.classList.remove('active');
        tabSignup.classList.add('active');
        formSignin.classList.remove('active');
        formSignup.classList.add('active');
    }
}

// Form Handlers
function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    console.log('Signing in...', email);
    // Firebase auth will go here
    showSuccess();
}

function handleSignUp(e) {
    e.preventDefault();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const error = document.getElementById('signup-error');

    if (password !== confirm) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';

    console.log('Creating account...');
    // Firebase auth will go here
    showSuccess();
}

function handleGoogleSignIn() {
    console.log('Google Sign In...');
    // Firebase Google Auth will go here
    showSuccess();
}

function showSuccess() {
    const success = document.getElementById('auth-success');
    const forms = document.querySelectorAll('.auth-form, .auth-tabs, .auth-divider, .auth-social');
    
    forms.forEach(f => f.style.display = 'none');
    success.style.display = 'block';

    setTimeout(() => {
        window.location.href = 'https://calendly.com/aham_grham-salem';
    }, 1500);
}

// Global hook for the "Book Session" buttons
window.handleBookSessionClick = function(event) {
    if (event) event.preventDefault();
    window.location.href = 'https://calendly.com/aham_grham-salem';
};
