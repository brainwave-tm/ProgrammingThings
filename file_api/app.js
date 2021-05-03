// Import and create a new Express app //
const express = require("express");
const app = express();

const { gen, api_responses } = require("./utilities/create_response");
const eventModel = require("./models/event.model");
const _ = require("lodash");
const enums = require("./utilities/enums");

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
app.use(cors({ origin: "*" }));
app.options("*", cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    next();
});

// MQTT Commands //
var client = require("./classes/mqtt-client").client

client.on('connect', function (packet) {
    console.log("MQTT connected")
    client.subscribe([enums.EVENT_TYPE.PI_ONLINE, enums.EVENT_TYPE.ARM_SYSTEM]);
});

client.on('message', function (topic, message, packet) {
    console.log("Received information from client: ", topic, message.toString())
    if (topic == enums.EVENT_TYPE.PI_ONLINE || topic == enums.EVENT_TYPE.ARM_SYSTEM) {
        let event = new eventModel({type: topic, timestamp: Date.now(), value: message});
        event.validate((err) => {
            if (err) console.log("Error in message: " + err.message)
            event.save()
                .then(doc => console.log("Event Saved in DB: " + doc.toString()))
                .catch(err => console.log("Error in saving: " + err.message))
                .finally(() => console.log("Done"));
        })
    }
});

client.on("error",function(error){
    console.log(error)
})

// END MQTT //

app.use(express.json()); // So we can parse and use JSON //
app.use(fileUpload({ createParentPath: true })); // https://attacomsian.com/blog/uploading-files-nodejs-express //
app.use("/uploaded", express.static(__dirname + "/uploaded")); // Expose the 'uploaded' folder //

app.listen(5000, () => console.log("Server is up and running."));

// Routes //
const uploadRouter = require("./routes/upload.routes");
const feedRouter = require("./routes/feed.routes");
const eventRouter = require("./routes/event.routes");
const armRouter = require("./routes/arm.routes");
app.use("/api", [uploadRouter, feedRouter, armRouter]);
app.use("/api/events", eventRouter);

function exitHandler(code) {
    console.log(code);
    console.log("I am disconnecting");
    client.removeAllListeners();
    client.end();
}

process.on("SIGINT", exitHandler.bind(null, "SIGINT"))
process.on("exit", exitHandler.bind(null, "exit"))
process.on("beforeExit", exitHandler.bind(null, "beforeExit"))
process.on("SIGUSR1", exitHandler.bind(null, "SIGUSR1"));
process.on("SIGUSR2", exitHandler.bind(null, "SIGUSR2"));
process.on("uncaughtException", exitHandler.bind(null, "SIGINT"));

module.exports = app;