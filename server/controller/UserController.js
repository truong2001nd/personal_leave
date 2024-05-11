require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/Users.js");
const Permissions = require("../models/Permissions.js");
const Room = require("../models/Rooms.js");
const Position = require("../models/Positions.js");

// them moi user
const register = async (req, res, next) => {
  if (!req.permissions.user.includes("create")) {
    return res
      .status(401)
      .json({ success: false, message: "Tài khoản không có quyền truy cập" });
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
      .status(400)
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const userRelease = await User.findOne({ email });

    if (userRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Email đã tồn tại" });
    }

    const roomRelease = await Room.findOne({ _id: room });

    if (!roomRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Không tồn tại phòng ban" });
    }

    const permissionRelease = await Permissions.findOne({ _id: permissions });

    if (!permissionRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Không tồn tại quyền" });
    }

    const positionRelease = await Position.findOne({ _id: positions });
    if (!positionRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Không tồn tại chức vụ" });
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

    // return token
    const accessToken = jwt.sign(
      { userId: newUser._id, permissions: permissionRelease },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: "Thành công",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Đăng nhập
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng nhập email và mật khẩu" });
  }

  try {
    const userRelease = await User.findOne({ email }).populate("permissions");

    if (!userRelease) {
      return res
        .status(401)
        .json({ success: false, message: "Không tồn tại tài khoản" });
    }

    // ma hoa mk
    const passwordValid = await argon2.verify(userRelease.password, password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    // return token
    const accessToken = jwt.sign(
      { userId: userRelease._id, permissions: userRelease.permissions },
      process.env.ACCESS_TOKEN_SECRET,
      //thoi gian token co hieu lực
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      message: "Thành công",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

const updateUser = async (req, res, next) => {
  if (!req.permissions.user.includes("update")) {
    return res.status(401).json({
      success: false,
      message: "Tài khoản không có sửa đổi thông tin",
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
      .json({ success: false, message: "Sai dữ liệu đầu vào" });
  }
  try {
    // kiểm tra id có trùng khớp khônmg
    if (!(req.userId === req.params.id)) {
      return res
        .status(400)
        .json({ success: false, message: "Mã id không trùng khớp" });
    }
    // kiểm tra xem email sửa đã tôn tại chưa và trừ trùng với tk cần sửa
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.params.id },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Tên Email đã tồn tại" });
    }
    // kiểm tra phòng ban truyền vào có tồn tại không
    // const roomRelease = await Room.findOne({ _id: room });

    // if (!roomRelease) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Không tồn tại phòng ban" });
    // }
    // kiểm tra xem quyền có tồn tại không
    // const permissionRelease = await Permissions.findOne({ _id: permissions });

    // if (!permissionRelease) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Không tồn tại quyền" });
    // }
    // //kiểm tra chức vụ tồn tại không
    // const positionRelease = await Position.findOne({ _id: positions });

    // if (!positionRelease) {
    //   return res
    //     .status(401)
    //     .json({ success: false, message: "Không tồn tại chức vụ" });
    // }
    const hashedPassword = await argon2.hash(password);
    let updateUser = {
      name,
      email,
      password: hashedPassword,
      // permissions,
      // positions,
      // room,
      sex: sex || 1,
      phone: phone || "",
      birthday: birthday || "",
    };

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      updateUser,
      { new: true }
    );
    res.json({
      success: true,
      message: "Cập nhật thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

// get tất cả các tài khoản
const getAllUsers = async (req, res, next) => {
  try {
    const userAll = await User.find();
    const names = userAll.map((user) => ({
      _id: user._id,
      name: user.name,
      password: user.password,
    }));

    if (!userAll) {
      return res
        .status(401)
        .json({ success: false, message: "Chưa có quyền nào được tạo!" });
    }

    console.log(userAll);
    res.json({ success: true, user: names });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Dịch vụ bị gián đoạn" });
  }
};

module.exports = {
  register,
  login,
  updateUser,
  getAllUsers,
};
