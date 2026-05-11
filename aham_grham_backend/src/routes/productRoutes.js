import express from 'express';
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

/**
 * Route: /api/products
 * GET: Fetch all products
 * POST: Create a new product (with image upload)
 */
router.route('/')
  .get(getAllProducts)
  .post(upload.single('image'), createProduct);

/**
 * Route: /api/products/:id
 * GET: Fetch a single product
 * DELETE: Remove a product
 */
router.route('/:id')
  .get(getSingleProduct)
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

export default router;
