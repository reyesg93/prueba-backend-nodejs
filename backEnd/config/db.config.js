const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('../keys');

const db = mysql.createPool(database);

db.getConnection((err, connection) => {
	if (err) { throw err;}
	if (connection) { connection.release();}

	console.log('BD Conectada');
});

db.query = promisify(db.query);

module.exports = db;