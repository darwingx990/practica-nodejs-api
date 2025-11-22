const incidencyReports = require('../models/incidencyReports.js');

// Validate Create method (Create a new incidency report)
const create = async (req, res) => {
    try {

        const {  } = req.body;
        // if (!descripcion){
        //     return res.status(400).json({
        //         success: false,
        //         message: 'La descripción es requerida'
        //     });
        // }
        if ( !data ) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        //invocar el metodo create del modelo
        // Call the create method of the model
        const incidencyReport = await incidencyReports.create({ data }); 
        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: incidencyReport
        });
    }catch (error){
        console.error('Error to create the report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal error with creating the report on the server side.',
            data: error.message
        });
    }
};



// Exporting the create function to be used in the controller
module.exports = {
    create
};


