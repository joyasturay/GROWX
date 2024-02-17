const mongoose=require('mongoose');
const Assignment=require('../models/assignment.js');
const newAssignment = new Assignment({
    fileUrl: 'https://pdfobject.com/pdf/sample.pdf', 
});
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
newAssignment.save()
    .then(savedAssignment => {
        console.log('Assignment saved:', savedAssignment);
    })
    .catch(error => {
        console.error('Error saving assignment:', error);
    });