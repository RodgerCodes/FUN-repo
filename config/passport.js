const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        const user = await db.user.findOne({
          where: {
            email: email,
          },
        });

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        } else {
          if (user.active == false) {
            return done(null, false, {
              message: "Please activate Your account",
            });
          } else {
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect Password" });
              }
            });
          }
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
