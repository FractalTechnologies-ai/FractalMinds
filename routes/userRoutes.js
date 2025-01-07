// routes/userRoutes.js
const express = require("express");

const { register, login } = require("../controllers/authController");
const { userQuery } = require("../controllers/queryController");
const { fileUploadHandler } = require("../controllers/fileUploadController");
const auth = require("../middlewares/auth");
const upload = require("../config/multerConfig");

const router = express.Router();

// User registration and login
router.post("/register", register);
router.post("/login", login);

// File upload with authorization and multer configuration
router.post("/upload", auth, upload.single("file"), fileUploadHandler);

// Query with GPT-4
router.post("/query", auth, upload.single("file"), userQuery);

module.exports = router;
