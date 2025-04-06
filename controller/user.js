const User = require("../models/user")
module.exports.renderSignUpForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.registeredUser = async (req, res, next) => {
    const { username, password, email } = req.body;
    const newUser = new User({ email: email, username: username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) {
            next(err)
        }
        req.flash("success", "Welcome to MAGD");
        res.redirect("/listings");
    })
}
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome to MAGD");
    // const redirectUrl = req.session.returnTo || "/listings";
    // delete req.session.returnTo;
    // res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings"
//      the reasoon why we store this url to a varibale because if we directly perform login from the home page then in that case isLoggedin function is  triggered and that why res.locals.redirectUrl me koi path h nahi to agr koi path h hi nahi to bydefault /listing pe bhenj denge
    res.redirect(redirectUrl);
}

module.exports.logOutUSer = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you logged out")
        res.redirect("/listings");
    })
}