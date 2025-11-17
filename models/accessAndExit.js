const mongoose = require('mongoose'); // Import mongoose

// Schema for counter functionality
const counterSchema = new mongoose.Schema({ // Schema for counter
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Main schema for AccesoSalida
const accessExitSchema = new mongoose.Schema({
    idint: {
        type: Number,
        unique: true
    },

    movement: {
        type: String,
        required: true,
        trim: true
    },

    dateTime: {
        type: Date,
        default: Date.now
    },

    door: {
        type: String,
        required: true,
        trim: true
    },

    stayTime: {
        type: Number,
        required: true,
        trim: true
    }


});

// Pre-save hook to auto-increment idint
accessExitSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'idint_acceso_salida',
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

const AccessExit = mongoose.models.AccesoSalida || mongoose.model('AccessExit', accessExitSchema);

module.exports = AccessExit;