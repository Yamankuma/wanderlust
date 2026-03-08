const Listing = require("../models/listing.js");

module.exports.index = async (req, res)=>{
  const allListing = await Listing.find({});
   res.render("listings/index", {allListing});
} 

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new");
  
}

module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: { path: "author"},}).populate("owner");
    if(!listing){
         req.flash("error", "Listing not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", {listing})
}

module.exports.createListing = async (req,res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const { location, country } = req.body.listing;
     const fullLocation = `${location}, ${country}`;
     console.log(fullLocation);

      // 🔥 Timeout controller define karo
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 sec timeout


    console.log("Location:", location);
     console.log("API KEY:", process.env.MAP_API_KEY);
     
     


     const response = await fetch(
  `https://api.maptiler.com/geocoding/${encodeURIComponent(fullLocation)}.json?limit=1&key=${process.env.MAP_API_KEY}`,
     { signal: controller.signal }
    );

    clearTimeout(timeout);

    const data = await response.json();

    console.log(data);
    if (!data.features || data.features.length === 0) {
  req.flash("error", "Location not found. Please enter a valid location.");
  return res.redirect("/listings/new");
   }
    
    const coordinates = data.features[0].geometry.coordinates;
    

    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    //ham chate hai ki jo hamare new
    //owner ho uske andar
    //current user ki it store ho
     newlisting.geometry = {
      type: "Point",
      coordinates: coordinates
    };
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings")
    } 

module.exports.renderEditForm = async (req,res)=>{
    
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
         req.flash("error", "Listing not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit",{listing, originalImageUrl});
}

module.exports.updateListing = async (req,res)=>{
   let {id} = req.params;
    
  let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
  if(typeof req.file != "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
  await listing.save();
  }
  req.flash("success", "Listing is Updated");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing is Deleted");
   console.log(deletedListing);
   res.redirect("/listings");
} 