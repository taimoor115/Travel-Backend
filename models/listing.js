const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/the-sun-is-setting-over-the-ocean-with-wildflowers-in-the-foreground-f4dA44AcwAo",
  },
  price: {
    type: Number,
    min: 1,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
