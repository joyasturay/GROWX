const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");
const loggedin=require("../middleware.js").loggedin;
const isOwner=require("../middleware.js").isOwner;
const Assignment = require('../models/assignment.js');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
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
// Render form for submitting assignments
router.get('/:id/assignments', loggedin,(req, res) => {
    const { id } = req.params;
    const message = req.flash('success');
    const messageType = 'success';
    res.render('./listings/assignmentForm.ejs', { listingId: id, message, messageType });
});
    // Handle assignment submission
router.post('/:id/assignments', upload.single('assignmentFile'), (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (file) {
        // Save the assignment to the database
        const newAssignment = new Assignment({
            listingId: id,
            file: {
                data: file.buffer,
                contentType: file.mimetype,
            },
        });

        newAssignment.save()
            .then(savedAssignment => {
                console.log('Assignment saved:', savedAssignment);
                req.flash('success', 'Assignment submitted successfully!');
                res.redirect(`/listings/${id}/assignments`);
            })
            .catch(error => {
                console.error('Error saving assignment:', error);
                req.flash('error', 'Error submitting assignment.');
                res.redirect(`/listings/${id}/assignments`);
            });
    } else {
        console.error('Multer upload error:', req.fileValidationError);
        req.flash('error', 'Error submitting assignment. Please select a valid PDF file.');
        res.redirect(`/listings/${id}/assignments`);
    }
});

router.get('/:id/seeassignments', (req, res) => {
    const { id } = req.params;
    Assignment.find({ listingId: id })
        .then(assignments => {
            console.log('Assignments:', assignments);
            res.render('./listings/viewAssignments.ejs', {assignments});
        })
        .catch(error => {
            console.error('Error fetching assignments:', error);
            res.status(500).send('Internal Server Error: ' + error.message);
        });
});


module.exports=router;
