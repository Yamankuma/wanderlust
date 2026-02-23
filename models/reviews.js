const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    comment: {
        type: String,
        min:1,
        max:5
    },
    rating: {
        type:Number
    },
    createdAt : {
        type: Date,
        default: Date.now()
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Review", reviewSchema);