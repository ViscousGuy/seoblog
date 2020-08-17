const slugify = require('slugify')
const Category = require('./../models/categoryModel')
const {errorHandler} = require('./../helpers/dbErrorHandler')
const Blog = require('./../models/blogModel')

exports.createCategory = async (req, res) => {
    try{
        const {name} = req.body
        const slug = slugify(name).toLowerCase()

        const category = await Category.create({name, slug})

        res.status(201).json({
            data : category
        })

    } catch(err) {
        res.status(400).json({
            error: errorHandler(err)
        })

    }


}

// getAllCategories, getCategory, removeCategory

exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find({})
        res.status(200).json({
            data : categories
        })

    } catch(err) {
        res.status(400).json({
            error: errorHandler(err)
        })

    }

}


exports.getCategory = async (req,res) => {
    try{
        const slug = req.params.slug.toLowerCase()

        const category = await Category.findOne({slug}) 
        if(!category) throw new Error('cant find the requested category')
        const blogs = Blog.find({categories: category})
        blogs.populate('categories', '_id name slug')
             .populate('tags', '_id name slug')
             .populate('postedBy', 'id name')
             .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        const data = await blogs
        res.status(200).json({
             category, blogs: data 
        })

    } catch(err){
        res.status(400).json({
            error: errorHandler(err)
        })

    }
}


exports.removeCategory = async (req,res) => {
    try{
        const slug = req.params.slug.toLowerCase()
        const category = await Category.findOne({slug})
        if(!category) throw new Error('slug doesnt exists, enter valid slug')
         await Category.findOneAndRemove({slug}) 
         res.status(200).json({
            message : 'deleted successfully'
        })

    } catch(err){
        res.status(400).json({
            error: errorHandler(err)
        })

    }
}