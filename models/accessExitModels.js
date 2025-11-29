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
const accessExitSchema = new mongoose.Schema({
  idint: {
    type: Number,
    unique: true,
  },

  movement: {
    type: String,
    required: true,
    enum: ["entrance", "exit"],
    trim: true,
  },

  dateTime: {
    type: Date,
    default: Date.now,
  },

  door: {
    type: String,
    required: false,
    trim: true,
  },

  stayTime: {
    type: Number,
    required: false,
    trim: true,
  },

  vehiculeId: {
    type: Number,
    ref: 'vehicule',
    required: true,
    index: true
  }

});

// Pre-save hook to auto-increment idint
accessExitSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "idint",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.idint = counter.seq;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//method for recording an input and output

accessExitSchema.statics.create = async function (data) {
  try {
    const accessExit = new this(data);
    await accessExit.save();
    return accessExit;
  } catch (error) {
    throw new Error("Error creating accessExit:");
  }
};

//view all entries and exits

accessExitSchema.statics.findAll = async function () {
  try {
    const accessExit = await this.find().sort({ dateTime: -1 });
    return accessExit;
  } catch (error) {
    throw new Error(`Error finding accessExit: ${error.message}`);
  }
};

//search by input or output

accessExitSchema.statics.findByMovement = async function (idint) {
  try {
    const accessExit = await this.find({ idint });
    if (!accessExit) return null;
    return accessExit;
  } catch (error) {
    throw new Error(`Error finding accessExit: ${error.message}`);
  }
};

//update accessExit
accessExitSchema.statics.update = async function (idint, data) {
  try {
    const accessExit = await this.findOneAndUpdate({ idint }, data, {
      new: true,
      runValidators: true,
    });
    if (!accessExit) return null;
    return accessExit;
  } catch (error) {
    throw new Error(`Error updating accessExit: ${error.message}`);
  }
};

const AccessExit =
  mongoose.models.AccesoSalida ||
  mongoose.model("AccessExit", accessExitSchema);

module.exports = AccessExit;
