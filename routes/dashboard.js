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
  res.render("panel/dashboard", {
    user,
    title: "Dashboard | Take control of your music",
    layout: "user",
  });
});

module.exports = router;
