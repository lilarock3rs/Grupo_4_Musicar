let express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');

router.get('/search', searchController.searchBar);
module.exports = router;