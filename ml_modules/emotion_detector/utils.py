# import cv2
# import numpy as np


# def preprocess_face(image_path):
#     face_cascade = cv2.CascadeClassifier(
#         cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
#     )
#     img = cv2.imread(image_path)
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     faces = face_cascade.detectMultiScale(gray, 1.3, 5)
#     if len(faces) == 0:
#         return None
#     (x, y, w, h) = faces[0]
#     face = gray[y : y + h, x : x + w]
#     face = cv2.resize(face, (48, 48)) / 255.0
#     return np.expand_dims(face, axis=(0, -1))









# import cv2
# import numpy as np


# def preprocess_face(image_path):
#     # Load Haar Cascade
#     face_cascade = cv2.CascadeClassifier(
#         cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
#     )

#     # Read image
#     img = cv2.imread(image_path)

#     # Check if image exists
#     if img is None:
#         print(f"Image not found: {image_path}")
#         return None

#     # Convert to grayscale
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#     # Detect faces
#     faces = face_cascade.detectMultiScale(
#         gray,
#         scaleFactor=1.3,
#         minNeighbors=5
#     )

#     # No face found
#     if len(faces) == 0:
#         print("No face detected.")
#         return None

#     # Crop first detected face
#     x, y, w, h = faces[0]
#     face = gray[y:y+h, x:x+w]

#     # Resize to model input
#     face = cv2.resize(face, (48, 48))

#     # Normalize
#     face = face.astype("float32") / 255.0

#     # Add batch & channel dimensions
#     face = np.expand_dims(face, axis=(0, -1))

#     return face



"""
Utility functions for Emotion Detection.

Reserved for future preprocessing utilities.
"""


import os


def image_exists(image_path):
    """
    Check whether image exists.
    """
    return os.path.exists(image_path)