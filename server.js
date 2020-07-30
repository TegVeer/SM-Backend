const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postRouter = require("./Routers/postRouter");
const userRouter = require("./Routers/userRouter");
const profileRouter = require("./Routers/profileRouter");
const uploadRouter = require("./Routers/uploadRouter");
const settingsRouter = require("./Routers/settingRouter");
const notificationRouter = require("./Routers/notificationRouter");
const app = express();
app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://localhost:27017/SocialMedia", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
mongoose.connection
  .once("open", () => {
    console.log("Connection Successful!");
  })
  .on("error", () => {
    console.log("Error occured while connecting to database");
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/upload", uploadRouter);
app.use("/settings", settingsRouter);
app.use("/notifications", notificationRouter);
app.post("/test", (req, res, next) => {
  console.log(req.body);
  console.log(req.body.title);
  console.log(req.body.list);
});
app.use("/", (req, res, next) => {
  res.status(201).json({
    message: "Connection to Server Successfull",
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Serer running on PORT: 5000");
});
