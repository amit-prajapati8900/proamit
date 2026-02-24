const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,                     // ← Recommended: forces HTTPS URLs (v2 mein default bhi hai)
});

// Cloudinary storage setup for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Dynamic params (better practice)
    return {
      folder: 'myproject',           // ya req.user.id ke hisab se dynamic kar sakte ho
      allowed_formats: ['png', 'jpg', 'jpeg'],
      // Optional useful additions:
      // public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique filename
      // overwrite: true,            // agar same name pe overwrite chahiye
      // transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // auto-resize
    };
  },
});

// Export both (jo bhi file use kar rahi hai)
module.exports = {
  cloudinary,
  storage,
};