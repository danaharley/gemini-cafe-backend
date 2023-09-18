import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/products/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext =
      [".jpg", ".jpeg", ".png", ".webp"].indexOf(
        path.extname(file.originalname).toLowerCase()
      ) >= 0;
    const mimeType =
      ["image/jpg", "image/jpeg", "image/png", "image/webp"].indexOf(
        file.mimetype
      ) >= 0;
    if (ext && mimeType) {
      return cb(null, true);
    }
    cb(new Error("Only JPG, JPEG, PNG, and WEBP image files are allowed"));
  },
}).single("image");

export default uploadFile;
