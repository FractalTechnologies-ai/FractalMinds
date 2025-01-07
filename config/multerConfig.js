// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userRole = req.user.role;
    const uploadType = req.query.type;
    const userId = req.user._id;

    // Create dynamic folder paths based on role and user ID
    const uploadPath =
      userRole === "admin"
        ? path.join(__dirname, `../uploads/${uploadType}/admin`)
        : path.join(__dirname, `../uploads/${uploadType}/${userId}`);

    // Ensure directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;
