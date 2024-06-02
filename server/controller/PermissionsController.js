const Permissions = require("../models/Permissions");

// them moi quyen
const createPermission = async (req, res, next) => {
  // check quyen

  if (!req.permissions.permission.includes("create")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  const { name, permission, position, room, single, singleType, user, status } =
    req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập tên quyền" });
  }

  if (
    !(
      Array.isArray(permission) &&
      Array.isArray(position) &&
      Array.isArray(room) &&
      Array.isArray(single) &&
      Array.isArray(singleType) &&
      Array.isArray(user)
    )
  ) {
    return res
      .status(422)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const permissionRelease = await Permissions.findOne({ name });

    if (permissionRelease) {
      return res
        .status(409)
        .json({ success: false, message: "Tên quyền đã tồn tại" });
    }

    const newPermission = new Permissions({
      name,
      permission,
      position,
      room,
      single,
      singleType,
      user,
      status: status ? status : 1,
    });

    await newPermission.save();

    res.status(200).json({
      success: true,
      message: "Thành công",
      data: newPermission,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// xem thông tin 1 quyền
const getOnePermission = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  try {
    const permissionOne = await Permissions.findOne({ _id: req.params.id });
    if (!permissionOne) {
      return res
        .status(404)
        .json({ success: false, message: "Quyền này không tồn tại" });
    }
    res.json({ success: true, message: "Thành công", data: permissionOne });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

// danh sách quyền
const getAllPermission = async (req, res) => {
  // check quyen

  // Check quyền
  if (!req.permissions.permission.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // Định nghĩa các tham số truy vấn

  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
    const search = req.query.search || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    // Xây dựng các điều kiện tìm kiếm
    const searchConditions = {};
    if (search) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(search, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    // Tìm kiếm và phân trang
    const permissionsAll = await Permissions.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng permissions để tính tổng số trang
    const totalCount = await Permissions.countDocuments(searchConditions);

    res.status(200).json({
      success: true,
      message: "Thành công",
      totalCount: totalCount,
      data: permissionsAll,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

const getAllPermissionName = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  try {
    const permissionsAll = await Permissions.find();
    const names = permissionsAll.map((permission) => ({
      _id: permission._id,
      name: permission.name,
    }));

    if (!permissionsAll) {
      return res
        .status(404)
        .json({ success: false, message: "Quyền không tồn tại" });
    }

    res.status(200).json({ success: true, message: "Thành công", data: names });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};
// sửa quyền
const updatePermission = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("update")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  const { name, permission, position, room, single, singleType, user, status } =
    req.body;
  if (!name) {
    return res
      .status(422)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }

  if (
    !(
      Array.isArray(permission) &&
      Array.isArray(position) &&
      Array.isArray(room) &&
      Array.isArray(single) &&
      Array.isArray(singleType) &&
      Array.isArray(user)
    )
  ) {
    return res
      .status(422)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const permissionID = await Permissions.findOne({ _id: req.params.id });
    if (!permissionID) {
      return res
        .status(400)
        .json({ success: false, message: "ID quyền không hợp lệ" });
    }
    const existingPermission = await Permissions.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingPermission) {
      return res
        .status(404)
        .json({ success: false, message: "Tên quyền đã tồn tại" });
    }
    let updatePermission = {
      name,
      permission: permission,
      position: position,
      room: room,
      single: single,
      singleType: singleType,
      user: user,
      status: status ? status : 1,
    };

    const newPermission = await Permissions.findOneAndUpdate(
      { _id: req.params.id },
      updatePermission,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
      data: newPermission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

// xóa quyền
const destroyPermission = async (req, res) => {
  // check quyen
  if (!req.permissions.permission.includes("delete")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }
  try {
    const deletePermission = await Permissions.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletePermission) {
      return res
        .status(404)
        .json({ success: false, message: "Quyền này không tồn tại" });
    }
    res.status(200).json({
      success: true,
      message: "Đã xóa thành công",
      data: deletePermission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

module.exports = {
  createPermission,
  getOnePermission,
  getAllPermission,
  updatePermission,
  destroyPermission,
  getAllPermissionName,
};
