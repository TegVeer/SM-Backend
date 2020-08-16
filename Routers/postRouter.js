const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../Models/postModel");
const User = require("../Models/userModel");
const { serverUrl } = require("../Constants/Config");

//* Post Types
const MEDIAPOST = "MEDIAPOST";
const POLLINGPOST = "POLLINGPOST";
const MENTIONEDPOST = "MENTIONEDPOST";
const TOURPOST = "TOURPOST";

//! Fetching Post
router.get("/", (req, res, next) => {
  Post.find()
    .populate("userId")
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//! Fetching Post of a perticular User
router.get("/:userId", (req, res, next) => {
  Post.find({ userId: req.params.userId })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//! Fetching Liked Posts of a perticular user
router.get("/likedPost/:userId", (req, res, next) => {
  /** NOTE Logic for the request
   * ! Algorithm
   * ? 1. Find the user's Liked Posts list
   * ? 2. Send the list of liked posts with populate function
   */
  const userId = req.params.userId;

  User.find({ _id: userId }) //?|1|
    .populate("likedPosts")
    .exec()
    .then((result) => {
      console.log(result);
      res.status(201).json(result[0].likedPosts); //?|2|
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
});
//! Creating Post
router.post("/", (req, res, next) => {
  //Fields Constants

  const {
    userId,
    postType,
    postText,
    postMedia,
    mentionedPostId,
    likes,
    shares,
    comments,
    parentPostId,
    publishedTime,
    edited,
  } = req.body;

  switch (postType) {
    case MEDIAPOST: {
      // Code for MEDIA POST
    }
    case POLLINGPOST: {
      //Code for POLLING POST
    }
    case MENTIONEDPOST: {
      //Code for MENTIONED POST
    }
    case TOURPOST: {
      //Code for TOUR POST
    }
    default: {
      res.status(201).json({ error: "Post Type cannot be dettermined" });
    }
  }
  //Buffer Variables
  const mediaList = [];

  for (let media of postMedia) {
    mediaList.push(`${serverUrl}/${media}`);
  }

  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    userId,
    postType,
    postText,
    postMedia,
    mentionedPostId,
    parentPostId,
    publishedTime: Date.now(),
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { posts: result._id } }
      )
        .then((response) => {
          res.status(201).json(result);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "ERROR_OCCURED", Error: err });
        });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//! Creating Comment Post
router.post("/comment", (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    userId: req.body.userId,
    postType: req.body.postType,
    postText: req.body.postText,
    postMedia: req.body.postMedia,
    mentionedPostId: req.body.mentionedPostId,
    parentPostId: req.body.parentPostId,
  });

  post
    .save()
    .then((result) => {
      //################### Saving postId to user's posts record #######################################
      User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { posts: result._id } }
      )
        .then(() => {
          //################ saving post id to parent's comments record ##################################
          Post.findOneAndUpdate(
            { _id: req.body.parentPostId },
            { $push: { comments: result._id } }
          )
            .then(() => {
              res.status(201).json({
                message: "Successfully Querry Run",
              });
            })
            .catch(() => {
              res.status(500).json({
                message: "Error Occured - level3",
              });
            });
        })
        .catch(() => {
          res.status(500).json({
            message: "Error Occured - level2",
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error Occured - level1",
      });
    });
});
//! Deleting Post
router.delete("/:postId", (req, res, next) => {
  Post.deleteOne({ _id: req.params.postId })
    .exec()
    .then((result) => {
      res.status(201).json({ result });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});
//! Update Post
router.patch("/", (req, res, next) => {});
//! Like Post
router.post("/like", (req, res, next) => {
  /** NOTE : LIKE/DISLIKE LOGIC
   * * Algorithm:
   * ?|1|. Check if user has already iked the post or not
   * ?|2|. If not liked then
   * ?|2a|. Find the post and update the likes array with userId
   * ?|2b|. Find the user and update its likedPosts array with postId
   * ?|3|. If already liked then
   * ?|3a|. Find the post and remove userId to dislike it
   * ?|3b|. Find the user and remove postId from likedPosts list
   */

  const postId = req.body.postId;
  const userId = req.body.userId;

  Post.find({ _id: postId, likes: { $in: [userId] } }) // ?|1|
    .exec()
    .then((result) => {
      if (result.length === 0) {
        // ?|2|
        Post.findOneAndUpdate({ _id: postId }, { $push: { likes: userId } }) //?|2a|
          .then((result) => {
            Post.find({ _id: postId })
              .exec()
              .then((response) => {
                // TODO: push post entery to user LikedPost list
                User.findOneAndUpdate(
                  { _id: userId },
                  { $push: { likedPosts: postId } }
                )
                  .then((r) => {
                    res
                      .status(201)
                      .json({ message: "Liked", response: response[0].likes });
                  })
                  .catch((e) => {
                    res.status(500).json({ message: "Error", response: e });
                  }); //?|2b|
              })
              .catch((error) => {
                res.status(500).json({ message: "Error", response: error });
              });
          })
          .catch(() => {
            res.status(500).json({ message: "Error" });
          });
      } else if (result.length >= 0) {
        //?|3|
        Post.update({ _id: postId }, { $pullAll: { likes: [userId] } }) //?|3a|
          .then((result) => {
            Post.find({ _id: postId })
              .exec()
              .then((response) => {
                //TODO: clear post entery from user's LikedPost list
                User.findOneAndUpdate(
                  { _id: userId },
                  { $pullAll: { likedPosts: [postId] } }
                )
                  .then((r) => {
                    res.status(201).json({
                      message: "Disliked",
                      response: response[0].likes,
                    });
                  })
                  .catch((e) => {
                    res.status(500).json({ message: "Error", response: e });
                  });
              })
              .catch((error) => {
                res.status(500).json({ message: "Error", response: error });
              });
          })
          .catch(() => {
            res.status(500).json({
              message: "Error while disliking",
            });
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

//! Polling Post
router.post("/poll", ((req, res, next) = {}));

module.exports = router;
