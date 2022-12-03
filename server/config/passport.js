const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const alert = require("alert");

passport.serializeUser((user, done) => {
  console.log("Serialize user");
  console.log(user);
  done(null, user._id); // Save mongoDB id into session
  // After signing id, return it as cookie to user
});

passport.deserializeUser(async (_id, done) => {
  console.log("Deserialize user, use serialize user's id to locate data in db");
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); // set req.user to foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Using google strategy");
      console.log("===============");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("User already signed up, no need to save into db");
        done(null, foundUser);
      } else {
        console.log("New user, needs to save to db");
        let newUser = new User({
          name: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("New profile created successfully");
        done(null, savedUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let foundUser = await User.findOne({ email: username });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser);
      } else {
        alert("Login failed! Email or password incorrect");
        done(null, false);
      }
    } else {
      alert("Login failed! Email or password incorrect");
      done(null, false);
    }
  })
);
