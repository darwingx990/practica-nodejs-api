const express = require("express");
const router = express.Router();
const cellController = require("../controllers/cellController");

// Rutas
router.post("/", cellController.create);
router.get("/", cellController.getAllCells);
router.get("/:idint", cellController.getCellByIdint);
router.put("/:idint", cellController.updateCell);

module.exports = router;
