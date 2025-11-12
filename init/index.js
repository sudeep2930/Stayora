const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/stayora"



async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "68e24767c28e9c575e758141"
    }));
    await Listing.insertMany(
        initData.data.map((doc) => ({
            title: doc.title,
            description: doc.description,
            image: doc.image || {
                url: "",
                filename: ""
            },
            price: doc.price,
            location: doc.location,
            country: doc.country,
            owner: doc.owner,
        }))
    );
    console.log("data was initialized");
}

main()
    .then(initDB)
    .catch((err) => {
        console.log("Database connection error:", err);
    });