module.exports = (req, res, next) => {
  const { age } = req.body;
  const { rate } = req.body.talk;
  if (rate < 1 || rate > 5) {
 return res.status(400)
    .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' }); 
}
  if (!age) { return res.status(400).json({ message: 'O campo "age" é obrigatório' }); }
  if (age < 18) {
 return res.status(400)
    .json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
}
return next();
};
