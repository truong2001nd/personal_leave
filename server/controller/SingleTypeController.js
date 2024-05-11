const SingleType = require("../models/SingleTypes.js");

const createSingleType = async (req, res, next) => {
  if (!req.permissions.singleType.includes("create")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }
  const { name, content } = req.body;
  if (!name || !content) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập tên loại đơn hoặc content",
    });
  }
  try {
    const singleTypeRelease = await SingleType.findOne({ name });

    if (singleTypeRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Loại đơn đã tồn tại" });
    }
    const newSingleType = new SingleType({
      name,
      content: JSON.stringify(content),
      status: 1,
    });

    await newSingleType.save();

    res.json({
      success: true,
      message: "Thành công",
      data: newSingleType,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const getOneSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  try {
    const singleTypeOne = await SingleType.findOne({ _id: req.params.id });
    if (!singleTypeOne) {
      return res
        .status(400)
        .json({ success: false, message: "Mã loại đơn này không tồn tại" });
    }
    res.json({ success: true, data: singleTypeOne });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};
const getAllSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

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
    const singleTypeAll = await SingleType.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng SingleType để tính tổng số trang
    const totalCount = await SingleType.countDocuments(searchConditions);

    if (!singleTypeAll) {
      return res
        .status(401)
        .json({ success: false, message: "Chưa có đơn nào được tạo!" });
    }

    res.json({
      success: true,
      message: "Thành công",
      totalCount: totalCount,
      data: singleTypeAll,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};
const updateSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("update")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  const { name, content, status } = req.body;
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập tên loại đơn" });
  }
  try {
    const singleTypeId = await SingleType.findOne({ _id: req.params.id });
    if (!singleTypeId) {
      return res
        .status(400)
        .json({ success: false, message: "Mã loại đơn này sai" });
    }
    const existingSingleType = await SingleType.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingSingleType) {
      return res
        .status(400)
        .json({ success: false, message: "Tên loại đơn đã tồn tại" });
    }
    let updateSingleType = {
      name,
      content: JSON.stringify(content),
      status: status ? status : 1,
    };

    const newSingleTypeId = await SingleType.findOneAndUpdate(
      { _id: req.params.id },
      updateSingleType,
      { new: true }
    );
    res.json({
      success: true,
      message: "Cập nhật thành công!",
      data: newSingleTypeId,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};
const destroySingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("delete")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
  }

  // check quyen

  try {
    const deleteSingleType = await SingleType.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteSingleType) {
      return res
        .status(400)
        .json({ success: false, message: "Loại đơn này không tồn tại" });
    }
    res.json({
      success: true,
      message: "Đã xóa thành công",
      data: deleteSingleType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

module.exports = {
  createSingleType,
  getOneSingleType,
  getAllSingleType,
  updateSingleType,
  destroySingleType,
};
