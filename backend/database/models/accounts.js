const validator = require('validator');
const mongoose = require('mongoose')
//creating a schema
const accountSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!!!")
            }
        }
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    },
    gender:{
    type:String,
        required:true
    }

})
// creating a Student collection 
const Account = new mongoose.model("Account",accountSchema)

module.exports = Account;