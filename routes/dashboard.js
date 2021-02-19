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

  const tracks = await db.track.findAll({
    where: {
      userId: req.user,
    },
  });

  // get content from upload model
  res.render("panel/dashboard", {
    user,
    tracks,
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
    await db.track.create({
      art: urls[0].url,
      art_id: urls[0].public,
      title: req.body.title,
      featured_artist: req.body.featured_artist,
      audio: urls[1].url,
      audio_id: urls[1].public,
      userId: creator,
      lyrics: req.body.lyrics,
    });

    res.redirect("/dashboard");

    // console.log({ data: urls });
  } catch (err) {
    console.log(err);
  }
});

// @desc GET request to delete page
// @route /dashboard/del/:id
router.delete("/dashboard/del/:id", async (req, res) => {
  try {
    const track = await db.track.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!track) {
      res.render("errors/404", {
        layout: "user",
      });
    } else {
      await cloudinary.delete_resource([track.art_id, track.audio_id]);
      await db.track.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.redirect("/dashboard");
    }
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
