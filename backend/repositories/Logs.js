const db = require("./db");

class LogsRepository {
    async create (user_id, action) {
        const query = "INSERT INTO logs (user_id, action) VALUES (?, ?)";
        const [result] = await db.query(query,[user_id, action])
        return result
    };

    async findAll  () {
        const query = "SELECT * FROM logs";
        const [results] = await db.query(query);
        return results || [];
    };
}



module.exports = new LogsRepository();