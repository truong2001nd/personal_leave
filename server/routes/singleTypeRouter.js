const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createSingleType,
  getOneSingleType,
  getAllSingleType,
  updateSingleType,
  destroySingleType,
} = require("../controller/SingleTypeController.js");

const router = express.Router();

// tao quyen
router.post("/create", verifyToken, createSingleType);
router.get("/getOne/:id", verifyToken, getOneSingleType);
router.get("/getAll", verifyToken, getAllSingleType);
router.put("/update/:id", verifyToken, updateSingleType);
router.delete("/delete/:id", verifyToken, destroySingleType);

module.exports = router;
