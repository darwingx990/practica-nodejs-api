const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas CRUD para usuarios
router.post('/', userController.createUser);           // Crear usuario
router.get('/', userController.getAllUsers);           // Obtener todos los usuarios
router.get('/search', userController.searchUsers);     // Buscar usuarios
router.get('/:id', userController.getUserById);        // Obtener usuario por ID
router.put('/:id', userController.updateUser);         // Actualizar usuario
router.delete('/:id', userController.deleteUser);      // Eliminar usuario

module.exports = router;