// models/picoPlaca.js
const mongoose = require('mongoose');

// Schema for counter functionality
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const PicoPlacaSchema = new mongoose.Schema({
    idint: {
        type: Number,
        unique: true,
        index: true
    },
    tipo_vehiculo: { 
        type: String, 
        required: true,
        maxlength: 45
    },
    numero: { 
        type: String, 
        required: true,
        maxlength: 45
    },
    dia: { 
        type: String, 
        required: true,
        maxlength: 45
    }
}, {
    timestamps: true
});

// Pre-save hook to auto-increment idint
PicoPlacaSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'picoPlaca',
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

const PicoPlaca = mongoose.model('PICO_PLACA', PicoPlacaSchema, 'pico_placa');
module.exports = PicoPlaca;