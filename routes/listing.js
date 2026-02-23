const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const {index,renderNewForm, showListing , createListing, renderEditForm, updateListing, deleteListing} = require("../controllers/listings.js")



//index Route
router.get("/listings", wrapAsync(index))


//new route
router.get("/listings/new", isLoggedIn,renderNewForm)

//show route
router.get("/listings/:id",wrapAsync(showListing))


//create route
router.post("/listings", isLoggedIn, validateListing,  wrapAsync(createListing))

//edit route
router.get("/listings/:id/edit", isLoggedIn,isOwner, wrapAsync(renderEditForm))

//update route
router.put("/listings/:id", isLoggedIn,isOwner,validateListing,  wrapAsync(updateListing))

//Delete Route
router.delete("/listings/:id", isLoggedIn, isOwner,wrapAsync(deleteListing))

module.exports = router;