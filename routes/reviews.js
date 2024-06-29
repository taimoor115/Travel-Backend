const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchema } = require("../schema");

// Validate Reviews
const validateReviews = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((err) => err.message).join(",");
    console.log("Hello", errorMessage);
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReviews,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
