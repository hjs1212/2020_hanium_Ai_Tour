from keras.models import model_from_json
import socket, threading
import cv2
import numpy as np

#HOST = '52.149.162.33'
HOST = '127.0.0.1'
PORT = 8080

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))

image_w = 128
image_h = 128

json_file = open('korModel.json','r')
load_model = json_file.read()
json_file.close()
korModel = model_from_json(load_model)
korModel.load_weights("kor.h5")
json_file = open('engModel.json','r')
load_model = json_file.read()
json_file.close()
engModel = model_from_json(load_model)
engModel.load_weights("eng.h5")

reSizing = lambda img : cv2.resize(img, None, fx=image_w/img.shape[1], fy=image_h/img.shape[0])

def recv(sock, count):
       buf = b''
       while count:
           newbuf = sock.recv(count)
           if not newbuf: return None
           buf += newbuf
           count -= len(newbuf)
       return buf

korUser = lambda img : korModel.predict(img)
engUser = lambda img : engModel.predict(img)

if __name__ == '__main__' :
    server_socket.listen()
    print('wait')
    client_socket, addr = server_socket.accept()
    print('connected')
    while True :
        useLang = recv(client_socket,2).decode()
        length = recv(client_socket,16).decode()
        recvData = recv(client_socket, int(length))
        data = np.fromstring(recvData, dtype=np.uint8)
        img = cv2.imdecode(data, 1)
        img = reSizing(img) 
        msg = []
        if useLang == '10' :
            msg = korUser(img)
        elif useLang == '20' :
            msg = engUser(img)
        client_socket.sendall(msg.encode())
    client_socket.close()
    server_socket.close()