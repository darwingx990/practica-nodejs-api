require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Conexión a MongoDB

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
const cellRoutes = require("./routes/cellRoutes");
const accessExitRoutes = require("./routes/accessExitRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");

app.use("/api/cells", cellRoutes);
app.use("/api/access-exits", accessExitRoutes);
app.use("/api/user-profiles", userProfileRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor del Parqueadero funcionando 🚀");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
