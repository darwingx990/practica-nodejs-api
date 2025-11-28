const express = require("express");
const router = express.Router();
const controller = require("../controllers/incidentController");

router.post("/incidents", controller.createIncident);
router.get("/incidents", controller.getAllIncidents);
router.put("/incidents/:idint", controller.updateIncident);
router.delete("/incidents/:idint", controller.deleteIncident);

router.post("/incident-reports", controller.createReport);
router.get("/incident-reports", controller.getAllReports);
router.put("/incident-reports/:idint", controller.updateReport);
router.delete("/incident-reports/:idint", controller.deleteReport);

module.exports = router;