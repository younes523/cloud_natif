const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUserCreation, validateUserId } = require('../validators/userValidator');
const { validationResult } = require('express-validator');

// Define routes
router.get('/', userController.getAllUsers);
router.get('/:id', validateUserId, handleValidationErrors, userController.getUserById);
router.post('/', validateUserCreation, handleValidationErrors, userController.createUser);
router.put('/:id', validateUserId, validateUserCreation, handleValidationErrors, userController.updateUser);
router.delete('/:id', validateUserId, handleValidationErrors, userController.deleteUser);

// Centralized validation error handler
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = router;

/******without validator */

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Define routes
// router.get('/', userController.getAllUsers);
// router.get('/:id', userController.getUserById);
// router.post('/', userController.createUser);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

// module.exports = router;