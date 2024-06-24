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
app.get("/", (req, res) => {
  res.send("Server working...");
});

app.get("/listing", (req, res) => {
  let list1 = new Listing({
    title: "Sea View",
    description: "A very beautifull sea view that make you feel happy..",
    price: 2000,
    location: "Karakram, Pakistan",
    country: "Pakistan",
  });

  list1
    .save()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Server Connection
const port = 8080;
app.listen(port, () => {
  console.log(`Server connecting to the port ${port}...`);
});
