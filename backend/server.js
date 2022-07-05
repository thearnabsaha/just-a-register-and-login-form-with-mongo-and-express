const express = require('express')
const path = require('path');
const app = express()
const port = process.env.PORT || 3000
require("./database/connection")
const Student = require("./database/models/accounts")
app.use(express.static(path.join(__dirname,"../client","public")))

app.get('/', (req, res) => res.sendFile(path.join(__dirname,"../client","index.html")))
app.get('/register', (req, res) => res.sendFile(path.join(__dirname,"../client","register.html")))
app.get('/login', (req, res) => res.sendFile(path.join(__dirname,"../client","login.html")))
app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))