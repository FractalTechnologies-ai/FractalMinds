// routes/roomRoutes.js
const express = require("express");
const {
  createRoom,
  getUserRooms,
  getRoomHistory,
} = require("../controllers/roomController");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/create", auth, createRoom); // Create a new room
router.get("/", auth, getUserRooms); // Get all rooms for the authenticated user
router.get("/:roomId/history", auth, getRoomHistory); // Get history for a specific room

module.exports = router;
