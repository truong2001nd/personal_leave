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

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://quandinh:dinhquan123@personal.unozwce.mongodb.net/?retryWrites=true&w=majority&appName=Personal",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Successfully connected to Mongo");
  } catch (err) {
    console.error("Error in DB connection: " + err);
  }
}

connect();

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
