const express = require('express');
const cors = require('cors');
const login = require('./routes/login');
const bodyParser = require('body-parser');
const router = express.Router();

const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(
    cors({
      origin: ['http://localhost:3000', 'http://localhost:5000'],
      allowHeader: ['Content-Type']
    })
  )
  .use('/login', login)

  .listen(5000, () => {
    console.log('server listening');
  });
