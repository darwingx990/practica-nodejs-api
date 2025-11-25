const incidencyReports = require('../models/incidencyReports.js');

// Validate Create method (Create a new incidency report)
const create = async (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Call the create method of the model
        const incidencyReport = await incidencyReports.create(data);
        res.status(201).json({
            success: true,
            message: 'Report created successfully',
            data: incidencyReport
        });
    } catch (error) {
        console.error('Error to create the report:', error);
        res.status(500).json({
            success: false,
            message: 'Internal error with creating the report on the server side.',
            data: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const reports = await incidencyReports.findAll();
        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving reports',
            error: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await incidencyReports.findById(parseInt(id));
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Report not found',
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const report = await incidencyReports.update(parseInt(id), data);
        res.status(200).json({
            success: true,
            message: 'Report updated successfully',
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating report',
            error: error.message
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await incidencyReports.delete(parseInt(id));
        res.status(200).json({
            success: true,
            message: 'Report deleted successfully',
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting report',
            error: error.message
        });
    }
};

// Exporting the functions to be used in the controller
module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: deleteReport
};


