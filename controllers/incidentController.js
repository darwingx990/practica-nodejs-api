const Incident = require("../models/incidentModel");
const IncidentReport = require("../models/incidentReportModel");

const incidentController = {

  async createIncident(req, res) {
    try {
      const incident = await Incident.createIncident(req.body);
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

  async createReport(req, res) {
    try {
      const report = await IncidentReport.createReport(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllReports(req, res) {
    try {
      const reports = await IncidentReport.findAll();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateReport(req, res) {
    try {
      const { idint } = req.params;
      const updated = await IncidentReport.updateReport(Number(idint), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteReport(req, res) {
    try {
      const { idint } = req.params;
      const deleted = await IncidentReport.deleteReport(Number(idint));
      res.json(deleted);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = incidentController;
