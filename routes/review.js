const express = require("express")
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn } = require("../views/middleware/middleware.js");
const reviewController = require("../controller/review.js")

router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.addReview))

router.delete("/:reviewID",wrapAsync(reviewController.destroyReview))

module.exports = router;
