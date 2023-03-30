import time
from picamera import PiCamera
from gpiozero import MotionSensor
from email_notification import notify_detection
from upload_detection import upload_photo, is_pic_requested
from sensitive_data import sender_email

camera = PiCamera()  # connect to the camera
pir = MotionSensor(17)  # connect to the PIR sensor, (on GPIO pin 17)

current_username = "user1"
# sensitive information stored in a file that will be changed before submitting project
current_notification_email = sender_email

while True:
    # if the PIR sensor detecs motino, OR, if the user presses the button on the dashboard to request a photo
    if pir.motion_detected or is_pic_requested():
        # save photo to current directory under 'detection.jpg'
        camera.capture("detection.jpg")
        print('Took picture')
        # send an email notifying the user of the photo
        notify_detection(current_notification_email)
        # upload an entry to firebase with current date and time
        upload_photo(current_username)
        time.sleep(30)  # to ensure not to notify user multiple times
