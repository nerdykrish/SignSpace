import cv2
import mediapipe as mp
import numpy as np
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Paths and setup
dataset_path = 'C:/Users/nikun/Downloads/asl_alphabet_test/asl_alphabet_test'  # Update to your dataset path
model_save_path = 'asl_rf_model.joblib'
mp_hands = mp.solutions.hands

# Step 1: Extract Landmarks from Images Using MediaPipe Hands
def extract_landmarks(dataset_path):
    hands = mp_hands.Hands(static_image_mode=True, max_num_hands=1, min_detection_confidence=0.5)
    landmarks_data = []
    labels_data = []
    labels = sorted(os.listdir(dataset_path))

    for label in labels:
        label_path = os.path.join(dataset_path, label)
        for img_file in os.listdir(label_path):
            img_path = os.path.join(label_path, img_file)
            image = cv2.imread(img_path)
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            result = hands.process(image_rgb)
            if result.multi_hand_landmarks:
                for hand_landmarks in result.multi_hand_landmarks:
                    landmarks = []
                    for lm in hand_landmarks.landmark:
                        landmarks.extend([lm.x, lm.y, lm.z])
                    landmarks_data.append(landmarks)
                    labels_data.append(label)

    hands.close()
    return landmarks_data, labels_data

# Step 2: Preprocess Data for Training
def preprocess_data(landmarks_data, labels_data):
    df = pd.DataFrame(landmarks_data)
    df['label'] = labels_data
    label_encoder = LabelEncoder()
    df['label'] = label_encoder.fit_transform(df['label'])
    X = df.drop('label', axis=1).values
    y = df['label'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=20)
    return X_train, X_test, y_train, y_test, label_encoder

# Step 3: Train a Classifier with Scikit-Learn
def train_model(X_train, y_train):
    model = RandomForestClassifier(n_estimators=150, random_state=20)
    model.fit(X_train, y_train)
    return model

# Step 4: Save and Load the Model
def save_model(model, path):
    joblib.dump(model, path)

def load_model(path):
    return joblib.load(path)

# Step 5: Real-Time ASL Recognition with Webcam Input
def real_time_recognition(model, label_encoder):
    cap = cv2.VideoCapture(0)
    with mp_hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5) as hands:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(frame_rgb)

            if result.multi_hand_landmarks:
                for hand_landmarks in result.multi_hand_landmarks:
                    landmarks = [lm.x for lm in hand_landmarks.landmark] + \
                                [lm.y for lm in hand_landmarks.landmark] + \
                                [lm.z for lm in hand_landmarks.landmark]
                    landmarks = np.array(landmarks).reshape(1, -1)
                    pred = model.predict(landmarks)
                    label = label_encoder.inverse_transform(pred)
                    print(f"Predicted ASL letter: {label[0]}")

            cv2.imshow('ASL Recognition', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

# Main flow
if __name__ == "__main__":
    # Step 1 and 2: Extract landmarks and preprocess data
    print("Extracting landmarks...")
    landmarks_data, labels_data = extract_landmarks(dataset_path)
    X_train, X_test, y_train, y_test, label_encoder = preprocess_data(landmarks_data, labels_data)

    # Step 3: Train model
    print("Training model...")
    model = train_model(X_train, y_train)

    # Step 4: Evaluate and save the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f'Test accuracy: {accuracy:.4f}')
    save_model(model, model_save_path)

    # Step 5: Real-time recognition
    print("Starting real-time ASL recognition...")
    model = load_model(model_save_path)
    real_time_recognition(model, label_encoder)