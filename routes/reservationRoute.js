const express = require('express')
const router = express.Router()
const reservationController = require('../controllers/reservationontroller')
const auth = require('../middleware/auth')


router.post('/add/:userId' , auth ,reservationController.makeReservation)
router.delete('/delete/:reservationId/:userId' , auth ,reservationController.cancelReservation)

router.get('/myReservation/:userId' , auth ,reservationController.getUserReservations)

router.get('/all', auth ,reservationController.getAllReservations)
router.get('/all/:salleId', auth ,reservationController.getSalleReservations)

module.exports = router;