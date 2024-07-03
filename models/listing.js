const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    min: 1,
  },
  category: {
    type: String,
    enum: [
      "Rooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pool",
      "Camping",
      "Farms",
      "Arctic",
    ],
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Cascade Delete
listingSchema.post("findOneAndDelete", async (list) => {
  if (list.reviews.length) {
    let res = await Review.deleteMany({ _id: { $in: list.reviews } });
    console.log(res);
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
