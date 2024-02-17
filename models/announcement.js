const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const User=require("./user.js");
const announceSchema=new Schema({
    comment:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
const Announcement=mongoose.model("Announcement",announceSchema);
module.exports=Announcement