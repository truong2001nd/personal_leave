const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: { type: Number, enum: [0, 1] },
    permission: { type: [String] },
    position: { type: [String] },
    room: { type: [String] },
    single: { type: [String] },
    singleType: { type: [String] },
    user: { type: [String] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Permissions", PermissionSchema);

// status value : 0 : Không hoạt động, 1 : 'Hoạt động'
