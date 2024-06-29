const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// Ejs
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views/listing"));
app.use(express.static(path.join(__dirname, "/public")));

// Db Connection
main()
  .then(() => {
    console.log("DB Connecting...");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/travel");
}

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

// Routes
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.send("Server Working...");
  })
);

app.use("/listings", listings);
// Add Reviews

app.post(
  "/listings/:id/reviews",
  validateReviews,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);
    const review = new Review(req.body.review);

    listing.reviews.push(review);
    await review.save();
    const result = await listing.save();
    console.log(result);
    res.redirect(`/listings/${listing._id}`);
  })
);

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

// Error Handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found..."));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong..." } = err;
  res.status(status).render("error", { message });
});

// Server Connection
const port = 5000;
app.listen(port, () => {
  console.log(`Server connecting to the port ${port}...`);
});
