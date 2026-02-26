// env loading - पहले रखो
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");  // ← stable और working
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./database/Paswd.js");

const userInfo = require("./routes/users.js");
const signUp = require("./routes/signLogin.js");

const ExpressError = require("./Error/ExpressError.js");
const validedata = require("./Error/vailidData.js");

const app = express();

const dbUrl = process.env.ATLASDB_URL;

// Database Connect
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database is connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

main();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Trust proxy
app.set('trust proxy', 1);

// Session + MongoStore
app.use(session({
  secret: process.env.SECRET_API || 'your-strong-secret-here-change-it',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    collectionName: "sessions",
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
  }
}));

// Flash middleware - session के ठीक बाद
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages locals
app.use((req, res, next) => {
  res.locals.successMSG = req.flash("success");
  res.locals.errorMSG   = req.flash("error");
  res.locals.Delete     = req.flash("Delete");
  res.locals.Update     = req.flash("Update");
  res.locals.currentUser = req.user;
  res.locals.logops     = req.user;
  next();
});

// Routes
app.use("/api", userInfo);
app.use("/api", signUp);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

// Start server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});