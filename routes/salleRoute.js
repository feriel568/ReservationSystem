const salleController = require('../controllers/salleController')
const express = require('express')
const router =express.Router()



router.post('/createSalle', salleController.createSalle);


router.get('/getAll', salleController.getAllSalles);


router.get('/get/:id', salleController.getSalleById);


router.put('/update/:id', salleController.updateSalle);


router.delete('/delete/:id', salleController.deleteSalle);

module.exports = router;