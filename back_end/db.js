const mysql = require("mysql2")

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "manualskatista_tcc"
})

module.exports = conexao