const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createSingle,
  getAllSingle,
  deleteSingle,
  updateSingle,
  approvalSingle,
} = require("../controller/SinglesController.js");

const router = express.Router();

router.post("/create", verifyToken, createSingle);
router.get("/getAll", verifyToken, getAllSingle);
router.put("/update/:id", verifyToken, updateSingle);
router.delete("/delete/:id", verifyToken, deleteSingle);
router.put("/approval/:id", verifyToken, approvalSingle);

module.exports = router;
