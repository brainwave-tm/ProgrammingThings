import paho.mqtt.client as mqtt # Import the MQTT library
import time # The time library is useful for delays
import requests
import pygame
import pygame.camera
import json

clientUsername = "homesecurity"
clientPassword = "eKsF3pQfJWttgevpP2n6CyRWQaeGx5ZdUntYNQ8x7QwrXetcQWPuj7gC5T6EUVpfGJRZ3"

url = "https://api.homesecurity.jakestringer.dev/api/upload"
payload = {'detected_face': 'false'}
headers = {}

pygame.camera.init()
pygame.camera.list_cameras()
cam = pygame.camera.Camera("/dev/video0", (500, 500))
systemArmed = False    

# Our "on message" event
def messageFunction (client, userdata, message):
    global systemArmed
    topic = str(message.topic)
    message = str(message.payload.decode("utf-8"))
    if topic == "ARM_SYSTEM":
        if message == "ARM":
            systemArmed = True
        elif message == "DISARM":
            systemArmed = False
    print(topic + " | " + message)

# Main program loop
def execute_app():
    while(1):
        print('----------')
        if systemArmed == True:
            print('System Armed')
        else:
            print('System Unarmed')
        
        cam.start()
        time.sleep(0.1)
        img = cam.get_image()
        pygame.image.save(img, "/home/pi/Documents/feed.jpg")
        print("Pic taken")
        cam.stop()

        files=[
            ('feed',('feed.jpg',open('/home/pi/Documents/feed.jpg', 'rb'), 'image/png'))
        ]
        
        response = requests.request("POST", url, headers=headers, data=payload, files=files)
        jsonResp = json.loads(response.text)
        print(jsonResp['code'])

        time.sleep(5) # Wait for selected time

def main():
    try:
        execute_app()
    finally:
        ourClient.publish("PI_ONLINE", "FALSE")
        ourClient.loop_stop()
        ourClient.disconnect()

ourClient = mqtt.Client("pi_middleman") # Create a MQTT client object
ourClient.username_pw_set(username=clientUsername, password=clientPassword)
ourClient.connect("homesecurity.jakestringer.dev", 1883) # Connect to the test MQTT broker
ourClient.subscribe("ARM_SYSTEM") # Subscribe to the topic arm_system
ourClient.on_message = messageFunction # Attach the messageFunction to subscription
ourClient.loop_start() # Start the MQTT client
ourClient.publish("PI_ONLINE", "TRUE")
ourClient.publish("ARM_SYSTEM", "DISARM") # Publish message to MQTT broker
main()
