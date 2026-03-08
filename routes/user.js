const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignupForm, signup, renderLoginForm, login, logout } = require("../controllers/users.js");

router
.route("/signup")
.get(renderSignupForm)
.post( wrapAsync(signup))

router
.route("/login")
.get( renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), login)//agar ham direct login
//karte hai to page not found aayega
//jab hamara isLoggedIn middleware trigger nhi hota
//isliye ye line hai let redirectUrl = res.locals.redirectUrl || '/listings';

router.get("/logout", logout)

module.exports = router;