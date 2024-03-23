const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const bcrypt = require('bcryptjs')


exports.register = async (req,res) => {

    try {
        
        console.log("Request Body:", req.body);
        const existingUser = await User.findOne({ Username : req.body.Username }).exec()
    if(existingUser){
        return res.status(400).json("This username already exists")
        
        // const message = "Username already exists";
        // return res.render('register', { message: message });
    
    }
    
 

   const  {email , Username , password} = req.body;
    const newUser = await User({
        email ,
        Username,
        password
    })
    await newUser.save()
    // const successMessage = 'Account created successfully';
        // res.render('register', { message: successMessage });

    res.json(newUser)
    }catch(err) {
        res.status(400).json({ error: err.message });

    }
}

exports.login = async (req,res) => {
    try {

    const { Username, password } = req.body;
    if (!Username || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
       
    }
    const user = await User.findOne({ Username }).exec();
    if (!user) {
        return res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    if (!user.comparePassword(password)) {
        return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }

    const token = jwt.sign({ Username: user.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });

}catch(err) {
    return res.status(500).json({ message: 'Internal Server Error' });
}

}