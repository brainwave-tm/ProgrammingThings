// Import and create a new Express app //
const express = require("express");
const app = express();

// Load the contents of the .env file into the process.env variable //
const dotenv = require("dotenv");
dotenv.config();

// Allow us to parse file upload requests //
const fileUpload = require("express-fileupload");

// CORS //
const cors = require("cors");
app.use(cors({origin: "*"}));
app.options("*", cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});


app.use(express.json()); // So we can parse and use JSON //
app.use(fileUpload({createParentPath: true})); // https://attacomsian.com/blog/uploading-files-nodejs-express //
app.use("/uploaded", express.static(__dirname + "/uploaded")); // Expose the 'uploaded' folder //

app.listen(5000, () => console.log("Server is up and running."));

// Routes //
const uploadRouter = require("./routes/upload.routes");
const feedRouter = require("./routes/feed.routes");
app.use("/api", [uploadRouter, feedRouter]);

module.exports = app;