const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Settings = require("../Models/settingsModel");

//TODO should include the token verification before supplying any type of data from the DATABASE

//! Get request to collect all the settings related data for all the users
router.get("/", (req, res, next) => {
  Settings.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! Get request to fetch data of a perticular user by supplying userId to the url
router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;

  Settings.find({ userId })
    .exec()
    .then((result) => {
      res
        .status(201)
        .json({ message: "Fetched User Data", status: "SUCCESS", result });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! Post request to create a new buffer for a perticular user (Should be called one time when the new user account is created)
router.post("/", (req, res, next) => {
  const privacy = req.body.privacy;
  const userId = req.body.userId;
  const settings = new Settings({
    userId,
    privacy,
  });

  settings
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! Patch request to update the buffer of a perticular user by supplying the userId in the url
router.patch("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  const settings = req.body.settings;

  Settings.update({ userId }, { $set: settings })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//! Delete request to delete a perticular user's  settings data, by supplying a userId in the url
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Settings.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(501).json(error);
    });
});

module.exports = router;
