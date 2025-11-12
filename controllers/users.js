const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
}

module.exports.signup = async (req, res) => {
    try {
        let {
            username,
            email,
            password
        } = req.body;
        const newUser = new User({
            email,
            username
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("/signup");
            }
            req.flash("success", "Welcome to Stayora!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Stayora!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/listings");
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
}