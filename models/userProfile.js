// Importar mongoose para trabajar con MongoDB
const mongoose = require('mongoose');

// Esquema para el contador autoincremental
// Este esquema maneja los contadores para IDs únicos
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Identificador único del contador
  seq: { type: Number, default: 0 } // Valor del contador, inicia en 0
});

// Crear o reutilizar el modelo Counter para manejar autoincremento
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Definir el esquema principal para el perfil de usuario
// Este esquema define la estructura de datos para los perfiles de usuario en la base de datos
const userProfileSchema = new mongoose.Schema({
    profile_id: { // ID único autoincremental del perfil de usuario
      type: Number,
      unique: true
    },
    profile: { // Nombre o descripción del perfil
      type: String,
      required: true,
      trim: true
    }
  },{ timestamps: true} // Agregar campos createdAt y updatedAt automáticamente
  );

// Hook pre-save para establecer el profile_id automáticamente
// Este hook se ejecuta antes de guardar un nuevo perfil de usuario
userProfileSchema.pre('save', async function(next) {
     if (this.isNew) {
         try {
             const counter = await Counter.findByIdAndUpdate(
                 'profile_id',
                 { $inc: { seq: 1 } },
                 { new: true, upsert: true }
             );
             this.profile_id = counter.seq;
         } catch (error) {
             return next(error);
         }
     }
     next();
 });

// Métodos estáticos para mantener consistencia en la API
// Estos métodos permiten interactuar con el modelo de manera uniforme

// Método para crear un nuevo perfil de usuario
userProfileSchema.statics.create = async function(data) {
     try {
         const userProfile = new this(data);
         await userProfile.save();
         return {
             profile_id: userProfile.profile_id,
             profile: userProfile.profile
         };
     } catch (error) {
         throw new Error(`Error creating user profile: ${error.message}`);
     }
     };

    // Método para obtener todos los perfiles de usuario ordenados por nombre
    userProfileSchema.statics.findAll = async function() {
     try {
         const profiles = await this.find().sort({ profile: 1 });
         return profiles.map(profile => ({
             profile_id: profile.profile_id,
             profile: profile.profile
         }));
     } catch (error) {
         throw new Error(`Error retrieving user profiles: ${error.message}`);
     }
 };

// Método para buscar un perfil de usuario específico por su profile_id
userProfileSchema.statics.findById = async function(profile_id) {
     try {
         const profile = await this.findOne({ profile_id });
         if (!profile) {
             return null;
         }
         return {
             profile_id: profile.profile_id,
             profile: profile.profile
         };
     } catch (error) {
         throw new Error(`Error retrieving user profile: ${error.message}`);
     }
 };

// Método para buscar perfiles de usuario por término de búsqueda en el nombre del perfil
userProfileSchema.statics.searchByDescription = async function(searchTerm) {
     try {
         const profiles = await this.find({
             profile: { $regex: searchTerm, $options: 'i' }
         }).sort({ profile: 1 });
         return profiles.map(profile => ({
             profile_id: profile.profile_id,
             profile: profile.profile
         }));
     } catch (error) {
         throw new Error(`Error searching user profiles: ${error.message}`);
     }
 };

// Método para actualizar un perfil de usuario existente
userProfileSchema.statics.update = async function(profile_id, data) {
     try {
         const profile = await this.findOneAndUpdate(
             { profile_id },
             data,
             { new: true, runValidators: true }
         );
         if (!profile) {
             return null;
         }
         return {
             profile_id: profile.profile_id,
             profile: profile.profile
         };
     } catch (error) {
         throw new Error(`Error updating user profile: ${error.message}`);
     }
 };

// Método para eliminar un perfil de usuario por su ID
// Verifica que el perfil existe antes de eliminarlo
userProfileSchema.statics.delete = async function(profile_id) {
     try {
         const profile = await this.findOneAndDelete({ profile_id });
         if (!profile) {
             return null;
         }
         return {
             profile_id: profile.profile_id,
             profile: profile.profile
         };
     } catch (error) {
         throw new Error(`Error deleting user profile: ${error.message}`);
     }
 };

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
  


