const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const User = require("../Models/userModel");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 52428800 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png|gif/;
  const extname = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileType.test(file.mimetype);

  if (extname && mimeType) {
    return cb(null, true);
  } else {
    cb("Error: FILE_SHOULD_BE_TYPE_IMAGE");
  }
}

/*single file upload*/
router.post("/image", upload.single("image"), function (req, res, next) {
  var fileinfo = req.file;
  res.send(fileinfo);
});

/*multiple files upload*/
router.post("/images", upload.array("image", 5), function (req, res, next) {
  var fileinfo = req.files;
  var title = req.body.title;
  console.log(title);
  res.send(fileinfo);
});
module.exports = router;
