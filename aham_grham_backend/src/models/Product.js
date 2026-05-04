import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    default: 'no-photo.jpg' // Placeholder for file path
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;
