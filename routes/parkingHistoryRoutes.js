const express = require('express');
const parkingHistoryController = require('../controllers/parkingHistoryController');

const router = express.Router();

// Rutas para el CRUD de Historial de parqueo
router.post('/', parkingHistoryController.create);
router.get('/', parkingHistoryController.findAll);
router.get('/:id', parkingHistoryController.findById);
router.get('/search', parkingHistoryController.searchByTerm);
router.put('/:id', parkingHistoryController.update);
router.delete('/:id', parkingHistoryController.delete);

module.exports = router;
