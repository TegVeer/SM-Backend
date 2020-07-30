const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
  postType: { type: String, require: true },
  postText: { type: String, default: "" },
  postMedia: [{ type: String }],
  mentionedPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  // Other Feilds
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  parentPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
  publishedTime: { type: Date, default: null },
  edited: [
    { postType: String, postText: String, postMedia: [{ type: String }] },
  ],
});

module.exports = mongoose.model("Post", postSchema);
