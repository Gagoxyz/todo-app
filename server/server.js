// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // para parsear JSON

// Rutas de prueba
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
  })
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err));
