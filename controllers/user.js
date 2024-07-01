const User = require("../models/user");

module.exports.signupForm = (req, res) => {
  res.render("users/signup");
};
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
    });
    const registeredUser = await User.register(user, password);
    req.logIn(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Sign up successfully!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Traveller ...");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};
