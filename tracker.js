/**
 * Aham Grham Analytics Tracker
 * Fires as early as possible to capture every visit.
 */
(function() {
    const API_URL = 'http://localhost:5000/api/analytics/track';
    
    async function track(type) {
        try {
            const page = window.location.pathname.split('/').pop() || 'home';
            console.log(`[Analytics] Tracking ${type} for ${page}...`);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, page })
            });
            if (response.ok) {
                console.log(`[Analytics] ${type} tracked successfully.`);
            }
        } catch (error) {
            console.error('[Analytics] Error:', error);
        }
    }

    // Always track a page view
    track('view');

    // Track a visitor if it's a new session
    // We use a shorter-lived session flag for testing purposes
    if (!sessionStorage.getItem('aham_tracking_active')) {
        track('visitor');
        sessionStorage.setItem('aham_tracking_active', 'true');
    }
})();
