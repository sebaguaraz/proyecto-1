const AuthService = require("../services/authService");


exports.register = async (req, res) => {
    const { username, password } = req.body; // Datos que vienen del formulario


    // TRY/CATCH: los errores de "lógica de negocio" (como que el usuario ya exista o que el rol no exista) los manejo directamente con `return res.status(...)` porque son errores esperados que queremos comunicar al cliente de manera específica.
    // El bloque `catch` atrapa errores inesperados, como errores de conexión a la base de datos, errores de sintaxis, etc.

    try {
        const resultado = await AuthService.register(username, password);
        return res.status(resultado.status).json({ message: resultado.message });

    } catch (error) {
        console.error("Error inesperado en registro:", error);
        const status = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : "Error interno del servidor al actualizar el perfil.";
        return res.status(status).json({ message });
    }
};


exports.login = async (req, res) => {
    const { username, password } = req.body;  // Sacamos username y password que envió el cliente en la petición

    try {
        const resultado = await AuthService.login(username, password);
        return res.status(200).json(resultado);

    } catch (error) {
        // Errores del sistema (base de datos, etc.)
        console.error("Error inesperado en login:", error);
        const status = error && error.status ? error.status : 500;
        const message = error && error.message ? error.message : "Error interno del servidor al iniciar sesión.";
        return res.status(status).json({ message });
    }
};
