const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  register,
  login,
  // logout,
  updateUser,
  getAllUsers,
  forgotPassword,
  disableAccount,
  loadUser,
} = require("../controller/UserController.js");

const router = express.Router();

router.get("/loadUser", verifyToken, loadUser);
router.post("/register", verifyToken, register);
router.post("/login", login);
router.put("/update/:id", verifyToken, updateUser);
router.get("/getAllUser", getAllUsers);
router.post("/forgotPassword", forgotPassword);
router.delete("/disableAccount/:id", disableAccount);
// router.post("/logout",verifyToken, logout);

module.exports = router;
