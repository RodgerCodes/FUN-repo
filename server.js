const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const SequeliStore = require("connect-session-sequelize")(session.Store);
const app = express();
const init = require("./config/passport");
const db = require("./models");

// load environmental variables
dotenv.config({
  path: "./config/config.env",
});

// passport init
init(passport);

// express setup
app.use(express.json());
app.use(
  express.urlencoded({
    extended: "false",
  })
);

// passport middleware
let hour = 7200000;
app.use(
  session({
    secret: "sdhadjh",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now(+hour)),
      maxAge: hour,
    },
    // store: new SequeliStore({
    //   db,
    // }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// handlebars setup
app.engine(
  ".hbs",
  exphs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// static folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("HEllO from Homepage");
});
app.use("/user", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

// morgan config
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// load port
const port = process.env.PORT || 8000;
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on Port  ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
