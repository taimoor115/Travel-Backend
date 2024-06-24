const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const app = express();
const path = require("path");
// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
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

// Show/Read

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
