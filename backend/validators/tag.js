const {check} = require('express-validator')

exports.TagCreateValidator = [
    check('name').not().isEmpty().withMessage('Name is required'), // not() negates(make false) the result of next validator
    
] 


