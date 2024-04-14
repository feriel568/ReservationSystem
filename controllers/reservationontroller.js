
const mongoose = require('mongoose')
const Reservation = require('../models/reservation');
const Salle = require('../models/salle');
const nodemailer = require('nodemailer');
const User = require('../models/user');

function sendEmailNotification(email, subject, text)  {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        
       
    });
    

        // Définir les options de l'e-mail
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS, // Expéditeur
            to: email, // Destinataire
            subject: subject, // Sujet de l'e-mail
            text: text // Contenu de l'e-mail
        };

        // Envoyer l'e-mail
         transporter.sendMail(mailOptions);

        console.log('Notification e-mail sent successfully.');
    
};

exports.makeReservation = async (req, res) => {
    try {

        const userId = req.params.userId;
        
        const {salle, day, startTime, endTime } = req.body;


        const user = await User.findById(userId);
        console.log("user" , user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        function getDayName(dayOfWeek) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return daysOfWeek[dayOfWeek];
        }
        const existingSalle = await Salle.findById(salle);
        if (!existingSalle) {
            return res.json({ message: 'Salle not found' });
        }
        const startDate =new Date(day);
        const dayName = getDayName(startDate.getDay());

        if (!existingSalle.days.includes(dayName)) {
            return res.json({ message: 'Invalid day selected for the salle' });
        }

        const conflicts = await Reservation.find({
            salle,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lte: endTime } },
                { endTime: { $lte: endTime, $gte: startTime } }
            ]
        });
        if (conflicts.length > 0) {
            return res.json({ message: 'Salle unavailable during selected time' });
        }

        const newReservation = new Reservation({ user: userId,salle, day, startTime, endTime });
        console.log(user.email);
        await newReservation.save();
        const subject = 'Confirmation de réservation';
        const text = `Votre réservation a été confirmée pour la salle ${existingSalle.name} le ${day} de ${startTime} à ${endTime}.`;
         sendEmailNotification( user.email, subject , text);

        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// exports.makeReservation = async (req, res) => {
//     try {
//         // Destructure userId from the request parameters
//         const { userId } = req.params;

//         // Destructure salleId, day, startTime, and endTime from the request body
//         const { salleId, day, startTime, endTime } = req.body;

//         // Find the user by ID
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Find the salle by ID
//         const salle = await Salle.findById(salleId);
//         if (!salle) {
//             return res.status(404).json({ message: 'Salle not found' });
//         }

//         // Validate the day of the reservation
//         const startDate = new Date(day);
//         const dayOfWeek = startDate.getDay();
//         const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
//         if (!salle.availableDays.includes(dayName)) {
//             return res.status(400).json({ message: 'Invalid day selected for the salle' });
//         }

//         // Check for conflicts with other reservations
//         const conflicts = await Reservation.find({
//             salle: salleId,
//             $or: [
//                 { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
//                 { startTime: { $gte: startTime, $lte: endTime } },
//                 { endTime: { $lte: endTime, $gte: startTime } }
//             ]
//         });

//         if (conflicts.length > 0) {
//             return res.status(400).json({ message: 'Salle unavailable during selected time' });
//         }

//         // Create a new reservation
//         const newReservation = new Reservation({ user: userId, salle: salleId, day, startTime, endTime });
//         await newReservation.save();

//         // Send a confirmation email
//         const subject = 'Confirmation de réservation';
//         const text = `Votre réservation a été confirmée pour la salle ${salle.name} le ${day} de ${startTime} à ${endTime}.`;
//         await sendEmailNotification(user.email, subject, text);

//         // Respond with a success message and the new reservation
//         res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
//     } catch (error) {
//         // Log the error and respond with a generic error message
//         console.error('Error making reservation:', error);
//         res.status(500).json({ error: 'An error occurred while making the reservation' });
//     }
// };


exports.cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const userId = req.params.userId; 

        // Find the reservation by ID
        // const reservation = await Reservation.find({salle : reservationId}); 
        // const reservation = await Reservation.findOne({ _id: reservationId }).populate("salle"); 
        const reservation = await Reservation.findById(reservationId).populate("salle" , "name");
        console.log(reservation);



        // Check if the reservation exists
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare email notification content
        const subject = 'Annulation de réservation';
        const text = `Votre réservation a été annulée pour la salle ${reservation.salle.name}`;
        const userEmail = user.email;

        // Delete the reservation
        await Reservation.findByIdAndDelete(reservation);

        // Send email notification to the user
        sendEmailNotification(userEmail, subject, text);

        // Respond with success message
        res.status(200).json({ message: 'Reservation canceled successfully' });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
}; 


exports.getUserReservations = async (req, res) => {
    try {
        const { userId } = req.params;

        const reservations = await Reservation.find({ user: userId }).populate('salle');

        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate('user').populate('salle');

        res.status(200).json({ reservations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSalleReservations = async (req, res) => {
try {

    const salleId = req.params.salleId
    const resv = await Reservation.find({salle : salleId});
    res.status(200).json({ resv });
} catch (error) {
    res.status(500).json({ error: error.message });
}

}
