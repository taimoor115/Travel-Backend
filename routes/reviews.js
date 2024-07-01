const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReviews, isLoggedIn, isAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

router.post(
  "/",
  isLoggedIn,
  validateReviews,
  wrapAsync(reviewController.saveReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.destroy)
);

module.exports = router;
