import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/config';
import orgCardsRoutes from './routes/orgCard.route';
import tiersRoutes from './routes/tiers.route';
import employeesRoutes from './routes/employee.route';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No autorizado por CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());


app.use('/api/v1/orgCards', orgCardsRoutes);
app.use('/api/v1/tiers', tiersRoutes);
app.use('/api/v1/employees', employeesRoutes);


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
