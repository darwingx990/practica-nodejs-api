//comentar cada codigo automaticamente para que sea entendible

const mongoose = require('mongoose');

// autoincremental schema para el contador
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const perfilUsuarioSchema = new mongoose.Schema({
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
perfilUsuarioSchema.pre('save', async function (next) {
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

//funcion para crear un nuevo perfil de usuario metodo estadistico par mantener la API similar
perfilUsuarioSchema.statics.create = async function (data) {
    try {
        const perfilUsuario = new this(data);
        await perfilUsuario.save();
        return {
            idint: perfilUsuario.idint,
            perfil: perfilUsuario.perfil
        };
    } catch (error) {
        throw new Error(`Error al crear perfil de usuario: ${error.message}`);
    }
};

// funcion para obtener todos los perfiles de usuario metodo estadistico par mantener la API similar
perfilUsuarioSchema.statics.findAll = async function () {
    try {
        const perfiles = await this.find().sort({ perfil: 1 });
        return perfiles.map(perfil => ({
            idint: perfil.idint,
            perfil: perfil.perfil
        }));
    } catch (error) {
        throw new Error(`Error al obtener perfiles de usuario: ${error.message}`);
    }
};

//buscar byidint metodo estadistico par mantener la API similar sirve para buscar por idint

perfilUsuarioSchema.statics.findById = async function (idint) {
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
perfilUsuarioSchema.statics.searchByDescription = async function (searchTerm) {
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
perfilUsuarioSchema.statics.update = async function (idint, data) {
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
perfilUsuarioSchema.statics.delete = async function (idint) {
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

const PerfilUsuario = mongoose.model('PerfilUsuario', perfilUsuarioSchema);
module.exports = PerfilUsuario;



