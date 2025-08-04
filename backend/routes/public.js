const express = require('express');
const { getPublicNote } = require('../controllers/publicController');
const router = express.Router();
router.get('/notes/:id', getPublicNote);
module.exports = router;
