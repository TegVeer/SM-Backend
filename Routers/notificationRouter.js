const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Notification = require("../Models/notificationsModel");

//! GET Request to access all the Notification buffers
router.get("/", (req, res, next) => {
  Notification.find()
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! POST Request to create a new buffer
router.post("/", (req, res, next) => {
  //TODO Verify if any other buffer for same userId exist or not
  const userId = req.body.userId;
  const notification = new Notification({
    userId: userId,
  });

  notification
    .save()
    .then((result) => {
      res.status(201).json({ message: "Buffer Created" });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

//! POST Request to add a notification into buffer
router.post("/add", (req, res, next) => {
  const userId = req.body.userId;
  const notificationType = req.body.notificationType;
  const message = req.body.message;
  const notificator = req.body.notificator;

  Notification.findOneAndUpdate(
    { userId },
    { $push: { notifications: { notificationType, message, notificator } } }
  )
    .then((result) => {
      res.status(201).json({ message: "Notification Added" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! POST Request to remove a notification from the notification buffer
router.post("/remove", (req, res, next) => {
  const notificationId = req.body.notificationId;
  const messageId = req.body.messageId;

  Notification.findByIdAndUpdate(notificationId, {
    $pull: { notifications: { _id: messageId } },
  })
    .exec()
    .then((result) => {
      res.status(201).json({ message: "Notifcation Removed" });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! DELETE Request to delete a notifications buffer
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Notification.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = router;
