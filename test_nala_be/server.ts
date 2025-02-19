import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/config';

dotenv.config();

// Conecta a MongoDB
connectDB();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de ejemplo
app.get('/', (req: Request, res: Response) => {
    res.send('¡Hola, mundo con TypeScript!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
