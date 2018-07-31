const { Client } = require('pg/lib');

var dbclient = (function() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
      });
      
    function getStuff() {
        client.connect();
    
        client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
        });
    }

    return {
        getStuff: getStuff
    }

})();


module.exports = dbclient;