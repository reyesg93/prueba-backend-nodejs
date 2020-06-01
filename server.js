const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions ={
	origin: "http://localhost:8081"
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));



app.get('/', (req, res) => {
	res.json({ message: "Hola, prueba de app backEnd"});
});
require('./backEnd/routes/auth.routes.js')(app);
require('./backEnd/routes/ticket.routes.js')(app);
require('./backEnd/routes/user.routes.js')(app);



//app.use(require('./backEnd/routes/auth.routes.js'));
//app.use(require('./backEnd/routes/ticket.routes.js'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`SERVIDOR EN EL PUERTO ${PORT}.`);
});

