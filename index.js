const express=require('express')
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate=require("ejs-mate");
var methodOverride = require('method-override');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
main().then(() => console.log('Connected to MongoDB!'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/cipherthon');
}
app.get('/',(req,res)=>{
  res.render("./listings/index.ejs");
});
app.listen(8080,()=>{
    console.log('server started at port 8080');
});

