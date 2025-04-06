const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/MAGD"
main()
   .then(() => console.log("connection is successfull"))
   .catch(err => console.log(err));

async function main() {
   await mongoose.connect(MONGO_URL)
}

// creating a function to insert data in mongoDB database
const initDB = async () => {
   await Listing.deleteMany({});
   //    await Listing.insertMany(initData.data)
   const modifiedData = initData.map((obj) => {
      return { ...obj, owner: '67ec371d5092abb23b811e5b' };
   });

   await Listing.insertMany(modifiedData);
   console.log("data is saved successfully")
}
initDB();