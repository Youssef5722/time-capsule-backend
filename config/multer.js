const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error("File format not supported. Please upload an image in JPG or PNG format."), false); 
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;