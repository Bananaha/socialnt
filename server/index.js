const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();

const routes = require('./routes');

const dbService = require('./services/db.service');

const URL = 'mongodb://localhost:27017/socialNetwork';
const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(
  cors({
    origin: ['http://localhost:3001', 'http://localhost:5000'],
    allowHeader: ['Content-Type']
  })
  )
  .use(routes);

dbService.connect(URL, (error, db) => {
  console.log('in db connect');
  if (error) {
    console.log('impossible de se connecter à la base de donnée', error);
  } else {
    app.listen(5000, () => {
      console.log('server listening');
    });
    console.log('connecté à la base de donnée mongo');
  }
});
