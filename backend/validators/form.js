const {check} = require('express-validator')

exports.contactFormValidator = [
    check('name').not().isEmpty().withMessage('Name is required'),// not() negates(make false) the result of next validator
    check('email').isEmail().withMessage('Email must be valid'),
    check('message').not().isEmpty().isLength({ min: 20 }).withMessage('message must be at least 20 char long')
    
] 