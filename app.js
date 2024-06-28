const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const schema = require("./schema.js");
const Review = require("./models/review.js");

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

// Validation
const validateListing = (req, res, next) => {
  let { error } = schema.validate(req.body);

  console.log(error);
  if (error) {
    let errMsg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(400, errMsg);
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

// Index
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const listing = await Listing.find();
    res.render("home", { listing });
  })
);
// Create
app.get("/listings/new", (req, res) => {
  res.render("new");
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const listing = req.body.listing;
    const list = new Listing(listing);
    await list.save();
    res.redirect("/listings");
  })
);

// Edit

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("edit", { listing });
  })
);

// Update
app.patch(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id, { new: true }).then((res) =>
      console.log(res)
    );
    res.redirect("/listings");
  })
);

// Show / Read

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    res.render("show", { list });
  })
);

// Add Reviews

app.post("/listings/:id/reviews", async (req, res) => {
  const { id } = req.params;
  console.log(req.body.review);
  const listing = await Listing.findById(id);
  const review = new Review(req.body.review);

  listing.reviews.push(review);
  await review.save();
  const result = await listing.save();
  console.log(result);
  res.redirect(`/listings/${listing._id}`);
});

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
