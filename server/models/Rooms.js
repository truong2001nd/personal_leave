const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Rooms = new Schema(
  {
    name: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
      unique: true, //không được trùng lặp
    },
    description: {
      type: String, //kiểu chữ
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Rooms", Rooms);
