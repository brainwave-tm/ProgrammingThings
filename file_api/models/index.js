const database_config = require("../config/db.config");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = {
    mongoose: mongoose,
    connection_string: database_config.db_connection_string
}