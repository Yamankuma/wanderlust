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
    
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    //ham chate hai ki jo hamare new
    //owner ho uske andar
    //current user ki it store ho
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
    res.render("listings/edit",{listing});
}

module.exports.updateListing = async (req,res)=>{
   let {id} = req.params;
    
   await Listing.findByIdAndUpdate(id, {...req.body.listing});
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