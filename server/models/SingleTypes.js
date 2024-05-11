const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SinglesStypes = new Schema(
  {
    name: {
      type: String, //kiểu chữ
      required: true, //bắt buộc phải có
      unique: true, //không được trùng lặp
    },
    content: {
      type: String,
    },
    status: { type: Number, enum: [0, 1] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("SinglesStypes", SinglesStypes);

// status value : 0 : Không hoạt động, 1 : 'Hoạt động'
