const express = require('express');
const router = express.Router();
//create router register,login
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/user');
//auth/login return message with html
router.get('/login',(req,res) =>{
    res.send("<h1>you are logged in ! </h1>")
});

module.exports=router;