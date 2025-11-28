// models/picoPlaca.js
import mongoose from 'mongoose';

const PicoPlacaSchema = new mongoose.Schema({
  placa: { type: String, required: true },
  fecha: { type: Date, required: true },
  restriccion: { type: Boolean, required: true },
  observaciones: { type: String }
}, {
  timestamps: true
});

const PicoPlaca = mongoose.model('PicoPlaca', PicoPlacaSchema);
export default PicoPlaca;