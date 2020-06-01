const express = require('express');
const router = express.Router();

const bcrypt = require('../middleware/bcrypt.middleware.js'); //encryptPassword, comparePasswords
const db = require('../config/db.config.js'); //configuracion db

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

router.post('/api/auth/registro', async (req, res, next) =>  {

	const usuario = {
		nombre: req.body.nombre,
		correo: req.body.correo,
		password: req.body.password,
		roleId: req.body.rol
	}
	
	usuario.password = await bcrypt.encryptPassword(req.body.password);

	const rows = await db.query('SELECT * FROM usuarios WHERE correo = ?', [usuario.correo]);

	if (rows.length > 0) {
		res.status(400).send({message: 'Usuario ya existe!'});
	}else{
		if(req.body.rol){
			await db.query('INSERT INTO usuarios SET ?', [usuario]);
			res.status(200).send({message: 'Usuario Creado!'});
		}else{
			usuario.roleId = 2;
			await db.query('INSERT INTO usuarios SET ?', [usuario]);
			res.status(200).send({message: 'Usuario Creado!'});
		}

	}
	next();
});

router.post('/api/auth/login', async (req, res, next) => {
	const usuario = {
		correo: req.body.correo,
		password: req.body.password
	}

	const rows = await db.query('SELECT * FROM usuarios WHERE correo = ?', [usuario.correo]);

	if (rows.length > 0) {
		const user = rows[0];
		const validPassword = await bcrypt.comparePasswords(usuario.password, user.password);

		if (!validPassword) {
	        return res.status(401).send({
	          accessToken: null,
	          message: "Contraseña incorrecta!"
	        });
    	}

    	var token = jwt.sign({ id: user.id }, config.secret, {
	        expiresIn: 1440 
	    });

	    const roles = await db.query('SELECT * FROM roles WHERE id = ?', user.roleId);
	    
	    res.status(200).send({
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          rol: roles[0].rol,
          accessToken: token
        });

	}else{
		return res.status(404).send({ message: "Usuario no encontrado." });
	}
	next();

});

/*
passport.use('local.signin', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];  
        const validPassword = await bcrypt.comparePasswords(password, user.password);
        if (validPassword) 
            done(null, user); 
        else 
            done(null, false, req.flash('message', 'Incorrect Password'));
    }
    else
        done(null, false, req.flash('message', 'Incorrect Username'));
}));
*/

module.exports = router;