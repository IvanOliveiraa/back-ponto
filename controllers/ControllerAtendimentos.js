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
        let datas1 = {  
        "id_cliente": req.body.cliente,
        "id_tipo_atendimento": req.body.servico,
        "status": "Aberto",  
        }
        
    
        try {
            let response1 = await db.query('INSERT INTO atendimentos SET ?', [datas1]);
            
            let lastid = await db.query('SELECT MAX(id) AS last_id FROM atendimentos');
            let retorno = lastid[0]
            let retornofinal = retorno[0]["last_id"];
            let datas2 = {  
                "id_usuario": req.body.usuario,
                "id_atendimento":retornofinal,
                "status_tarefa": "Aberta",
                "id_tipo_atendimento": req.body.servico,
                "abertura": req.body.abertura,  
                "data": req.body.data,  
                "hora": req.body.hora,  
                "prioridade": req.body.prioridade,  
                "revisada": 0,  
                }

            let response2 = await db.query('INSERT INTO tarefas SET ?', [datas2]);
            let response= [
                response1[0],
                response2[0]
            ]
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
        "nome": req.body.nome ,
        "email": req.body.email ,
        "telefone": req.body.telefone ,
        "responsavel": req.body.responsavel ,
        "endereco": req.body.endereco 
        }

        try {
            let response = await db.query('UPDATE clientes SET ? WHERE id = ?', [datas, id]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    } //FIM UPDATE 
    
    
    //INICIO LISTAR TODOS
    ,
    async findAll(req, res){
        try {
            let response = await db.query(`SELECT atendimentos.id,tarefas.id_tarefa,tarefas.status_tarefa, tipos_atendimentos.nome_atendimento, atendimentos.status, clientes.nome_cliente, usuarios.nome, tarefas.hora, tarefas.prioridade FROM atendimentos 
            INNER JOIN clientes ON atendimentos.id_cliente = clientes.id 
            INNER JOIN tarefas ON tarefas.id_atendimento= atendimentos.id
            INNER JOIN tipos_atendimentos ON atendimentos.id_tipo_atendimento= tipos_atendimentos.id
            INNER JOIN usuarios ON tarefas.id_usuario = usuarios.id where tarefas.status_tarefa!='concluido'order by atendimentos.id desc;`);
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
            let response = await db.query(`
            SELECT atendimentos.id, tipos_atendimentos.nome_atendimento, atendimentos.status, clientes.nome_cliente
            , clientes.telefone_cliente
            , clientes.email_cliente
            , clientes.responsavel
            , clientes.endereco
            FROM atendimentos 
            INNER JOIN clientes ON atendimentos.id_cliente = clientes.id 
            INNER JOIN tipos_atendimentos ON atendimentos.id_tipo_atendimento= tipos_atendimentos.id
            WHERE atendimentos.id = ${id}`);
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
            let response = await db.query(`DELETE FROM clientes WHERE id = ${id}`);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    },
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
            let response = await db.query('UPDATE tarefas SET ? WHERE id_atendimento = ? and status_tarefa != "concluido"', [datas, id]);
            res.json(response);
        } catch (error) {
            console.log(error);
        }
    }


    
}



