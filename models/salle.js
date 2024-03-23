const mongoose = require('mongoose');

const salleSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
      },
      capacity: {
        type: Number,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      days: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
      startTime: { type: Date, required: true },
      endTime: { type: Date, required: true }
     
    
     })

module.exports = mongoose.model('Salle', salleSchema);