import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import programRoutes from './routes/programRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import centerRoutes from './routes/centerRoutes.js';
import aiTagRoutes from './routes/aiTagRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import footerRoutes from './routes/footerRoutes.js';
import activityRoutes from './routes/activityRoutes.js';


// Import Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Initialize environment variables
dotenv.config();

// Connect to Database
connectDB();

console.log('--------------------------------------------------');
console.log('☁️  Cloudinary Status:', process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : 'MISSING');
console.log('📸 Centers Image System: CLOUDINARY (JSON-BASE64)');
console.log('--------------------------------------------------');

const app = express();

// --- Standard Middleware ---
// 1. CORS - MUST BE FIRST
app.use(cors({
  origin: [
    'https://aham-grham-website.vercel.app',
    'https://aham-grham-admin.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Logging
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 3. Body Parsing
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- Static Folder for Image Uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Static Folder for Frontend ---
// Redirect .html requests to clean URLs
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const cleanPath = req.path.replace(/\.html$/, '');
    if (cleanPath === '/index') {
      return res.redirect(301, '/');
    }
    return res.redirect(301, cleanPath);
  }
  next();
});

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/aitags', aiTagRoutes);
app.use('/api/footer', footerRoutes);
app.use('/api/activities', activityRoutes);

// Health Check Endpoint
app.get('/api', (req, res) => {
  res.send('🚀 Aham Grham API is running...');
});

// --- Static Folder for Frontend ---
// Serve static files with .html extension support
// This is moved here so API routes take precedence
app.use(express.static(path.join(__dirname, '../../'), { extensions: ['html'] }));

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start the server if not running on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
    --------------------------------------------------
    ✅ Server running in ${process.env.NODE_ENV || 'development'} mode
    📡 Port: ${PORT}
    🔗 API URL: http://localhost:${PORT}
    --------------------------------------------------
    `);
  });
}

export default app;
