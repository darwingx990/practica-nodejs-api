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

// Middleware for global error handling
app.use((error, req, res, next) => {
    console.error('Error nor handled:', error);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Error in the server'
    });
});

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server with database connection
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running in the port: ${PORT}`);
            console.log(`📚 API documentation is available in: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`The port ${PORT} is already in used. Try again with another port.`);
                process.exit(1);
            } else {
                console.error('Server Error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Error when stating the Server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;