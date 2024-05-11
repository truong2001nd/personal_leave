const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createRoom,
  getOneRoom,
  getAllRoom,
  updateRoom,
  deleteRoom,
} = require("../controller/roomController.js");

const router = express.Router();

router.post("/create", verifyToken, createRoom);
router.get("/getOne/:id", verifyToken, getOneRoom);
router.get("/getAll", verifyToken, getAllRoom);
router.put("/update/:id", verifyToken, updateRoom);
router.delete("/deleteRoom/:id", verifyToken, deleteRoom);

module.exports = router;
