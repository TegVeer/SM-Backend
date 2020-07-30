const mongoose = require("mongoose");

const EVERYONE = "EVERYONE";
const FOLLOWERS = "FOLLOWERS";
const NO_ONE = "NO_ONE";

const privacy = mongoose.Schema(
  {
    posts: { type: String, default: EVERYONE },
    message: { type: String, default: EVERYONE },
    comments: { type: String, default: EVERYONE },
    mention: { type: String, default: EVERYONE },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    restrictedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { _id: false }
);

const settingsSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  privacy: { type: privacy },
});

module.exports = mongoose.model("Settings", settingsSchema);
