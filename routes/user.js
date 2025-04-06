// const express = require("express");
// const wrapAsync = require("../utils/wrapAsync");
// const user = require("../models/user");
// const passport = require("passport");
// const router = express.Router();

// router.get("/signup",(req,res)=>{
//     res.render("user/signup.ejs");
// })
// router.post("/signup",wrapAsync(async(req,res)=>{
//     const {username,password,email} = req.body;
//     const newUser =  new user({email:email,username:username});
//     const registerUser= await user.register(newUser,password);
//     req.flash("success","welcome to MAGD")
//     res.redirect("/listings")
// }))
// router.get("/login",(req,res)=>{
//     res.render("user/login.ejs")
// })

// router.post("/login",passport.authenticate("local",
//     { failureRedirect: '/login',failureFlash:true }),
//     async(req,res)=>{
//     req.flash("success","welcome to MAGD");
//     res.redirect("/listings")
// })
// module.exports = router;

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user"); // Use correct capitalization
const passport = require("passport");
const { redirectUrl } = require("../views/middleware/middleware");
const router = express.Router();
const userController = require("../controller/user")


router.route("/signup")
.get(userController.renderSignUpForm)
.post( wrapAsync(userController.registeredUser));

// router.get("/signup", userController.renderSignUpForm);

// router.post("/signup", wrapAsync(userController.registeredUser));

router.route("/login")
.get(userController.renderLoginForm)
.post( redirectUrl, passport.authenticate("local", {
    failureRedirect: "/login", failureFlash: true
}), userController.loginUser
);

// router.get("/login", userController.renderLoginForm);

// router.post("/login", redirectUrl, passport.authenticate("local", {
//     failureRedirect: "/login", failureFlash: true
// }), userController.loginUser
// );

router.get("/logout", userController.logOutUSer)

module.exports = router;
