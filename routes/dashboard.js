const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../config/auth");
const db = require("../models");

router.get("/", ensureAuth, async (req, res) => {
  const user = await db.user.findOne({
    where: {
      id: req.user,
    },
  });
  res.send(user);
});

module.exports = router;
