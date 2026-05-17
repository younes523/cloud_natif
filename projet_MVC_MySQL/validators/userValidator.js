const { body, param } = require('express-validator');

exports.validateUserCreation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email')
        .trim()
        .isEmail().withMessage('Email must be a valid email address')
];

exports.validateUserId = [
    param('id')
        .isInt().withMessage('User ID must be a number')
        .toInt()
];
