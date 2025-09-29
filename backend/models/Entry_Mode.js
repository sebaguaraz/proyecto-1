const db = require("./db");


const Entry_Mode = {
    async findByName (entry_mode) {
        const query = "SELECT id FROM entry_modes WHERE name = ?"; //db debe trabajar con promesas y no calllback porque db.query es asincrono y retorna una promesa
        const [result] = await db.query(query,[entry_mode]);
        return result[0] || null;
    }
};


module.exports = Entry_Mode