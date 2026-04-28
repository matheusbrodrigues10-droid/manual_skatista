const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "manual_skatista"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar:", err.message);
        return;
    }
    console.log("✅ Conectado ao manual_skatista");
});

module.exports = db;