const mongoose=require('mongoose')
const Data=mongoose.model('mobilebrands', new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:false
    },
    password:{
        type: String,
        required:true
    }
}))

module.exports.Data=Data;