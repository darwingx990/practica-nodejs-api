
// comentar cada proceso automaticamente para que sea entendible 
const mongoose = require('mongoose');
const { estimatedDocumentCount } = require('./userProfile');
const userProfile = require('./userProfile');

// Schema for counter

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

// definir el modelo Counter para manejar el contador autoincremental

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// definir el esquema para el user
const userSchema = new mongoose.Schema({
  id_user: {
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
  userProfileidint: {
    type: Number,
    required: true,
    ref: 'userProfile'
  }
}, {
  timestamps: true,
  collection: 'user' // 👈 fuerza el nombre 'user'
}
);



