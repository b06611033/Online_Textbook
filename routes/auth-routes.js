const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const alert = require("alert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// After login in google, google will call this API
router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log("In callback route.");
  console.log(req.user);

  // Create a json web token for user
  const foundUser = req.user;
  const tokenObject = { _id: foundUser._id, email: foundUser.email }; // Using _id may be buggy?
  const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

  // Create a new window to send user data to client, I don't know how to use a better way
  var responseHTML =
    '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
  responseHTML = responseHTML.replace(
    "%value%",
    JSON.stringify({
      message: "Login and JWT created",
      token: "JWT " + token,
      user: foundUser,
    })
  );
  res.status(200).send(responseHTML);

});


module.exports = router;
