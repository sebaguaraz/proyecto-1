// Este archivo contiene nuestros "guardias de seguridad".
// Estos guardias revisan quién quiere pasar y si tienen permiso.

const jwt = require("jsonwebtoken"); // Traemos la herramienta para leer los "pasaportes especiales" (JWT).

// --- GUARDIA 1: 'protect' (Proteger la entrada) ---
// Este guardia se asegura de que la persona que quiere pasar tenga un "pasaporte válido".
const protect = (req, res, next) => {
    // La persona nos entrega su "pasaporte" en el encabezado de su solicitud.
    // Viene como "Bearer <el_pasaporte_aqui>", así que lo separamos para quedarnos solo con el pasaporte.
    const token = req.headers.authorization?.split(" ")[1];

    // Si la persona no nos da ningún pasaporte...
    if (!token) {
        // ...le decimos: "¡Alto! No tienes permiso porque te falta el pasaporte."
        return res.status(401).json({ error: "No autorizado, token faltante" });
    }

    try {
        // Intentamos leer el pasaporte. Necesitamos nuestro "sello secreto" (JWT_SECRET) para verificarlo.
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Si el sello coincide y no está vencido, el pasaporte es válido.
        // Si el pasaporte es válido, guardamos la información del usuario (su ID, nombre, rol)
        // para que las siguientes "recetas" (controladores) puedan saber quién es.
        req.user = decoded;
        // Le decimos al guardia: "Todo bien, ¡deja pasar a la siguiente parte de la receta!"
        next();
    } catch (error) {
        // Si el pasaporte está dañado, no tiene el sello correcto, o está vencido...
        res.status(401).json({ error: "Token inválido" }); // ...le decimos: "¡Alto! Tu pasaporte no sirve."
    }
};

// --- GUARDIA 2: 'authorize' (Autorizar por rol) ---
// Este guardia es más especial. No solo ve el pasaporte, sino que revisa si la persona
// tiene el "rol" (el tipo de permiso) necesario para hacer lo que quiere.
// 'roles' es una lista de los roles que SÍ tienen permiso (ej. ['admin', 'artist']).
const authorize = (roles) => {
    // Este guardia devuelve otra función, porque primero le decimos qué roles buscar,
    // y luego se aplica a la petición real.
    return (req, res, next) => {
        // Después de que el guardia 'protect' ya verificó el pasaporte,
        // 'req.user' ya tiene el rol de la persona.
        // Si el rol de la persona NO está en nuestra lista de 'roles' permitidos...
        if (!roles.includes(req.user.role)) {
            // ...le decimos: "¡Alto! No tienes el tipo de permiso adecuado para esto."
            return res.status(403).json({ error: "No tienes permiso" });
        }
        // Si el rol sí está permitido, le decimos: "Adelante, puedes pasar."
        next();
    };
};

// Al final, exportamos nuestros guardias para que otras partes del programa puedan usarlos.
module.exports = { protect, authorize };

/**
 * --- Notas Conceptuales para Entender Mejor ---
 *
 * 1.  **Middleware**: Imagina que una "petición" (cuando tu navegador le pide algo al servidor)
 * es como un cliente que entra a una tienda. Un "middleware" es como un empleado en la entrada
 * que hace una verificación antes de que el cliente pueda ir a la sección que quiere.
 * Los middlewares son funciones que se ejecutan *antes* de que la petición llegue a la "receta"
 * principal (el controlador) que realmente hace el trabajo.
 * - Pueden:
 * - Revisar cosas (como el token).
 * - Añadir información a la petición (como `req.user`).
 * - Detener la petición si algo no está bien.
 * - Pasar la petición al siguiente middleware o al controlador (`next()`).
 *
 * 2.  **`JWT` (JSON Web Token)**: Es como un "pasaporte digital" seguro.
 * Cuando inicias sesión, el servidor te da este pasaporte. Tú lo guardas y,
 * cada vez que le pides algo al servidor que requiere estar "logueado" (como ver tu perfil),
 * le envías tu pasaporte.
 * - **Verificación (`jwt.verify`)**: El servidor revisa el pasaporte para asegurarse de que es auténtico
 * (que no ha sido falsificado), que tiene el sello secreto correcto y que no está vencido.
 * - **`process.env.JWT_SECRET`**: Es la "clave secreta" que solo tu servidor conoce. Se usa para
 * "sellar" y "verificar" los pasaportes. Es súper importante que sea SECRETA y que no se comparta.
 *
 * 3.  **Encabezados de Autorización (`req.headers.authorization`)**:
 * Cuando envías un "pasaporte" (token) al servidor, lo envías en una parte especial
 * de la petición HTTP llamada "headers" (encabezados). Específicamente, en el encabezado
 * `Authorization`, que suele tener el formato `Bearer TU_TOKEN_AQUI`.
 *
 * 4.  **`req.user`**: Cuando el guardia `protect` verifica con éxito el pasaporte,
 * toma la información que venía dentro del pasaporte (ID del usuario, nombre, rol)
 * y la guarda en `req.user`. Así, cualquier "receta" (controlador) que venga después
 * ya sabe quién es el usuario y qué rol tiene, sin tener que verificar el pasaporte de nuevo.
 *
 * 5.  **`next()`**: Este es el comando mágico que un middleware usa para decir:
 * "Mi trabajo está hecho. Ahora, pasa esta petición al siguiente guardia o a la receta final".
 * Si un middleware no llama a `next()`, la petición se detiene ahí.
 *
 * 6.  **`res.status(401)` y `res.status(403)`**:
 * Son códigos de estado HTTP que el servidor envía para explicar por qué una petición falló.
 * - `401 Unauthorized`: "No autorizado". Significa que no tienes un pasaporte, o tu pasaporte no es válido.
 * El servidor no sabe quién eres, o no confía en tu identidad.
 * - `403 Forbidden`: "Prohibido". Significa que el servidor *sabe quién eres* (tienes un pasaporte válido),
 * pero *no tienes permiso* para hacer lo que intentas. Por ejemplo, eres un artista, pero intentas acceder
 * a una función de administrador.
 */