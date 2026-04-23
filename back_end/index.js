const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   LOGIN
========================= */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

  db.query(sql, [email, senha], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).json({ erro: "Email ou senha inválidos" });
    }
  });
});

/* =========================
   CADASTRO
========================= */
app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

  db.query(sql, [nome, email, senha], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ mensagem: "Usuário criado" });
  });
});

/* =========================
   EDITAR USUARIO
========================= */
app.put("/usuarios/:id", (req, res) => {
  const { nome, email, senha } = req.body;
  const { id } = req.params;

  const sql = "UPDATE usuarios SET nome=?, email=?, senha=? WHERE id=?";

  db.query(sql, [nome, email, senha, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ mensagem: "Atualizado" });
  });
});

/* =========================
   TROCAR SENHA
========================= */
app.put("/trocar-senha", (req, res) => {
  const { id, novaSenha } = req.body;

  const sql = "UPDATE usuarios SET senha=? WHERE id=?";

  db.query(sql, [novaSenha, id], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ mensagem: "Senha alterada" });
  });
});

/* =========================
   RECUPERAR SENHA
========================= */
app.put("/recuperar", (req, res) => {
  const { email, novaSenha } = req.body;

  const sql = "UPDATE usuarios SET senha=? WHERE email=?";

  db.query(sql, [novaSenha, email], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ mensagem: "Senha redefinida" });
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});