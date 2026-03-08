const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const {index,renderNewForm, showListing , createListing, renderEditForm, updateListing, deleteListing} = require("../controllers/listings.js")
const multer = require("multer");
const {storage} = require('../cloudConfig.js')
const upload = multer({storage});//cloudinary storage save karvayega
//kha per save karege file


router
.route("/listings")
.get( wrapAsync(index))
.post( isLoggedIn, validateListing, upload.single("listing[image][url]"), wrapAsync(createListing))

//new route
router.get("/listings/new", isLoggedIn,renderNewForm)

router
.route("/listings/:id")
.get(wrapAsync(showListing))
.put( isLoggedIn,isOwner,
upload.single("listing[image][url]"),
validateListing,  wrapAsync(updateListing))
.delete( isLoggedIn, isOwner,wrapAsync(deleteListing))



//edit route
router.get("/listings/:id/edit", isLoggedIn,isOwner, wrapAsync(renderEditForm))


module.exports = router;