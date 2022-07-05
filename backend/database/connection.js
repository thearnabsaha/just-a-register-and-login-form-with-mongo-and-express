const mongoose = require('mongoose')
// connection creation and creating a new database
mongoose.connect("mongodb://localhost:27017/accounts-api",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=> console.log("connection sucessful..."))
.catch((err)=>{throw err})