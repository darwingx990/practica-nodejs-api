const mongoose = require("mongoose"); // Import mongoose

// Schema for counter functionality
const counterSchema = new mongoose.Schema({
  // Schema for counter
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

// Main schema for AccesoSalida
const cellSchema = new mongoose.Schema({
  idint: {
    type: Number,
    unique: true,
  },

  type: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    required: true,
  },
});

// Pre-save hook to auto-increment idint
cellSchema.pre("save", async function (next) {
  // Pre-save hook to auto-increment idint
  if (this.isNew) {
    // Si la celda es nueva
    try {
      const counter = await Counter.findByIdAndUpdate(
        // Actualizar el contador
        "idint_cell", // ID del contador
        { $inc: { seq: 1 } }, // Incrementar el contador en 1
        { new: true, upsert: true } // Crear el contador si no existe
      );
      this.idint = counter.seq; // Asignar el nuevo idint
      next(); // Continuar con la operación
    } catch (error) {
      // En caso de error
      next(error); // Lanzar el error
    }
  } else {
    next(); // Continuar con la operación si la celda no es nueva
  }
});

//crear

cellSchema.satatics.createCell = async function (data) {
  try {
    const newCell = new this(data); // Crear una nueva instancia de la celda
    return await newCell.save(); // Guardar la nueva celda en la base de datos
  } catch (error) {
    throw new Error(`Error creating cell: ${error.message}`); // Lanzar un error
  }
};

// buscar celda

cellSchema.statics.findCell = async function () {
  // Buscar todas las celdas
  try {
    return await this.find(); // Devolver todas las celdas
  } catch (error) {
    // En caso de error
    new Error(`Error finding cell: ${error.message}`); // Lanzar un error
  }
};

// actualizar celda

cellSchema.statics.updateCell = async function (indint, data) {
  try {
    const cell = await this.findOneAndUpdate({ indint }, data, {
      new: true,
      runValidators: true,
    });
    return cell;
  } catch (error) {
    throw new Error(`Error updating cell: ${error.message}`);
  }
};

const cell = mongoose.models.cell || mongoose.model("cell", cellSchema);

module.exports = cell;
