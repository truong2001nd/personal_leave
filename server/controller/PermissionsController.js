const Permissions = require("../models/Permissions");

// them moi quyen
const createPermission = async (req, res, next) => {
  // check quyen

  if (!req.permissions.permission.includes("create")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  const { name, permission, position, room, single, singleType, user, status } =
    req.body;
  if (!name) {
    return res.json({ status: 400, message: "Vui lòng nhập tên quyền" });
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
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const permissionRelease = await Permissions.findOne({ name });

    if (permissionRelease) {
      return res.json({ status: 400, message: "Tên quyền đã tồn tại" });
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

    res.json({
      status: 200,
      message: "Thành công",
      data: newPermission,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// xem thông tin 1 quyền
const getOnePermission = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  try {
    const permissionOne = await Permissions.findOne({ _id: req.params.id });
    if (!permissionOne) {
      return res.json({ status: 400, message: "Quyền này không tồn tại" });
    }
    res.json({ status: 200, message: "Thành công", data: permissionOne });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// danh sách quyền
const getAllPermission = async (req, res) => {
  // check quyen

  // Check quyền
  if (!req.permissions.permission.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // Định nghĩa các tham số truy vấn

  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const size = parseInt(req.query.size) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
    const keySearch = req.query.keySearch || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    // Xây dựng các điều kiện tìm kiếm
    const searchConditions = {};
    if (keySearch) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(keySearch, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    // Tìm kiếm và phân trang
    const permissionsAll = await Permissions.find(searchConditions)
      .skip((page - 1) * size) // Bỏ qua các mục trước đó
      .limit(size); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng permissions để tính tổng số trang
    const totalCount = await Permissions.countDocuments(searchConditions);

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: permissionsAll,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

const getAllPermissionName = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  try {
    const permissionsAll = await Permissions.find();
    const names = permissionsAll.map((permission) => ({
      _id: permission._id,
      name: permission.name,
    }));

    if (!permissionsAll) {
      return res.json({ status: 400, message: "Quyền không tồn tại" });
    }

    res.json({ status: 200, message: "Thành công", data: names });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
// sửa quyền
const updatePermission = async (req, res) => {
  // check quyen

  if (!req.permissions.permission.includes("update")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  const { name, permission, position, room, single, singleType, user, status } =
    req.body;
  if (!name) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
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
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const permissionID = await Permissions.findOne({ _id: req.params.id });
    if (!permissionID) {
      return res.json({ status: 400, message: "ID quyền không hợp lệ" });
    }
    const existingPermission = await Permissions.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingPermission) {
      return res.json({ status: 400, message: "Tên quyền đã tồn tại" });
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
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newPermission,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// xóa quyền
const destroyPermission = async (req, res) => {
  // check quyen
  if (!req.permissions.permission.includes("delete")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }
  try {
    const deletePermission = await Permissions.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletePermission) {
      return res.json({ status: 400, message: "Quyền này không tồn tại" });
    }
    res.json({
      status: 200,
      message: "Đã xóa thành công",
      data: deletePermission,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
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
