// controllers/picoPlacaController.js
import PicoPlaca from '../models/picoPlaca.js';

export const createPicoPlaca = async (req, res) => {
  try {
    const nuevo = new PicoPlaca(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPicoPlaca = async (_req, res) => {
  try {
    const registros = await PicoPlaca.find();
    res.json(registros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePicoPlaca = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await PicoPlaca.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!actualizado) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deletePicoPlaca = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await PicoPlaca.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};