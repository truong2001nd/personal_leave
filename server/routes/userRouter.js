const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  register,
  login,
  updateUser,
  getAllUsers,
  forgotPassword,
  disableAccount,
  loadUser,
  getUser,
  updateAccount,
  changePassword,
} = require("../controller/UserController.js");

const router = express.Router();

router.get("/loadUser", verifyToken, loadUser);
router.post("/register", verifyToken, register);
router.post("/updateAccount", verifyToken, updateAccount);
router.post("/login", login);
router.put("/update/:id", verifyToken, updateUser);
router.post("/changePassword", verifyToken, changePassword);
router.get("/getAllUser", getAllUsers);
router.get("/getUser/:id", getUser);
router.post("/forgotPassword", forgotPassword);
router.delete("/disableAccount/:id", disableAccount);

module.exports = router;
