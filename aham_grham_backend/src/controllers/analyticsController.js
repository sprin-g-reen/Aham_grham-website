import Analytics from '../models/Analytics.js';
import crypto from 'crypto';

// Helper to hash IP
const hashIP = (ip) => {
    return crypto.createHash('sha256').update(ip).digest('hex');
};

export const trackActivity = async (req, res) => {
    try {
        const { type, page } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];

        const activity = new Analytics({
            type,
            page,
            ipHash: hashIP(ip),
            userAgent
        });

        await activity.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ message: 'Failed to track activity' });
    }
};

export const getStats = async (req, res) => {
    try {
        // Get total counts
        const totalVisitors = await Analytics.countDocuments({ type: 'visitor' });
        const totalViews = await Analytics.countDocuments({ type: 'view' });

        // Get daily stats for the last 7 days for the chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyStats = await Analytics.aggregate([
            {
                $match: {
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    visitors: { $sum: { $cond: [{ $eq: ["$type", "visitor"] }, 1, 0] } },
                    views: { $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] } }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Format daily stats for the chart
        const formattedChartData = dailyStats.map(day => ({
            date: day._id,
            visitors: day.visitors,
            views: day.views
        }));

        res.status(200).json({
            totalVisitors,
            totalViews,
            chartData: formattedChartData
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};
