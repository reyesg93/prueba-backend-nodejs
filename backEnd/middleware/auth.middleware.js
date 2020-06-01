const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../config/db.config.js');


verificarToken = (req, res, next) => {
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(400).send({
			message: 'No se ha proporcionado token!'
		});
	}

	jwt.verify(token, config.secret, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: 'No Autorizado!'
			});
		}

		req.userId = decoded.id;
		next();
	});
};


isAdmin = async (req, res, next) => {
	const query = await db.query('SELECT r.rol FROM usuarios as u INNER JOIN roles as r on r.id = u.roleId WHERE u.id = ?', req.userId);

	
	if (query[0].rol === "admin"){
		next();
		return;
	}else{
		res.status(403).send({
			message: "Necesita Rol de Admin"
		});
		return;
	}
};

const authJwt = {
	verificarToken: verificarToken,
	isAdmin:isAdmin
}

module.exports = authJwt;