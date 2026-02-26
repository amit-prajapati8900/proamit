const express = require("express");
const router = express.Router();

const passport = require("passport");  // ← ये line जोड़ो (passport import करो)

const Listing = require("../controller/listing");

// SignUp routes
router.route("/signUp")
  .get(Listing.SignUpform)
  .post(Listing.SignUp);

// Login routes
router.route("/logIn")
  .get(Listing.logInform)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/api/logIn",
      failureFlash: true
    }),
    Listing.logIn
  );

// Logout route
router.get("/logout", Listing.logOut);

module.exports = router;