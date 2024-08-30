const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 8080;

// Configuração do CORS
app.use(cors({
    origin: ['https://sistema.pontoti.net.br',
        'http://localhost:3000',
        'http://localhost:3006',
        'http://localhost',  // XAMPP na porta 80
        'http://127.0.0.1'], // Sem a barra no final

    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());

// Importação dos controllers
const ControllerUsers = require('./controllers/ControllerUsers');
const ControllerClientes = require('./controllers/ControllerClientes');
const login = require('./middleware/login');
const ControllerAuth = require('./controllers/ControllerAuth');
const ControllerAtendimento = require('./controllers/ControllerAtendimentos');
const ControllerTipos_Atendimentos = require('./controllers/ControllerTipos_Atendimentos');
const ControllerTarefas = require('./controllers/ControllerTarefas');
const ControllerOrcamento = require('./controllers/ControllerOrcamento');

// Rotas
//AUTENTICAÇÃO
app.post('/login', ControllerAuth.login);

//USUARIOS
app.post('/usuario/insert', ControllerUsers.insert);
app.put('/usuario/update/:id', ControllerUsers.update);
app.get('/usuarios', ControllerUsers.findAll);
app.get('/selectusuarios', ControllerUsers.SelectList);
app.get('/usuario/:id', ControllerUsers.findById);
app.delete('/usuario/:id', ControllerUsers.delete);

//CLIENTES
app.post('/cliente/insert', ControllerClientes.insert);
app.put('/cliente/update/:id', ControllerClientes.update);
app.get('/clientes', ControllerClientes.findAll);
app.get('/selectclientes', ControllerClientes.SelectList);
app.get('/cliente/:id', ControllerClientes.findById);
app.delete('/cliente/:id', ControllerClientes.delete);

//TIPOS ATENDIMENTOS
app.post('/tiposatendimentos/insert', ControllerTipos_Atendimentos.insert);
app.put('/tipoatendimento/update/:id', ControllerTipos_Atendimentos.update);
app.get('/tiposatendimentos', ControllerTipos_Atendimentos.findAll);
app.get('/tipoatendimento/:id', ControllerTipos_Atendimentos.findById);
app.delete('/tipoatendimento/:id', ControllerTipos_Atendimentos.delete);

//ATENDIMENTOS
app.get('/atendimentoslast', ControllerAtendimento.lastid);
app.post('/atendimento/insert', ControllerAtendimento.insert);
app.get('/atendimentos', ControllerAtendimento.findAll);
app.get('/atendimento/:id', ControllerAtendimento.findById);
app.put('/atendimento/confirmar/:id', ControllerAtendimento.confirmar);
app.get('/atendimentos/aguardando', ControllerAtendimento.findAguardando);

//TAREFAS
app.post('/tarefa/insert', ControllerTarefas.insert);
app.get('/tarefasporatendimento/:id', ControllerTarefas.findByAtendimento);
app.get('/tarefas/:id', ControllerTarefas.findByUser);
app.get('/tarefashoje/:id', ControllerTarefas.findByUserday);
app.get('/tarefa/:id', ControllerTarefas.findByTarefa);
app.delete('/tarefa/:id', ControllerTarefas.delete);
app.put('/tarefa/confirmar/:id', ControllerTarefas.confirmar);
app.get('/tarefa/detalhes/:id', ControllerTarefas.findDetails);

//ORCAMENTOS
app.post('/orcamento/insert', ControllerOrcamento.insert);
app.get('/orcamentos', ControllerOrcamento.findAll);
app.get('/orcamento/:id', ControllerOrcamento.findById);
app.get('/orcamento/gerarproposta/:id', ControllerOrcamento.gerarProposta);

app.listen(PORT, () => {
    console.log(`------------------------------`);
    console.log(`    🚀 API PONTO TI 🚀`);
    console.log(`------------------------------`);
    console.log(`🔥FUNCIONANDO COM SUCESSO🔥`);
    console.log(`   🚪 NA PORTA ${PORT} 🚪`);
    console.log(`______________________________`);
});