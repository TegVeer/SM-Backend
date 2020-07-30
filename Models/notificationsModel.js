const mongoose = require("mongoose");
const notification = mongoose.Schema({
  notificationType: { type: String },
  message: { type: String },
  notificator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const notificationSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  notifications: [{ type: notification }],
});

module.exports = mongoose.model("Notification", notificationSchema);
