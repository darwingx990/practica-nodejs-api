const IncidencyReport = require("../models/incidencyReports");

// Validate Create method (Create a new incidency report)
const create = async (req, res) => {
    try {
        const reportData = req.body;
        
        // Validaciones básicas
        if (!reportData.description) {
            return res.status(400).json({
                success: false,
                message: "description is required"
            });
        }

        const newReport = new IncidencyReport(reportData);
        await newReport.save();

        res.status(201).json({
            success: true,
            message: "Incidency report created successfully",
            data: newReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating incidency report",
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const reports = await IncidencyReport.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incidency reports",
            error: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await IncidencyReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incidency report not found"
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching incidency report",
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const report = await IncidencyReport.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incidency report not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Incidency report updated successfully",
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating incidency report",
            error: error.message
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await IncidencyReport.findByIdAndDelete(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Incidency report not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Incidency report deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting incidency report",
            error: error.message
        });
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    deleteReport
};
