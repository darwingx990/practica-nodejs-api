const mongoose = require('mongoose');

// Counter schema to auto-increment idint per collection
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Vehicle schema (VEHICULO in the ERD)
const vehicleSchema = new mongoose.Schema({
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
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

// Auto-increment idint before save
vehicleSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    try {
        const counter = await Counter.findByIdAndUpdate(
            'vehicle_id',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.idint = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

vehicleSchema.statics.create = async function (data) {
    try {
        const vehicle = new this(data);
        await vehicle.save();
        return vehicle;
    } catch (error) {
        throw new Error(`Error creating vehicle: ${error.message}`);
    }
};

vehicleSchema.statics.findAll = async function () {
    try {
        return await this.find().sort({ idint: 1 });
    } catch (error) {
        throw new Error(`Error finding vehicles: ${error.message}`);
    }
};

vehicleSchema.statics.findByIdInt = async function (idint) {
    const vehicle = await this.findOne({ idint });
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
};

vehicleSchema.statics.updateVehicle = async function (idint, data) {
    const updated = await this.findOneAndUpdate({ idint }, data, {
        new: true,
        runValidators: true
    });
    if (!updated) throw new Error('Vehicle not found to update');
    return updated;
};

vehicleSchema.statics.deleteVehicle = async function (idint) {
    const deleted = await this.findOneAndDelete({ idint });
    if (!deleted) throw new Error('Vehicle not found to delete');
    return deleted;
};

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
