const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema(
  {
    name: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
    },
    email: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
      unique: true, //không được trùng lặp
    },
    password: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
    },
    permissions: {
      type: Schema.Types.ObjectId,
      ref: "Permissions",
    },
    positions: {
      type: Schema.Types.ObjectId,
      ref: "Positions",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
    },
    sex: { type: Number, enum: [0, 1] },
    phone: {
      type: String, //kiểu chữ
    },
    birthday: {
      type: String, //kiểu chữ
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Users", Users);
