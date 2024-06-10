const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Positions = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    room: {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
      required: true,
    },
    status: { type: Number, enum: [0, 1] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Positions", Positions);
