const connection = require('../data/db');

const index = (req, res) => {
  res.send("Elenco dei film")
}

const show = (req, res) => {
  const id = req.params.id
  res.send(`film con id ${id}`)
}

module.exports = {
  index,
  show
}