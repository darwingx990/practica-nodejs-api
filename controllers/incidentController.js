const Incident = require("../models/incidentModel");

const incidentController = {

  async create(req, res) {
    try {
      const incident = await Incident.create(req.body);
      res.status(201).json(incident);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllIncidents(req, res) {
    try {
      const incidents = await Incident.findAll();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateIncident(req, res) {
    try {
      const { idint } = req.params;
      const updated = await Incident.updateIncident(Number(idint), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteIncident(req, res) {
    try {
      const { idint } = req.params;
      const deleted = await Incident.deleteIncident(Number(idint));
      res.json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Note: IncidentReport model doesn't exist, so these functions are removed
  // If you need incident reports, create the model first or use incidencyReports instead
  async createReport(req, res) {
    res.status(501).json({ error: "IncidentReport model not implemented. Use /api/incidency-reports instead." });
  },

  async getAllReports(req, res) {
    res.status(501).json({ error: "IncidentReport model not implemented. Use /api/incidency-reports instead." });
  },

  async updateReport(req, res) {
    res.status(501).json({ error: "IncidentReport model not implemented. Use /api/incidency-reports instead." });
  },

  async deleteReport(req, res) {
    res.status(501).json({ error: "IncidentReport model not implemented. Use /api/incidency-reports instead." });
  },
};

module.exports = incidentController;
