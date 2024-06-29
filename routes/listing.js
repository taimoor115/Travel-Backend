const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema");

// Validation

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  console.log(error);
  if (error) {
    let errMsg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const listing = await Listing.find();
    res.render("home", { listing });
  })
);
// Create
router.get("/new", (req, res) => {
  res.render("new");
});

// Show / Read

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id).populate("reviews");
    console.log(list);
    res.render("show", { list });
  })
);
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = req.body.listing;
    const list = new Listing(listing);
    await list.save();
    req.flash("success", "New List added successfully");
    res.redirect("/listings");
  })
);

// Edit

router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("edit", { listing });
  })
);

// Update
router.patch(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing, {
      new: true,
      runValidators: true,
    });
    res.redirect("/listings");
  })
);

// Delete
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id, { new: true });
    res.redirect("/listings");
  })
);

module.exports = router;
