import Product from '../models/Product.js';
import { logActivity } from '../utils/logger.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  console.log('📦 Create Product Request:', { ...req.body, image: req.body.image ? 'Base64 data...' : 'None' });
  try {
    const { name, price, category, description, isMostSelling, offer, sku, tax, stockStatus, image } = req.body;

    let imageUrl = image || '';
    if (imageUrl && imageUrl.startsWith('data:')) {
      imageUrl = await uploadToCloudinary(imageUrl);
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image: imageUrl || 'no-photo.jpg',
      isMostSelling: isMostSelling === 'true' || isMostSelling === true,
      isServicePage: req.body.isServicePage === 'true' || req.body.isServicePage === true,
      offer,
      sku,
      tax,
      stockStatus
    });

    const createdProduct = await product.save();
    await logActivity({
      action: 'CREATE',
      module: 'Products',
      description: `Created product ${name} (SKU: ${sku})`
    });
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  console.log('🔍 Get All Products Request');
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description, isMostSelling, offer, sku, tax, stockStatus, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.category = category || product.category;
      product.description = description || product.description;
      product.offer = offer || product.offer;
      product.sku = sku || product.sku;
      product.tax = tax || product.tax;
      product.stockStatus = stockStatus || product.stockStatus;

      if (isMostSelling !== undefined) {
        product.isMostSelling = isMostSelling === 'true' || isMostSelling === true;
      }

      if (req.body.isServicePage !== undefined) {
        product.isServicePage = req.body.isServicePage === 'true' || req.body.isServicePage === true;
      }

      if (image && image.startsWith('data:')) {
        product.image = await uploadToCloudinary(image);
      } else if (image) {
        product.image = image;
      }

      const updatedProduct = await product.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Products',
        description: `Updated product ${updatedProduct.name} (SKU: ${updatedProduct.sku})`
      });
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const { name, sku } = product;
      await Product.deleteOne({ _id: product._id });
      await logActivity({
        action: 'DELETE',
        module: 'Products',
        description: `Deleted product ${name} (SKU: ${sku})`
      });
      res.status(200).json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
