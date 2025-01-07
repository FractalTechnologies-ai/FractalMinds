// controllers/roomController.js
const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const room = new Room({ name, user: userId });
    await room.save();

    res.status(201).json({ message: "Room created successfully", room });
  } catch (error) {
    res.status(500).send("Error creating room");
  }
};

exports.getUserRooms = async (req, res) => {
  try {
    const userId = req.user._id;
    const rooms = await Room.find({ user: userId });
    res.json(rooms);
  } catch (error) {
    res.status(500).send("Error retrieving rooms");
  }
};

exports.getRoomHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { roomId } = req.params;

    // Find the room by ID and ensure it belongs to the user
    const room = await Room.findOne({ _id: roomId, user: userId });
    if (!room) {
      return res.status(404).send("Room not found or unauthorized");
    }

    res.json(room.history);
  } catch (error) {
    res.status(500).send("Error retrieving room history");
  }
};
