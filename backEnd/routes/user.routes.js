const authJwt  = require('../middleware/auth.middleware.js');
const controller = require("../controllers/user.controller.js");


module.exports = function(app) {
	app.use(function(req, res, next){
		res.header(
			"Access-Control-Allow-Headers",
	  		"x-access-token, Origin, Content-Type, Accept"
	  	);
		next();
	});

	app.get("/api/usuarios/lista",
		[authJwt.verificarToken, isAdmin], 
		controller.lista
	);

	
}