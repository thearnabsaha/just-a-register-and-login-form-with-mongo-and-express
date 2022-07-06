const validator = require('validator');
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

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
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})
accountSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens =this.tokens.concat({token})
        await this.save()
        console.log(process.env.SECRET_KEY);
        return token
    } catch (error) {
        res.send(error)
    }
}
accountSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password,10)
        this.confirmPassword=await bcrypt.hash(this.confirmPassword,10)
    }
    next()
})
// creating a Student collection 
const Account = new mongoose.model("Account",accountSchema)

module.exports = Account;