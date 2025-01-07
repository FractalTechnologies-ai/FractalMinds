// queryController.js
const File = require("../models/File");
const Room = require("../models/Room");
const { queryGPT } = require("../services/gptService");
const { parseDocument } = require("../utils/documentParser");

async function userQuery(req, res) {
  try {
    const { query, type, roomId } = req.body;
    const userId = req.user._id;
    let fileText = "";

    if (req.file) {
      const filePath = req.file.path;
      fileText = await parseDocument(filePath);

      // Save file information in the database
      const file = new File({
        path: filePath,
        type,
        uploadedBy: userId,
        isAdminUpload: false,
        content: fileText,
      });
      await file.save();

      // Associate the file with the specified room
      const room = await Room.findOne({ _id: roomId, user: userId });
      if (!room) {
        return res.status(404).send("Room not found or unauthorized");
      }
      room.documents.push(file._id);
      await room.save();
    }
    if (query) {
      // Find admin files of the specified type
      const adminFiles = await File.find({ isAdminUpload: true, type });
      const userFiles = await File.find({
        type,
        uploadedBy: userId,
        isAdminUpload: false,
      });

      // Find the room and its associated files
      const room = await Room.findOne({ _id: roomId, user: userId }).populate(
        "documents"
      );
      if (!room) {
        return res.status(404).send("Room not found or unauthorized");
      }

      // Combine content from admin files and user room files
      const allFileContents = [
        ...adminFiles.map((file) => file.content),
        ...userFiles.map((file) => file.content),
        ...room.documents.map((file) => file.content),
      ].join("\n");

      // Prepare conversation history for context
      const conversationHistory = room.history
        .map((entry) => [
          { role: "user", content: entry.query },
          { role: "assistant", content: entry.response },
        ])
        .flat();

      // Add the new user query to the conversation
      conversationHistory.push({ role: "user", content: query });
      // Query GPT-4 with both document content and conversation history
      const gptAnswer = await queryGPT(conversationHistory, allFileContents);

      // Save the query and response to the room's history
      room.history.push({ query, response: gptAnswer });
      await room.save();

      res.json({ response: gptAnswer });
    }
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).send("Error processing query");
  }
}

module.exports = { userQuery };
