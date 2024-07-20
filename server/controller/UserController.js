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
    const user = await User.findById(req.userId)
      .populate({
        path: "permissions",
      })
      .populate({
        path: "positions",
        populate: {
          path: "room",
        },
      })

      .select("-password");

    if (!user) return res.json({ status: 400, message: "User not found" });
    res.json({ status: 200, data: user });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// thêm mới tài khoản
const register = async (req, res, next) => {
  if (!req.permissions.user.includes("create")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền truy cập",
    });
  }

  const {
    name,
    email,
    password,
    permissions,
    positions,
    sex,
    phone,
    birthday,
  } = req.body;
  if (!name || !email || !password || !permissions || !positions) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }

  try {
    const userRelease = await User.findOne({ email });

    if (userRelease) {
      return res.json({ status: 409, message: "Email đã tồn tại" });
    }
    const permissionRelease = await Permissions.findOne({ _id: permissions });

    if (!permissionRelease) {
      return res.json({ status: 400, message: "Không tồn tại quyền" });
    }

    const positionRelease = await Position.findOne({ _id: positions }).populate(
      { path: "room" }
    );
    if (!positionRelease) {
      return res.json({ status: 400, message: "Không tồn tại chức vụ" });
    }

    // ma hoa mk
    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      permissions: permissionRelease,
      positions: positionRelease,
      room: positionRelease.room._id,
      sex: sex || null,
      phone: phone || null,
      birthday: birthday || null,
    });

    await newUser.save();
    if (!(await newUser.save())) {
      return res.json({ status: 400, message: "Tạo tài khoản thất bại!" });
    }

    await sendMail({
      email: email,
      subject: `"Thông báo cấp tài khoản"`,
      html: `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: none;">
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <h2 style="margin: 0;">Thông tin tài khoản</h2>
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <p><strong>Tài khoản:</strong> ${email} </p>
                    <p><strong>Mật khẩu:</strong> ${password} </p>
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <p>Trân trọng,</p>
                  </td>
                </tr>
              </table>`,
    });
    res.json({
      status: 200,
      message: "Thành công",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Đăng nhập
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      status: 400,
      message: "Vui lòng nhập email và mật khẩu",
    });
  }

  try {
    const userRelease = await User.findOne({ email }).populate("permissions");

    if (!userRelease) {
      return res.json({ status: 400, message: "Không tồn tại tài khoản" });
    }

    // ma hoa mk
    const passwordValid = await argon2.verify(userRelease.password, password);
    if (!passwordValid)
      return res.json({ status: 400, message: "Sai tài khoản hoặc mật khẩu" });

    // return token
    const accessToken = jwt.sign(
      {
        userId: userRelease._id,
        userName: userRelease.name,
        permissions: userRelease.permissions,
      },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      status: 200,
      message: "Thành công",
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ tạm thời giám đoạn" });
  }
};

// Chỉnh sửa tài khoản
const updateUser = async (req, res, next) => {
  if (!req.permissions.user.includes("update")) {
    return res.json({
      status: 401,
      message: "Tài khoản không  có quyền sửa đổi thông tin",
    });
  }
  const { name, email, positions, permissions } = req.body;
  try {
    // kiểm tra xem email sửa đã tôn tại chưa và trừ trùng với tk cần sửa
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.params.id },
    });
    if (existingUser) {
      return res.json({ status: 400, message: " Email đã tồn tại" });
    }

    let updateUser = {
      name,
      email,
      positions,
      permissions,
    };

    const newUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      updateUser,
      { new: true }
    );
    if (!newUser) {
      return res.json({ status: 400, message: " Không tồn tại tài khoản" });
    }
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// Chỉnh sửa tài khoản
const updateAccount = async (req, res, next) => {
  const { name, email, sex, phone, birthday } = req.body;

  if (!name || !email) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    let updateUser = {
      name,
      email,
      sex: sex || 1,
      phone: phone || "",
      birthday: birthday || "",
    };

    const newUser = await User.findOneAndUpdate(
      { _id: req.userId },
      updateUser,
      { new: true }
    );
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};
const changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  if (!password || !newPassword) {
    return res.json({ status: 422, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const checkUser = await User.findOne({
      _id: req.userId,
    });
    const passwordValid = await argon2.verify(checkUser.password, password);

    if (!passwordValid) {
      return res.json({
        status: 401,
        message: "Mật khẩu hiện tại không chính xác",
      });
    }

    const hashedPassword = await argon2.hash(newPassword);
    const newUser = await User.findOneAndUpdate(
      { _id: req.userId },
      { password: hashedPassword },
      { new: true }
    );
    if (!newUser) {
      return res.json({ status: 400, message: " Không tồn tại tài khoản" });
    }
    res.json({
      status: 200,
      message: "Cập nhật thành công!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// Xem tất cả các tài khoản
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const size = parseInt(req.query.size) || 5; // Số lượng mục trên mỗi trang, mặc định là 5
    const keySearch = req.query.keySearch || "";
    const positions = req.query.positions || "";
    const permissions = req.query.permission || "";

    const searchConditions = {};
    if (keySearch) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.name = { $regex: new RegExp(keySearch, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }

    if (positions) {
      searchConditions.positions = positions;
    }
    if (permissions) {
      searchConditions.permissions = permissions;
    }
    // Tìm kiếm và phân trang
    const userAll = await User.find(searchConditions)
      .populate({
        path: "permissions",
        select: "name",
      })
      .populate({
        path: "positions",
        populate: { path: "room" },
      })
      .select("-password")
      .skip((page - 1) * size) // Bỏ qua các mục trước đó
      .limit(size); // Giới hạn số lượng mục trả về trên mỗi trang

    const totalCount = await User.countDocuments(searchConditions);

    if (userAll.length === 0) {
      return res.json({
        status: 200,
        message: "Không tìm thấy chức vụ tương ứng",
        data: userAll,
      });
    }

    if (!userAll) {
      return res.json({
        status: 401,
        message: "Chưa có người dùng nào được tạo!",
      });
    }

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: userAll,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.json({ status: 400, message: "id không tồn tại" });
    }

    res.json({ status: 200, message: "Thành công", data: user });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ status: 400, message: "Sai dữ liệu đầu vào" });
  }
  try {
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      return res.json({ status: 400, message: "Email không tồn tại!" });
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
    res.json({
      status: 200,
      message: "Thành công!",
    });

    if (!updatedUser) {
      return res.json({ status: 400, message: "Cập nhật mật khẩu thất bại!" });
    }
    await sendMail({
      email: email,
      subject: "Mật khẩu mới ",
      html: `<h1> Mật khẩu mới của bạn là: ${newPassword}</h1>
        `,
    });
  } catch (error) {
    console.log(error);
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
  }
};

const disableAccount = async (req, res) => {
  // check quyen
  if (!req.permissions.User.includes("delete")) {
    return res.json({
      status: 401,
      message: "Tài khoản không có quyền xóa tài khoản",
    });
  }
  try {
    const deleteUser = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteUser) {
      return res.json({ status: 400, message: "ID người dùng không hợp lệ" });
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
  register,
  login,
  updateUser,
  getAllUsers,
  forgotPassword,
  disableAccount,
  loadUser,
  getUser,
  updateAccount,
  changePassword,
};
