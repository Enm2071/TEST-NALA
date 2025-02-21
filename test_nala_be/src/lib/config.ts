import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Conectando a MongoDB...', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
