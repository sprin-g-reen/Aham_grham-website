import express from 'express';
import { 
  createProduct, 
  getAllProducts, 
  getSingleProduct, 
  deleteProduct 
} from '../controllers/productController.js';

const router = express.Router();

/**
 * Route: /api/products
 * GET: Fetch all products
 * POST: Create a new product
 */
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

/**
 * Route: /api/products/:id
 * GET: Fetch a single product
 * DELETE: Remove a product
 */
router.route('/:id')
  .get(getSingleProduct)
  .delete(deleteProduct);

export default router;
