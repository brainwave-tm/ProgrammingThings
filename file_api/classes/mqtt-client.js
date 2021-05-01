var mqtt = require('mqtt')

class MQTTClient {
    constructor() {
        var options = {
            clientId: (process.env.LOCAL === "true" ? "LOCAL_INSTANCE_" : "SERVER_INSTANCE_") + 'file_api_' + Math.random().toString(),
            username: process.env.BROKER_USERNAME,
            password: process.env.BROKER_PASSWORD,
            clean: true
        }

        this.client = mqtt.connect('mqtt://homesecurity.jakestringer.dev', options)

        this.client.removeAllListeners();
    }
}

module.exports = new MQTTClient();