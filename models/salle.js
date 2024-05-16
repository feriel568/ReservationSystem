const mongoose = require('mongoose');

const salleSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
      },
      capacity: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      isAvailable : {
          type: Boolean,
          default: false
      },
      description: {
        type: String,
       
      },
      days: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
     
    
     })

module.exports = mongoose.model('Salle', salleSchema);