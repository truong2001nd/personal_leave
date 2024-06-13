const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createRoom,
  getRoomUserApprove,
  getAllRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/roomController.js");

const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.get("/getRoomUserApprove/:id", verifyToken, getRoomUserApprove);
router.get("/getAll", verifyToken, getAllRoom);
router.put("/update/:id", verifyToken, updateRoom);
router.delete("/deleteRoom/:id", verifyToken, deleteRoom);

module.exports = router;
