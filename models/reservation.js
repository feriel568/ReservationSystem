const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    salle: { type: mongoose.Schema.Types.ObjectId, ref: 'Salle', required: true },
    day : { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
     
    
     })

module.exports = mongoose.model('Reservation', reservationSchema);