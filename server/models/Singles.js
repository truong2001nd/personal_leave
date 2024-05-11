const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Singles = new Schema(
  {
    name: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
      unique: true, //không được trùng lặp
    },
    content: {
      type: String,
    },
    status: { type: Number, enum: [0, 1, 2] },
    singlesStyes: {
      type: Schema.Types.ObjectId,
      ref: "SinglesStypes",
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    approver: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Singles", Singles);

// status value : 0 : chờ duyệt, 1 : 'Đẫ duyệt', 2 : 'Từ chối duyệt'
