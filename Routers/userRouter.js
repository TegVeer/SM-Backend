const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_key = "#6295ismybikE";

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Check if user Exists already or not
// usually used before signup
router.post("/check", (req, res, next) => {
  console.log("Check Request Made");
  User.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.status(409).json({
          status: "FAILED",
          message: "This Email already Exists",
        });
      } else {
        res.status(200).json({
          status: "SUCCESSFUL",
          message: "Check completed, this email is unique",
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/signup", (req, res, next) => {
  console.log("Signup Request made");
  const tokenExpiry = Date.now() + 86400000;
  User.find({ email: req.body.email })
    .exec()
    .then((users) => {
      if (users.length != 0) {
        return res.status(409).json({
          error: "This Email Already Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
              message: "Can't hash password",
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              name: req.body.name,
              dob: req.body.dob,
              gender: req.body.gender,
              phone: req.body.phone,
            });
            const token = jwt.sign(
              {
                email: req.body.email,
                userId: user._id,
              },
              jwt_key,
              {
                expiresIn: "24h",
              }
            );
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User Created Successfully",
                  status: "SUCCESSFUL",
                  token: token,
                  tokenExiry: tokenExpiry,
                  user: result,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status: "FAILED",
                  error: error,
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  const tokenExpiry = Date.now() + 86400000;
  console.log("Login Request Made");
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user < 1) {
        return res.status(401).json({
          message: "AUTH_FAILED",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "AUTH_FAILED",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            jwt_key,
            {
              expiresIn: "24h",
            }
          );
          return res.status(200).json({
            message: "AUTH_SUCCESSFUL",
            token,
            tokenExpiry,
            user: user[0],
          });
        }
        res.status(401).json({
          message: "AUTH_FAILED",
        });
      });
    })
    .catch((error) => {});
});
router.patch("/update/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};
  const fields = req.body;

  User.updateOne({ _id: id }, { $set: fields })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "SUCCESS", result });
    })
    .catch((err) => {
      res.status(500).json({ message: "FAILED", err });
    });
});

router.delete("/:userID", (req, res, next) => {
  User.deleteOne({ _id: req.params.userID })
    .exec()
    .then((response) => {
      res.status(200).json({
        message: "DELETED_SUCCESSFULLY",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
