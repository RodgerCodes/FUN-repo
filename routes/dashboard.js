const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
const db = require("../models");
const multer = require("multer");
const fs = require("fs");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");

// @desc GET request to dashboard landing page
// @route /dashboard
router.get("/", ensureAuth, async (req, res) => {
  const user = await db.user.findOne({
    where: {
      id: req.user,
    },
  });

  // get content from upload model
  res.render("panel/dashboard", {
    user,
    title: "Dashboard | Take control of your music",
    layout: "user",
  });
});

// @desc GET request to upload page
// @route /dashboard/upload
router.get("/upload", ensureAuth, (req, res) => {
  res.render("panel/upload", {
    layout: "user",
  });
});

// @desc POST request for a new track
// @route /dashboard/upload
router.post("/upload", upload.array("image"), async (req, res) => {
  try {
    const uploader = async (path) => await cloudinary.uploads(path);
    const urls = [];
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);

      fs.unlinkSync(path);
    }

    let creator = req.user;
    // await db.track.create({
    //   art:data[0]
    // })

    console.log({ data: urls, image: urls[0].url });
  } catch (err) {
    console.log(err);
  }
});

// @desc GET request to user profile page
// @route /dashboard/profile
router.get("/profile", async (req, res) => {
  try {
    const profile = await db.profile.findOne({
      where: {
        userId: req.user,
      },
    });
    console.log(profile);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
