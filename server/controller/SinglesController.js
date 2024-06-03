const { request } = require("express");
const Singles = require("../models/Singles.js");
const SingleType = require("../models/SingleTypes.js");
const User = require("../models/Users.js");
const sendMail = require("../helper/sendMail.js");

// tạo đơn
const createSingle = async (req, res, next) => {
  if (!req.permissions.single.includes("create")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }
  const { name, content, singlesStyes, approver } = req.body;
  if (!name || !content || !singlesStyes || !approver) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    // kiểm tra loại đơn
    const singlesStyesRelease = await SingleType.findOne({ _id: singlesStyes });
    if (!singlesStyesRelease) {
      return res.json({ status: 400, message: "Không tồn tại Loại đơn" });
    }

    // kiểm tra người phê duyệt
    const approverRelease = await User.findOne({ _id: approver });
    if (!approverRelease) {
      return res.json({
        status: 400,
        message: "Mã người phê duyệt không tồn tại",
      });
    }

    const newSingles = new Singles({
      name,
      content: JSON.stringify(content),
      singlesStyes,
      sender: req.userId,
      approver,
      status: 0,
    });
    await newSingles.save();
    if (!(await newSingles.save())) {
      return res.json({ status: 400, message: "Gửi đơn thất bại!" });
    }
    res.json({
      status: 200,
      message: "Thành công",
      data: newSingles,
    });
    await sendMail({
      email: approverRelease.email,
      subject: `"Thông báo có đơn mới từ ${req.userName} "`,
      html: `<h1>${name} <h1>  
      `,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Xem tất cả đơn.
const getAllSingle = async (req, res) => {
  // check quyen

  if (!req.permissions.single.includes("read")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 6; // Số lượng mục trên mỗi trang, mặc định là 5
    const search = req.query.search || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const searchConditions = {};
    if (search) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(search, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    // Tìm kiếm và phân trang
    const singleAll = await Singles.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng Singles để tính tổng số trang
    const totalCount = await Singles.countDocuments(searchConditions);

    if (!singleAll) {
      return res.json({ status: 401, message: "Chưa có đơn nào được tạo!" });
    }

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: singleAll,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

const deleteSingle = async (req, res) => {
  // check quyen

  if (!req.permissions.single.includes("delete")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  try {
    const deleteSing = await Singles.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteSing) {
      return res.json({ status: 400, message: "Loại đơn này không tồn tại" });
    }
    res.json({
      status: 200,
      message: "Đã xóa thành công",
      data: deleteSing,
    });
  } catch (error) {
    console.log(error);
    res0.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
const updateSingle = async (req, res) => {
  // check quyen

  if (!req.permissions.single.includes("update")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  const { name, content } = req.body;
  if (!name) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const singleId = await Singles.findOne({ _id: req.params.id });
    if (!singleId) {
      return res.json({ status: 400, message: "Mã loại đơn này sai" });
    }
    if (!(singleId.status === 0)) {
      return res.json({
        status: 400,
        message: "Đơn đã được phê duyệt không được sửa",
      });
    }
    const existingSingleType = await SingleType.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingSingleType) {
      return res.json({ status: 400, message: "Tên loại đơn đã tồn tại" });
    }
    let updateSingle = {
      name,
      content: JSON.stringify(content),
    };

    const newSingleId = await Singles.findOneAndUpdate(
      { _id: req.params.id },
      updateSingle,
      { new: true }
    );
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newSingleId,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// phệ duyệt đơn
const approvalSingle = async (req, res) => {
  if (!req.permissions.single.includes("update")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền chỉnh sửa",
    });
  }
  const { status } = req.body;
  if (status !== 1 && status !== 2) {
    return res.json({
      status: 422,
      message: "Sai dữ liệu đầu vào",
    });
  }

  try {
    const singleId = await Singles.findOne({ _id: req.params.id });
    if (!singleId) {
      return res.json({ status: 400, message: "ID đơn Không hợp lệ" });
    }

    let approvalSingle = {
      status,
    };
    const newSingleId = await Singles.findOneAndUpdate(
      { _id: req.params.id },
      approvalSingle,
      { new: true }
    );
    res.json({
      status: 200,
      message: "Phê duyệt  thành công!",
      data: newSingleId,
    });
  } catch (error) {}
};

module.exports = {
  createSingle,
  getAllSingle,
  deleteSingle,
  updateSingle,
  approvalSingle,
};
