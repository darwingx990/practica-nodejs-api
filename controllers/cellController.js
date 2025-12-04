const Cell = require("../models/cellModel");

// ================= CONTROLLER ================= //

// Crear celda
const create = async (req, res) => {
  try {
    const data = req.body;
    const newCell = await Cell.create(data);

    res.status(201).json({
      message: "Cell created successfully",
      cell: newCell,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Obtener todas las celdas
const getAllCells = async (req, res) => {
  try {
    const cells = await Cell.findAll();

    res.status(200).json(cells);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Obtener una celda por idint
const getCellByIdint = async (req, res) => {
  try {
    const { idint } = req.params;

    const cell = await Cell.findByIdint(idint);

    if (!cell) {
      return res.status(404).json({
        message: "Cell not found",
      });
    }

    res.status(200).json(cell);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Actualizar una celda
const updateCell = async (req, res) => {
  try {
    const { idint } = req.params;
    const data = req.body;

    const updatedCell = await Cell.updateCell(idint, data);

    if (!updatedCell) {
      return res.status(404).json({
        message: "Cell not found",
      });
    }

    res.status(200).json({
      message: "Cell updated successfully",
      cell: updatedCell,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Eliminar celda
const deleteCell = async (req, res) => {
  try {
    const { idint } = req.params;

    const deletedCell = await Cell.deleteCell(idint);

    if (!deletedCell) {
      return res.status(404).json({
        message: "Cell not found",
      });
    }

    res.status(200).json({
      message: "Cell deleted successfully",
      cell: deletedCell,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Exportar todas las funciones del controlador
module.exports = {
  create,
  getAllCells,
  getCellByIdint,
  updateCell,
  deleteCell
};
