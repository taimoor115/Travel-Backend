const ExpressError = require("./utils/ExpressError");
const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must logged in to create a list...");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;

  let list = await Listing.findById(id);
  if (!list.owner._id.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the owner of the list...");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((err) => err.message).join(",");
    console.log("Hello", errorMessage);
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the owner of the list...");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
