const Listings = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listings.find({});
    if(!allListings){
        throw new express(404, "Page not found..") 
    }else{
        res.render("listings/index.ejs", { allListings });
    }
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs");
}
module.exports.createListing = async (req, res, next) => {
    // const {title,description,price,location,country} = req.body;
    // let newListing  = new Listings({
    //     title:title,
    //     price:price,
    //     description:description,
    //     location:location,
    //     country:country,
    // })
    // newListing.save();
    // let listing = req.body.listing;
    // if(!req.body.listing){
    //     throw new express(400,"Bad Request")
    // }

    let newListing = await new Listings(req.body.listing)
    newListing.owner = req.user._id;
    // res.send(req.file)
    const { filename, path } = req.file
    newListing.image.filename = filename;
    newListing.image.url = path;
    // newListing.image = {filename,path}
    newListing.save();
    req.flash("success", "new Listing is saved... ")
    console.log(newListing)
    // console.log("data is added successfully");
    res.redirect("/listings")
    // console.log(newListing);
}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate("reviews").populate("owner");
    // console.log(listing)
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listings.findById(id);
    let originalImgUrl = listing.image.url.replace("/upload","/upload/w_125")
    res.render("listings/edit.ejs", { listing, originalImgUrl});
}
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new express(400, "Bad Request")
    }
    let { id } = req.params;
    let listing = await Listings.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        const { filename, path } = req.file
        listing.image.filename = filename;
        listing.image.url = path;
        await listing.save();
    }
    req.flash("success", "listing is updated")
    res.redirect(`/listings/${id}`)
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listings.findByIdAndDelete(id)
    res.redirect("/listings")
}