const keys = require('./keys');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const {Pool} = require('pg');
const pgClient = new Pool({
    user : keys.pgUsername,
    host : keys.pgHost,
    database : keys.pgDatabase,
    password : keys.pgPassword,
    port : keys.pgPort
});

pgClient.on('error', () => console.log('Lost Connection to PG'));

pgClient
.query("CREATE TABLE IF NOT EXISTS values(number INT)")
.catch(err => console.log(err));

const redis = require('redis');
const redisClient = redis.createClient({
    host : keys.redisHost,
    port : keys.redisPort,
    retry_strategy : () => 1000
});

const redisPublisher = redisClient.duplicate();


app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
const values =  await pgClient.query("SELECT * FROM values");
res.send(values.rows);
});

