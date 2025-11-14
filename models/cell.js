const mongoose = require('mongoose'); // Import mongoose

// Schema for counter functionality
const counterSchema = new mongoose.Schema({ // Schema for counter
    _id: { type: String, required: true }, 
    seq: {type: Number, default: 0}
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema); 

// Main schema for AccesoSalida
const cellSchema = new mongoose.Schema({ 

    idint: {
        type: Number,
        unique: true
    },

    type: {
        type: String,
        required: true
    },
     
    state : {
        type: String,
        required: true
    }

});

// Pre-save hook to auto-increment idint
cellSchema.pre('save', async function(next) { 
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'idint_cell',
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

const cell = mongoose.models.cell || mongoose.model('cell', cellSchema);

module.exports = cell;    