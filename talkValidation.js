const validator = require('is-my-date-valid');

const validate = validator({ format: 'DD/MM/YYYY' }); // módulo para validar data

module.exports = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || !talk.watchedAt) { 
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
   }
  if (validate(talk.watchedAt) !== true) {
 return res.status(400)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' }); 
}
return next();
};
