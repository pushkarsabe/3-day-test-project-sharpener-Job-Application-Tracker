const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const userController = require('../controller/user');

router.post('/signup', userController.postAddSignup);

router.post('/login', userController.postLogin);

router.get('/data/:id', auth.authenticate, userController.getUserData);

router.get('/data', auth.authenticate, userController.getAllUerData);

router.put('/update', auth.authenticate, userController.updateUser);

//delete the user which is logged in
router.delete('/delete', auth.authenticate, userController.deleteUser);

module.exports = router;