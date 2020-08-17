const { promisify } = require("util");
const shortid = require("shortid");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const { errorHandler } = require("../helpers/dbErrorHandler");
const Blog = require("../models/blogModel");
const _ = require("lodash");
const {OAuth2Client} = require('google-auth-library')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
  });
  user.password = undefined;
  const { name, email, username, profile, role } = user;
  res.status(statusCode).json({
    message: "success",
    data: {
      token,
      user: { name, email, username, profile, role },
    },
  });
};

exports.signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user)
      return res.status(400).json({
        message: "Email is already taken",
      });

    const { name, email, password } = req.body;
    let username = shortid.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    await User.create({
      name,
      email,
      password,
      profile,
      username,
      ...req.body,
    });
    res.status(201).json({
      message: "signup success, Please sign in",
    });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select("+password");

    // check if user exists and password is correct
    if (!user || !(await user.authenticate(password, user.password)))
      return res.status(401).json({ error: "incorrect email or password" });

    //if everything ok, send token
    createSendToken(user, 200, res);
  } catch (err) {
    res.json({
      error: "something went very wrong",
    });
  }
};

exports.signout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    message: "signed out!",
  });
};

exports.protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(404).json({
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded._id);
    
    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token does no longer exist.",
      });
    }
    // GRANT ACCESS TO PROTECTED ROUTE

    req.user = currentUser;
    next();
  } catch (err) {
    res.json({
      message: err,
    });
  }
};

exports.restrictToAdmin = async (req, res, next) => {
  try {
    const adminUserId = req.user._id;
    const user = await User.findById({ _id: adminUserId });
    if (user.role !== 1) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    next();
  } catch (err) {
    res.status(400).json({
      error: "access denied",
    });
  }
};

exports.canUpdateDeleteBlog = async (req, res, next) => {
  try {
    const slug = req.params.slug.toLowerCase();
    const blog = await Blog.findOne({ slug });
    let authorizedUser =
      blog.postedBy._id.toString() === req.user._id.toString();
    if (!authorizedUser) throw new Error("you are not authorized");
    next();
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("user with the email not exist");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: "10m",
    });
    const emailData = {
      to: email,
      from: "stinsonbarney1991@gmail.com",
      subject: `password reset link`,
      //text: `Email received from contact form \n sender name : ${name} \n  sender email : ${email} \n sender message : ${message}`,
      html: `
                <p>use this link to reset pwd</p>
                <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensetive information</p>
                <p>https://seoblog.com</p>
            
            `,
    };
    await user.updateOne({ resetPasswordLink: token });
    sgMail.send(emailData).then(sent => {
      return res.json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`
      });
  })
  } catch (err) {
    res.json({
      error: errorHandler(err),
    });
  }
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: "Expired link. Try again",
        });
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(401).json({
            error: "Something went wrong. Try later",
          });
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: "",
          passwordConfirm: newPassword,
        };

        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          }
          res.json({
            message: `Great! Now you can login with your new password`,
          });
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req,res) => {
  const idToken = req.body.tokenId
  client.verifyIdToken({idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
    const {email_verified, name, email, jti} = response.payload
    if (email_verified) {
      User.findOne({ email }).exec((err, user) => {
          if (user) {
              // console.log(user)
              const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
              res.cookie('token', token, { expiresIn: '1d' });
              const { _id, email, name, role, username } = user;
              return res.json({ token, user: { _id, email, name, role, username } });
          } else {
              let username = shortid.generate();
              let profile = `${process.env.CLIENT_URL}/profile/${username}`;
              let passwordConfirm = jti;
              let password = jti;
              user = new User({ name, email, profile, username, password, passwordConfirm });
              user.save((err, data) => { 
                  if (err) {
                      return res.status(400).json({
                          error: errorHandler(err)
                      });
                  }
                  const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                  res.cookie('token', token, { expiresIn: '1d' });
                  const { _id, email, name, role, username } = data;
                  return res.json({ token, user: { _id, email, name, role, username } });
              });
          }
      });
  } else {
      return res.status(400).json({
          error: 'Google login failed. Try again.'
      });
  }
  })


}