// Import the required modules (Express, CORS, dotenv)
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/databases');

// Import routes
const incidencyReportsRoutes = require('./routes/incidencyReports');
const cellRoutes = require('./routes/cellRoutes');
const accessExitRoutes = require('./routes/accessExitRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const picoPlacaRoutes = require('./routes/picoPlacaRoutes');
const parkingHistoryRoutes = require('./routes/parkingHistoryRoutes');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

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
app.use('/api/cells', cellRoutes);
app.use('/api/access-exits', accessExitRoutes);
app.use('/api/user-profiles', userProfileRoutes);
app.use('/api/pico-placa', picoPlacaRoutes);
app.use('/api/parking-history', parkingHistoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);

// Root endpoint to verify API is running
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API of Parking Lot Project is running',
        version: '1.0.0',
        endpoints: {
            incidencyReports: {
                base: "/api/incidency-reports",
                description: "Manage incidency reports",
                methods: ['POST', 'GET', 'GET /:id', 'PUT /:id', 'DELETE /:id']
            },
            cells: {
                base: "/api/cells",
                description: "Manage parking cells",
                methods: ['POST', 'GET', 'GET /:idint', 'PUT /:idint']
            },
            accessExits: {
                base: "/api/access-exits",
                description: "Manage access and exit records",
                methods: ['POST', 'GET', 'GET /movement/:movement', 'GET /idint/:idint', 'GET /date-range', 'PUT /:idint']
            },
            userProfiles: {
                base: "/api/user-profiles",
                description: "Manage user profiles",
                methods: ['POST', 'GET', 'GET /:idint', 'PUT /:idint']
            },
            picoPlaca: {
                base: "/api/pico-placa",
                description: "Manage pico y placa restrictions",
                methods: ['POST', 'GET', 'PUT /:id', 'DELETE /:id']
            },
            parkingHistory: {
                base: "/api/parking-history",
                description: "Manage parking history records",
                methods: ['POST', 'GET', 'GET /:id', 'GET /search', 'PUT /:id', 'DELETE /:id']
            },
            users: {
                base: "/api/users",
                description: "Manage users",
                methods: ['POST', 'GET', 'GET /search', 'GET /:id', 'PUT /:id', 'DELETE /:id']
            },
            incidents: {
                base: "/api/incidents",
                description: "Manage incidents and incident reports",
                methods: ['POST /incidents', 'GET /incidents', 'PUT /incidents/:idint', 'DELETE /incidents/:idint',
                    'POST /incident-reports', 'GET /incident-reports', 'PUT /incident-reports/:idint', 'DELETE /incident-reports/:idint']
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
            '/api/incidency-reports/*',
            '/api/cells/*',
            '/api/access-exits/*',
            '/api/user-profiles/*',
            '/api/pico-placa/*',
            '/api/parking-history/*',
            '/api/users/*',
            '/api/incidents/*'
        ]
    });
});

// Middleware for global error handling
app.use((error, req, res, next) => {
    console.error('Error not handled:', error);

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
                console.error(`The port ${PORT} is already in use. Try again with another port.`);
                process.exit(1);
            } else {
                console.error('Server Error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('Error when starting the Server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;