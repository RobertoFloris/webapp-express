const connection = require('../data/db');

const index = (req, res) => {
  const sql =
    `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS average_vote
    FROM movies
    LEFT JOIN reviews ON reviews.movie_id = movies.id
    GROUP BY movies.id`;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" })
    }

    const movie = results.map(item => {
      return {
        ...item,
        image: req.imagePath + item.image
      }


    })

    res.json(movie)
  })
}

const show = (req, res) => {
  const id = req.params.id;
  const sql =
    `SELECT movies.*, 
    reviews.*
    FROM movies
    LEFT JOIN reviews ON reviews.movie_id = movies.id
    WHERE movies.id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Film non trovato' });
    }

    const movie = {
      id: results[0].id,
      title: results[0].title,
      director: results[0].director,
      genre: results[0].genre,
      release_year: results[0].release_year,
      abstract: results[0].abstract,
      image: req.imagePath + results[0].image,
      created_at: results[0].created_at,
      updated_at: results[0].updated_at,
      reviews: []
    }

    results.forEach(item => {
      movie.reviews.push({
        id: item.id,
        movie_id: item.movie_id,
        name: item.name,
        vote: item.vote,
        text: item.text,
        created_at: item.created_at,
        updated_at: item.updated_at,
      })
    })

    res.json(movie)

  })

}

const storeReviews = (req, res) => {
  const id = req.params.id;

  const { name, vote, text } = req.body;

  const sql =
    `INSERT INTO reviews (movie_id, name, vote, text)
    VALUES (?,?,?,?)`

  connection.query(sql, [id, name, vote, text], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" });
    }
    res.status(201).json({ message: 'review added' })
  })
}

const store = (req, res) => {
  const { title, director, genre, release_year, abstract } = req.body;

  const image = req.file.filename

  const sql =
    `INSERT INTO movies (title, director, genre, release_year, abstract, image)
    VALUES (?,?,?,?,?,?)`

  connection.query(sql, [title, director, genre, release_year, abstract, image], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" });
    }
    res.status(201).json({ message: 'movie added' })
  })
}


module.exports = {
  index,
  show,
  storeReviews,
  store
}