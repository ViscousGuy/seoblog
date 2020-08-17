const {check} = require('express-validator')

exports.userSignupValidator = [
    check('name').not().isEmpty().withMessage('Name is required'), // not() negates(make false) the result of next validator
    check('email').isEmail().withMessage('Name is required'),
    check('password').isLength({min:6}).withMessage('password must be atleast 6 char long')
] 


exports.userSignInValidator = [
    check('email').not().isEmpty().withMessage('please provide email'),
    check('password').not().isEmpty().withMessage('please provide password')
]

exports.forgotPasswordValidator = [
    check('email').not().isEmpty().isEmail().withMessage('not a valid email')
]



exports.resetPasswordValidator = [
    check('newPassword').not().isEmpty().isLength({min:6}).withMessage('password must be atleast 6 char long')
]