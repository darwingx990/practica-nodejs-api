const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

const incidentSchema = new mongoose.Schema(
  {
    idint: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

incidentSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        "incident_id",
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.idint = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else next();
});

incidentSchema.statics.createIncident = async function (data) {
  try {
    const incident = new this(data);
    await incident.save();
    return incident;
  } catch (error) {
    throw new Error(`Error creating incident: ${error.message}`);
  }
};

incidentSchema.statics.findAll = async function () {
  try {
    return await this.find().sort({ idint: 1 });
  } catch (error) {
    throw new Error(`Error finding incidents: ${error.message}`);
  }
};

incidentSchema.statics.findByIdInt = async function (idint) {
  const incident = await this.findOne({ idint });
  if (!incident) throw new Error("Incident not found");
  return incident;
};

incidentSchema.statics.updateIncident = async function (idint, data) {
  const updated = await this.findOneAndUpdate({ idint }, data, {
    new: true,
  });
  if (!updated) throw new Error("Incident not found to update");
  return updated;
};

incidentSchema.statics.deleteIncident = async function (idint) {
  const deleted = await this.findOneAndDelete({ idint });
  if (!deleted) throw new Error("Incident not found to delete");
  return deleted;
};

const Incident =
  mongoose.models.Incident || mongoose.model("Incident", incidentSchema);

module.exports = Incident;
