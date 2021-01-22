const express = require("express");
const db = require("../models");
const router = express.Router();

// @desc GET request to homepage
// @route /
router.get("/", async (req, res) => {
  // render homepage view
  const user = await db.user.findAll();
  res.send(user);
});

// @desc GET request to songs
// @route /songs
router.get("/songs", async (req, res) => {
  // render view
});

// @desc GET request to a particular songs
// @route /songs/:id
router.get("/songs/:id", async (req, res) => {
  //   do the thing
});

// @desc GET request to artist
// @route /artists
router.get("/artists", async (req, res) => {
  // render view
});

module.exports = router;
