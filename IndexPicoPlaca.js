// src/index.js (o index.js)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';

import picoPlacaRoutes from './routes/picoPlacaRoutes.js';
import parkingHistoryRoutes from './routes/parkingHistoryRoutes.js';

dotenv.config();

mongoose.set('strictQuery', true); // o false, según prefieras el warning

const app = express();
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión:', err));

app.use('/api/pico-placa', picoPlacaRoutes);
app.use('/api/parking-history', parkingHistoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});