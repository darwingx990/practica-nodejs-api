// routes/picoPlacaRoutes.js
const express = require('express');
const { createPicoPlaca, getPicoPlaca, updatePicoPlaca, deletePicoPlaca } = require('../controllers/picoPlacaController');

const router = express.Router();

router.post('/', createPicoPlaca);
router.get('/', getPicoPlaca);
router.put('/:id', updatePicoPlaca);
router.delete('/:id', deletePicoPlaca);

module.exports = router;