const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const upload = require('../middlewares/multer');

router.get('/', movieController.index);

router.get('/:id', movieController.show);

router.post('/', movieController.store)

router.post('/:id', upload.single("image"), movieController.storeReviews)

module.exports = router;