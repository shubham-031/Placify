# from .utils import preprocess_face
# from .model import load_emotion_model
# import numpy as np

# # List of emotion labels from the FER-2013 dataset
# EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]


# def predict_emotion(image_path):
#     model = load_emotion_model()
#     if model is None:
#         return "Model not loaded", 0.0

#     face = preprocess_face(image_path)
#     if face is None:
#         return "No face detected", 0.0

#     preds = model.predict(face)[0]
#     top = np.argmax(preds)
#     return EMOTIONS[top], float(preds[top])



from deepface import DeepFace


def predict_emotion(image_path):
    """
    Detect dominant emotion from image.

    Returns:
        emotion (str)
        confidence (float)
    """

    try:
        result = DeepFace.analyze(
            img_path=image_path,
            actions=["emotion"],
            enforce_detection=False,
            silent=True
        )

        if isinstance(result, list):
            result = result[0]

        emotion = result["dominant_emotion"]
        confidence = float(result["emotion"][emotion])

        return emotion, confidence

    except Exception as e:
        print("Emotion Detection Error:", e)
        return "Unknown", 0.0