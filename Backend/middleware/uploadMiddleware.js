import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Created uploads folder on Render!");
}

// 1. Configure Storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // This tells multer to save files in a folder named 'uploads'
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // create a unique filename using the student's ID and the current timestamp
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Filter for specific file types
const checkFileType = (file, cb) => {
  const filetypes = /pdf|jpg|jpeg|png/;
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

export default upload;
