const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    require: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, require: true },
  name: { type: String, require: true },
  dob: { type: String, default: null },
  gender: { type: String, require: true },
  phone: { type: String, default: null },
  age: { type: Number, default: null },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  sharedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  location: { type: String, default: null },
  profileImage: { type: String, default: null },
  coverImage: { type: String, default: null },
  bio: { type: String, default: null },
  userName: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);
