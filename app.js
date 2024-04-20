const express = require('express');
const app = express();
const session = require('express-session');
const mongoose	= require('mongoose');
const passport	= require('passport');
const localStrategy	= require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// app.use('/auth',auth);
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute.js')
const salleRouter = require('./routes/salleRoute.js')
const resRouter = require('./routes/reservationRoute.js')

app.use("/user" , userRouter);
app.use("/salle" , salleRouter);
app.use("/reservation" , resRouter);

//bch yifhem ili huwe bch ya9ra ml fichier .env
dotenv.config()
const MONGODB_URI=process.env.MONGODB_URI
// const PORT = process.env.PORT || 9000
const PORT = process.env.PORT 
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Define the routes
app.get('/', (req, res) => {
  res.render('home', {title: 'Home'});
});
app.get('/userReservations', (req, res) => {
  res.render('userReservations',{title: 'userReservations'});
});
app.get('/allReservations', (req, res) => {
  res.render('allReservations',{title: 'allReservations'});
});
app.get('/calendar', (req, res) => {
  res.render('calendar',{title: 'Calendar'});
});
app.get('/makeReservation', (req, res) => {
  res.render('makeReservation',{title: 'makeReservation'});
});
app.get('/cancelReservation', (req, res) => {
  res.render('cancelReservation',{title: 'cancelReservation'});
});

app.get('/login', (req, res) => {
  const error = req.query.error; // Assuming the error value is coming from a query parameter
  res.render('login', { error });
});

  app.get('/register', (req, res) => {
    const message = ''; // Define the message variable here or fetch it from somewhere
    res.render('register', { message }); // Pass the message variable to the template
  });
  app.use((req, res) => {
    res.status(404).send('Route not found');
  });
  
//connection to the mongodb and start server
mongoose.connect(MONGODB_URI).then(()=>{
    console.log('Connected to mongodb')
    app.listen(PORT,()=>{
        console.log(`Server listening on ${PORT}`)
    })
}).catch(err=>{
    console.log('Error connecting to mongodb:',err.message)
})