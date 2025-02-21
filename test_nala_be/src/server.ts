import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/config';
import orgCardsRoutes from './routes/orgCard.route';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Registrar rutas
app.use('/api/v1/orgCards', orgCardsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
