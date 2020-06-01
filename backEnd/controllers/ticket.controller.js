const db = require('../config/db.config.js');

exports.listar = async (req, res) => {
  const tickets = await db.query('SELECT t.*, u.nombre FROM tickets as t LEFT JOIN usuarios as u on t.userId = u.id');

  res.send(tickets);

};

exports.listarByUser = async (req, res) => {
	const userId = req.query.userId;
	//console.log(req.query);
  	const tickets = await db.query('SELECT t.*, u.nombre FROM tickets as t LEFT JOIN usuarios as u on t.userId = u.id WHERE t.userId = ?', [userId]);
  	res.send(tickets);

};

exports.agregar = async (req, res) => {
	const ticket = {
		ticket_pedido: req.body.ticket,
		userId: req.body.usuario
	}

    await db.query('INSERT INTO tickets SET ?', [ticket]);
    const last = await db.query('SELECT t.*, u.nombre FROM tickets as t LEFT JOIN usuarios as u on t.userId = u.id ORDER BY id DESC  LIMIT 0,1');
    res.status(200).send({ last: last[0],message: 'Se agrego el ticket'});
};

exports.ver = async (req, res) => {
	const  id  = req.body.id;
	const ticket = await db.query('SELECT * FROM tickets WHERE id = ?', [id]);
	res.send(ticket);
};

exports.modificar = async (req, res) => {
	const ticket = {
		ticket_pedido: req.body.ticket,
		userId: req.body.usuario
	}
	const  id  = req.body.id;
	const tickets = await db.query('UPDATE tickets SET ? WHERE id = ?', [ticket,id]);

  	res.status(200).send({ message:'Se modifico el ticket'});
};

exports.eliminar = async (req, res) => {
	const  id  = req.body.id;
	const tickets = await db.query('DELETE FROM tickets WHERE id = ?', [id]);
	res.status(200).send({message:'Se Elimino el ticket'});
};

exports.setear = async (req, res) => {
	try {
		const  id  = req.body.id;
		const tickets = await db.query('UPDATE tickets SET  ? WHERE id = ?',[req.body, id]);
		res.status(200).send({message:'Se Seteo el ticket'});
	} catch (err) {
		res.json({error: 'error'});
	}
};

