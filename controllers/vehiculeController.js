const Vehicule = require('../models/vehicule');

// ================= CONTROLLER ================= //

// Create vehicule
exports.create = async (req, res) => {
  try {
    const vehicule = await Vehicule.create(req.body);
    res.status(201).json({
      message: 'Vehicule created successfully',
      vehicule,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get all vehicules
exports.getAll = async (req, res) => {
  try {
    const vehicules = await Vehicule.findAll();
    res.status(200).json(vehicules);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get vehicule by idint
exports.getByIdint = async (req, res) => {
  try {
    const { idint } = req.params;
    const vehicule = await Vehicule.findByIdInt(Number(idint));
    res.status(200).json(vehicule);
  } catch (error) {
    const status = error.message && error.message.toLowerCase().includes('not found') ? 404 : 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

// Update vehicule by idint
exports.update = async (req, res) => {
  try {
    const { idint } = req.params;
    const updatedVehicule = await Vehicule.updatevehicule(Number(idint), req.body);
    res.status(200).json({
      message: 'Vehicule updated successfully',
      vehicule: updatedVehicule,
    });
  } catch (error) {
    const status = error.message && error.message.toLowerCase().includes('not found') ? 404 : 500;
    res.status(status).json({
      error: error.message,
    });
  }
};

// Delete vehicule by idint
exports.remove = async (req, res) => {
  try {
    const { idint } = req.params;
    const deletedVehicule = await Vehicule.deletevehicule(Number(idint));
    res.status(200).json({
      message: 'Vehicule deleted successfully',
      vehicule: deletedVehicule,
    });
  } catch (error) {
    const status = error.message && error.message.toLowerCase().includes('not found') ? 404 : 500;
    res.status(status).json({
      error: error.message,
    });
  }
};
