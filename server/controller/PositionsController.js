const Position = require("../models/Positions.js");
const Room = require("../models/Rooms.js");

const createPositions = async (req, res) => {
  if (!req.permissions.position.includes("create")) {
    return res.json({ status: 401, message: "Bạn không có quyền tạo chức vụ" });
  }
  const { name, room } = req.body;
  if (!name) {
    return res.json({
      success: 422,
      message: "Sai dữ liệu đầu vào",
    });
  }
  if (!room) {
    return res.json({
      status: 400,
      message: "vui lòng chọn chức vụ",
    });
  }
  try {
    let roomObject = await Room.findById(room);
    if (!roomObject) {
      return res.json({
        status: 400,
        message: "ID phòng ban không hợp lệ",
      });
    }

    const existingPosition = await Position.findOne({
      name,
      room: roomObject._id,
    }).lean();
    if (existingPosition) {
      return res.json({
        status: 400,
        message: "Chức vụ đã tồn tại trong phòng ban này!",
      });
    }

    console.log("existingPosition", existingPosition);

    const newPosition = new Position({
      name,
      room: room,
    });

    await newPosition.save();
    res.json({
      status: 200,
      message: "Thành công",
      data: newPosition,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, error: error.message });
  }
};
const getAllPosition = async (req, res) => {
  if (!req.permissions.position.includes("read")) {
    return res.json({ status: 401, message: "Bạn không có quyền xem chức vụ" });
  }

  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const limit = parseInt(req.query.limit) || 5; // Số lượng mục trên mỗi trang, mặc định là 5
    const search = req.query.search || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const searchConditions = {};
    if (search) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(search, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    // Tìm kiếm và phân trang
    const positionAll = await Position.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng Position để tính tổng số trang
    const totalCount = await Position.countDocuments(searchConditions);

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: positionAll,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const getOnePosition = async (req, res) => {
  if (!req.permissions.position.includes("read")) {
    return res.json({ status: 401, message: "Bạn không có quyền xem chức vụ" });
  }
  try {
    const positionCondition = await Position.findOne({ _id: req.params.id });
    if (!positionCondition) {
      return res.json({ status: 400, message: "Sai mã chức vụ" });
    }
    res.json({ status: 200, message: "Thành công", data: positionCondition });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const updatePosition = async (req, res) => {
  if (!req.permissions.position.includes("update")) {
    return res.json({ status: 401, message: "Bạn không có quyền sửa chức vụ" });
  }
  const { name, room } = req.body;
  if (!name) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const roomObject = await Room.findById(room).lean();
    if (!roomObject) {
      return res.json({ status: 400, message: "ID Phòng ban không hợp lệ" });
    }
    let updatePosition = { name, room: roomObject._id };

    const positionId = await Position.findOneAndUpdate(
      { _id: req.params.id },
      updatePosition,
      { new: true }
    );

    if (!positionId) {
      return res.json({ status: 400, message: "ID Chức vụ không hợp lệ" });
    }
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: updatePosition,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const deletePosition = async (req, res) => {
  if (!req.permissions.position.includes("delete")) {
    return res.json({ status: 401, message: "Bạn không có quyền xóa chức vụ" });
  }
  try {
    const deletePosition = await Position.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deletePosition) {
      return res.json({ status: 400, message: "ID chức vụ sai" });
    }
    res.json({
      status: 200,
      message: "Đã xóa chức vụ thành công",
      data: deletePosition,
    });
  } catch (error) {
    res.json({ status: 500, message: "Dịch vụ tạm thời gián đoạn" });
  }
};

module.exports = {
  createPositions,
  getAllPosition,
  getOnePosition,
  updatePosition,
  updatePosition,
  deletePosition,
};
