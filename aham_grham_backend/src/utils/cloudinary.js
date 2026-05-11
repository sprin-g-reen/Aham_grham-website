import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a Base64 string to Cloudinary
 * @param {string} base64Str - The Base64 string (data:image/...)
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export const uploadToCloudinary = async (base64Str) => {
  if (!base64Str || !base64Str.startsWith('data:')) return base64Str;
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str);
    console.log('☁️ Cloudinary Upload Success:', uploadResponse.secure_url);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return base64Str; // Fallback to Base64 if upload fails
  }
};

export default cloudinary;
