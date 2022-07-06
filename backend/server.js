require('dotenv').config()
const express = require('express')
const path = require('path');
const Account = require('./database/models/accounts');
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const bcrypt = require("bcryptjs")
const app = express()
const port = process.env.PORT || 3000
require("./database/connection")
app.use(express.static(path.join(__dirname,"../client","public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.post('/register' , (req , res)=>{
    let result;
    (async function(){
       try {
        const password=req.body.password
        const cpassword=req.body.confirmPassword
        if(password===cpassword){
            const user = new Account({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                confirmPassword:req.body.confirmPassword,
                gender:req.body.gender,
                username:req.body.username
            })
            const token = await user.generateAuthToken()
            result = await user.save()
            res.status(201).sendFile(path.join(__dirname,"../client","index.html"))
        }else{
            res.send("passwords are not matching!")
        }
       } catch (error) {
          res.status(400).send(error)
       }
    })()
 })
 //login logic
app.post('/login' , (req , res)=>{
    let result;
    (async function(){
       try {
        const username=req.body.username
        const password=req.body.password
        result= await Account.findOne({username})
        const isMatch= await bcrypt.compare(password,result.password)
        const token = await result.generateAuthToken()
        // res.cookie("jwt",token,{expires:new Date(Date.now()+ 10000),httpOnly:true})
        res.cookie("jwt",token,{httpOnly:true})
        if(isMatch){
            res.status(201).sendFile(path.join(__dirname,"../client","account.html"))
        }else{
            res.send("invalid login details!!")
        }
       } catch (error) {
          res.status(400).send(error)
       }
    })()
 })

app.get('/', (req, res) => res.sendFile(path.join(__dirname,"../client","index.html")))
app.get('/account',auth,(req, res) => {
    res.sendFile(path.join(__dirname,"../client","account.html"))
})
app.get('/logout',auth, async(req, res) => {
    try {
        req.user.tokens=req.user.tokens.filter((e)=>{
            return e.token!==req.token
        })
        res.clearCookie("jwt")
        await req.user.save()
        console.log("logout successfully");
        res.status(201).sendFile(path.join(__dirname,"../client","index.html"))
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/logoutall',auth, async(req, res) => {
    try {
        req.user.tokens=[]
        res.clearCookie("jwt")
        await req.user.save()
        console.log("logout successfully");
        res.status(201).sendFile(path.join(__dirname,"../client","index.html"))
    } catch (error) {
        res.status(500).send(error)
    }
})
app.get('/register', (req, res) => res.sendFile(path.join(__dirname,"../client","register.html")))
app.get('/login', (req, res) => res.sendFile(path.join(__dirname,"../client","login.html")))
app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))