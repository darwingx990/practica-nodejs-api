import express from 'express';
import parkingHistoryController from '../controllers/parkingHistoryController.js';

const router = express.Router();

// Rutas para el CRUD de Historial de parqueo
router.post('/', parkingHistoryController.create);
router.get('/', parkingHistoryController.findAll);
router.get('/:id', parkingHistoryController.findById);
router.get('/search', parkingHistoryController.searchByDescription);
router.put('/:id', parkingHistoryController.update);
router.delete('/:id', parkingHistoryController.delete);

export default router;
