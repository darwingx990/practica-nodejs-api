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

// funcion para obtener todos los perfiles de usuario metodo estadistico par mantener la API similar
// Function to get all the reports
incidencyReportsSchemaema.statics.findAll = async function () {

    try {
        const report = await this.find().sort({ idint: 1 });


        // const reports = await this.find().sort({});
        return reports.map(perfil => ({
            idint: reports.$inc,
            perfil: perfil.perfil
        }));
    } catch (error) {
        throw new Error(`Error when getting the reports: ${error.message}`);
    }
};

//buscar byidint metodo estadistico par mantener la API similar sirve para buscar por idint

incidencyReportsSchemaema.statics.findById = async function (idint) {
    try {
        const perfil = await this.findOne({ idint });
        if (!perfil) {
            throw new Error('Perfil de usuario no encontrado');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al obtener perfil de usuario: ${error.message}`);
    }
};

//funcion searchbydescripcion metodo estadistico par mantener la API similar sirve para buscar por perfil
incidencyReportsSchemaema.statics.searchByDescription = async function (searchTerm) {
    try {
        const perfiles = await this.find({
            perfil: { $regex: searchTerm, $options: 'i' }
        }).sort({ perfil: 1 });
        return perfiles.map(perfil => ({
            idint: perfil.idint,
            perfil: perfil.perfil
        }));
    } catch (error) {
        throw new Error(`Error al buscar perfiles de usuario: ${error.message}`);
    }
};

//funcion update perfil de usuario metodo estadistico par mantener la API similar sirve para actualizar el perfil de usuario
incidencyReportsSchemaema.statics.update = async function (idint, data) {
    try {
        const perfil = await this.findOneAndUpdate(
            { idint },
            data,
            { new: true }
        );
        if (!perfil) {
            throw new Error('Perfil de usuario no encontrado para actualizar');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al actualizar perfil de usuario: ${error.message}`);
    }
};

//fucncion delete metodo estadistico par mantener la API similar sirve para eliminar el perfil de usuario
incidencyReportsSchemaema.statics.delete = async function (idint) {
    //verifica si el perfil de usuario existe antes de eliminarlo
    try {
        const perfil = await this.findOneAndDelete({ idint });
        if (!perfil) {
            throw new Error('Perfil de usuario no encontrado para eliminar');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al eliminar perfil de usuario: ${error.message}`);
    }
};

const incidencyReports = mongoose.model('incidencyReports', incidencyReportsSchema);
module.exports = incidencyReports;



