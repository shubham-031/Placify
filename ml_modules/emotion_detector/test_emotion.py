import os

from predict import predict_emotion


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

IMAGE_PATH = os.path.join(
    BASE_DIR,
    "samples",
    "face.jpg"
)

print("=" * 50)
print("PLACIFY EMOTION DETECTION TEST")
print("=" * 50)

print("\nImage Path:")
print(IMAGE_PATH)

emotion, confidence = predict_emotion(IMAGE_PATH)

print("\nPrediction")
print("---------------------------")
print("Emotion    :", emotion)
print("Confidence :", round(confidence, 2), "%")

print("\nCompleted Successfully")