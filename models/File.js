// models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    path: String,
    type: String,
    uploadedBy: mongoose.Schema.Types.ObjectId,
    isAdminUpload: Boolean,
    content: String, // New field to store parsed text content
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
