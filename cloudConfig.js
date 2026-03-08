const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');


cloudinary.config({
       cloud_name: process.env.CLOUD_NAME,
       api_key: process.env.CLOUD_API_KEY,
       api_secret: process.env.CLOUD_API_SECRET
})//cofigration detail pass karte mtlab jodna(add)
//.env k file m to kuch bhi naam de sakte
//per config m by default ye hi naam hi send karna hai


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
   
  },
});//account to bana liya abb batana hai kaha 
//per jakar kon se folder m store karna 
//hai file ko

module.exports = {
    cloudinary,
    storage
}