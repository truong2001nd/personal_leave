require("dotenv").config();

const crypto = require("crypto");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/Users.js");
const Permissions = require("../models/Permissions.js");
const Room = require("../models/Rooms.js");
const Position = require("../models/Positions.js");

const sendMail = require("../helper/sendMail.js");

const loadUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res.status(400).json({ status: 400, message: "User not found" });
    res.json({ status: 200, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// thêm mới tài khoản
const register = async (req, res, next) => {
  if (!req.permissions.user.includes("create")) {
    return res
      .status(401)
      .json({ status: 401, message: "Tài khoản không có quyền truy cập" });
  }

  const {
    name,
    email,
    password,
    permissions,
    positions,
    room,
    sex,
    phone,
    birthday,
  } = req.body;
  if (!name || !email || !password || !permissions) {
    return res
      .status(422)
      .json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const userRelease = await User.findOne({ email });

    if (userRelease) {
      return res.status(409).json({ status: 409, message: "Email đã tồn tại" });
    }

    const roomRelease = await Room.findOne({ _id: room });

    if (!roomRelease) {
      return res
        .status(400)
        .json({ status: 400, message: "Không tồn tại phòng ban" });
    }

    const permissionRelease = await Permissions.findOne({ _id: permissions });

    if (!permissionRelease) {
      return res
        .status(400)
        .json({ status: 400, message: "Không tồn tại quyền" });
    }

    const positionRelease = await Position.findOne({ _id: positions });
    if (!positionRelease) {
      return res
        .status(400)
        .json({ status: 400, message: "Không tồn tại chức vụ" });
    }

    // ma hoa mk
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      permissions: permissions || "",
      positions: positions || "",
      room: room || "",
      sex,
      phone,
      birthday,
    });

    await newUser.save();
    if (!(await newUser.save())) {
      return res
        .status(500)
        .json({ status: 500, message: "Tạo tài khoản thất bại!" });
    }

    await sendMail({
      email: email,
      subject: "Thông báo đăng ký tài khoản thành công",
      html: `<h1> Mật khẩu của ${name}<h1>
            <li>Mật Khẩu : ${password}</li>  
      `,
    });
    res.status(200).json({
      status: 200,
      message: "Thành công",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Đăng nhập
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Vui lòng nhập email và mật khẩu" });
  }

  try {
    const userRelease = await User.findOne({ email }).populate("permissions");

    if (!userRelease) {
      return res
        .status(404)
        .json({ status: 400, message: "Không tồn tại tài khoản" });
    }

    // ma hoa mk
    const passwordValid = await argon2.verify(userRelease.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ status: 400, message: "Sai tài khoản hoặc mật khẩu" });

    // return token
    const accessToken = jwt.sign(
      {
        userId: userRelease._id,
        userName: userRelease.name,
        permissions: userRelease.permissions,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(200).json({
      status: 200,
      message: "Thành công",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Chỉnh sửa tài khoản
const updateUser = async (req, res, next) => {
  if (!req.permissions.user.includes("update")) {
    return res.status(401).json({
      status: 401,
      message: "Tài khoản không  có quyền sửa đổi thông tin",
    });
  }
  const {
    name,
    email,
    password,

    sex,
    phone,
    birthday,
  } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Sai dữ liệu đầu vào" });
  }
  try {
    // kiểm tra id có trùng khớp khônmg
    if (!(req.userId === req.params.id)) {
      return res
        .status(400)
        .json({ status: 400, message: "ID người dùng không hợp lệ" });
    }
    // kiểm tra xem email sửa đã tôn tại chưa và trừ trùng với tk cần sửa
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.params.id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: " Email đã tồn tại" });
    }

    const hashedPassword = await argon2.hash(password);
    let updateUser = {
      name,
      email,
      password: hashedPassword,
      sex: sex || 1,
      phone: phone || "",
      birthday: birthday || "",
    };

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      updateUser,
      { new: true }
    );
    res.status(200).json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// Xem tất cả các tài khoản
const getAllUsers = async (req, res, next) => {
  try {
    const userAll = await User.find();
    const names = userAll.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    }));

    if (!userAll) {
      return res
        .status(401)
        .json({ status: 401, message: "Chưa có quyền nào được tạo!" });
    }

    res.status(200).json({ status: 200, message: "Thành công", data: names });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ status: 400, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Email không tồn tại!" });
    }
    // Tạo mật khẩu ngẫu nhiên
    const newPassword = crypto.randomBytes(3).toString("hex").toUpperCase();
    // Mã hóa mk
    const hashedPassword = await argon2.hash(newPassword);

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({
      status: 200,
      message: "Thành công!",
    });

    if (!updatedUser) {
      return res
        .status(400)
        .json({ status: 400, message: "Cập nhật mật khẩu thất bại!" });
    }
    await sendMail({
      email: email,
      subject: "Mật khẩu mới ",
      html: `<h1> Mật khẩu mới của bạn là: ${newPassword}</h1>
        `,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

const disableAccount = async (req, res) => {
  // check quyen
  if (!req.permissions.User.includes("delete")) {
    return res.status(401).json({
      status: 401,
      message: "Tài khoản không có quyền xóa tài khoản",
    });
  }
  try {
    const deleteUser = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteUser) {
      return res
        .status(400)
        .json({ status: 400, message: "ID người dùng không hợp lệ" });
    }
    res.status(200).json({
      status: 200,
      message: "Đã xóa thành công",
      data: deletePermission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  getAllUsers,
  forgotPassword,
  disableAccount,
  loadUser,
};
