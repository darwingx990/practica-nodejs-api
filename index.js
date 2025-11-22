// Import the required modules (Express, CORS, dotenv)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/databases');

// Import routes
const incidencyReportsRoutes = require('./routes/incidencyReports');
const incidencyReports = require('./models/incidencyReports');

// Create an Express application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Use routes
app.use('/api/incidency-reports', incidencyReportsRoutes);

// Root endpoint to verify API is running
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API of Parking Lot Project is running',
        version: '1.0.0',
        endpoints: {
            incidencyReports: {
                base: "/api/incidency-reports",
                endpoints: {
                    'POST /': 'Create a new incidency report',
                    'GET /': 'Get all incidency reports',
                    'GET /:id': 'Get a specific incidency report by ID',
                    'PUT /:id': 'Update a specific incidency report by ID',
                    'DELETE /:id': 'Delete a specific incidency report by ID'
                }
            }
        }
    });
});

// Middleware to handle not found routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        availableRoutes: [
            'GET /',
            '/api/IncidencyReports/*'
        ]
    });
});

// Middleware para manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);

    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error del servidor'
    });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor con conexión a la base de datos
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📚 Documentación de la API disponible en: http://localhost:${PORT}`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });

        // Manejar errores del servidor
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Puerto ${PORT} ya está en uso. Intenta con otro puerto.`);
                process.exit(1);
            } else {
                console.error('Error del servidor:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;