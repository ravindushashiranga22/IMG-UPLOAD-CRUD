const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage }).single("image");

// Routes
router.post('/add-user', upload, userController.addUser);
router.get('/', userController.getAllUsers);
router.get('/add-user', userController.renderAddUserPage);
router.get('/edit/:id', userController.getUserById);
router.post('/update/:id', upload, userController.updateUser);
router.get('/delete/:id', userController.deleteUser);

module.exports = router;
