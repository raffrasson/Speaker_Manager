const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const SPEAKERS = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res, next) => {
  const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
  const parsedSpeakers = JSON.parse(allSpeakers);
  return res.status(200).json(parsedSpeakers);
});