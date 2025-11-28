// controllers/picoPlacaController.js
const PicoPlaca = require('../models/picoPlaca');

const createPicoPlaca = async (req, res) => {
  try {
    const picoPlaca = new PicoPlaca(req.body);
    await picoPlaca.save();
    res.status(201).json(picoPlaca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPicoPlaca = async (req, res) => {
  try {
    const picoPlacas = await PicoPlaca.find();
    res.json(picoPlacas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePicoPlaca = async (req, res) => {
  try {
    const picoPlaca = await PicoPlaca.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!picoPlaca) return res.status(404).json({ message: 'No encontrado' });
    res.json(picoPlaca);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePicoPlaca = async (req, res) => {
  try {
    const picoPlaca = await PicoPlaca.findByIdAndDelete(req.params.id);
    if (!picoPlaca) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPicoPlaca,
  getPicoPlaca,
  updatePicoPlaca,
  deletePicoPlaca
};