
const db = require('../config/db');
const login = require('../middleware/login');
const moment = require('moment');
const fetch = require('node-fetch');



module.exports = {
    async insert(req, res) {

        // Data de emissão: momento atual
        let dataEmissao = new Date();

        // Data de validade: 30 dias após a data de emissão
        let dataValidade = new Date();
        dataValidade.setDate(dataValidade.getDate() + 30);

        // Dados para inserir na tabela de orçamentos
        let datas1 = {
            "id_cliente": req.body.cliente,
            "id_tipo_atendimento": req.body.servico,
            "descricao": req.body.descricao,
            "valor": req.body.valor,
            "data_emissao": dataEmissao,
            "data_validade": dataValidade,
            "status": "Aberto",
        };
        try {
            // Inserindo o orçamento no banco de dados
            await db.query('INSERT INTO orcamentos SET ?', [datas1]);

            // Retornando o status de sucesso 201 Created
            res.status(201).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao inserir o orçamento' });
        }
    } // FIM INSERT

    ,
    // INICIO LISTAR TODOS
    async findAll(req, res) {
        try {
            let response = await db.query(`
            SELECT 
                orcamentos.id,
                orcamentos.descricao,
                orcamentos.valor,
                orcamentos.data_emissao,
                orcamentos.data_validade,
                orcamentos.status,
                clientes.nome_cliente,
                tipos_atendimentos.nome_atendimento
            FROM orcamentos
            INNER JOIN clientes ON orcamentos.id_cliente = clientes.id
            INNER JOIN tipos_atendimentos ON orcamentos.id_tipo_atendimento = tipos_atendimentos.id
            ORDER BY orcamentos.id DESC;
        `);

            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao listar os orçamentos' });
        }
    } // FIM LISTAR TODOS
    ,
    // INICIO LISTAR POR ID
    async findById(req, res) {
        let id = req.params.id;
        try {
            let response = await db.query(`
            SELECT 
                orcamentos.id,
                orcamentos.descricao,
                orcamentos.valor,
                orcamentos.data_emissao,
                orcamentos.data_validade,
                orcamentos.status,
                clientes.nome_cliente,
                clientes.telefone_cliente,
                clientes.email_cliente,
                clientes.responsavel,
                clientes.endereco,
                tipos_atendimentos.nome_atendimento
            FROM orcamentos
            INNER JOIN clientes ON orcamentos.id_cliente = clientes.id
            INNER JOIN tipos_atendimentos ON orcamentos.id_tipo_atendimento = tipos_atendimentos.id
            WHERE orcamentos.id = ${id}
        `);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao listar o orçamento' });
        }
    } // FIM LISTAR POR ID
    ,
    // INICIO LISTAR POR ID
    async gerarProposta(req, res) {
        let id = req.params.id;
        console.log(id);
        try {
            let response = await db.query(`
                SELECT 
                    orcamentos.id,
                    orcamentos.descricao,
                    orcamentos.valor,
                    orcamentos.data_emissao,
                    orcamentos.data_validade,
                    orcamentos.status,
                    clientes.nome_cliente,
                    clientes.responsavel AS nome_responsavel,
                    tipos_atendimentos.nome_atendimento
                FROM orcamentos
                INNER JOIN clientes ON orcamentos.id_cliente = clientes.id
                INNER JOIN tipos_atendimentos ON orcamentos.id_tipo_atendimento = tipos_atendimentos.id
                WHERE orcamentos.id = ${id}
            `);

            if (response.length > 0) {
                const orcamento = response[0]["0"];

                const dataEmissaoFormatada = moment(orcamento.data_emissao).format('YYYY-MM-DD');
                const dataValidadeFormatada = moment(orcamento.data_validade).format('YYYY-MM-DD');

                const payload = {
                    id: orcamento.id,
                    descricao: orcamento.descricao,
                    valor: parseFloat(orcamento.valor).toFixed(2),
                    data_emissao: dataEmissaoFormatada,
                    data_validade: dataValidadeFormatada,
                    status: orcamento.status,
                    nome_cliente: orcamento.nome_cliente,
                    nome_responsavel: orcamento.nome_responsavel,
                    nome_atendimento: orcamento.nome_atendimento,
                };
                console.log(payload);
                const webhookResponse = await fetch('https://hook.us2.make.com/yrduv13hso1o9h4tlbb5xp22a30qb4mo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!webhookResponse.ok) {
                    const errorText = await webhookResponse.text();
                    console.error('Erro ao enviar para o webhook:', errorText);
                    res.status(500).json({ error: 'Erro ao enviar para o webhook', details: errorText });
                    return;
                }

                res.json({ message: 'Orçamento enviado para o webhook com sucesso' });
            } else {
                console.log(`Orçamento não encontrado: ${id}`);
                res.status(404).json({ error: 'Orçamento não encontrado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao processar o orçamento' });
        }
    }

    ,
    async update(req, res) {
        let id = req.params.id;

        let datas = {
            "id_cliente": req.body.cliente,
            "id_tipo_atendimento": req.body.servico,
            "descricao": req.body.descricao,
            "valor": req.body.valor,
            "data_emissao": req.body.data_emissao,
            "data_validade": req.body.data_validade,
            "status": req.body.status
        };

        try {
            // Atualizando o orçamento no banco de dados
            await db.query('UPDATE orcamentos SET ? WHERE id = ?', [datas, id]);

            // Retornando o status de sucesso 200 OK
            res.status(200).send();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao atualizar o orçamento' });
        }
    } // FIM UPDATE
    ,
}