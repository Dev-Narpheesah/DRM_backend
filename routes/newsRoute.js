const express = require('express');
const router = express.Router();
const { getAllNews, addNews } = require('../controllers/newsController');

router.get('/', getAllNews);
router.post('/', addNews); // Protect with admin middleware if needed

module.exports = router;