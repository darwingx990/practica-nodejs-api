
// comentar cada proceso automaticamente para que sea entendible 
const mongoose = require('mongoose');
const { estimatedDocumentCount } = require('./perfilusuario');
const PerfilUsuario = require('./perfilusuario');

// Schema for counter

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// definir el modelo Counter para manejar el contador autoincremental

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// definir el esquema para el usuario
const usuarioSchema = new mongoose.Schema({
    id_usuario: {
    type: Number,
    unique: true
  },
    tipo_documento: {
    type: String,
    required: true,
    trim: true
    },
    numero_documento: {
    type: String,
    required: true,
    trim: true
    },
    primer_nombre: {
    type: String,
    required: true,
    trim: true
    },
    segundo_nombre: {
    type: String,
    trim: true
    },
    primer_apellido: {
    type: String,
    required: true,
    trim: true
    },
    segundo_apellido: {
    type: String,
    trim: true
    },
    direccion_correo: { 
    type: String,
    required: true,
    trim: true,
    unique: true
    },
    numero_celular: {
    type: String,
    required: true,
    trim: true
    },
    foto_perfil: {
    type: String,
    trim: true
    },
    estado: {
    type: String,
    required: true,
    trim: true
    },
    clave: {
    type: String,
    required: true,
    trim: true
    },
    PerfilUsuarioidint: {
    type: Number,
    required: true,
    ref: 'PerfilUsuario'
    }
},{ timestamps: true,
    collection: 'usuario' // 👈 fuerza el nombre 'usuario'
}
);



