const express = require('express')
const { contactForm }  = require('./../controllers/formController')

const {runValidation} = require('./../validators')
const {contactFormValidator} = require('./../validators/form')

const router = express.Router()



router
    .route('/')
    .post(contactFormValidator, runValidation ,contactForm)

    


module.exports = router