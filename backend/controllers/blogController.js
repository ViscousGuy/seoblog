const fs = require("fs");
const _ = require("lodash");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const Blog = require("./../models/blogModel");
const Category = require("./../models/categoryModel");
const Tag = require("./../models/tagModel");
const { errorHandler } = require("./../helpers/dbErrorHandler");
const { smartTrim } = require("./../helpers/blog");
const User = require("../models/userModel");

exports.create = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //const formData = await form.parse(req)
    const formFields = await new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      }); // form.parse
    });
    //console.log(formFields)
    const { title, body, categories, tags } = formFields.fields;
    if (!title) throw new Error(">>title is required");
    if (!body || body.length < 200) throw new Error(">>content too short");
    if (!categories || categories.length === 0)
      throw new Error(">>category is required");
    if (!tags || tags.length === 0) throw new Error(">>tag is required");
    const arrayOfCategories = categories && categories.split(",");
    const arrayOfTags = tags && tags.split(",");
    const blog = new Blog({
      title,
      body,
      excerpt: smartTrim(body, 320, " ", "..."),
      slug: slugify(title).toLowerCase(),
      mtitle: `${title} | ${process.env.APP_NAME}`,
      mdesc: stripHtml(body.substring(0, 160)),
      postedBy: req.user._id,
      categories: arrayOfCategories,
      tags: arrayOfTags,
    });

    if (formFields.files.photo) {
      if (formFields.files.photo.size > 10000000) {
        throw new Error("Image should be les than 1mb in size");
      }
      blog.photo.data = fs.readFileSync(formFields.files.photo.path);
      blog.photo.contentType = formFields.files.photo.type;
    }

    const result = await blog.save();

    res.status(201).json({
      blog: result,
    });
  } catch (err) {
    res.status(400).json({
      error: errorHandler(err),
    });
  }
};

exports.list = async (req, res) => {
  try {
    let blogs = Blog.find({});
    blogs.populate("categories", "_id name slug");
    blogs.populate("tags", "_id name slug");
    blogs.populate("postedBy", "_id name username");
    blogs.select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    );
    const data = await blogs;
    res.status(200).json({
      data,
    });
  } catch (err) {
    error: errorHandler(err);
  }
};

exports.listAllBlogsCategoriesTags = async (req, res) => {
  try {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let newBlogs;
    let newTags;
    let newCategories;
    const blogs = Blog.find({});
    blogs.populate("categories", "_id name slug");
    blogs.populate("tags", "_id name slug");
    blogs.populate("postedBy", "_id name username profile");
    blogs.sort({ createdAt: -1 });
    blogs.skip(skip);
    blogs.limit(limit);
    blogs.select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    );
    const data = await blogs;

    newBlogs = data;
    const categories = await Category.find({});
    newCategories = categories;
    const tags = await Tag.find({});
    newTags = tags;
    res.status(200).json({
      blogs: newBlogs,
      categories: newCategories,
      tags: newTags,
      size: newBlogs.length,
    });
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};

exports.read = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = Blog.findOne({ slug });
    blog
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name username")
      .select(
        "_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt"
      );
    const data = await blog;
    if (!data) throw new Error("invalid slug");
    res.status(200).json(data);
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug });
    if (!blog) throw new Error("slug doesnt exists, enter valid slug");
    await Blog.findOneAndRemove({ slug });
    res.json({
      message: "Blog deleted successfully",
    });
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};

exports.update = async (req, res) => {
  try {
    const slug = req.params.slug.toLowerCase();
    let oldBlog = await Blog.findOne({ slug });
    if (!oldBlog) throw new Error("invalid slug");

    const form = new formidable.IncomingForm();
    form.keepExtensions = true;

    //const formData = await form.parse(req)
    const formFields = await new Promise(function (resolve, reject) {
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ fields, files });
      }); // form.parse
    });

    let slugBeforeMerge = oldBlog.slug;
    oldBlog = _.merge(oldBlog, formFields.fields);
    oldBlog.slug = slugBeforeMerge;

    const { body, desc, categories, tags } = formFields.fields;
    if (body) {
      if (body.length < 200) throw new Error(">>content too short");
      oldBlog.excerpt = smartTrim(body, 320, " ", " ...");
      oldBlog.desc = stripHtml(body.substring(0, 160));
    }

    if (categories) {
      oldBlog.categories = categories.split(",");
    }

    if (tags) {
      oldBlog.tags = tags.split(",");
    }

    if (formFields.files.photo) {
      if (formFields.files.photo.size > 10000000)
        throw new Error("image should be less than 10mb");
      oldBlog.photo.data = fs.readFileSync(formFields.files.photo.path);
      oldBlog.photo.contentType = formFields.files.photo.type;
    }
    const result = await oldBlog.save();
    res.status(200).json(result);
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};


exports.photo = async (req, res) => {
  try{
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug }).select('photo')
    if(!blog || !blog.photo) throw new Error('no photo exists for the requested blog')
    res.set('Content-Type', blog.photo.contentType);
    return res.send(blog.photo.data);
    

  } catch(err){
    res.json({
      error: errorHandler(err)
    })
  }
};


exports.listRelated = async (req,res) => {
  try{
    //console.log(req.body)
    
      let limit = req.body.limit ? parseInt(req.body.limit) : 3;
      const { _id, categories } = req.body.blog;
  
      const findBlogs = Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
          findBlogs.limit(limit)
          .populate('postedBy', '_id name profile')
          .select('title slug excerpt postedBy createdAt updatedAt')
      

      const blogs =  await findBlogs
      res.json(blogs);
          
          

  } catch(err){
    res.json({
      error: errorHandler(err)
    })

  }
}


exports.listSearch = async (req,res) => {
  try{
    let blogs;
    const {search} = req.query
    if(search) {
       blogs = await Blog.find({
        $or : [{title: {$regex: search, $options: 'i'}}, {body: {$regex: search, $options: 'i'}}]
      }).select('-photo -body')
    } else{
      throw new Error('invalid query string')
    }
    if(!blogs) throw new Error("no blogs found")
    res.status(200).json(blogs)

  } catch(err){

    res.json({
      error: errorHandler(err)
    })
  }

}


exports.listByUser = async (req,res) => {
  try{
    const user = await User.findOne({username: req.params.username})
    let userId = user._id
    const data = await Blog.find({postedBy: userId}).populate('categories' ,'_id name slug').populate('tags' ,'_id name slug').populate('postedBy' ,'_id name username').select('_id title slug postedBy createdAt updatedAt')
    res.json({
      data
    })
  } catch (err){
    res.json({
      error: errorHandler(err)
    })
  }

}