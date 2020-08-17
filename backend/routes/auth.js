const express = require("express");
const router = express.Router();

const { signup, signin, signout, protect, forgotPassword, resetPassword, googleLogin } = require('./../controllers/authController')

const {runValidation} = require('./../validators')
const {userSignupValidator, userSignInValidator, forgotPasswordValidator, resetPasswordValidator} = require('./../validators/auth')


router
    .route("/signup")
    .post(userSignupValidator, runValidation ,signup);

router
    .route('/signin')
    .post(userSignInValidator, runValidation, signin)

router 
    .route('/signout')
    .get(signout)

router
    .route('/forgot-password')
    .put(forgotPasswordValidator, runValidation, forgotPassword)

    router
    .route('/reset-password')
    .put(resetPasswordValidator, runValidation, resetPassword)

router
        .route('/google-login')
        .post(googleLogin)



module.exports = router