if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

//  npm install connect-mongo --legacy-peer-deps if the npm package is not install and throw an error then use this command 

// console.log(process.env.KEY)
const express = require("express");
let app = express();
const mongoose = require("mongoose");
const path = require("path")
const method_override = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/expressError.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const listingsRoutes = require("./routes/listing.js")
const reviewsReutes = require("./routes/review.js")
const userRoutes = require("./routes/user.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(method_override("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))
// let MONGO_URL = "mongodb://127.0.0.1:27017/MAGD";
let mongoAtlas_url = process.env.ATLASDB_URL

const store = MongoStore.create({
    mongoUrl:mongoAtlas_url,
    crypto: {
        secret: "MySuperSecreteSring"
      },
    touchAfter:24*3600
    
})

const sessionOption = {
    store,
    secret: "MySuperSecreteSring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    httpOnly: true
}






main().then(() => {
    console.log('connection is successfull...')
}).catch(er => console.log(er));

async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(mongoAtlas_url);
}
app.use(session(sessionOption))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingsRoutes)
app.use("/listings/:id/review", reviewsReutes)
app.use("/", userRoutes)


app.get("/", (req, res) => {
    res.send("Hi, I am root Directory")
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"dcp@gmail.com",
//         username:"Dhruv"
//     })
//    let registerdUser =  await User.register(fakeUser,"helloworld");
//    res.send(registerdUser);

// })


// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new Listings({
//         title:"my new Villa",
//         description:"By the bitch",
//         price:1499,
//         location:"Lucknow",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("data is saved");
//     res.send("successfully you saved the data");
// })

app.get("*", (req, res, next) => {
    next(new ExpressError(402, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.render("Error.ejs", { err })
    // res.status(statusCode).send(message);
    // res.send("something went wrong...")
})
app.listen(8080, () => {
    console.log("listening at port 8080")
})