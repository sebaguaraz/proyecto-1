const db = require("./db");


class RoleRepository {
    async findByName (nombreRol) {
        const query = "SELECT * FROM roles WHERE name = ?"; //db debe trabajar con promesas y no calllback porque db.query es asincrono y retorna una promesa
        const [result] = await db.query(query,[nombreRol]);
        return result[0] || null;
    };

    async findById (id) {
        const query = "SELECT * FROM roles WHERE id = ?";
        const [result] = await db.query(query, [id]);
        return result[0] || null;
    };
};


module.exports = new RoleRepository();