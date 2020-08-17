const express = require('express')
const { createTag, getAllTags, getTag, removeTag }  = require('./../controllers/TagController')

const {protect, restrictToAdmin} = require('./../controllers/authController')
const {runValidation} = require('./../validators')
const {TagCreateValidator} = require('./../validators/tag')

const router = express.Router()



router
    .route('/')
    .post(TagCreateValidator, runValidation , createTag)
    .get(getAllTags)
    

router
    .route('/:slug') 
    .get(getTag)
    .delete(protect, restrictToAdmin, removeTag)   


module.exports = router