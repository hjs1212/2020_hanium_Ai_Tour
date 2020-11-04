from tensorflow import keras
from _thread import *
import socket
import cv2
import numpy as np

#HOST = '52.149.162.33'
HOST = '127.0.0.1'
PORT = 8080

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind((HOST, PORT))

image_w = 127
image_h = 127

Model = keras.models.load_model("kor.h5")

reSizing = lambda img : cv2.resize(img, None, fx=image_w/img.shape[1], fy=image_h/img.shape[0])

def recv(sock, count):
       buf = b''
       while count:
           newbuf = sock.recv(count)
           if not newbuf: return None
           buf += newbuf
           count -= len(newbuf)
       return buf

def connUser(client_socket, addr) :
    print('connected {}'.format(addr[0]))
    while True :
        try :
            useLang = recv(client_socket,2).decode()
            length = recv(client_socket,16).decode()
            recvData = recv(client_socket, int(length))
            data = np.fromstring(recvData, dtype=np.uint8)
            img = cv2.imdecode(data, 1)
            X = []
            X.append(reSizing(img)/256)
            X = np.array(X)
            msg = ''
            pred = User(X)
            if len(pred) == 0 :
                msg = 0
            else :
                if useLang == '10' :
                    msg = korCategories[pred[0]]
                elif useLang == '20' :
                    msg = engCategories[pred[0]]
            client_socket.sendall(str(msg).encode())
        except Exception as e:
            break
    client_socket.close()

User = lambda img : Model.predict_classes(img)
korCategories = [126508, 126535, 128019, 126474, 129438, 250331, 264590, 126451, 126175, 127923]
engCategories = [264377, 264550, 264244, 264222, 616253, 264421, 264591, 1052165, 264238, 264128]


if __name__ == '__main__' :
    server_socket.listen()
    print('wait')
    
    while True :
        client_socket, addr = server_socket.accept()
        start_new_thread(connUser, (client_socket, addr))
    server_socket.close()