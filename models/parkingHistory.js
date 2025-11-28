import mongoose from 'mongoose';

// Schema for counter functionality
const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const ParkingHistorySchema = new mongoose.Schema({
  idint: { type: Number, unique: true },
  placa: { type: String, required: true },
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  licensePlate: { type: String, required: true },
  cost: { type: Number, required: true },
  observaciones: { type: String }
}, {
  timestamps: true
});

// Pre-save hook to auto-increment idint
ParkingHistorySchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: 'parkingHistory' },
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

export default ParkingHistory;
