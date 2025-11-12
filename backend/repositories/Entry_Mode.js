const db = require("./db");


class Entry_ModeRepository {
    async findByName (entry_mode) {
        const query = "SELECT id FROM entry_modes WHERE name = ?"; //db debe trabajar con promesas y no calllback porque db.query es asincrono y retorna una promesa
        const [result] = await db.query(query,[entry_mode]);
        return result[0] || null;
    };

};


module.exports = new Entry_ModeRepository();