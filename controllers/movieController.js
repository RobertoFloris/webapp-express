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
    `SELECT movies.*, ROUND(AVG(reviews.vote), 2) AS average_vote
    FROM movies
    LEFT JOIN reviews ON reviews.movie_id = movies.id
    WHERE movies.id = ?`;

  const sqlReviews =
    `SELECT *
    FROM reviews
    WHERE reviews.movie_id = ?`;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Film non trovato' });
    }

    connection.query(sqlReviews, [id], (err, resultsReviews) => {
      if (err) {
        return res.status(500).json({ error: "Query errata" });
      }

      const movie = results[0];
      res.json({
        ...movie,
        image: req.imagePath + movie.image,
        reviews: resultsReviews
      });
    });
  });
};


module.exports = {
  index,
  show
}