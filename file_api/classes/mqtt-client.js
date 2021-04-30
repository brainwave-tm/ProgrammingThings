var mqtt = require('mqtt')

class MQTTClient {
    constructor() {
        var options = {
            clientId: 'file_api' + Math.random().toString(),
            username: process.env.BROKER_USERNAME,
            password: process.env.BROKER_PASSWORD,
            clean: true
        }

        this.client = mqtt.connect('mqtt://homesecurity.jakestringer.dev', options)
    }
}

module.exports = new MQTTClient();