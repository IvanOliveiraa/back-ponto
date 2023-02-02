const db = require('../config/db');
const login = require('../middleware/login');

module.exports = {
    async insert(req, res){
        let datas = {
         
        "nome_atendimento": req.body.nome 
        
        }

        try {
            let response = await db.query('INSERT INTO tipos_atendimentos SET ?', [datas]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    } //FIM INSERT 
    

    //INICIO UPDATE
    ,
    async update(req, res){
        let id = req.params.id;

        let datas = {
          "nome_atendimento": req.body.nome
        }

        try {
            let response = await db.query('UPDATE tipos_atendimentos SET ? WHERE id = ?', [datas, id]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    } //FIM UPDATE 
    
    
    //INICIO LISTAR TODOS
    ,
    async findAll(req, res){
        try {
            let response = await db.query('SELECT * FROM tipos_atendimentos order by id desc');
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
            let response = await db.query(`SELECT * FROM tipos_atendimentos WHERE id = ${id}`);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR POR ID
    
    
    //INICIO DELETE
    ,
    async delete(req, res){
        let id = req.params.id;

        try {
            let response = await db.query(`DELETE FROM tipos_atendimentos WHERE id = ${id}`);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }
}