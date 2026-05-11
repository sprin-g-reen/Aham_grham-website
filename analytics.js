/**
 * Aham Grham Analytics Tracker
 * Tracks visitors and page views in real-time.
 */

(function() {
    const API_URL = '/api/analytics/track';
    
    async function track(type) {
        try {
            const page = window.location.pathname.split('/').pop() || 'index.html';
            await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, page })
            });
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }

    // 1. Track Page View (every load)
    track('view');

    // 2. Track Visitor (once per session)
    if (!sessionStorage.getItem('aham_visited')) {
        track('visitor');
        sessionStorage.setItem('aham_visited', 'true');
    }
})();
