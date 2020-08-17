const slugify = require('slugify')
const Tag = require('./../models/tagModel')
const {errorHandler} = require('./../helpers/dbErrorHandler')
const Blog = require('./../models/blogModel')

exports.createTag = async (req, res) => {
    try{
        const {name} = req.body
        const slug = slugify(name).toLowerCase()

        const tag = await Tag.create({name, slug})

        res.status(201).json({
            data : tag
        })

    } catch(err) {
        res.status(400).json({
            error: errorHandler(err)
        })

    }


}



exports.getAllTags = async (req, res) => {
    try{
        const tags = await Tag.find({})
        res.status(200).json({
            data : tags
        })

    } catch(err) {
        res.status(400).json({
            error: errorHandler(err)
        })

    }

}


exports.getTag = async (req,res) => {
    try{
        const slug = req.params.slug.toLowerCase()

        const tag = await Tag.findOne({slug}) 
        if(!tag) throw new Error('cant find the requested tag')
        const blogs = Blog.find({tags: tag})
        blogs.populate('categories', '_id name slug')
             .populate('tags', '_id name slug')
             .populate('postedBy', 'id name')
             .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        const data = await blogs
        res.status(200).json({
             tag, blogs: data 
        })

    } catch(err){
        res.status(400).json({
            error: errorHandler(err)
        })

    }
}


exports.removeTag = async (req,res) => {
    try{
        const slug = req.params.slug.toLowerCase()
        const tag = await Tag.findOne({slug})
         if(!tag) throw new Error('slug doesnt exists, enter valid slug')
         await Tag.findOneAndRemove({slug}) 
         res.status(200).json({
            message : 'deleted successfully'
        })

    } catch(err){
        res.status(400).json({
            error: errorHandler(err)
        })

    }
}