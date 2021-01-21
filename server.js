const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");
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

// method override middleware
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
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
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", ".hbs");

// static folder
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/home"));
app.use("/user", require("./routes/users"));
app.use("/dashboard", require("./routes/dashboard"));

// morgan config
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// @desc GLOBAL error handlers
app.use((req, res, next) => {
  res.status(404).render("errors/404");
});

app.use((err, req, res, next) => {
  res.status(500).render("errors/500");
});

// load port
const port = process.env.PORT || 8000;
db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `Server started in ${process.env.NODE_ENV} mode on Port  ${port}`
      );
    });
  })
  .catch((err) => {
    console.error(err);
  });
