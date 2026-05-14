const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// TESTE
app.get("/teste", (req, res) => {
    res.json({ ok: true, db: "manual_skatista" });
});

// CADASTRO COMPLETO
app.post("/usuarios", (req, res) => {
    console.log("=".repeat(50));
    console.log("📥 RECEBI DADOS:", req.body);
    
    const { nome, email, senha, nivel_id, objetivo_id, tempo_id } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Campos obrigatórios" });
    }
    
    const sql = `
        INSERT INTO usuarios 
        (nome, email, senha, nivel_id, objetivo_id, tempo_id) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [nome, email, senha, nivel_id, objetivo_id, tempo_id], (err, result) => {
        if (err) {
            console.error("❌ ERRO:", err.message);
            return res.status(500).json({ erro: err.message });
        }
        
        console.log("✅ USUÁRIO CADASTRADO! ID:", result.insertId);
        console.log("=".repeat(50));
        
        res.status(201).json({ 
            ok: true, 
            id: result.insertId,
            mensagem: "Cadastrado com sucesso!" 
        });
    });
});

// OPÇÕES PARA CADASTRO
app.get("/opcoes-cadastro", (req, res) => {
    const sqlNiveis = "SELECT id, descricao FROM nivel_skate";
    const sqlObjetivos = "SELECT id, descricao FROM objetivo_skate";
    const sqlTempos = "SELECT id, descricao FROM tempo_skate";

    db.query(sqlNiveis, (err1, niveis) => {
        if (err1) return res.status(500).json({ erro: err1.message });

        db.query(sqlObjetivos, (err2, objetivos) => {
            if (err2) return res.status(500).json({ erro: err2.message });

            db.query(sqlTempos, (err3, tempos) => {
                if (err3) return res.status(500).json({ erro: err3.message });

                res.json({
                    niveis: niveis,
                    objetivos: objetivos,
                    tempos: tempos
                });
            });
        });
    });
});

// BUSCAR USUÁRIOS
app.get("/usuarios", (req, res) => {
    db.query("SELECT * FROM usuarios", (err, result) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        console.log("📊 Usuários:", result.length);
        res.json(result);
    });
});

// TEMPOS
app.get("/tempos", (req, res) => {
    db.query("SELECT * FROM tempo_skate", (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(result);
    });
});

// NÍVEIS
app.get("/niveis", (req, res) => {
    db.query("SELECT * FROM nivel_skate", (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(result);
    });
});

// OBJETIVOS
app.get("/objetivos", (req, res) => {
    db.query("SELECT * FROM objetivo_skate", (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(result);
    });
});

// INICIAR
const PORT = 3000;
app.listen(PORT, () => {
    console.log("🚀 Rodando na porta", PORT);
    console.log("📋 Teste: http://localhost:" + PORT + "/teste");
});

app.post("/login", (req, res) => {
    console.log("📥 LOGIN:", req.body.email);
    
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, result) => {
        if (err) {
            console.error("❌ Erro no login:", err.message);
            return res.status(500).json({ erro: "Erro interno" });
        }

        if (result.length > 0) {
            const usuario = result[0];
            console.log("✅ Login OK:", usuario.nome);
            
            // Retornar dados do usuário (sem a senha)
            res.json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            });
        } else {
            console.log("❌ Credenciais inválidas");
            res.status(401).json({ erro: "Email ou senha inválidos" });
        }
    });
});