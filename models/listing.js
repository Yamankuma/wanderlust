const mongoose =require("mongoose");
const reviews = require('./reviews');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    image : {
       
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
       type: String,
        default: "https://plus.unsplash.com/premium_photo-1686090449192-4ab1d00cb735?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v ==="" ? "https://plus.unsplash.com/premium_photo-1686090449192-4ab1d00cb735?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        }
    },
    price :{
        type: Number
    },
    location :{
        type: String
    },
    country: {
        type: String
    },

    geometry: {
    type: {
      type: String,
      enum: ["Point"], // "location must be point"
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner: {
          type: Schema.Types.ObjectId,
          ref: "User"
    }
});

listingSchema.index({ geometry: "2dsphere" });

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await reviews.deleteMany({_id: {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;