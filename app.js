const express = require('express');
const app = express();
const mongoose	= require('mongoose');
const passport	= require('passport');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: 'http://localhost:4200' }));
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute.js')
const adminRoute = require('./routes/adminRoute.js')
const salleRouter = require('./routes/salleRoute.js')
const resRouter = require('./routes/reservationRoute.js')

app.use("/user" , userRouter);
app.use("/admin" , adminRoute)
app.use("/salle" , salleRouter);
app.use("/reservation" , resRouter);

dotenv.config()
const MONGODB_URI=process.env.MONGODB_URI
// const PORT = process.env.PORT || 9000
const PORT = process.env.PORT 


//connection to the mongodb and start server
mongoose.connect(MONGODB_URI).then(()=>{
    console.log('Connected to mongodb')
    app.listen(PORT,()=>{
        console.log(`Server listening on ${PORT}`)
    })
}).catch(err=>{
    console.log('Error connecting to mongodb:',err.message)
})