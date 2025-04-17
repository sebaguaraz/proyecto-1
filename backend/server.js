const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { protect, authorize } = require('./middlewares/authMiddleware');

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);

app.get('/api/artistas', protect, authorize(['artist']), (req, res) => {
  res.send('Bienvenido al panel del artista');
});

app.get('/api/admin', protect, authorize(['admin']), (req, res) => {
  res.send('Bienvenido al panel de administrador');
});



app.listen(port, () => {
  
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


