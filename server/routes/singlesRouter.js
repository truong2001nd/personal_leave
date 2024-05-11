const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createSingle,
  getAllSingle,
  destroySingle,
  updateSingle,
} = require("../controller/SinglesController.js");

const router = express.Router();

router.post("/create", verifyToken, createSingle);
router.get("/getAll", verifyToken, getAllSingle);
router.put("/update/:id", verifyToken, updateSingle);
router.delete("/delete/:id", verifyToken, destroySingle);

module.exports = router;
