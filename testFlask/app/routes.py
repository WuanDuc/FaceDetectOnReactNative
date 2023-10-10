from app import app 
from flask import render_template, send_file
from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
import cv2
import numpy as np
from base64 import b64decode
import imutils

# def detect(frame):

#   print("[INFO] loading model...")
#   prototxt = 'deploy.prototxt'
#   model = 'res10_300x300_ssd_iter_140000.caffemodel'
#   net = cv2.dnn.readNetFromCaffe(prototxt, model)
#   frameOpencvDnn = frame.copy()
#   frameHeight = frameOpencvDnn.shape[0]
#   frameWidth = frameOpencvDnn.shape[1]
#   blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)

#   net.setInput(blob)
#   detections = net.forward()
#   bboxes = []
#   for i in range(detections.shape[2]):
#       confidence = detections[0, 0, i, 2]
#       #if confidence > conf_threshold:
#       if confidence > 0.3:
#             x1 = int(detections[0, 0, i, 3] * frameWidth)
#             y1 = int(detections[0, 0, i, 4] * frameHeight)
#             x2 = int(detections[0, 0, i, 5] * frameWidth)
#             y2 = int(detections[0, 0, i, 6] * frameHeight)
#             bboxes.append([x1, y1, x2, y2])
#             cv2.rectangle(frameOpencvDnn, (x1, y1), (x2, y2), (0, 255, 0), int(round(frameHeight/150)), 8)
#   return frameOpencvDnn

def getFaceBox(net, frame, conf_threshold=0.7):
    frameOpencvDnn = frame.copy()
    frameHeight = frameOpencvDnn.shape[0]
    frameWidth = frameOpencvDnn.shape[1]
    blob = cv2.dnn.blobFromImage(frameOpencvDnn, 1.0, (300, 300), [104, 117, 123], True, False)

    net.setInput(blob)
    detections = net.forward()
    bboxes = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > conf_threshold:
            x1 = int(detections[0, 0, i, 3] * frameWidth)
            y1 = int(detections[0, 0, i, 4] * frameHeight)
            x2 = int(detections[0, 0, i, 5] * frameWidth)
            y2 = int(detections[0, 0, i, 6] * frameHeight)
            bboxes.append([x1, y1, x2, y2])
            cv2.rectangle(frameOpencvDnn, (x1, y1), (x2, y2), (0, 255, 0), int(round(frameHeight/150)), 8)
    return frameOpencvDnn, bboxes

faceProto = "deploy.prototxt"
faceModel = "res10_300x300_ssd_iter_140000.caffemodel"

ageProto = "modelNweight/age_deploy.prototxt"
ageModel = "modelNweight/age_net.caffemodel"

genderProto = "modelNweight/gender_deploy.prototxt"
genderModel = "modelNweight/gender_net.caffemodel"

MODEL_MEAN_VALUES = (78.4263377603, 87.7689143744, 114.895847746)
ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)']
genderList = ['Male', 'Female']

# Load network
ageNet = cv2.dnn.readNet(ageModel, ageProto)
genderNet = cv2.dnn.readNet(genderModel, genderProto)
faceNet = cv2.dnn.readNet(faceModel, faceProto)

padding = 20

def age_gender_detector(frame):
    # Read frame
    t = time.time()
    frameFace, bboxes = getFaceBox(faceNet, frame)
    for bbox in bboxes:
        # print(bbox)
        face = frame[max(0,bbox[1]-padding):min(bbox[3]+padding,frame.shape[0]-1),max(0,bbox[0]-padding):min(bbox[2]+padding, frame.shape[1]-1)]

        blob = cv2.dnn.blobFromImage(face, 1.0, (227, 227), MODEL_MEAN_VALUES, swapRB=False)
        genderNet.setInput(blob)
        genderPreds = genderNet.forward()
        gender = genderList[genderPreds[0].argmax()]
        ageNet.setInput(blob)
        agePreds = ageNet.forward()
        age = ageList[agePreds[0].argmax()]

        label = "{},{}".format(gender, age)
        cv2.putText(frameFace, label, (bbox[0], bbox[1]-10), cv2.FONT_HERSHEY_COMPLEX_SMALL, 0.8, (0, 255, 255), 1, cv2.LINE_AA)
    return frameFace

def detectImg():
    img = cv2.imread(('image.jpeg'))
    output_img = age_gender_detector(img)
    cv2.imwrite("image_output.jpeg", output_img)

def detectVideo():
    video_path = 'video.mp4'
    output_video_path = 'output_video.mp4'
    cap = cv2.VideoCapture(video_path)
    frame_width = int(cap.get(3))
    frame_height = int(cap.get(4))
    fps = int(cap.get(5))
    print(frame_width)
    print(frame_height)
    print(fps)

    # Khởi tạo video output
    out = cv2.VideoWriter(output_video_path, cv2.VideoWriter_fourcc(*'mjpg'), fps, (frame_width, frame_height))
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Detect khuôn mặt trên frame
        image = age_gender_detector(frame)
        print(f'Image {image}')

        # # Ghi frame đã detect vào video output
        out.write(image)
    cv2.destroyAllWindows()
    cap.release()
    out.release()

# def detect():
#     #image = cv2.imread(image_file, cv2.IMREAD_UNCHANGED)
#     image = cv2.imread('image.jpeg')

#     # resize it to have a maximum width of 400 pixels
#     image = imutils.resize(image, width=400)
#     (h, w) = image.shape[:2]
#     print(w,h)
#     #cv2_imshow(image)
#     print("[INFO] loading model...")
#     prototxt = 'deploy.prototxt'
#     model = 'res10_300x300_ssd_iter_140000.caffemodel'
#     net = cv2.dnn.readNetFromCaffe(prototxt, model)
#     image = imutils.resize(image, width=400)
#     blob = cv2.dnn.blobFromImage(cv2.resize(image, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
#     print("[INFO] computing object detections...")
#     net.setInput(blob)
#     detections = net.forward()
#     for i in range(0, detections.shape[2]):

#         # extract the confidence (i.e., probability) associated with the prediction
#         confidence = detections[0, 0, i, 2]
#         # filter out weak detections by ensuring the `confidence` is
#         # greater than the minimum confidence threshold
#         if confidence > 0.3:
#             # compute the (x, y)-coordinates of the bounding box for the object
#             box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#             (startX, startY, endX, endY) = box.astype("int")
#             print(startX,startY,endX,endY)
#             # draw the bounding box of the face along with the associated probability
#             text = "{:.2f}%".format(confidence * 100)
#             y = startY - 10 if startY - 10 > 10 else startY + 10
#             cv2.rectangle(image, (startX, startY), (endX, endY), (0, 0, 255), 2)
#             cv2.putText(image, text, (startX, y),
#                 cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
#             cv2.imwrite("image.jpeg", image)


@app.route('/') 
@app.route('/index')
def index():
    user = {'username': 'Wuan'}
    return render_template('index.html', title='Home', user=user)
@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        bytesOfImage = request.get_data()
        with open('image.jpeg', 'wb') as out:
            out.write(bytesOfImage)
        detectImg()
        return "Image read"
@app.route("/video", methods=['GET', 'POST'])
def video():
    if(request.method == "POST"):
        bytesOfVideo = request.get_data()
        with open('video.mp4', 'wb') as out:
            out.write(bytesOfVideo)
        detectVideo()
        return "Video read"
@app.route("/get_image", methods=['GET'])
def get_image():
    image_path = 'image.jpeg'
    
    try:
        return send_file(image_path, mimetype='image/jpeg')
    except FileNotFoundError:
        return "Image not found", 404