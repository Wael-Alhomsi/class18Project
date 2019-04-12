const mysql = require('mysql');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'hyfuser',
    password: 'hyfpassword',
    database: 'class18_db',
});
db.queryPromise = promisify(db.query);
module.exports = db;

// db.connect();
// const sql = `insert into houses (
// link ,
// location_country,
// location_city ,
// size_rooms,
// price_value,
// price_currency
// ) values ?`;
// const values = [
//     ['aa', 'gg', 'll', 5, 11, 'EUR'],
//     ['bb', 'gg', 'll', 5, 11, 'EUR'],
// ];

// db.query(sql, [values], (err, res) => {
//     if (err) {
//         throw err;
//     }
//     console.log(res);
// });
// db.end();
