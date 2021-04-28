import paho.mqtt.client as mqtt # Import the MQTT library
import time # The time library is useful for delays
import requests
import pygame
import pygame.camera

url = "http://api.homesecurity.jakestringer.dev/api/upload"
payload = {'detected_face': 'feed'}
headers = {}

pygame.camera.init()
pygame.camera.list_cameras()
cam = pygame.camera.Camera("/dev/video0", (1920, 1080))

# Our "on message" event
def messageFunction (client, userdata, message):
    topic = str(message.topic)
    message = str(message.payload.decode("utf-8"))
    print(topic + " | " + message)

#ourClient = mqtt.Client("makerio_mqtt") # Create a MQTT client object
#ourClient.connect("homesecurity.jakestringer.dev", 1883) # Connect to the test MQTT broker
#ourClient.subscribe("arm_system") # Subscribe to the topic arm_system
#ourClient.on_message = messageFunction # Attach the messageFunction to subscription
#ourClient.loop_start() # Start the MQTT client

armed = False

# Main program loop
while(1):
    print('----------')
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
    print(response.text)

    #ourClient.publish("arm_system", "ARM") # Publish message to MQTT broker
    time.sleep(5) # Sleep for a second
