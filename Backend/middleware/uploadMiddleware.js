import multer from "multer";
import path from "path";

// 1. Configure Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // This tells multer to save files in a folder named 'uploads'
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // We create a unique filename using the student's ID and the current timestamp
    // Example: 64a1b2c3-1698765432.pdf
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Filter for specific file types (Optional but recommended)
const checkFileType = (file, cb) => {
  const filetypes = /pdf|jpg|jpeg|png/; // Allow PDFs and basic images
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images and PDFs only!"));
  }
};

// 3. Initialize Multer
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
