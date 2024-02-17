/*const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const loggedin=require("../middleware.js").loggedin;
const isOwner=require("../middleware.js").isOwner;
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

};
//listings route
router.get("/",wrapAsync(async(req,res)=>{
    const listings=await Listing.find({});
    res.render("./listings/index.ejs",{listings});
}));
//help
router.get("/help",wrapAsync(async(req,res)=>{
    res.render("./listings/help.ejs");
}))
  
//new route
router.get("/new",loggedin,(req,res)=>{
    res.render("./listings/new.ejs");
});
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    const listing=new Listing(req.body);
    listing.owner=req.user._id;
    await listing.save();
    req.flash("success","listing created successfully");
    res.redirect("/listings");
}));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"announcements",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing not found");
         res.redirect("/listings");
      }
    res.render("./listings/show.ejs",{listing});
}));
//edit route
router.get("/:id/edit",loggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","listing not found");
        res.redirect("/listings");
      }
    res.render("./listings/edit.ejs",{listing});
}));
router.put("/:id",loggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",loggedin,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
}));
//video route
router.get("/:id/video",loggedin,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/video.ejs",{listing});
}));

module.exports=router;*/
const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }

};
//listings route
router.get("/",wrapAsync(async(req,res)=>{
    const listings=await Listing.find({});
    res.render("./listings/index.ejs",{listings});
}));

  
//new route
router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
router.post("/",validateListing,wrapAsync(async(req,res)=>{
    const listing=new Listing(req.body);
    await listing.save();
    req.flash("success","listing created successfully");
    res.redirect("/listings");
}));
//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("announcements");
    res.render("./listings/show.ejs",{listing});
}));
//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));
router.put("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));
module.exports=router;