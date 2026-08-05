const express = require('express');  
const dotenv = require('dotenv');   
const authRoutes = require('./routes/authRoutes');  
const userRoutes = require("./routes/userRoutes"); 
const artistRoutes = require("./routes/artistRoutes");
const actionRoutes = require("./routes/actionRoutes")
const eventRoutes = require("./routes/eventRoutes");
const cors = require('cors');       
const path = require('path');       

dotenv.config();  

const port = process.env.PORT || 3000;  

const app = express();  // Crea una instancia de la aplicación express.

app.use(cors());  // Usa el middleware 'cors' q permite que nuestro frontend (que podría estar en una dirección diferente) pueda enviarle peticiones a este servidor.

// Si la persona nos envía información en formato JSON (que es como hablamos con nuestro frontend),
// este traductor la convierte a un formato que JavaScript entienda fácilmente.
app.use(express.json());

// Servir archivos estáticos del frontend al navegador
// Esto le dice a Express que sirva los archivos de tu carpeta 'frontend'
// cuando se acceda a ellos desde el navegador.
// Asume que 'backend' y 'frontend' son carpetas hermanas.
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);  
app.use("/api/users", userRoutes); 
app.use("/api/artists", artistRoutes);
app.use("/api/actions", actionRoutes)
app.use("/api/events", eventRoutes)

app.listen(port, () => {  
  console.log(`Servidor corriendo en http://localhost:${port}`);  
  console.log(`Frontend debería estar accesible en http://localhost:${port}`);
});
