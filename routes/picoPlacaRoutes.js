// routes/picoPlacaRoutes.js
import express from 'express';
import { createPicoPlaca, getPicoPlaca, updatePicoPlaca, deletePicoPlaca } from '../controllers/picoPlacaController.js';

const router = express.Router();

router.post('/', createPicoPlaca);
router.get('/', getPicoPlaca);
router.put('/:id', updatePicoPlaca);
router.delete('/:id', deletePicoPlaca);

export default router;