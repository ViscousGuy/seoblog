const express = require('express')
const { protect, restrictToAdmin}  = require('./../controllers/authController')

const {getUser, publicProfile, update, photo} = require('./../controllers/userController')

const router = express.Router()



router
    .route('/profile')
    .get(protect, getUser)

router
    .route('/:username')
    .get(publicProfile)

router
    .route('/update')
    .put(protect, update)

router 
    .route('/photo/:username')
    .get(photo)





module.exports = router