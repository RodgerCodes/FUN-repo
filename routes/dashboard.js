const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
const db = require("../models");

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
