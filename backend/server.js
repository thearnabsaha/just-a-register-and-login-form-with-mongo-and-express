const express = require('express')
const path = require('path');
const Account = require('./database/models/accounts');
const bcrypt = require("bcryptjs")
const app = express()
const port = process.env.PORT || 3000
require("./database/connection")
app.use(express.static(path.join(__dirname,"../client","public")))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

// create a new user in our database
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
app.get('/register', (req, res) => res.sendFile(path.join(__dirname,"../client","register.html")))
app.get('/login', (req, res) => res.sendFile(path.join(__dirname,"../client","login.html")))
app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))