var mqtt = require('mqtt')

//  + Math.random().toString()

class MQTTClient {
    constructor() {
        var options = {
            clientId: 'file_api',
            username: process.env.BROKER_USERNAME,
            password: process.env.BROKER_PASSWORD,
            clean: true
        }

        this.client = mqtt.connect('mqtt://homesecurity.jakestringer.dev', options)
    }
}

module.exports = new MQTTClient();