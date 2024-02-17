const mongoose=require('mongoose');
const initData=require("./data.js");
const Listing=require("../models/listings.js");

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
const initDB= async() =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65cf6c49573977418b3d9ca2"}));
    await Listing.insertMany(initData.data);
    console.log("init db done");
}
initDB();