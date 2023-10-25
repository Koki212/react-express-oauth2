import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

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