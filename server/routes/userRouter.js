const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  register,
  login,
  updateUser,
  getAllUsers,
} = require("../controller/UserController.js");

const router = express.Router();

router.post("/register", verifyToken, register);
router.post("/login", login);
router.put("/update/:id", verifyToken, updateUser);
router.get("/getAllUser", getAllUsers);

module.exports = router;
