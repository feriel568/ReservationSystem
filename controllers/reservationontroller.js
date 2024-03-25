
const mongoose = require('mongoose')
const Reservation = require('../models/reservation');
const Salle = require('../models/salle');
exports.makeReservation = async (req, res) => {
    try {
        const { user, salle, day, startTime, endTime } = req.body;

        function getDayName(dayOfWeek) {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return daysOfWeek[dayOfWeek];
        }
        const existingSalle = await Salle.findById(salle);
        if (!existingSalle) {
            return res.status(404).json({ message: 'Salle not found' });
        }
        const startDate =new Date(day);
        const dayName = getDayName(startDate.getDay());

        if (!existingSalle.days.includes(dayName)) {
            return res.status(400).json({ message: 'Invalid day selected for the salle' });
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
            return res.status(409).json({ message: 'Salle unavailable during selected time' });
        }

        const newReservation = new Reservation({ user, salle, day, startTime, endTime });
        await newReservation.save();
        res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.cancelReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        await Reservation.findByIdAndDelete(reservationId);
        res.status(200).json({ message: 'Reservation canceled successfully' });
    } catch (error) {
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
