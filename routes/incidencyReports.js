const express = require('express'); //Calling express fraamework
const router = express.Router(); // Creating router instance
const incidencyReportsController = require('../controllers/incidencyReportsController'); //Importing controller

// Defining CRUD routes for incidency reports
router.post('/', incidencyReportsController.create); // Create a new incidency report
router.get('/', incidencyReportsController.getAll); // Get all incidency reports
router.get('/:id', incidencyReportsController.getById); // Get a specific incidency report by ID
router.put('/:id', incidencyReportsController.update); // Update a specific incidency report by ID
router.delete('/:id', incidencyReportsController.delete); // Delete a specific incidency report by ID

module.exports = router; // Exporting the router to be used in other parts of the application