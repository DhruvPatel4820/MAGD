const Listings  = require("../../models/listing.js")
const { listingSchema, reviewSchema } = require("../../schema.js")
const ExpressError = require("../../utils/expressError.js")

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.path , ".. ", req.originalUrl);
    // jab tak user logged in h tab to hame original password ko save karvane ki jarurat nahi h agr loggedin nahi h tab hame originalurl ko save karvane ki jarurat h
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create a new listing")
        // return res.redirect("/listings")
        return res.redirect("/login")
        
    }
    next();
}

module.exports.redirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;
    const listing= await Listings.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser)){
        req.flash("error","You are not the owner")
        return res.redirect(`/listings/${id}`)
    }
}

module.exports.validListing = (req, res, next) => {
    // if (typeof req.body.listing.image === "string") {
    //     req.body.listing.image = { url: req.body.listing.image, filename: "" };
    // }
    const { error } = listingSchema.validate(req.body)
    // console.log(result);
    if (error) {
        let result = error.details.map(err => err.message).join(",")
        throw new ExpressError(400, result)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    // console.log(result);
    if (error) {
        let result = error.details.map(err=>err.message).join(",")
        throw new ExpressError(400, result)
    } else {
        next()
    }
}
