import { Client } from 'pg/lib';

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

export function getStuff() {
    console.log("get stuff from db..");
    client.connect();

    client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
        console.log(JSON.stringify(row));
    }
    client.end();
    });
}
