let express = require('express');
const path = require('path');

const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

const productController = require('../controllers/productController');

const multerProductMiddleware = require('../middlewares/multerProductMiddleware');
const productValidationMiddleware = require('../middlewares/productValidationMiddleware');
const updateProductValidationMiddleware = require('../middlewares/updateProductValidationMiddelware');


router.get('/all', authMiddleware, productController.allProducts);

router.get('/detail/:id', productController.detail);

router.get('/create', authMiddleware, productController.create);
router.post('/create',multerProductMiddleware.single('image'), productValidationMiddleware, productController.store);

router.get('/edit/:id',authMiddleware,  productController.edit);
router.put('/update/:id',multerProductMiddleware.single('image'), updateProductValidationMiddleware, productController.update);        

router.delete('/delete/:id', authMiddleware, productController.delete);


module.exports = router;