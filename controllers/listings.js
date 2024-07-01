const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const listing = await Listing.find();
  res.render("home", { listing });
};
