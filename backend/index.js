import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
// jwt: https://github.com/auth0/node-jsonwebtoken - to create access tokens
import jwt from 'jsonwebtoken';
// bcrypt: https://github.com/kelektiv/node.bcrypt.js - to encrypt (hash) passwords before saving them in the db
import bcrypt from 'bcrypt';

// read environment variables (`process.env`) from `.env` file
import 'dotenv/config';



// In commonjs (using require instead of import/export) these variables exist globally
// and contain information about the path of the application (on the hard drive).
// In module type however, these variables do not exist and we have to create them manually.
// To be honest: I had to google how to get them!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



try {
  // setup database connection
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  const db = client.db('oauth2_demo');
  const colUsers = db.collection('users');
  const colToDos = db.collection('todos');



  // setup express
  const app = express();
  const port = 3000;
  // CORS middleware for proper CORS handling
  app.use(cors());
  // JSON body parser (so we don't have to parse request bodies manually)
  app.use(bodyParser.json());



  // logging middleware - TODO: remove for production use, it will log passwords in plaintext!
  app.use((req, res, next) => {
    console.log(`\n${req.method} - ${req.path}\n\tHeaders:\n\t\t${JSON.stringify(req.headers)}\n\tBody:\n\t\t${JSON.stringify(req.body)}`);
    next();
  });



  // Authentication endpoints

  // auth token endpoint for login and token exchange
  app.post('/api/auth/token', async (req, res) => {
    // TODO: handle token requests
    res.status(500).json({ message: 'Not yet implemented!' });
  });

  // auth register endpoint for user creation
  app.post('/api/auth/register', async (req, res) => {
    // TODO: handle register requests
    res.status(500).json({ message: 'Not yet implemented!' });
  });

  // Authentication middleware
  const auth = (req, res, next) => {
    // TODO: check token and add user information or return error status
    next();
  }



  // ToDo Endpoints

  // get all ToDos
  app.get('/api/todos', async (req, res) => { // TODO: make sure user is authenticated and only accesses his own data
    const toDos = await colToDos.find().toArray();
    res.status(200).json(toDos);
  });

  // get one ToDo
  app.get('/api/todos/:id', async (req, res) => { // TODO: make sure user is authenticated and only accesses his own data
    const toDo = await colToDos.findOne({ _id: new ObjectId(req.params.id) });
    if (toDo) {
      res.status(200).json(toDo);
    } else {
      res.status(404).send();
    }
  });

  // add a ToDo
  app.post('/api/todos/', async (req, res) => { // TODO: make sure user is authenticated and only accesses his own data
    const insertion = await colToDos.insertOne(req.body);
    if (insertion.acknowledged) {
      const toDo = await colToDos.findOne({ _id: insertion.insertedId });
      if (toDo) {
        res.status(200).json(toDo);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(500).json({ message: 'An error occurred!' });
    }
  });

  // update a ToDo
  app.put('/api/todos/:id', async (req, res) => { // TODO: make sure user is authenticated and only accesses his own data
    const updateData = req.body;
    delete updateData._id;
    const updated = await colToDos.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
    if (updated.modifiedCount === 1) {
      const toDo = await colToDos.findOne({ _id: new ObjectId(req.params.id) });
      if (toDo) {
        res.status(200).json(toDo);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(404).send();
    }
  });

  // delete a ToDo
  app.delete('/api/todos/:id', async (req, res) => { // TODO: make sure user is authenticated and only accesses his own data
    const deleted = await colToDos.deleteOne({ _id: new ObjectId(req.params.id) });
    if (deleted.deletedCount === 1) {
      res.status(200).json({});
    } else {
      res.status(404).send();
    }
  });



  // output status 404 for all other /api requests that have not been handled explicitly
  app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Path not found!' });
  });



  // Frontend endpoints

  // static routing for /assets
  app.use('/assets', express.static('./frontend/dist/assets'));

  // route all other requests to `frontend/dist/index.html` for handling in React Router
  app.use(function(req, res) {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });



  // start server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });



} catch(e) {
  // output any errors on console
  console.error(e);
}
