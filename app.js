const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const session = require("express-session");

// Sessions
const sessionOptions = {
  secret: "mysecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(sessionOptions));

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

// Routes
app.get(
  "/",
  wrapAsync(async (req, res) => {
    res.send("Server Working...");
  })
);

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
// Add Reviews

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
