const db = require('../config/db');
const login = require('../middleware/login');

module.exports = {

    async lastid(req, res){
        try {
            let lastid = await db.query('SELECT MAX(id) AS last_id FROM atendimentos');
            let retorno = lastid[0]
            let retornofinal = retorno[0]["last_id"];
            let resultado= await db.query('SELECT * FROM atendimentos where id = ?',[retornofinal]);
            res.json(resultado[0]);
        } catch (error) {
            console.log(error);
        }
    },

    async insert(req, res){

        
        try {
            let datas2 = {  
                "id_usuario": req.body.usuario,
                "id_atendimento":req.body.atendimento,
                "status_tarefa": "agendado",
                "id_tipo_atendimento": req.body.servico,
                "abertura": req.body.abertura,  
                "data": req.body.data,  
                "hora": req.body.hora,  
                "prioridade": req.body.prioridade,  
                "revisada": 0 
                }

            let response = await db.query('INSERT INTO tarefas SET ?', [datas2]);
            
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
            "id_usuario": req.body.usuario,
            "id_atendimento":req.body.atendimento,
            "id_tipo_atendimento": req.body.servico,
            "abertura": req.body.abertura,  
            "data": req.body.data,  
            "hora": req.body.hora,  
            "prioridade": req.body.prioridade,  
            "revisada": req.body.revisada
        }

        try {
            let response = await db.query('UPDATE tarefas SET ? WHERE id_tarefa = ?', [datas, id]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    } //FIM UPDATE 
    
     //INICIO UPDATE
     ,
     async confirmar(req, res){
         let id = req.params.id;
         let nivel = req.body.nivel;
         var status = "aguardando";
         var revisada = false;
         
         if(nivel =="administrador"){
            var status = "concluido";
            var revisada = true;
         }
         else if(nivel =="administrativo"){
            var status = "revisado";
            var revisada = true;
         }

 
         let datas = {
         "conclusao": req.body.conclusao ,
         "horario_conclusao": req.body.hora ,
         "revisada": revisada ,
         "status_tarefa": status 
         }
 
         try {
             let response = await db.query('UPDATE tarefas SET ? WHERE id_tarefa = ?', [datas, id]);
             res.json(response);
         } catch (error) {
             console.log(error);
         }
     } //FIM UPDATE 
    
    //INICIO LISTAR TODOS
    ,
    async findAll(req, res){
        try {
            let response = await db.query();
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR TODOS
    
    //FIM LISTAR POR ATENDIMENTO
    ,
    async findByAtendimento(req, res){
        let id = req.params.id;
        try {
            let response = await db.query(`SELECT 
            tarefas.id_tarefa,
            tarefas.id_atendimento,
            usuarios.nome,
            tipos_atendimentos.nome_atendimento,
            tarefas.status_tarefa,
            tarefas.abertura,
            tarefas.data,
            tarefas.hora,
            tarefas.revisada,
            tarefas.conclusao,
            tarefas.horario_conclusao,
            clientes.nome_cliente,
            clientes.telefone_cliente,
            clientes.email_cliente,
            clientes.responsavel,
            clientes.endereco
                        FROM tarefas 
                        INNER JOIN atendimentos ON tarefas.id_atendimento = atendimentos.id
                        INNER JOIN usuarios ON tarefas.id_usuario = usuarios.id
                        INNER JOIN clientes ON atendimentos.id_cliente = clientes.id 
                        INNER JOIN tipos_atendimentos ON atendimentos.id_tipo_atendimento= tipos_atendimentos.id
                        WHERE atendimentos.id = ${id}
                        `);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }
    //FIM LISTAR POR ATENDIMENTO

    //INICIO LISTAR POR ID
    ,
    async findByUser(req, res){
        let id = req.params.id;
        try {
            let response = await db.query(`
            
SELECT 
tarefas.id_tarefa,
tarefas.id_atendimento,
usuarios.nome,
tipos_atendimentos.nome_atendimento,
tarefas.status_tarefa,
tarefas.abertura,
tarefas.data,
tarefas.hora,
tarefas.revisada,
tarefas.conclusao,
tarefas.horario_conclusao,
clientes.nome_cliente,
clientes.telefone_cliente,
clientes.email_cliente,
clientes.responsavel,
clientes.endereco
            FROM tarefas 
            INNER JOIN atendimentos ON tarefas.id_atendimento = atendimentos.id
            INNER JOIN usuarios ON tarefas.id_usuario = usuarios.id
            INNER JOIN clientes ON atendimentos.id_cliente = clientes.id 
            INNER JOIN tipos_atendimentos ON atendimentos.id_tipo_atendimento= tipos_atendimentos.id
            WHERE usuarios.id = ${id} order by tarefas.data desc`);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
        }
    }//FIM LISTAR POR ID

    ,
    async findByTarefa(req, res){
        let id = req.params.id;
        try {
            let response = await db.query(`
            
SELECT 
tarefas.id_tarefa,
tarefas.id_atendimento,
usuarios.nome,
tipos_atendimentos.nome_atendimento,
tarefas.id_tipo_atendimento,
tarefas.id_usuario,
tarefas.status_tarefa,
tarefas.abertura,
tarefas.data,
tarefas.hora,
tarefas.revisada,
tarefas.conclusao,
tarefas.horario_conclusao,
clientes.nome_cliente,
clientes.telefone_cliente,
clientes.email_cliente,
clientes.responsavel,
clientes.endereco
            FROM tarefas 
            INNER JOIN atendimentos ON tarefas.id_atendimento = atendimentos.id
            INNER JOIN usuarios ON tarefas.id_usuario = usuarios.id
            INNER JOIN clientes ON atendimentos.id_cliente = clientes.id 
            INNER JOIN tipos_atendimentos ON atendimentos.id_tipo_atendimento= tipos_atendimentos.id
            WHERE tarefas.id_tarefa = ${id}`);
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
            let response = await db.query(`DELETE FROM tarefas WHERE id_tarefa = ${id}`);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }


    
}



