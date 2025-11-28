const AccessExit = require("../models/accessExitModels");

// ====================================================
//  Crear un movimiento (entrada o salida)
// ====================================================
exports.createAccessExit = async (req, res) => {
  try {
    const data = req.body;

    // Validaciones básicas
    if (!data.movement || !data.door) {
      return res.status(400).json({
        message: "movement and door are required",
      });
    }

    // Crear usando tu método estático
    const accessExit = await AccessExit.createAccessExit(data);

    res.status(201).json(accessExit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Obtener todos los registros
// ====================================================
exports.getAllAccessExits = async (req, res) => {
  try {
    const accessExits = await AccessExit.findAll();
    res.status(200).json(accessExits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Obtener registros por tipo de movimiento (entrada/salida)
// ====================================================
exports.getByMovement = async (req, res) => {
  try {
    const { movement } = req.params;

    if (!movement) {
      return res
        .status(400)
        .json({ message: "The movement parameter is required" });
    }

    const results = await AccessExit.findByMovement(movement);

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Obtener por ID interno (idint autoincremental)
// ====================================================
exports.getByIdInt = async (req, res) => {
  try {
    const { idint } = req.params;

    const result = await AccessExit.findOne({ idint });

    if (!result) {
      return res.status(404).json({ message: "register not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Filtrar por fecha (rango)
// ====================================================
exports.getByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "the parameters start and end are required" });
    }

    const results = await AccessExit.find({
      dateTime: {
        $gte: new Date(start),
        $lte: new Date(end),
      },
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Actualizar un registro
// ====================================================
exports.updateAccessExit = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await AccessExit.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "register not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================================================
//  Eliminar un registro
// ====================================================
exports.deleteAccessExit = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await AccessExit.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "register not found" });
    }

    res.status(200).json({ message: "register deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
