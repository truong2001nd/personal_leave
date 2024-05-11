require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const permissionRouter = require("./routes/permissionsRouter.js");
const roomRouter = require("./routes/roomRoutes.js");
const PositionRouter = require("./routes/positionRoute.js");
const userRouter = require("./routes/userRouter.js");
const singleTypeRouter = require("./routes/singleTypeRouter.js");
const singleRouter = require("./routes/singlesRouter.js");

// const authRouter = require("./routes/auth.js");
// // const user = require('./routes/user.js');
// const account = require("./routes/account.js");

const connecDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/qlpdd");
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connecDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/permission", permissionRouter);
app.use("/api/room", roomRouter);
app.use("/api/Position", PositionRouter);
app.use("/api/users", userRouter);
app.use("/api/singleType", singleTypeRouter);
app.use("/api/single", singleRouter);

const PORT = 5000;

app.listen(PORT, (req, res) => console.log(`server started on port ${PORT}`));
