/**
 * Aham Grham Professional Analytics Tracker
 * Version 2.0 - Accurate, Privacy-Safe, Real-Time
 */
(function() {
    const API_URL = (window.API_BASE_URL || '') + '/api/analytics/track';
    
    // 1. Unique Visitor ID (LocalStorage - 1 Year)
    let visitorId = localStorage.getItem('aham_visitor_id');
    if (!visitorId) {
        visitorId = 'v-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('aham_visitor_id', visitorId);
    }

    // 2. Session ID (LocalStorage with Expiry)
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 Minutes
    let sessionId = localStorage.getItem('aham_session_id');
    let lastActivity = localStorage.getItem('aham_last_activity');
    
    const now = Date.now();
    if (!sessionId || !lastActivity || (now - lastActivity > SESSION_TIMEOUT)) {
        sessionId = 's-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        localStorage.setItem('aham_session_id', sessionId);
    }
    localStorage.setItem('aham_last_activity', now);

    // 3. Device Detection
    const getDevice = () => {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
        return "desktop";
    };

    // 4. Tracking Logic with Duplicate Prevention
    const trackedPages = JSON.parse(sessionStorage.getItem('aham_tracked_pages') || '{}');

    async function track(type) {
        const page = window.location.pathname.split('/').pop() || 'home';
        
        // Prevent duplicate views within 10 seconds for the same page
        if (type === 'view') {
            const lastTracked = trackedPages[page];
            if (lastTracked && (Date.now() - lastTracked < 10000)) {
                return; 
            }
            trackedPages[page] = Date.now();
            sessionStorage.setItem('aham_tracked_pages', JSON.stringify(trackedPages));
        }

        // Only track 'visitor' once per 24 hours per visitorId
        if (type === 'visitor') {
            const lastVisit = localStorage.getItem('aham_last_visit_date');
            const today = new Date().toDateString();
            if (lastVisit === today) return;
            localStorage.setItem('aham_last_visit_date', today);
        }

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    type, 
                    page, 
                    visitorId, 
                    sessionId, 
                    device: getDevice() 
                })
            });
        } catch (e) {
            console.warn('[Analytics] Silent Fail:', e.message);
        }
    }

    // 5. Initial Firing
    track('view');
    track('visitor');

    // Update last activity on any click
    document.addEventListener('click', () => {
        localStorage.setItem('aham_last_activity', Date.now());
    });
})();
