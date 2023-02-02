const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    app.use(cors());
    next();
});

const ControllerUsers = require('./controllers/ControllerUsers');
const ControllerClientes = require('./controllers/ControllerClientes');
const login = require('./middleware/login');
const ControllerAuth = require('./controllers/ControllerAuth');
const ControllerAtendimento = require('./controllers/ControllerAtendimentos');
const ControllerTipos_Atendimentos = require('./controllers/ControllerTipos_Atendimentos');
const ControllerTarefas = require('./controllers/ControllerTarefas');

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

//TAREFAS
app.post('/tarefa/insert', ControllerTarefas.insert);
app.get('/tarefasporatendimento/:id', ControllerTarefas.findByAtendimento);
app.get('/tarefas/:id', ControllerTarefas.findByUser);
app.get('/tarefa/:id', ControllerTarefas.findByTarefa);
app.delete('/tarefa/:id', ControllerTarefas.delete);
app.put('/tarefa/confirmar/:id', ControllerTarefas.confirmar);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`------------------------------`);
    console.log(`    🚀 API PONTO TI 🚀`);
    console.log(`------------------------------`);
    console.log(`🔥FUNCIONANDO COM SUCESSO🔥`);
    console.log(`   🚪 NA PORTA ${PORT} 🚪`);
    console.log(`______________________________`);
})