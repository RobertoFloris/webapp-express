const express = require('express');

require('dotenv').config();

const app = express();

const routerMovie = require('./router/movie');

const errorsHandler = require('./middlewares/errorsHandler');
const notFound = require('./middlewares/notFound');
const imagePath = require("./middlewares/imagePath");

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173' }))

// app.use(cors())
// SOLO IN FASE DI SVILUPPO PER COMODITA', ONLINE NO

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'))

app.use(imagePath)

app.get('/', (req, res) => {
  res.send('Server dei film')
})

app.use('/api/movies', routerMovie);

app.use(errorsHandler);
app.use(notFound);


app.listen(port, () => {
  console.log(`Sono in ascolto alla porta ${port}`);
})
