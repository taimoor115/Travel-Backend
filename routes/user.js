const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");
const user = require("../models/user");

router.get("/signup", userController.signupForm);

router.post("/signup", userController.signup);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    failureMessage: "A user with the given email is already registered",
  }),
  userController.login
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out successfully...");
    res.redirect("/listings");
  });
});
module.exports = router;
