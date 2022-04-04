require("dotenv").config();

var express = require("express");
var app = express();
var multer = require("multer");
var cors = require("cors");
var path = require("path");

app.use(cors());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("image");

//image upload
app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

//serve static application/frontend
app.use(express.static(path.resolve(__dirname, "./build")));

//serve images
app.use(express.static("public"));
// app.use(express.static(path.resolve(__dirname, "./public")));

//metadata api
app.use("/api/", require("./src/api/metadata"));

// serve default
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8000, function () {
  console.log("App running on port 8000 ");
});
