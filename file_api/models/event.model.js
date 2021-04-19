const mongoose = require("mongoose");

const types = mongoose.Schema.Types;
const eventSchema = new mongoose.Schema({
    type: {type: types.String, required: true},
    timestamp: {type: types.Date, required: true},
    value: {type: types.String, required: true}
})

module.exports = mongoose.model("event", eventSchema);