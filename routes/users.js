const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendgrid = require("@sendgrid/mail");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { ensureGuest } = require("../config/auth");
const db = require("../models");
const router = express.Router();

// @desc GET request to login page
// @route /user/signin
router.get("/", ensureGuest, (req, res) => {
  res.render("user/signin");
});

// @desc GET request to sign up page
// @route /user/signup
router.get("/signup", ensureGuest, (req, res) => {
  res.render("user/signup");
});

// @desc POST request to create acoount
// @route /user/signup
router.post(
  "/signup",
  ensureGuest,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    try {
      let errors = [];
      let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

      // check if user already exists
      const user = await db.user.findOne({
        where: {
          email: req.body.email,
        },
      });

      if (user) {
        errors.push({ msg: "An account with that email already exists" });
        res.render("user/signup", {
          errors,
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          c_password: req.body.c_password,
        });
        // render view with requiered parameters
      } else {
        // check fields
        if (
          !req.body.name ||
          !req.body.email ||
          !req.body.password ||
          !req.body.c_password
        ) {
          errors.push({ msg: "Make sure to fill in all forms" });
        }

        if (req.body.password !== req.body.c_password) {
          errors.push({ msg: "Make  sure the password match" });
        }

        if (req.body.password.length < 6) {
          errors.push({
            msg: "Make sure your password has al least six Characters",
          });
        }

        // check if the array contain any errors
        if (errors.length > 0) {
          res.render("user/signup", {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            c_password: req.body.c_password,
          });
        } else {
          // generate salt
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req.body.password, salt);

          // generate random string
          let token = crypto.randomBytes(20).toString("hex");
          // create a new user
          await db.user.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            activation_token: token,
            active: false,
          });

          // send email for validation of email
          sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: req.body.email,
            from: process.env.FROM_EMAIL,
            subject: "Email Validation",
            text: "Email Validation",
            html: `You are receiving this because \n Please click the link Confirm your account http://${req.headers.host}/user/confirm/${token}`,
          };

          sendgrid.send(msg);
          res.redirect("/user/success");
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
);

// @desc GET request to confirm
// @route /user/success
router.get("/success", ensureGuest, (req, res) => {
  // TODO: render a view with email and button back to login
  res.render("user/success");
});

// @desc GET request to confirmation page with backend valu change
// @route /user/confirm/:token
router.get("/confirm/:token", ensureGuest, async (req, res) => {
  const user = await db.user.findOne({
    where: {
      activation_token: req.params.token, //just in case
    },
  });

  if (!user) {
    res.render("error/invalid");
  } else {
    await db.user.update(
      {
        activation_token: "",
        active: true,
      },
      {
        where: {
          activation_token: req.params.token,
        },
      }
    );
    res.render("user/activate");
  }
});

// @desc POST request to login page
// @route /user/login
router.post(
  "/login",
  ensureGuest,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/user",
    failureFlash: true,
  })
);

module.exports = router;
