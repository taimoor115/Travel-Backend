const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/demo", async (req, res) => {
  let fakeUser = new User({
    username: "Test",
    email: "fakeuser@gmail.com",
  });
  const result = await User.register(fakeUser, "honda125");
  res.send(result);
});
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
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
