module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must logged in to create a list...");
    return res.redirect("/login");
  }
  next();
};
