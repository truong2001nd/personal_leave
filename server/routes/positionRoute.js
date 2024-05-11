const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createPositions,
  getAllPosition,
  getOnePosition,
  updatePosition,
  deletePosition,
} = require("../controller/PositionsController");

const router = express.Router();

router.post("/create", verifyToken, createPositions);
router.get("/getall", verifyToken, getAllPosition);
router.get("/getOne/:id", verifyToken, getOnePosition);
router.put("/update/:id", verifyToken, updatePosition);
router.delete("/delete/:id", verifyToken, deletePosition);

module.exports = router;
