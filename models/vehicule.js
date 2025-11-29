const mongoose = require('mongoose');

// Counter schema to auto-increment idint per collection
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// vehicule schema (VEHICULO in the ERD)
const vehiculeSchema = new mongoose.Schema({
    idint: {
        type: Number,
        unique: true
    },
    plate: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Number,
        ref: 'user',
        required: true,
        index: true
    }
}, { timestamps: true });

// Auto-increment idint before save
vehiculeSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findByIdAndUpdate(
            'vehicule_id',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.idint = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

vehiculeSchema.statics.create = async function (data) {
    try {
        const vehicule = new this(data);
        await vehicule.save();
        return vehicule;
    } catch (error) {
        throw new Error(`Error creating vehicule: ${error.message}`);
    }
};

vehiculeSchema.statics.findAll = async function () {
    try {
        return await this.find().sort({ idint: 1 });
    } catch (error) {
        throw new Error(`Error finding vehicules: ${error.message}`);
    }
};

vehiculeSchema.statics.findByIdInt = async function (idint) {
    const vehicule = await this.findOne({ idint });
    if (!vehicule) throw new Error('vehicule not found');
    return vehicule;
};

vehiculeSchema.statics.updatevehicule = async function (idint, data) {
    const updated = await this.findOneAndUpdate({ idint }, data, {
        new: true,
        runValidators: true
    });
    if (!updated) throw new Error('vehicule not found to update');
    return updated;
};

vehiculeSchema.statics.deletevehicule = async function (idint) {
    const deleted = await this.findOneAndDelete({ idint });
    if (!deleted) throw new Error('vehicule not found to delete');
    return deleted;
};

const vehicule = mongoose.models.vehicule || mongoose.model('vehicule', vehiculeSchema);

module.exports = vehicule;
