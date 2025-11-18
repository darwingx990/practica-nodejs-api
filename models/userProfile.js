//comentar cada codigo automaticamente para que sea entendible

const mongoose = require('mongoose');

// autoincremental schema para el contador
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const userProfileSchema = new mongoose.Schema({
    idint: {
        type: Number,
        unique: true
    },
    perfil: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true }
);

//pre-save hook para establecer idint
userProfileSchema.pre('save', async function (next) {
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

//funcion para crear un nuevo perfil de user metodo estadistico par mantener la API similar
userProfileSchema.statics.create = async function (data) {
    try {
        const userProfile = new this(data);
        await userProfile.save();
        return {
            idint: userProfile.idint,
            perfil: userProfile.perfil
        };
    } catch (error) {
        throw new Error(`Error al crear perfil de user: ${error.message}`);
    }
};

// funcion para obtener todos los perfiles de user metodo estadistico par mantener la API similar
userProfileSchema.statics.findAll = async function () {
    try {
        const perfiles = await this.find().sort({ perfil: 1 });
        return perfiles.map(perfil => ({
            idint: perfil.idint,
            perfil: perfil.perfil
        }));
    } catch (error) {
        throw new Error(`Error al obtener perfiles de user: ${error.message}`);
    }
};

//buscar byidint metodo estadistico par mantener la API similar sirve para buscar por idint

userProfileSchema.statics.findById = async function (idint) {
    try {
        const perfil = await this.findOne({ idint });
        if (!perfil) {
            throw new Error('Perfil de user no encontrado');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al obtener perfil de user: ${error.message}`);
    }
};

//funcion searchbydescripcion metodo estadistico par mantener la API similar sirve para buscar por perfil
userProfileSchema.statics.searchByDescription = async function (searchTerm) {
    try {
        const perfiles = await this.find({
            perfil: { $regex: searchTerm, $options: 'i' }
        }).sort({ perfil: 1 });
        return perfiles.map(perfil => ({
            idint: perfil.idint,
            perfil: perfil.perfil
        }));
    } catch (error) {
        throw new Error(`Error al buscar perfiles de user: ${error.message}`);
    }
};

//funcion update perfil de user metodo estadistico par mantener la API similar sirve para actualizar el perfil de user
userProfileSchema.statics.update = async function (idint, data) {
    try {
        const perfil = await this.findOneAndUpdate(
            { idint },
            data,
            { new: true }
        );
        if (!perfil) {
            throw new Error('Perfil de user no encontrado para actualizar');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al actualizar perfil de user: ${error.message}`);
    }
};

//fucncion delete metodo estadistico par mantener la API similar sirve para eliminar el perfil de user
userProfileSchema.statics.delete = async function (idint) {
    //verifica si el perfil de user existe antes de eliminarlo
    try {
        const perfil = await this.findOneAndDelete({ idint });
        if (!perfil) {
            throw new Error('Perfil de user no encontrado para eliminar');
        }
        return {
            idint: perfil.idint,
            perfil: perfil.perfil
        };
    } catch (error) {
        throw new Error(`Error al eliminar perfil de user: ${error.message}`);
    }
};

const userProfile = mongoose.model('userProfile', userProfileSchema);
module.exports = userProfile;



