const { gen } = require("../utilities/create_response");
const _ = require("lodash");
const enums = require("../utilities/enums");

// MQTT client //
var client = require("../classes/mqtt-client").client

module.exports.arm_home = (req, res) => {
    client.publish(enums.EVENT_TYPE.ARM_SYSTEM, "ARM")
    return res.send(gen({payload: {"connected": client.connected}}))
}

module.exports.disarm_home = (req, res) => {
    client.publish(enums.EVENT_TYPE.ARM_SYSTEM, "DISARM")
    return res.send(gen({payload: {"connected": client.connected}}))
}