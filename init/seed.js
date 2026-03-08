require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data: sampleListings } = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function seedDB() {
  try {
    // 🔥 Connect FIRST
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB:", mongoose.connection.name);

    await Listing.deleteMany({});
    console.log("Old listings deleted");

    const ownerId = "698b21bb5968b4d789363932";

    for (let listing of sampleListings) {

      const fullLocation = `${listing.location}, ${listing.country}`;
      console.log("Geocoding:", fullLocation);

      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(fullLocation)}.json?limit=1&key=${process.env.MAP_API_KEY}`
      );

      const geoData = await response.json();

      if (!geoData.features || geoData.features.length === 0) {
        console.log("Location not found:", fullLocation);
        continue;
      }

      listing.geometry = {
        type: "Point",
        coordinates: geoData.features[0].geometry.coordinates,
      };

       await Listing.create({
        ...listing,
        owner: ownerId
      });
      console.log("Added:", listing.title);
    }

    console.log("🎉 Seeding Completed");

  } catch (err) {
    console.log("ERROR:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection Closed");
  }
}

seedDB();