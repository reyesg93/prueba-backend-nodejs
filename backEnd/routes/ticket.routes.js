//const express = require('express');
//const router = express.Router();
//const db = require('../config/db.config.js'); //configuracion db

const authJwt  = require('../middleware/auth.middleware.js');
const controller = require("../controllers/ticket.controller.js");

module.exports = function(app) {
	app.use(function(req, res, next){
		res.header(
			"Access-Control-Allow-Headers",
	  		"x-access-token, Origin, Content-Type, Accept"
	  	);
		next();
	});

	app.get("/api/tickets/lista", 
		[authJwt.verificarToken], 
		controller.listar
	);

	app.get("/api/tickets/listarByUser",  
		controller.listarByUser
	);


	app.post("/api/tickets/agregar", 
		[authJwt.verificarToken, isAdmin], 
		controller.agregar
	);

	app.get("/api/tickets/ver", 
		[authJwt.verificarToken, isAdmin], 
		controller.ver
	);

	app.post("/api/tickets/modificar", 
		[authJwt.verificarToken, isAdmin], 
		controller.modificar
	);

	app.post("/api/tickets/eliminar", 
		[authJwt.verificarToken, isAdmin], 
		controller.eliminar
	);

	app.put("/api/tickets/setear", 
		[authJwt.verificarToken], 
		controller.setear
	);
}

