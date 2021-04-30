import paho.mqtt.client as mqtt # Import the MQTT library
import time # The time library is useful for delays
import requests
import pygame
import pygame.camera
import json

url = "http://api.homesecurity.jakestringer.dev/api/upload"
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
    if topic == "arm_system":
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

        #ourClient.publish("arm_system", "ARM") # Publish message to MQTT broker
        time.sleep(5) # Wait for selected time

def main():
    try:
        execute_app()
    finally:
        ourClient.publish("pi_online", "FALSE")
        ourClient.loop_stop()
        ourClient.disconnect()

ourClient = mqtt.Client("pi_middleman") # Create a MQTT client object
ourClient.username_pw_set(username="homesecurity", password="SQgYS6amWzZmx66d5a7x4n6P2B2k3WpRF8qXtZHg4nMeeXKFpw73vNPaHbKjpEDMav28ZH9KEXk3qgPyZBmxJWGu8L6vkWcFqcEc")
ourClient.connect("homesecurity.jakestringer.dev", 1883) # Connect to the test MQTT broker
ourClient.subscribe("arm_system") # Subscribe to the topic arm_system
ourClient.on_message = messageFunction # Attach the messageFunction to subscription
ourClient.loop_start() # Start the MQTT client
ourClient.publish("pi_online", "TRUE")
ourClient.publish("arm_system", "DISARM") # Publish message to MQTT broker
main()
