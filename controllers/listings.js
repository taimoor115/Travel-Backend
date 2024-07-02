const Listing = require("../models/listing");
const { login } = require("./user");

module.exports.index = async (req, res) => {
  const listing = await Listing.find();
  res.render("home", { listing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!list) {
    req.flash("error", "List does not exist...");
    res.redirect("/listings");
  }
  res.render("show", { list });
};

module.exports.saveListing = async (req, res, next) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const listing = req.body.listing;
  const list = new Listing(listing);
  list.owner = req.user.id;
  list.image = { url, filename };
  await list.save();
  req.flash("success", "List added successfully");
  res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("edit", { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = req.body.listing;
  await Listing.findByIdAndUpdate(id, listing, {
    new: true,
    runValidators: true,
  });
  req.flash("success", "List updated successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id, { new: true });
  req.flash("success", "List deleted successfully");
  res.redirect("/listings");
};
