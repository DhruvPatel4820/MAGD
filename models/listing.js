const mongoose = require("mongoose");
const Review = require("./review.js");
const { object, string } = require("joi");
const User = require("./user.js");
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    // image:{
    //     type:String,
    //     default:"https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",//ye check karega ki img hai hi nahi
    //     set:(v)=>v===""?"https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v, // ye check karega ki img to h but usme kuch value h to vo set kar do nahi to dafault ko set kar do
    // },
    image: {
        filename: String,
        url: String,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    categories:{
        type:String,
        enum:["mountain","Tranding","Rooms","Iconic Cities"]
    }


})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;