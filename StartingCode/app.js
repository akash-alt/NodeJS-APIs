//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});


const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// here we encrypt our password
const secret = "thisismyfirstencryptedsecret"; // if someone get my secret then they can easily hack my password
userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password'] })
//***************** end *********/
const User = new mongoose.model("User",userSchema) 

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

///////////////////////////// this is for "register" page /////////////////
app.post("/register",(req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    })
})
  
////////////////////////// this is for "login" page //////////////////////
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username},(err,foundUser)=>{
        if(err){
            console.log(err)
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })
});

app.listen(3000,function(){
    console.log("server started on port 3000")
})