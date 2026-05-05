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

// Import Middleware
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Initialize environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- Standard Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static Folder for Image Uploads ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- API Routes ---
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/programs', programRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('🚀 Aham Grham API is running...');
});

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  --------------------------------------------------
  ✅ Server running in ${process.env.NODE_ENV || 'development'} mode
  📡 Port: ${PORT}
  🔗 API URL: http://localhost:${PORT}
  --------------------------------------------------
  `);
});
 
