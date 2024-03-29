let express = require('express');
const router = express.Router();

const mainController = require('../controllers/mainController');

router.get('/', mainController.index);
router.get('/contact', mainController.contact);
router.get('/faq', mainController.faq);
router.get('/search', mainController.searchBar);
module.exports = router;