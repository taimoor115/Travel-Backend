const express = require("express");
const router = express.Router();
const User = require("../models/user");

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
    req.flash("success", "Welcome to Traveller!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
});
module.exports = router;
