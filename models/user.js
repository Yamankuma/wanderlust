
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema =new Schema({
    email:{
      type: String,
      required: true
    }
    })//by default passportLOcalMongoose 
//khud ek username add kar dega
//sath ki sath hash and salt walla field 
//add kardega and hash password bhi
//khud hi save kara dega
//automatically Schema k andar define kar dega
//usse k liye ye karo
//or kuch method  automatic create 
//kar dega changepassword jaise methods
//authenticatepassword khud method add kar dega.



userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);