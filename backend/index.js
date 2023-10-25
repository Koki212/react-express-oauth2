import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import 'dotenv/config';

// jwt: https://github.com/auth0/node-jsonwebtoken
// bcrypt: https://github.com/kelektiv/node.bcrypt.js

try {
    const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
    const db = client.db('oauth2_demo');
    const colUsers = db.collection('users');

    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(bodyParser.json());

    app.get('/api', (req, res) => {
        res.send('Hello API!');
    });

    app.use(express.static('./frontend/dist'));

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });

} catch(e) {
    console.error(e);
}
