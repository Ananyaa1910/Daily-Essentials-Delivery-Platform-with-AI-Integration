import multer from 'multer';

// Use default temp storage since we will upload directly to Cloudinary
const storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });
export default upload;
