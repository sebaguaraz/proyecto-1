const jwt = require("jsonwebtoken");

// Middleware protect (idéntico a Gaby)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "No autorizado, token faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
    req.user = decoded; // Añade user al request (como Gaby)
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Middleware authorize (extra para roles)
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    next();
  };
};

module.exports = { protect, authorize };
/*
  actúa como una capa de seguridad que decide si una petición que llega a una ruta puede o no continuar hacia el controlador correspondiente.
 */