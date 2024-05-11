const express = require("express");
const verifyToken = require("../middleware/verifyToken");

const {
  createPermission,
  getOnePermission,
  getAllPermission,
  updatePermission,
  destroyPermission,
  getAllPermissionName,
} = require("../controller/PermissionsController.js");

const router = express.Router();

// tao quyen
router.post("/create", verifyToken, createPermission);
router.get("/getOne/:id", verifyToken, getOnePermission);
router.get("/getAll", verifyToken, getAllPermission);
router.get("/getAllName", verifyToken, getAllPermissionName);
router.put("/update/:id", verifyToken, updatePermission);
router.delete("/delete/:id", verifyToken, destroyPermission);

module.exports = router;
