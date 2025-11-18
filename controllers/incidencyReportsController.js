const incidencyReports = require('../models/incidencyReports.js');

// Validate Create method (Create a new incidency report)
const create = async (req, res) => {
    try {

        const {  } = req.body;
        if (!descripcion){
            return res.status(400).json({
                success: false,
                message: 'La descripción es requerida'
            });
        }

        //invocar el metodo create del modelo
        const tipo_usuario = await incidencyReports.create({ descripcion }); 

        res.status(201).json({
            success: true,
            message: 'Tipo Usuario registrado exitosamente',
            data: tipo_usuario
        });
    }catch (error){
        console.error('Error al crear tipo de usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            data: error.message
        });
    }
};



//exportar los controladores
module.exports = {
    create
};


