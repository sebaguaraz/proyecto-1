const db = require("./db");


const Role = {
    findByName: (roleName, callback) => {
        const query = "SELECT id FROM roles WHERE name = ?";
        db.query(query,[roleName],(err,results) => {
            if(err) return callback(err,null);
            callback(null, results[0]);
        });
    }
};


module.exports = Role