const express=require('express')
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listings.js");
const ejsMate=require("ejs-mate");
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
const Mongo_url="mongodb://127.0.0.1:27017/cipherthon";

main().then(() => {
    console.log("connected to mongodb")
})
.catch(err =>{
     console.log(err)
});

async function main() {
  await mongoose.connect(Mongo_url);
}
//root route
app.get('/',(req,res)=>{
  res.send("hello world");
});
//listings route
app.get("/listings",async(req,res)=>{
    const listings=await Listing.find({});
    res.render("./listings/index.ejs",{listings});
});
//new route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
app.post("/listings",async(req,res)=>{
    const listing=new Listing(req.body);
    await listing.save();
    res.redirect("/listings");
});
//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});
app.listen(8080,()=>{
    console.log('server started at port 8080');
});

