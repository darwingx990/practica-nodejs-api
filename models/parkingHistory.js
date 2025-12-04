const mongoose = require('mongoose');

// Schema for counter functionality
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const ParkingHistorySchema = new mongoose.Schema({
  idint: { type: Number, unique: true },
  Celda_id: { type: Number, required: true },
  Vehiculo_id: { type: Number, required: true },
  fecha_hora: { type: Date, required: true }
}, {
  timestamps: true
});

// Pre-save hook to auto-increment idint
ParkingHistorySchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'parkingHistory',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.idint = counter.seq;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Crear el modelo
const ParkingHistory = mongoose.models.ParkingHistory || mongoose.model('ParkingHistory', ParkingHistorySchema);

module.exports = ParkingHistory;
