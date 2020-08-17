const express = require('express')
const { createCategory, getAllCategories, getCategory, removeCategory }  = require('./../controllers/categoryController')

const {protect, restrictToAdmin} = require('./../controllers/authController')
const {runValidation} = require('./../validators')
const {categoryCreateValidator} = require('./../validators/category')

const router = express.Router()



router
    .route('/')
    .post(categoryCreateValidator, runValidation ,createCategory)
    .get(getAllCategories)
    

router
    .route('/:slug') 
    .get(getCategory)
    .delete(protect, restrictToAdmin, removeCategory)   


module.exports = router