
// Importar mongoose para trabajar con MongoDB
const mongoose = require('mongoose');
// Importar el modelo de perfil de usuario para referencias
const PerfilUsuario = require('./userProfileModel');

// Esquema para el contador autoincremental
// Este esquema maneja los contadores para IDs únicos
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Identificador único del contador
  seq: { type: Number, default: 0 } // Valor del contador, inicia en 0
});

// Crear o reutilizar el modelo Counter para manejar autoincremento
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Definir el esquema principal para el usuario
// Este esquema define la estructura de datos para los usuarios en la base de datos
const userSchema = new mongoose.Schema({
  idint: { // ID único autoincremental del usuario
    type: Number,
    unique: true
  },
  document_type: { // Tipo de documento (ej: CC, TI, etc.)
    type: String,
    required: true,
    trim: true
  },
  document_number: { // Número del documento de identidad
    type: String,
    required: true,
    trim: true
  },
  first_name: { // Primer nombre del usuario
    type: String,
    required: true,
    trim: true
  },
  middle_name: { // Segundo nombre (opcional)
    type: String,
    trim: true
  },
  last_name: { // Primer apellido
    type: String,
    required: true,
    trim: true
  },
  second_last_name: { // Segundo apellido (opcional)
    type: String,
    trim: true
  },
  email: { // Correo electrónico único
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phone_number: { // Número de teléfono
    type: String,
    required: true,
    trim: true
  },
  profile_photo: { // URL o path de la foto de perfil (opcional)
    type: String,
    trim: true
  },
  status: { // Estado del usuario (activo, inactivo, etc.)
    type: String,
    required: true,
    trim: true
  },
  password: { // Contraseña encriptada
    type: String,
    required: true,
    trim: true
  },
  userProfileId: { // ID del perfil de usuario (referencia)
    type: Number,
    required: true,
    ref: 'userProfileModel'
  },
}, {
  timestamps: true, // Agregar campos createdAt y updatedAt automáticamente
  collection: 'user' // Nombre de la colección en MongoDB
}
);

// Hook pre-save para establecer el idint automáticamente
// Este hook se ejecuta antes de guardar un nuevo usuario
userSchema.pre('save', async function (next) {
  if (this.isNew) { // Solo para documentos nuevos
    try {
      // Incrementar el contador y obtener el nuevo valor
      const counter = await Counter.findByIdAndUpdate(
        'idint', // ID del contador
        { $inc: { seq: 1 } }, // Incrementar secuencia en 1
        { new: true, upsert: true } // Retornar el documento actualizado, crear si no existe
      );
      this.idint = counter.seq; // Asignar el ID autoincremental
    } catch (error) {
      return next(error); // Pasar el error al siguiente middleware
    }
  }
  next(); // Continuar con el guardado
});

// Métodos estáticos para mantener consistencia en la API
// Estos métodos permiten interactuar con el modelo de manera uniforme

// Método para crear un nuevo usuario
userSchema.statics.create = async function (data) {
  try {
    // Crear nueva instancia del modelo
    const user = new this(data);
    // Guardar en la base de datos
    await user.save();
    // Retornar los datos del usuario creado (sin campos sensibles como password en producción)
    return {
      idint: user.idint,
      document_type: user.document_type,
      document_number: user.document_number,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile_photo: user.profile_photo,
      status: user.status,
      password: user.password,
      userProfileId: user.userProfileId
    };
  } catch (error) {
    // Lanzar error con mensaje descriptivo
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// Método para obtener todos los usuarios ordenados por nombre
userSchema.statics.findAll = async function () {
  try {
    // Buscar todos los usuarios y ordenar por first_name ascendente
    const users = await this.find().sort({ first_name: 1 });
    // Mapear los resultados para retornar solo los campos necesarios
    return users.map(user => ({
      idint: user.idint,
      document_type: user.document_type,
      document_number: user.document_number,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile_photo: user.profile_photo,
      status: user.status,
      password: user.password,
      userProfileId: user.userProfileId
    }));
  } catch (error) {
    // Lanzar error si ocurre algún problema en la consulta
    throw new Error(`Error retrieving users: ${error.message}`);
  }
};

// Método para buscar un usuario específico por su idint
userSchema.statics.findById = async function (idint) {
  try {
    // Buscar un usuario por su ID único
    const user = await this.findOne({ idint });
    if (!user) return null; // Retornar null si no se encuentra
    // Retornar los datos del usuario encontrado
    return {
      idint: user.idint,
      document_type: user.document_type,
      document_number: user.document_number,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile_photo: user.profile_photo,
      status: user.status,
      password: user.password,
      userProfileId: user.userProfileId,
      birth_date: user.birth_date
    };
  } catch (error) {
    // Lanzar error si ocurre algún problema
    throw new Error(`Error retrieving user: ${error.message}`);
  }
};

// Método para buscar usuarios por término de búsqueda en campos específicos
userSchema.statics.searchByDescription = async function (searchTerm) {
  try {
    // Buscar usuarios donde el término coincida con nombre, apellido o email (insensible a mayúsculas)
    const users = await this.find({
      $or: [
        { first_name: { $regex: searchTerm, $options: 'i' } }, // Buscar en primer nombre
        { last_name: { $regex: searchTerm, $options: 'i' } }, // Buscar en primer apellido
        { email: { $regex: searchTerm, $options: 'i' } } // Buscar en email
      ]
    }).sort({ first_name: 1 }); // Ordenar por nombre ascendente
    // Mapear resultados para retornar datos consistentes
    return users.map(user => ({
      idint: user.idint,
      document_type: user.document_type,
      document_number: user.document_number,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile_photo: user.profile_photo,
      status: user.status,
      password: user.password,
      userProfileId: user.userProfileId,
      birth_date: user.birth_date
    }));
  } catch (error) {
    // Lanzar error si la búsqueda falla
    throw new Error(`Error searching users: ${error.message}`);
  }
};

// Método para actualizar un usuario existente
userSchema.statics.update = async function (idint, data) {
  try {
    // Buscar y actualizar el usuario por su ID, retornando el documento actualizado
    const user = await this.findOneAndUpdate(
      { idint }, // Filtro por ID
      data, // Datos a actualizar
      { new: true, runValidators: true } // Retornar documento actualizado y validar
    );
    if (!user) {
      // Lanzar error si no se encuentra el usuario
      throw new Error('User not found');
    }
    // Retornar los datos actualizados
    return {
      idint: user.idint,
      document_type: user.document_type,
      document_number: user.document_number,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      second_last_name: user.second_last_name,
      email: user.email,
      phone_number: user.phone_number,
      profile_photo: user.profile_photo,
      status: user.status,
      password: user.password,
      userProfileId: user.userProfileId
    };
  } catch (error) {
    // Lanzar error con mensaje descriptivo
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// Método para eliminar un usuario por su ID
userSchema.statics.delete = async function (idint) {
  try {
    // Buscar y eliminar el usuario, retornando el documento eliminado
    const result = await this.findOneAndDelete({ idint });
    if (!result) {
      // Lanzar error si no se encuentra el usuario
      throw new Error('User not found');
    }
    // Retornar los datos del usuario eliminado
    return {
      idint: result.idint,
      document_type: result.document_type,
      document_number: result.document_number,
      first_name: result.first_name,
      middle_name: result.middle_name,
      last_name: result.last_name,
      second_last_name: result.second_last_name,
      email: result.email,
      phone_number: result.phone_number,
      profile_photo: result.profile_photo,
      status: result.status,
      // password: result.password,
      userProfileId: result.userProfileId
    };
  } catch (error) {
    // Lanzar error con mensaje descriptivo
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

// Crear y exportar el modelo User basado en el esquema definido
const User = mongoose.model('User', userSchema);
module.exports = User;


