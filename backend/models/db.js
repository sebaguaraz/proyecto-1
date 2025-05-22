const mysql = require('mysql2'); // Importa la librería para hablar con MySQL
const dotenv = require('dotenv'); // Importa dotenv para leer el archivo .env

dotenv.config(); // Carga las variables del archivo .env

// Crea una instancia y configura la conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,       // Dirección del servidor de la base de datos (ej: 'localhost')
    user: process.env.DB_USER,       // Usuario para conectarse a la base de datos (ej: 'root')
    password: process.env.DB_PASSWORD, // Contraseña de ese usuario
    database: process.env.DB_NAME      // Nombre de la base de datos específica (ej: 'musicalendaria_db')
});

// Intenta conectar y muestra un mensaje en consola
db.connect(err => {
    if (err) {
        // Si hay un error, lo muestra en la consola
        console.error('Error de conexión a la base de datos:', err);
    } else {
        // Si todo va bien, avisa que se conectó
        console.log('Conectado a la base de datos');
    }
});

// Exporta el objeto 'db' para que otros archivos (los modelos) puedan usarlo
module.exports = db;


