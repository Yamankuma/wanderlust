const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const {addReviews, deleteReviews} = require("../controllers/reviews.js")


//Review Route
router.post("/",isLoggedIn, validateReview , wrapAsync(addReviews))

//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(deleteReviews));

module.exports = router;