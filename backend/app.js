const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const blogRouter = require("./routes/blog");
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const categoryRouter = require('./routes/category')
const tagRouter = require('./routes/tag')
const formRouter = require('./routes/form')

const app = express();

console.log(process.env.PORT);

app.use(morgan("dev"));
app.use(bodyParser.json())
app.use(cookieParser())

if (process.env.NODE_ENV === "development")
  app.use(cors({ origin: process.env.CLIENT_URL }));

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/users", authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/categories',categoryRouter)
app.use('/api/v1/tags',tagRouter)
app.use('/api/v1/contact', formRouter)
module.exports = app;
