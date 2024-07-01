const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");

// Index
router.get("/", wrapAsync(listingController.index));
// Create
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show / Read

router.get("/:id", wrapAsync(listingController.showListing));

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.saveListing)
);

// Edit

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

// Update
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroy)
);

module.exports = router;
