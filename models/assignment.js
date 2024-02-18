const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const assignmentSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
    },
});


const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;