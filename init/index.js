const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MonogUrl = "mongodb://127.0.0.1:27017/travel";

// Db Connection
main()
  .then(() => {
    console.log("DB Connecting...");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MonogUrl);
}

const initDb = async function () {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data is initialized");
};

initDb();
