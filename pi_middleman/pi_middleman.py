import paho.mqtt.client as mqtt # Import the MQTT library
import time # The time library is useful for delays
import requests

url = "https://api.homesecurity.jakestringer.dev/api/upload"
payload = {'detected_face': 'false'}
files=[
    ('feed',('buetiful2.jpg',open('/home/pi/Documents/buetiful2.jpg', 'rb'), 'image/png'))
]
headers = {}

# Our "on message" event
def messageFunction (client, userdata, message):
    topic = str(message.topic)
    message = str(message.payload.decode("utf-8"))
    print(topic + " | " + message)

ourClient = mqtt.Client("piMiddleman") # Create a MQTT client object
ourClient.connect("homesecurity.jakestringer.dev", 1883) # Connect to the test MQTT broker
ourClient.subscribe("arm_system") # Subscribe to the topic arm_system
ourClient.on_message = messageFunction # Attach the messageFunction to subscription
ourClient.loop_start() # Start the MQTT client

armed = False

# Main program loop
while(1):
    response = requests.request("POST", url, headers=headers, data=payload, files=files)
    print(response.text)

    ourClient.publish("arm_system", "ARM") # Publish message to MQTT broker
    time.sleep(1000) # Sleep for a second
