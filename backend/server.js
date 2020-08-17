 require("dotenv").config({
  path: ".env",
});
const app = require("./app");

const mongoose = require("mongoose");


const DB = process.env.DATABASE.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected successfully to the DB");
  });

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log("connected successfully to port " + port);
  });
  
