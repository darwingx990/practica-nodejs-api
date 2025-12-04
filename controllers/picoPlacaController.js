const PicoPlaca = require('../models/picoPlaca');

// CREATE - Crear nuevo registro
const createPicoPlaca = async (req, res) => {
    try {
        const { tipo_vehiculo, numero, dia } = req.body;
        
        const nuevoRegistro = new PicoPlaca({
            tipo_vehiculo,
            numero,
            dia
        });

        const registroGuardado = await nuevoRegistro.save();
        res.status(201).json({
            success: true,
            message: 'Registro creado exitosamente',
            data: registroGuardado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear registro',
            error: error.message
        });
    }
};

// READ - Obtener todos los registros
const getAllPicoPlaca = async (req, res) => {
    try {
        const registros = await PicoPlaca.find().sort({ idint: 1 });
        res.status(200).json({
            success: true,
            count: registros.length,
            data: registros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener registros',
            error: error.message
        });
    }
};

// READ - Obtener un registro por ID
const getPicoPlacaById = async (req, res) => {
    try {
        const { id } = req.params;
        const registro = await PicoPlaca.findOne({ idint: parseInt(id) });
        
        if (!registro) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: registro
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener registro',
            error: error.message
        });
    }
};

// UPDATE - Actualizar registro por ID
const updatePicoPlaca = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_vehiculo, numero, dia } = req.body;

        const registroActualizado = await PicoPlaca.findOneAndUpdate(
            { idint: parseInt(id) },
            { tipo_vehiculo, numero, dia },
            { new: true, runValidators: true }
        );

        if (!registroActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registro actualizado exitosamente',
            data: registroActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar registro',
            error: error.message
        });
    }
};

// DELETE - Eliminar registro por ID
const deletePicoPlaca = async (req, res) => {
    try {
        const { id } = req.params;
        const registroEliminado = await PicoPlaca.findOneAndDelete({ idint: parseInt(id) });

        if (!registroEliminado) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registro eliminado exitosamente',
            data: registroEliminado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar registro',
            error: error.message
        });
    }
};

module.exports = {
    createPicoPlaca,
    getAllPicoPlaca,
    getPicoPlacaById,
    updatePicoPlaca,
    deletePicoPlaca
};