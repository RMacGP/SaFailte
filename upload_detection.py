import base64
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from time import strftime, gmtime
from sensitive_data import username

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://tionscnamh-riomheolaiochta-default-rtdb.europe-west1.firebasedatabase.app/"
})
ref = db.reference()

# https://www.techcoil.com/blog/how-to-use-python-3-to-convert-your-images-to-base64-encoding/


def get_base64_encoded_image(image_path):
    """
    Encodes an image to base64
    This lets us store an image on firebase as a string, which will be decoded when needed on the frontend
    """
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')


def upload_photo(username):
    """
    Adds a record to detections/$user
    Each record is comprised of
    {
        "date", current_date,
        "time", current_time,
        "image", base64_encoded_image,
        "archived", False by default, can be archived by user on frontend
    }
    """
    current_date = strftime("%d/%m/%Y", gmtime())
    title = strftime("%Y_%m_%d_%H_%M_%S", gmtime())
    current_time = strftime("%H:%M", gmtime())
    encoded_image = get_base64_encoded_image("./detection.jpg")
    record = {"date": current_date,
              "time": current_time,
              "image": encoded_image,
              "archived": False}
    ref.child(
        f"detections/{username}").child(title).set(record)


def is_pic_requested():
    """
    This function is used in main.py to check if a user has requested a picture from the dashboard
    """
    request_state = ref.child(f"users/{username}/take_pic").get()
    if request_state:
        ref.child(f"users/{username}/take_pic").set(False)
        return True
    return False
