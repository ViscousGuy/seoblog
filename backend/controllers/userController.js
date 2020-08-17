const _ = require('lodash')
const fs = require('fs')
const formidable = require('formidable')
const User = require('./../models/userModel')
const {errorHandler} = require('./../helpers/dbErrorHandler')
const Blog = require('./../models/blogModel')

exports.getUser = async (req, res) => {
    try {

        const profile = await User.findOne({_id : req.user._id}).select('+password')
        return res.status(200).json({
             profile
        })
    } catch(err) {
        res.json({
            error: errorHandler(err)
        })

    }
    
}


exports.publicProfile = async (req,res) => {
    try{
    const username = req.params.username
    const user = await User.findOne({username})
    if (!user) throw new Error('no user found')
    const userId = user._id
    const blogs = await Blog.find({postedBy : userId}).populate('categories', '_id name slug').populate('tags', '_id name slug').populate('postedBy', '_id name').limit(10).select('_id title slug excerpt categories tags createdAt updatedAt')
    user.photo = undefined
    res.status(200).json({
        user, blogs

    })

    } catch(err){
        res.json({
            error: errorHandler(err)
        })
    }

}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        console.log(fields)
        let user = req.user;
        user = _.extend(user, fields);
        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        User.findByIdAndUpdate(user._id, user, (err, result) => {
            if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json(user);

        })

        // user.save((err, result) => {
        //     if (err) {
        //         return res.status(400).json({
        //             error: errorHandler(err)
        //         });
        //     }
        //     res.json(user);
        // });
    });
};

exports.photo = (req, res) => {
    const username = req.params.username;
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
};