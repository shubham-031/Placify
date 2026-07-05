# from tensorflow.keras.models import load_model


# def load_emotion_model(path="ml_modules/emotion_detector/emotion_model.h5"):
#     try:
#         model = load_model(path)
#         return model
#     except Exception as e:
#         print("Error loading model:", e)
#         return None








# from pathlib import Path
# from tensorflow.keras.models import load_model

# BASE_DIR = Path(__file__).resolve().parent

# MODEL_PATH = BASE_DIR / "emotion_model.h5"

# def load_emotion_model():
#     try:
#         return load_model(MODEL_PATH)
#     except Exception as e:
#         print("Error loading model:", e)
#         return None