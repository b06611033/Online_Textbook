const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const alert = require("alert");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

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

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
  }),
  (req, res) => {
    return res.redirect("/profile");
  }
);

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

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("In redirect route.");
  console.log(req.user);
  return res.redirect("http://localhost:3000/");
});

router.get("checkSession", passport.authenticate("google"), (req, res) => {
  console.log("In checkSession route.");
  console.log(req.user);
  return res.send("called");
});

module.exports = router;
