// Import and create a new Express app //
const express = require("express");
const app = express();

const {gen, api_responses} = require("./utilities/create_response");

// Load the contents of the .env file into the process.env variable //
const dotenv = require("dotenv");
dotenv.config();

// Allow us to parse file upload requests //
const fileUpload = require("express-fileupload");

// MongoDB setup //
const db = require("./models");
db.mongoose.set("useCreateIndex", true); // https://github.com/Automattic/mongoose/issues/6890#issuecomment-416218953 //
db.mongoose.connect(db.connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch(err => {
    console.log("An error occurred when connecting to the MongoDB database: ", err);
    process.exit();
});

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

// MQTT Commands //
var mqtt = require('mqtt')

var options = {
    username: "test",
    password: "test"
}

var client  = mqtt.connect('mqtt://homesecurity.jakestringer.dev', options)

client.on('connect', function () {
    console.log("MQTT connected")
    // client.publish('arm_system', "DISARM")
})
app.post("/api/arm-home", (req, res) => {
    console.log("Arm recieved")
    client.publish('arm_system', "ARM")
    return res.send(gen({}))
    
})
app.post("/api/disarm-home", (req, res) => {
    console.log("Disarm recieved")
    client.publish('arm_system', "DISARM")
    return res.send(gen({}))
})

// END MQTT //

app.use(express.json()); // So we can parse and use JSON //
app.use(fileUpload({createParentPath: true})); // https://attacomsian.com/blog/uploading-files-nodejs-express //
app.use("/uploaded", express.static(__dirname + "/uploaded")); // Expose the 'uploaded' folder //

app.listen(5000, () => console.log("Server is up and running."));

// Routes //
const uploadRouter = require("./routes/upload.routes");
const feedRouter = require("./routes/feed.routes");
const eventRouter = require("./routes/event.routes");
app.use("/api", [uploadRouter, feedRouter]);
app.use("/api/events", eventRouter);

module.exports = app;