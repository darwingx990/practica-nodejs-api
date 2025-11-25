// models/incidencyReports.js
const mongoose = require('mongoose');

// Schema for counter functionality to auto-increment idint
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Main schema for IncidencyReports
const incidencyReportsSchema = new mongoose.Schema({
    idint: {
        type: Number,
        unique: true
    },
    date: {
        type: Date,
        required: true
    },
    VehiculeId: {
        Number
    },
    IncidencyId: {
        type: Number,
        required: true
    }
}, { timestamps: true }
);

// Pre-save hook to auto-increment idint beofore saving a new incidency report.
incidencyReportsSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                'idint',
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.idint = counter.seq;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Create a new user profile function
incidencyReportsSchema.statics.create = async function (data) {
    try {
        const report = new this(data);
        await report.save();
        return {
            idint: report.idint,
            date: report.date,
            VihiculeId: report.VihiculeId,
            incidencyId: report.incidencyId
        };
    } catch (error) {
        throw new Error(`There was an error creating the report: ${error.message}`);
    }
};

// Function to get all the reports
incidencyReportsSchema.statics.findAll = async function () {

    try {
        const report = await this.find().sort({ idint: 1 });
        return report.map(report => ({
            idint: report.idint,
            date: report.date,
            VihiculeId: report.VihiculeId,
            incidencyId: report.incidencyId
        }));
    } catch (error) {
        throw new Error(`Error when getting the reports: ${error.message}`);
    }
};

// Find one element by idint
incidencyReportsSchema.statics.findById = async function (idint) {
    try {
        const report = await this.findOne({ idint });
        if (!report) {
            throw new Error('Report not found');
        }
        return {
            idint: report.idint,
            date: report.date,
            VihiculeId: report.VihiculeId,
            incidencyId: report.incidencyId
        };
    } catch (error) {
        throw new Error(`Error when gettingh the report: ${error.message}`);
    }
};

// incidencyReportsSchemaema.statics.searchByDescription = async function (searchTerm) {
//     try {
//         const perfiles = await this.find({
//             perfil: { $regex: searchTerm, $options: 'i' }
//         }).sort({ perfil: 1 });
//         return perfiles.map(perfil => ({
//             idint: perfil.idint,
//             perfil: perfil.perfil
//         }));
//     } catch (error) {
//         throw new Error(`Error al buscar perfiles de usuario: ${error.message}`);
//     }
// };

// Function to update a report by idint
incidencyReportsSchema.statics.update = async function (idint, data) {
    try {
        const report = await this.findOneAndUpdate(
            { idint },
            data,
            { new: true }
        );
        if (!report) {
            throw new Error('Unable to find report to update');
        }
        return {
            idint: report.idint,
            report: report.report
        };
    } catch (error) {
        throw new Error(`Error to update the report: ${error.message}`);
    }
};

// Function to delete a report by idint
incidencyReportsSchema.statics.delete = async function (idint) {

    // Verify if the report exists before deleting it.
    try {
        const report = await this.findOneAndDelete({ idint });
        if (!report) {
            throw new Error('Report not found to delete');
        }
        return {
            idint: report.idint,
            date: report.date,
            VihiculeId: report.VihiculeId,
            incidencyId: report.incidencyId
        };
    } catch (error) {
        throw new Error(`Error to delete the report: ${error.message}`);
    }
};

// Export the model to be used in other parts of the application
const incidencyReports = mongoose.model('incidencyReports', incidencyReportsSchema);
module.exports = incidencyReports;