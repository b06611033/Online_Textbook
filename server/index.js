const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");



mongoose.connect("mongodb://localhost:27017/MYMathDB")
.then(() => {
    console.log("connecting to mongodb");
})
.catch((e) => {
    console.log(e);
})


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false},
}));
app.use(passport.initialize());
app.use(passport.session());

// set routes
app.use("/auth", authRoutes);

app.listen(8080, () => {
    console.log("running server on port 8080");
})
