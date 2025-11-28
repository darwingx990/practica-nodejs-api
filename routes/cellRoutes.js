const express = require("express");
const router = express.Router();
const cellController = require("../controllers/cell.controller");

// Rutas
router.post("/", cellController.createCell);
router.get("/", cellController.getAllCells);
router.get("/:idint", cellController.getCellByIdint);
router.put("/:idint", cellController.updateCell);

module.exports = router;
