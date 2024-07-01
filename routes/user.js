const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.signupForm)
  .post(userController.signup);

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
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
