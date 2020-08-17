const express = require('express');
const router = express.Router();
const { create, list, listAllBlogsCategoriesTags, read, remove, update, photo, listRelated, listSearch, listByUser} = require('../controllers/blogController');

const { protect, restrictToAdmin, canUpdateDeleteBlog } = require('../controllers/authController');

router
    .route('/')
    .post(protect, restrictToAdmin, create)
    .get(list)

router
    .route('/search')
    .get(listSearch)

    
router
    .route('/:slug')
    .get(read)
    .delete(protect, restrictToAdmin, remove)
    .put(protect, restrictToAdmin, update)

router
    .route('/blogs-categories-tags')
    .post(listAllBlogsCategoriesTags)

router
    .route('/photo/:slug')
    .get(photo)


router
    .route('/related')
    .post(listRelated)

router
    .route('/user')
    .post(protect, create)
    .get(list)



router
    .route('/:username/blogs')
    .get(listByUser)  

router
    .route('/user/:slug')
    .get(read)
    .delete(protect, canUpdateDeleteBlog, remove)
    .put(protect, canUpdateDeleteBlog, update)
  




module.exports = router;