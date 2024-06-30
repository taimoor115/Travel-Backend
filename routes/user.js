const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
    });
    const result = await User.register(user, password);
    console.log(result);
    req.flash("success", "Sign up successfully!");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Traveller ...");
    res.redirect("/listings");
  }
);
module.exports = router;
