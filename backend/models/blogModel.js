const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        min:3,
        max:160,
        maxlength: 32,
        required: true,
    },
    
    slug: {
        
        type: String,
        unique: true,
        required: true,
        index: 32
    },

    body: {
        type: {},
        required: true,
        min:200,
        max:2000000
    },

    excerpt: {
        type: String,
        max: 1000
    },


    mtitle: {
        type: String
    },

    mdesc: {
        type: String
    },

    photo:{
        data: Buffer,
        contenType: String
    },
    categories: [{type: ObjectId, ref: 'Category', required:true}],
    tags: [{type: ObjectId, ref: 'Tag', required:true}],
    postedBy: {
        type: ObjectId,
        ref : 'User'
    }

}, {
    timestamps: true
})


const Blog = mongoose.model('Blog', blogSchema)


module.exports = Blog
