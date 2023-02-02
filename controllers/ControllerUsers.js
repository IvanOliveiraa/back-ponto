const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async insert(req, res){
        var salt = bcrypt.genSaltSync(10);
        let hashedpassword = req.body.senha;
        //const hashedpassword =  await bcrypt.hashSync(req.body.senha, salt);
        let datas = {
          
        "cpf": req.body.cpf ,
        "email": req.body.email ,
        "nome": req.body.nome ,
        "senha": hashedpassword ,
        "nivel": req.body.nivel ,
        "telefone": req.body.telefone
        }

        try {
            let response = await db.query('INSERT INTO usuarios SET ?', [datas]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    } //FIM INSERT NORMAL
    

    //INICIO UPDATE
    ,
    async update(req, res){
        let id = req.params.id;

        var salt = bcrypt.genSaltSync(10);
        let hashedpassword = req.body.senha;
        //const hashedpassword =  await bcrypt.hashSync(req.body.senha, salt);


        let datas = {
          "cpf": req.body.cpf,
          "email": req.body.email,
          "nome": req.body.nome,
          "senha": hashedpassword,
          "nivel": req.body.nivel,
          "telefone": req.body.telefone
        }

        try {
            let response = await db.query('UPDATE usuarios SET ? WHERE id = ?', [datas, id]);
            res.send('update deu certo');
        } catch (error) {
            console.log(error);
            res.send('Erro no update');
        }
    } //FIM UPDATE 
    
     //INICIO LISTAR TODOS
     ,
     async SelectList(req, res){
         try {
             let response = await db.query('SELECT id, nome FROM `usuarios` order by id desc');
             res.json(response[0]);
         } catch (error) {
             console.log(error);
         }
     }//FIM LISTAR TODOS
    //INICIO LISTAR TODOS
    ,
    async findAll(req, res){
        try {
            let response = await db.query('SELECT * FROM usuarios order by id desc');
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR TODOS
    
    
    //INICIO LISTAR POR ID
    ,
    async findById(req, res){
        let id = req.params.id;
        try {
            let response = await db.query(`SELECT * FROM usuarios WHERE id = ? `,[id]);

           
            res.send(response[0]
            );
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR POR ID
    
    
    //INICIO DELETE
    ,
    
    async delete(req, res){
        let id = req.params.id;

        try {
            let response = await db.query(`DELETE FROM usuarios WHERE id = ${id}`);
            res.json(response);
            
        } catch (error) {
            console.log(error);
        }
    }//FIM DELETE
     
    
}