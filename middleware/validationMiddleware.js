const { body, validationResult } = require('express-validator');

exports.validateSignUp = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('companyAddress').notEmpty().withMessage('Company address is required'),
    body('registeredLegalNumber').notEmpty().withMessage('Registered legal number is required'),
    body('plan').notEmpty().withMessage('Plan is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
