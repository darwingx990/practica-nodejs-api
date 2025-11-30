const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');

router.post('/', vehiculeController.create);
router.get('/', vehiculeController.getAll);
router.get('/:idint', vehiculeController.getByIdint);
router.put('/:idint', vehiculeController.update);
router.delete('/:idint', vehiculeController.remove);

module.exports = router;
