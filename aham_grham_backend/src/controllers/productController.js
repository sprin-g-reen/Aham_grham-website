import Product from '../models/Product.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, isMostSelling, offer, sku, tax, stockStatus } = req.body;

    let imagePath = 'no-photo.jpg';
    if (req.file) {
      imagePath = req.file.filename;
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image: imagePath,
      isMostSelling: isMostSelling === 'true' || isMostSelling === true,
      offer,
      sku,
      tax,
      stockStatus
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
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
    const { name, price, category, description, isMostSelling, offer, sku, tax, stockStatus } = req.body;
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

      if (req.file) {
        product.image = req.file.filename;
      }

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
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
      await Product.deleteOne({ _id: product._id });
      res.status(200).json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
