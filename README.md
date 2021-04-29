# Programming Things #

## Jake - NodeRED Backend API ##
Backend API is currently hosted at **https://api.homesecurity.jakestringer.dev**. Source code for it can be found in the 'file_api' folder in this repository.

File API is as follows:

**POST /api/upload** - multipart/form-data request, requires an image with the key 'feed' to be uploaded, and a boolean value 'detected_face'.

**GET /api/recent-faces** - requires pagination parameters (offset/limit), returns recently detected faces, sorted by date newest.

**POST /api/events/new** - requires 'type' (currently only "SYSTEM_ARM") and 'value' ("ARM" or "DISARM"), adds an event to the database.

**GET /api/events** - requires pagination parameters (offset/limit), returns events from the database.

**GET https://api.homesecurity.jakestringer.dev/uploaded/feed.jpg** - the latest feed image.


NodeRED interface can be found at **https://homesecurity.jakestringer.dev**.
The NodeRED interface currently only features a basic MQTT setup but can be accessed by running a *mosquitto_pub* request to **homesecurity.jakestringer.dev:1883**

e.g. `.\mosquitto_pub -h homesecurity.jakestringer.dev -p 1883 -t arm_system -m "ARM"`

It only accepts the phrases *'ARM'* and *'DISARM'* currently, as well as only the topic *'arm_system'*. It automatically adds an event to the database upon receiving either ARM or DISARM.

---

## Mike - Raspberry Pi Facial Recognition ##
(fill in as required)

---

## James - Raspberry Pi Backend Communication ##
(fill in as required)

---

## Harrison - Frontend Web UI ##
The frontend UI consists of 1 small React website that allows a user to interact and view events within the home security system.

The web ui is located in the *'pt-ui'* folder and can be run using the *'npm start'* command.

To connect to the API the URL's located in the *'.env'* file may need to be changed if you want to point it to a local instance of the file_api or the live version.

---

## Jack - Arduino and Pi Communication ##
(fill in as required)