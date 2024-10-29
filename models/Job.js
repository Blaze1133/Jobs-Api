const mongoose = require('mongoose')
const jobScehma = new mongoose.Schema({
    company:{
        type:String,
        require:[true,'Please provide company name'],
        maxLength:50
    },
    position:{
        type:String,
        require:[true,'Please provide position'],
        maxLenth:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId, // this epcifies that this field should store the object id
        ref:'User', // ref property is used to specify the model to which the field is referencing, basically used to link two documents
        required:[true,'Please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Job',jobScehma);

// the timestamps option is a built-in feature 
// that automatically adds two fields to your schema: createdAt and updatedAt