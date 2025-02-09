const connection = require('../data/db');

const index = (req, res) => {
  const sql = 'SELECT * FROM movies'
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
    ` 
  SELECT movies.*, 
  reviews.*
  FROM movies
  LEFT JOIN reviews ON reviews.movie_id = movies.id
  WHERE movies.id = ?
  `;

  connection.query(sql, [id], (err, results) => {

    if (err) {
      return res.status(500).json({ error: "Query errata" })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Post non trovato' });
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

module.exports = {
  index,
  show
}