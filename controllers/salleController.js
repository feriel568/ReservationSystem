const Salle = require('../models/salle');


exports.createSalle = async (req, res) => {
    try {
        const salle = new Salle(req.body);
        await salle.save();
        res.status(201).json({ success: true, data: salle });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


exports.getAllSalles = async (req, res) => {
    try {
        const salles = await Salle.find();
        res.status(200).json({ success: true, data: salles });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.getSalleById = async (req, res) => {
    try {
        const salle = await Salle.findById(req.params.id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle not found' });
        }
        res.status(200).json({ success: true, data: salle });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.updateSalle = async function(req,res){
    try {
        const salleId = req.params.id;
        const updateData = req.body;
        const updatedSalle = await Salle.findByIdAndUpdate(
            salleId,
            updateData,
            { new: true, useFindAndModify: false }
            
        );

        if (!updatedSalle) {
            return res.status(404).json({ message: 'Salle not found' });
        }

        return res.json(updatedSalle);


    }catch(err){
        console.error('Error updating salle:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deleteSalle = async (req, res) => {
    try {
        const salle = await Salle.findByIdAndDelete(req.params.id);
        if (!salle) {
            return res.status(404).json({ success: false, message: 'Salle not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
