const Room = require("../models/Rooms.js");

const createRoom = async (req, res, next) => {
  if (!req.permissions.room.includes("create")) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn không có quyền tạo phòng ban" });
  }
  const { name, description } = req.body;
  if (!name) {
    return res
      .status(422)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const roomReleaser = await Room.findOne({ name: name });
    if (roomReleaser) {
      return res
        .status(401)
        .json({ success: false, message: "Tên phòng ban đã tồn tại" });
    }
    const newRoom = new Room({
      name,
      description: description || "",
    });
    await newRoom.save();
    res.status(200).json({
      success: true,
      message: "Thành công ",
      data: newRoom,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

const getOneRoom = async (req, res) => {
  if (!req.permissions.room.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn không có quyền xem phòng ban" });
  }
  try {
    const roomCondition = await Room.findOne({ _id: req.params.id });
    if (!roomCondition) {
      return res
        .status(401)
        .json({ success: false, message: "Phòng ban đã tồn tại" });
    }
    const RoomOne = await Room.findOne(roomCondition);
    res.status(200).json({
      success: true,
      message: "Thành công",
      data: RoomOne,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

const getAllRoom = async (req, res) => {
  if (!req.permissions.room.includes("read")) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn không có quyền xem phòng ban" });
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
    const roomAll = await Room.find(searchConditions)
      .skip((page - 1) * limit) // Bỏ qua các mục trước đó
      .limit(limit); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng Room để tính tổng số trang
    const totalCount = await Room.countDocuments(searchConditions);
    res.status(200).json({
      success: true,
      message: "Thành công",
      totalCount: totalCount,
      data: roomAll,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

const updateRoom = async (req, res, next) => {
  if (!req.permissions.room.includes("update")) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn không có quyền xem phòng ban" });
  }
  const { name, description } = req.body;
  if (!name) {
    return res
      .status(422)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }
  try {
    // Kiểm tra tên phòng đã tồn tại hay chưa
    const existingRoom = await Room.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingRoom) {
      return res
        .status(400)
        .json({ success: false, message: "Tên phòng đã tồn tại" });
    }
    let updateRoom = {
      name,
      description: description || "",
    };
    const roomCondition = await Room.findOne({ _id: req.params.id });
    if (!roomCondition) {
      return res
        .status(400)
        .json({ success: false, message: "ID phòng ban không hợp lệ" });
    }
    updateRoom = await Room.findOneAndUpdate(roomCondition, updateRoom, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Cập nhật thành công!",
      data: updateRoom,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
const deleteRoom = async (req, res) => {
  if (!req.permissions.room.includes("delete")) {
    return res
      .status(401)
      .json({ success: false, message: "Bạn không có quyền xóa phòng ban" });
  }
  try {
    const deleteRoom = await Room.findOneAndDelete({ _id: req.params.id });
    if (!deleteRoom) {
      return res
        .status(400)
        .json({ success: false, message: "ID phòng ban không hợp lệ" });
    }
    res
      .status(200)
      .json({ success: true, message: "Đã xóa thành công", data: deleteRoom });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};
module.exports = { createRoom, getOneRoom, getAllRoom, updateRoom, deleteRoom };
