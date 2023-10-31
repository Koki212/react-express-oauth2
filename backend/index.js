import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import path from "path";
import { fileURLToPath } from "url";
// jwt: https://github.com/auth0/node-jsonwebtoken - to create access tokens
import jwt from "jsonwebtoken";
// bcrypt: https://github.com/kelektiv/node.bcrypt.js - to encrypt (hash) passwords before saving them in the db
import bcrypt, { hash } from "bcrypt";

// read environment variables (`process.env`) from `.env` file
import "dotenv/config";

// In commonjs (using require instead of import/export) these variables exist globally
// and contain information about the path of the application (on the hard drive).
// In module type however, these variables do not exist and we have to create them manually.
// To be honest: I had to google how to get them!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  // setup database connection
  const client = new MongoClient(process.env.MONGODB_CONNECTION_STRING);
  const db = client.db("oauth2_demo");
  const colUsers = db.collection("users");
  const colToDos = db.collection("todos");

  // setup express
  const app = express();
  const port = 3000;
  // CORS middleware for proper CORS handling
  app.use(cors());
  // JSON body parser (so we don't have to parse request bodies manually)
  app.use(bodyParser.json());

  // logging middleware - TODO: remove for production use, it will log passwords in plaintext!
  app.use((req, res, next) => {
    console.log(
      `\n${req.method} - ${req.path}\n\tHeaders:\n\t\t${JSON.stringify(
        req.headers
      )}\n\tBody:\n\t\t${JSON.stringify(req.body)}`
    );
    next();
  });

  // Authentication endpoints

  // auth token endpoint for login and token exchange
  app.post("/api/auth/token", async (req, res) => {
    // TODO: handle token requests
    switch (req.body.grant_type) {
      case "client_credentials":
        const email = req.body.client_id;
        const password = req.body.client_secret;
        const existingUser = await colUsers.findOne({ email });
        if (!existingUser) {
          res.status(400).send();
        } else {
          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.hash
          );
          if (passwordMatch) {
            // TODO: generate tokens
            const accessToken = jwt.sign(
              {
                sub: existingUser._id,
                iat: Date.now(),
                exp: new Date(Date.now() + 1000 * 60 * 60).getTime(),
              },
              process.env.JWT_SECRET
            );
            const refreshToken = jwt.sign(
              {
                sub: existingUser._id,
                iat: Date.now(),
                exp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).getTime(),
              },
              process.env.JWT_SECRET
            );

            res
              .status(200)
              .json({ access_Token: accessToken, refresh_Token: refreshToken });
          } else {
            res.status(400).send();
          }
        }
        break;
      case "refresh_token":
        const token = req.body.refresh_token;
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const accessToken = jwt.sign(
            {
              sub: decoded.sub,
              iat: Date.now(),
              exp: new Date(Date.now() + 1000 * 60 * 60).getTime(),
            },
            process.env.JWT_SECURE_KEY
          );
          res.status(200).json({ access_token: accessToken });
        } catch (err) {
          res.status(400).send();
        }
        break;
      default:
        res.status(500).json({ message: "Grant type not implemented!" });
    }
  });

  // auth register endpoint for user creation
  app.post("/api/auth/register", async (req, res) => {
    // TODO: handle register requests
    const user = {
      email: req.body.email.toLowerCase(),
      hash: await bcrypt.hash(req.body.password, 10),
    };
    const existingUser = await colUsers.findOne({ email: user.email });
    if (existingUser) {
      res.status(500).send();
    } else {
      const insertion = await colUsers.insertOne(user);
      if (insertion.acknowledged) {
        res.status(200).json({});
      } else {
        res.status(500).send();
      }
    }
  });

  // Authentication middleware
  const auth = async (req, res, next) => {
    // TODO: check token and add user information or return error status
    const token = req.headers.authorization.replace(/Bearer /i, "");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECURE_KEY);
      const existingUser = await colUsers.findOne({
        _id: new ObjectId(decoded.sub),
      });
      if (existingUser) {
        req.user = existingUser;
      } else {
        res.status(401).send();
      }
    } catch (err) {
      res.status(401).send();
    }
    next();
  };

  // ToDo Endpoints

  // get all ToDos
  app.get("/api/todos", auth, async (req, res) => {
    // TODO: make sure user is authenticated and only accesses his own data
    const toDos = await colToDos.find({ user_id: req.user._id }).toArray();
    res.status(200).json(toDos);
  });

  // get one ToDo
  app.get("/api/todos/:id", auth, async (req, res) => {
    // TODO: make sure user is authenticated and only accesses his own data
    const toDo = await colToDos.findOne({
      _id: new ObjectId(req.params.id),
      user_id: req.user._id,
    });
    if (toDo) {
      res.status(200).json(toDo);
    } else {
      res.status(404).send();
    }
  });

  // add a ToDo
  app.post("/api/todos/", auth, async (req, res) => {
    // TODO: make sure user is authenticated and only accesses his own data
    const data = req.body;
    data.user_id = req.user._id;
    const insertion = await colToDos.insertOne(req.body);
    if (insertion.acknowledged) {
      const toDo = await colToDos.findOne({
        _id: insertion.insertedId,
        user_id: req.user._id,
      });
      if (toDo) {
        res.status(200).json(toDo);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(500).json({ message: "An error occurred!" });
    }
  });

  // update a ToDo
  app.put("/api/todos/:id", auth, async (req, res) => {
    // TODO: make sure user is authenticated and only accesses his own data
    const updateData = req.body;
    delete updateData._id; // make sure the _id is not updated
    const updated = await colToDos.updateOne(
      { _id: new ObjectId(req.params.id), user_id: req.user._id },
      { $set: updateData }
    );
    if (updated.modifiedCount === 1) {
      const toDo = await colToDos.findOne({
        _id: new ObjectId(req.params.id),
        user_id: req.user._id,
      });
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
  app.delete("/api/todos/:id", auth, async (req, res) => {
    // TODO: make sure user is authenticated and only accesses his own data
    const deleted = await colToDos.deleteOne({
      _id: new ObjectId(req.params.id),
      user_id: req.user._id,
    });
    if (deleted.deletedCount === 1) {
      res.status(200).json({});
    } else {
      res.status(404).send();
    }
  });

  // output status 404 for all other /api requests that have not been handled explicitly
  app.use("/api", (req, res) => {
    res.status(404).json({ message: "Path not found!" });
  });

  // Frontend endpoints

  // static routing for /assets
  app.use("/assets", express.static("./frontend/dist/assets"));

  // route all other requests to `frontend/dist/index.html` for handling in React Router
  app.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });

  // start server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch (e) {
  // output any errors on console
  console.error(e);
}
