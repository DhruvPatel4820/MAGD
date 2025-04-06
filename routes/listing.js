const express = require("express")
const router = express.Router();
const Listings = require("../models/listing.js")
const wrapAsync = require("../utils/wrapAsync.js")
const { isLoggedIn } = require("../views/middleware/middleware.js")
const { validListing } = require("../views/middleware/middleware.js")
const listingController = require("../controller/Listings.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })



router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image][url]'),validListing, wrapAsync(listingController.createListing))
    // .post(upload.single('listing[image][url]'),(req,res)=>{
    //   res.send(req.file);
    // }
  // )
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .delete(isLoggedIn, wrapAsync(listingController.deleteListing))
    .put(isLoggedIn,upload.single('listing[image][url]'), wrapAsync(listingController.updateListing))


// router.get('/', wrapAsync(listingController.index))

router.get("/:id/new", isLoggedIn, wrapAsync(listingController.renderEditForm))




// router.post("/", isLoggedIn, validListing, wrapAsync(listingController.createListing))

// router.get("/:id/new", isLoggedIn, wrapAsync(listingController.renderEditForm))

// router.put("/:id", isLoggedIn, wrapAsync(listingController.updateListing))

// router.delete("/:id", isLoggedIn, wrapAsync(listingController.deleteListing))

module.exports = router;