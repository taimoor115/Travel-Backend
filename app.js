const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
var methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
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
// Routes
app.get("/", async (req, res) => {
  res.send("Server Working...");
});

// Index
app.get("/listings", async (req, res) => {
  const listing = await Listing.find();

  res.render("home", { listing });
});
// Create
app.get("/listings/new", (req, res) => {
  res.render("new");
});

app.post("/listings", async (req, res) => {
  const listing = req.body.listing;
  const list = new Listing(listing);
  await list.save();
  res.redirect("/listings");
});

// Edit

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("edit", { listing });
});

// Update
app.patch("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = req.body.listing;

  await Listing.findByIdAndUpdate(id, listing, {
    new: true,
    runValidators: true,
  });
  res.redirect("/listings");
});

// Delete
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id, { new: true }).then((res) =>
    console.log(res)
  );
  res.redirect("/listings");
});

// Show / Read

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("show", { list });
});

// Server Connection
const port = 8080;
app.listen(port, () => {
  console.log(`Server connecting to the port ${port}...`);
});
