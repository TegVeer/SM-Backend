const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../Models/userModel");
const Notification = require("../Models/notificationsModel");
const Settings = require("../Models/settingsModel");

//! POST Request to follow public account
router.post("/follow", (req, res, next) => {
  const userId = req.body.userId;
  const targetId = req.body.targetId;
  // STUB Check if the user is already a follower or not, if yes then procede to unfollow
  User.findById(targetId)
    .then((result) => {
      if (result.followers.includes(userId)) {
        //* Already a Follower procede to UnFollow
        User.findByIdAndUpdate(targetId, { $pull: { followers: userId } })
          .then((result) => {
            res.status(201).json({ message: "Unfollowed" });
          })
          .catch((error) => {
            res.status(201).json({ error });
          });
      } else {
        //* Not a Follower procede to Following
        User.findByIdAndUpdate(targetId, { $push: { followers: userId } })
          .then((result) => {
            res.status(201).json({ message: "Followed" });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      }
    })
    .catch((error) => {});
});

//! POST Request to generate notification of follow private accounts
router.post("/notifyFollow", (req, res, next) => {
  const name = req.body.name;
  const userId = req.body.userId;
  const targetId = req.body.targetId;
  const entry = {
    notificationType: "FOLLOW_REQUEST",
    message: `${name} wants to Follow you`,
    notificator: userId,
  };
  Notification.findOneAndUpdate(
    { userId: targetId },
    {
      $push: { notifications: entry },
    }
  )
    .then((result) => {
      res.status(201).json({ message: "Notification Added" });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

//! POST Request to accept follow request
router.post("/acceptFollow", (req, res, next) => {
  // TODO delete the notification
  const userId = req.body.userId;
  const targetId = req.body.targetId;

  User.findByIdAndUpdate(userId, { $push: { followers: targetId } })
    .then((result) => {
      res.status(201).json({ message: "Followed" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! POST Request to block/unblock users
router.post("/blockAccount", (req, res, next) => {
  const userId = req.body.userId;
  const accountId = req.body.accountId;

  Settings.findOne({ userId })
    .then((result) => {
      if (result.privacy.blockedUsers.includes(accountId)) {
        //* Unblock User
        Settings.findOneAndUpdate(
          { userId },
          { $pull: { "privacy.blockedUsers": accountId } },
          { new: true }
        )
          .then((result) => {
            res.status(201).json({ message: "User Unblocked" });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        //* Block User
        Settings.findOneAndUpdate(
          { userId },
          { $push: { "privacy.blockedUsers": accountId } },
          { new: true }
        )
          .then((result) => {
            res.status(201).json({ message: "User Blocked" });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {});
});

//! POST Request to restrict/unrestrict users
router.post("/restrictAccount", (req, res, next) => {
  const userId = req.body.userId;
  const accountId = req.body.accountId;

  Settings.findOne({ userId })
    .then((result) => {
      if (result.privacy.blockedUsers.includes(accountId)) {
        //* Unrestrict User
        Settings.findOneAndUpdate(
          { userId },
          { $pull: { "privacy.restrictedUsers": accountId } },
          { new: true }
        )
          .then((result) => {
            res.status(201).json({ message: "User Unrestricted" });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      } else {
        //* Restric User
        Settings.findOneAndUpdate(
          { userId },
          { $push: { "privacy.restrictedUsers": accountId } },
          { new: true }
        )
          .then((result) => {
            res.status(201).json({ message: "User Restricted" });
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {});
});

module.exports = router;
