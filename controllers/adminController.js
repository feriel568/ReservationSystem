const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const bcrypt = require('bcryptjs')

exports.register = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const existingUser = await Admin.findOne({ Username: req.body.Username }).exec()
        if (existingUser) {
            const message = "Username already exists";
          return res.json({ message: message })
        }

        const { email, Username, password } = req.body;
        const newUser = await Admin({
            email,
            Username,
            password
        })
        await newUser.save()
        
        
        res.json({ newUser ,  message: "Account created successfully for admin" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

exports.login = async (req,res) => {
    try {

    const { Username, password } = req.body;
    if (!Username || !password) {
        return res.json({ message: 'Email and password are required.' });
       
    }
    const user = await Admin.findOne({ Username }).exec();
    if (!user) {
        return res.json({ message: 'Authentication failed. User not found.' });
    }

    if (!user.comparePassword(password)) {
        return res.json({ message: 'Authentication failed. Invalid password.' });
    }

    const token = jwt.sign({ Username: user.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token , userId: user._id});

}catch(err) {
    return res.status(500).json({ message: 'Internal Server Error' });
}

}