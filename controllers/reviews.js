const Listing = require("../models/listing");
const Review = require("../models/review");

// Verify Review model is loaded
if (!Review) {
    console.error("ERROR: Review model failed to load!");
} else {
    console.log("Review model loaded successfully:", Review.modelName);
}

module.exports.createReview = async (req, res) => {
    if (!Review) {
        throw new Error("Review model is not available");
    }

    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success", "Successfully created a new review");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let {
        id,
        reviewId
    } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted the review");
    res.redirect(`/listings/${id}`);
};