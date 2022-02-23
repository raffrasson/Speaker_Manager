const express = require('express');
const fs = require('fs/promises');
const bodyParser = require('body-parser');
const randomToken = require('random-token'); // módulo para gerar token aleatorio
const validator = require('email-validator'); // módulo para verificação de email com base na forma
const nameValidation = require('./nameValidation');
const ageValidation = require('./ageValidation');
const talkValidation = require('./talkValidation');
const authValidation = require('./authValidation');
const rateValidation = require('./rateValidation');

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

app.get('/talker', async (_req, res, _next) => {
  const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
  const parsedSpeakers = JSON.parse(allSpeakers);
  return res.status(200).json(parsedSpeakers);
});

app.get('/talker/:id', async (req, res, _next) => {
  const { id } = req.params;
  const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
  const parsedSpeakers = JSON.parse(allSpeakers);
  const speaker = parsedSpeakers.find((person) => person.id === Number(id));
  
  if (!speaker) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }

  return res.status(200).json(speaker);
});

app.post('/login', async (req, res, _next) => {
  const token = randomToken(16);
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }
  if (validator.validate(email) !== true) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  if (!password) {
    return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  return res.status(200).json({ token });
  });

app.post('/talker', 
authValidation, talkValidation, rateValidation, nameValidation, ageValidation, async (req, res) => {
  const { name, age, talk } = req.body;
  const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
  const parsedSpeakers = JSON.parse(allSpeakers);
  const newId = (parsedSpeakers.length + 1);
  const newSpeaker = { name, age, id: newId, talk };
  parsedSpeakers.push(newSpeaker);
  const updatedSpeakerArray = JSON.stringify(parsedSpeakers);
  await fs.writeFile('./talker.json', updatedSpeakerArray);
  return res.status(201).json(newSpeaker);
  });

  app.put('/talker/:id', 
  authValidation, 
  nameValidation, talkValidation, rateValidation, ageValidation, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const idToEdit = Number(id);
    const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
    const parsedSpeakers = JSON.parse(allSpeakers);

    const index = parsedSpeakers.findIndex((speaker) => speaker.id === idToEdit);

    const editedSpeaker = { name, age, id: idToEdit, talk };
    parsedSpeakers.splice(index, 1, editedSpeaker);
    const updatedSpeakerArray = JSON.stringify(parsedSpeakers);
    await fs.writeFile('./talker.json', updatedSpeakerArray);
    return res.status(200).json(editedSpeaker);
    });

    app.delete('/talker/:id', authValidation, async (req, res, _next) => {
      const { id } = req.params;
      const idToDelete = Number(id);
      const allSpeakers = await fs.readFile(SPEAKERS, 'utf-8');
      const parsedSpeakers = JSON.parse(allSpeakers);
  
      const index = parsedSpeakers.findIndex((speaker) => speaker.id === idToDelete);
  
      parsedSpeakers.splice(index, 1); // remover e não põe nada no lugar = deletar
      const updatedSpeakerArray = JSON.stringify(parsedSpeakers);
      await fs.writeFile('./talker.json', updatedSpeakerArray);
      return res.status(204).end();
});
