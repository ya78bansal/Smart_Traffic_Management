import cv2
import datetime
import numpy as np
import json
import os
from ultralytics import YOLO
from src.sort import Sort

vehicle_classes = ["car", "motorcycle", "bus", "person", "bike", "ambulance", "accident"]
model = YOLO("../models/yolov8n.pt")

def detect_video(video_path):
    cap = cv2.VideoCapture(video_path)
    frame_id = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_id += 1
        results = model(frame)[0]

        live_counts = {"car":0, "bus":0, "bike":0, "person":0}
        ambulance_detected = False
        accident_detected = False

        for box in results.boxes:
            cls = int(box.cls[0])
            label = results.names[cls]

            if label in ["car"]:
                live_counts["car"] += 1
            elif label in ["bus"]:
                live_counts["bus"] += 1
            elif label in ["motorcycle", "bike"]:
                live_counts["bike"] += 1
            elif label == "person":
                live_counts["person"] += 1
            elif label == "ambulance":
                ambulance_detected = True
            elif label == "accident":
                accident_detected = True

        if frame_id % 30 == 0:
            live_data = {
                "car": live_counts["car"],
                "bus": live_counts["bus"],
                "bike": live_counts["bike"],
                "person": live_counts["person"],
                "ambulance": ambulance_detected,
                "accident": accident_detected,
                "timestamp": datetime.datetime.now().strftime("%H:%M:%S")
            }

            os.makedirs("data", exist_ok=True)
            with open("data/traffic_total.json", "w") as f:
                json.dump([live_data], f, indent=4)

            print("LIVE JSON:", live_data)

    cap.release()

if __name__ == "__main__":
    import sys
    detect_video(sys.argv[1])
