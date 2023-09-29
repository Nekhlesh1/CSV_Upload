const express = require('express');
const router = express.Router();
const multer = require('multer');

const homeController = require('../controllers/homeController');
const csvController = require('../controllers/csvController');
const upload = multer({dest: 'uploads/'})

router.get('/', homeController.home);
router.get('/csv/:id', csvController.view);
router.post('/upload', upload.single('csv'), csvController.upload);


module.exports = router;