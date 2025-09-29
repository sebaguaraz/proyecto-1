const db = require("./db");


const Role = {
    async findByName (roleName) {
        const query = "SELECT id FROM roles WHERE name = ?"; //db debe trabajar con promesas y no calllback porque db.query es asincrono y retorna una promesa
        const [result] = await db.query(query,[roleName]);
        return result[0];
    }
};


module.exports = Role