const SingleType = require("../models/SingleTypes.js");

const createSingleType = async (req, res, next) => {
  if (!req.permissions.singleType.includes("create")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }
  const { name, content } = req.body;
  if (!name || !content) {
    return res.json({
      success: 422,
      message: "Sai dữ liệu đầu vào",
    });
  }
  try {
    const singleTypeRelease = await SingleType.findOne({ name });

    if (singleTypeRelease) {
      return res.json({ status: 409, message: "Loại đơn đã tồn tại" });
    }
    const newSingleType = new SingleType({
      name,
      content: JSON.stringify(content),
      status: 1,
    });

    await newSingleType.save();

    res.json({
      status: 200,
      message: "Thành công",
      data: newSingleType,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const getOneSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  try {
    const singleTypeOne = await SingleType.findOne({ _id: req.params.id });
    if (!singleTypeOne) {
      return res.json({
        status: 404,
        message: "Mã loại đơn này không tồn tại",
      });
    }
    res.json({ status: 200, data: singleTypeOne });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
const getAllSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 10; // Số lượng mục trên mỗi trang, mặc định là 10
    const keySearch = req.query.keySearch || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const _id = req.query._id || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const searchConditions = {};
    if (keySearch) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(keySearch, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }
    if (_id) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions._id = _id; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    // Tìm kiếm và phân trang
    const singleTypeAll = await SingleType.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng SingleType để tính tổng số trang
    const totalCount = await SingleType.countDocuments(searchConditions);

    if (!singleTypeAll) {
      return res.json({ status: 401, message: "Chưa có đơn nào được tạo!" });
    }

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: singleTypeAll,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
const updateSingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("update")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  const { name, content, status } = req.body;
  if (!name) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const singleTypeId = await SingleType.findOne({ _id: req.params.id });
    console.log(singleTypeId);
    if (!singleTypeId) {
      return res.json({ status: 400, message: "Id loại Đơn không hợp lệ" });
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
      status: 200,
      message: "Cập nhật thành công!",
      data: newSingleTypeId,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
const destroySingleType = async (req, res) => {
  // check quyen

  if (!req.permissions.singleType.includes("delete")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  // check quyen

  try {
    const deleteSingleType = await SingleType.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteSingleType) {
      return res.json({ status: 400, message: "Loại đơn này không tồn tại" });
    }
    res.json({
      status: 200,
      message: "Đã xóa thành công",
      data: deleteSingleType,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

module.exports = {
  createSingleType,
  getOneSingleType,
  getAllSingleType,
  updateSingleType,
  destroySingleType,
};
