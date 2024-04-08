const db = require('../config/db');
const jwt = require('jsonwebtoken');

module.exports = {

    //INICIO LOGIN
    async login(req, res) {

        const email = req.body.email;
        const senha = req.body.senha;


        try {

            const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
            var resultado = rows;


            if (resultado.length < 1) {
                //se não encontrar usuario
                return res.status(401).send({ message: 'Falha na autenticação' });

            } else {
                console.log("login feito!");
                const token = jwt.sign({
                    id_usuario: resultado[0].id,
                    email: resultado[0].email,
                    nivel: resultado[0].nivel

                }, "CHAVE", {
                    expiresIn: "2d"
                });
                res.status(200).send({
                    message: 'login feito com sucessso',
                    token: token,
                    nivel: resultado[0].nivel,
                    id: resultado[0].id

                });

            }


        } catch (error) {
            console.log(error);
        }


    }
}