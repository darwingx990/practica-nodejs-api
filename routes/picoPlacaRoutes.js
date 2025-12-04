// routes/picoPlacaRoutes.js
const express = require('express');
const { createPicoPlaca,
    getAllPicoPlaca,
    getPicoPlacaById,
    updatePicoPlaca,
    deletePicoPlaca} = require('../controllers/picoPlacaController');

const router = express.Router();

// CRUD Routes
router.post('/', createPicoPlaca);
router.get('/', getAllPicoPlaca);
router.get('/:id', getPicoPlacaById);
router.put('/:id', updatePicoPlaca);
router.delete('/:id', deletePicoPlaca);

module.exports = router;