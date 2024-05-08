const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

//routes
const userRouter = require("./routes/user.route");
const recipeRouter = require("./routes/recipe.route");

const { pageNotFound, serverNotFound } = require("./middlewares/handleErrors");

// reads all the content from the file .env and puts its values ​​into process.env
require('dotenv').config();

// database connection
require('./config/db')

const app = express();

//middlewares
app.use(express.json()); // req.body for json data
app.use(express.urlencoded({ extended: true }));// req.body for form-data (with files)
app.use(morgan("dev"));// print the information of each request
app.use(cors()); // allows access to all addresses

app.get("/", (req, res) => {
    res.send("wellcome");
})
app.use("/recipes", recipeRouter);
app.use("/users", userRouter);

// if we got here - path is not found
app.use(pageNotFound);
app.use(serverNotFound);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("running at http://localhost:" + port);
});