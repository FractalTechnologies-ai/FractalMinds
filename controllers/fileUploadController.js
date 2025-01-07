const Room = require("../models/Room");
const File = require("../models/File");
const { parseDocument } = require("../utils/documentParser");

exports.fileUploadHandler = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user._id;
    const filePath = req.file.path;
    const isAdminUpload = req.user.role === "admin";
    if (isAdminUpload === true) {
      // Parse the document to extract text content
      const fileText = await parseDocument(filePath);

      // Save file information in the database
      const file = new File({
        path: filePath,
        type,
        uploadedBy: userId,
        isAdminUpload: isAdminUpload,
        content: fileText,
      });
      await file.save();
      res.status(201).send("File uploaded successfully");
    } else {
      res.status(500).send("You are not Admin");
    }
  } catch (error) {
    res.status(500).send("Error uploading file");
  }
};
