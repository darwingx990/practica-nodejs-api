const express = require('express');
const router = express.Router();
const incidencyReportsController = require('../controllers/incidencyReportsController');

// Defining CRUD routes for incidency reports
router.post('/', incidencyReportsController.create); // Create a new incidency report
router.get('/', incidencyReportsController.getAll); // Get all incidency reports
router.get('/:id', incidencyReportsController.getById); // Get a specific incidency report by ID
router.put('/:id', incidencyReportsController.update); // Update a specific incidency report by ID
router.delete('/:id', incidencyReportsController.deleteReport); // Delete a specific incidency report by ID

module.exports = router;