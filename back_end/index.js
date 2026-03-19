const express = require("express")
const app = express()
const db = require("./db")
const cors = require("cors")

app.use(express.json())
app.use(cors())

// INSERIR USUARIO
app.post("/usuarios", (req,res)=>{

    const {nome,email,senha} = req.body

    const sql = "INSERT INTO usuarios (nome,email,senha) VALUES (?,?,?)"

    db.query(sql,[nome,email,senha],(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("Usuario cadastrado")
        }
    })

})


// VISUALIZAR USUARIOS
app.get("/usuarios",(req,res)=>{

    const sql = "SELECT * FROM usuarios"

    db.query(sql,(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send(result)
        }
    })

})


// ATUALIZAR USUARIO
app.put("/usuarios/:id",(req,res)=>{

    const id = req.params.id
    const {nome,email,senha} = req.body

    const sql = "UPDATE usuarios SET nome=?, email=?, senha=? WHERE id=?"

    db.query(sql,[nome,email,senha,id],(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("Usuario atualizado")
        }
    })

})


// DELETAR USUARIO
app.delete("/usuarios/:id",(req,res)=>{

    const id = req.params.id

    const sql = "DELETE FROM usuarios WHERE id=?"

    db.query(sql,[id],(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("Usuario deletado")
        }
    })

})

app.listen(3001,()=>{
    console.log("Servidor rodando")
})