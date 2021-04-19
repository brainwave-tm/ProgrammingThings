# Programming Things #

## Jake - NodeRED Backend API ##
Backend API is currently hosted at **https://api.homesecurity.jakestringer.dev**. Source code for it can be found in the 'file_api' folder in this repository.

NodeRED interface can be found at **https://homesecurity.jakestringer.dev**.
The NodeRED interface currently only features a basic MQTT setup but can be accessed by running a *mosquitto_pub* request to **homesecurity.jakestringer.dev:1883**

e.g. `.\mosquitto_pub -h homesecurity.jakestringer.dev -p 1883 -t arm_system -m "ARM"`

It only accepts the phrases *'ARM'* and *'DISARM'* currently, as well as only the topic *'arm_system'*. It currently doesn't do anything in response to these requests though.

---

## Mike - Raspberry Pi Facial Recognition ##
(fill in as required)

---

## James - Raspberry Pi Backend Communication ##
(fill in as required)

---

## Harrison - Frontend Web UI ##
(fill in as required)

---

## Jack - Arduino and Pi Communication ##
(fill in as required)