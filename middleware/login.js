const jwt = require("jsonwebtoken");

exports.obrigatorio =(req, res, next)=>{
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = jwt.verify(token,"CHAVE");
    req.usuario = decode;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'TOKEN ERROR' }) ;
    
  }}

  exports.opcional =(req, res, next)=>{
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decode = jwt.verify(token,"CHAVE");
      req.usuario = decode;
      next();
    } catch (error) {
      next();
      
    }}