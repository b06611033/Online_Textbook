const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const alert = require("alert");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    return res.redirect("/profile");
  }
);

/*
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    alert("Email already resistered. Please login here!");
    res.redirect("/auth/login");
  } else {
    let hashedPassword = await bcrypt.hash(password, 12);
    let newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    alert("Registered successfully!");
    return res.redirect("/auth/login");
  }
});
*/

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    else res.redirect("/auth/login");
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/callback", passport.authenticate("google"), (req, res) => {
  console.log("In callback route.");
  console.log(req.user);

  // Create a json web token for user
  const foundUser = req.user;
  const tokenObject = { _id: foundUser._id, email: foundUser.email }; // Using _id may be buggy?
  const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);

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

  // return res.send({
  //   message: "Login and JWT created",
  //   token: "JWT " + token,
  //   user: foundUser,
  // });

  //return res.redirect("http://localhost:3000/");
});

router.get("/test", (req, res) => {
  console.log("return success");
  return res.status(200).send("return success");
});

module.exports = router;
