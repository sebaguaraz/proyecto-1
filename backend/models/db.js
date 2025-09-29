const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Configuración simple de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

// Creamos un pool de conexiones (recomendado para apps web)
const pool = mysql.createPool(dbConfig);

// Probar la conexión al iniciar
async function conectar() {
    try {
        const conn = await pool.getConnection(); // Obtenemos una conexión del pool
        await conn.query('SELECT 1'); // Ejecutamos una consulta simple para verificar
        conn.release(); // Liberamos la conexión
        console.log('Conectado a la base de datos');
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
    }
}

conectar(); // Ejecutamos la prueba de conexión

// Exportamos el pool para usar en los modelos
module.exports = pool;
