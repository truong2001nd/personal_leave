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
      html: `<table cellpadding="0" cellspacing="0" style="border-collapse: collapse; border: none;">
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <h2 style="margin: 0;">Thông tin đơn</h2>
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <p><strong>Người nộp đơn:</strong> ${req.userName} </p>
                    <p><strong>Ngày nộp:</strong> ${newSingles.createdAt}</p>
                    <p><strong>Nội dung đơn:</strong></p>
                    <p>[Nội dung đơn]</p>
                  </td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">
                    <p>Vui lòng xem xét đơn và phản hồi sớm.</p>
                    <p>Trân trọng,</p>
                    <p>${approverRelease.name}</p>
                  </td>
                </tr>
              </table>`,
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
    const size = parseInt(req.query.size) || 6; // Số lượng mục trên mỗi trang, mặc định là 5
    const search = req.query.search || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const singlesStyes = req.query.singlesStyes || "";
    const date = req.query.date || "";
    const searchConditions = {};
    if (search) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.sender.name = { $regex: new RegExp(search, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }
    if (singlesStyes) {
      searchConditions.singlesStyes = singlesStyes;
    }
    if (date) {
      // Nếu có ngày tháng, tính toán khoảng thời gian tìm kiếm
      const searchDate = new Date(date);
      const startOfDay = new Date(
        searchDate.getFullYear(),
        searchDate.getMonth(),
        searchDate.getDate()
      );
      const endOfDay = new Date(
        searchDate.getFullYear(),
        searchDate.getMonth(),
        searchDate.getDate() + 1
      );

      searchConditions.createdAt = {
        $gte: startOfDay,
        $lt: endOfDay,
      };
    }

    // Tìm kiếm và phân trang
    const singleAll = await Singles.find({
      $or: [{ sender: req.userId }, { approver: req.userId }],
      ...searchConditions,
    })
      .populate({
        path: "sender",
        select: "name _id",
      })
      .populate({
        path: "approver",
        select: "name _id",
      })
      .populate({
        path: "singlesStyes",
        select: "name _id",
      })
      .select(
        "_id name content status  sender approver createdAt updatedAt __v"
      )
      .skip((page - 1) * size) // Bỏ qua các mục trước đó
      .limit(size); // Giới hạn số lượng mục trả về trên mỗi trang

    // Đếm số lượng Singles để tính tổng số trang
    const totalCount = await Singles.countDocuments({
      $or: [{ sender: req.userId }, { approver: req.userId }],
      ...searchConditions,
    });

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

const getSingleReport = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại, mặc định là trang 1
    const size = parseInt(req.query.size) || 5; // Số lượng mục trên mỗi trang, mặc định là 5
    const keySearch = req.query.keySearch || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const user = req.query.user || ""; // Từ khóa tìm kiếm, mặc định là chuỗi rỗng
    const searchConditions = {};
    if (keySearch) {
      // Nếu có từ khóa tìm kiếm, thêm điều kiện tìm kiếm
      searchConditions.sender.name = { $regex: new RegExp(search, "i") }; // Tìm kiếm tên permission không phân biệt chữ hoa, chữ thường
    }
    if (user) {
      searchConditions.sender = user;
    }

    const singleAll = await Singles.find({
      $or: [{ sender: req.userId }, { approver: req.userId }],
      ...searchConditions,
    });
    const singleTypeAll = await SingleType.find()
      .select("name _id")
      .skip((page - 1) * size) // Bỏ qua các mục trước đó
      .limit(size); // Giới hạn số lượng mục trả về trên mỗi trang;

    const result = singleTypeAll.map((typeSingle) => {
      return {
        name: typeSingle.name,
        countApproval: singleAll.filter(
          (single) =>
            String(single.singlesStyes) == String(typeSingle._id) &&
            single.status == 1
        ).length,
        countRefuse: singleAll.filter(
          (single) =>
            String(single.singlesStyes) == String(typeSingle._id) &&
            single.status == 2
        ).length,
        countPending: singleAll.filter(
          (single) =>
            String(single.singlesStyes) == String(typeSingle._id) &&
            single.status == 0
        ).length,
      };
    });
    // Đếm số lượng Singles để tính tổng số trang
    const totalCount = await SingleType.countDocuments({});

    res.json({
      status: 200,
      message: "Thành công",
      totalCount: totalCount,
      data: result,
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
    res.json({ status: 500, message: "Dịch vụ bị gián đoạn" });
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
  if (!req.permissions.singleType.includes("update")) {
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
    if (singleId.status !== 0) {
      return res.json({
        status: 400,
        message: "Đơn đã được phệ duyện hoặc từ chuối ",
      });
    }

    // Kiểm tra trạng thái một lần nữa trước khi cập nhật
    if (singleId.status === 0) {
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
    } else {
      return res.json({
        status: 400,
        message: "Đơn đã được phệ duyện hoặc từ chuối ",
      });
    }
  } catch (error) {
    // Xử lý lỗi
  }
};

module.exports = {
  createSingle,
  getAllSingle,
  deleteSingle,
  updateSingle,
  approvalSingle,
  getSingleReport,
};
