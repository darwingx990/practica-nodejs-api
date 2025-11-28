const express = require("express");
const router = express.Router();

const controller = require("../controllers/accessExit.controller");

router.post("/", controller.createAccessExit);
router.get("/", controller.getAllAccessExits);
router.get("/movement/:movement", controller.getByMovement);
router.get("/idint/:idint", controller.getByIdInt);
router.get("/date-range", controller.getByDateRange);
router.put("/:idint", controller.updateByIdint);

module.exports = router;
