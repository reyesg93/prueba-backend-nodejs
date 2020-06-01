const db = require('../config/db.config.js');

exports.lista = async (req, res) => {
  const usuarios = await db.query('SELECT * FROM usuarios');
  res.send(usuarios);
};