import cv2
import numpy as np
import socket

HOST = 'localhost'
PORT = 8080

path = 'D:/Git/2020_Contest/2020_hanium_Ai_Tour/4.image/cfile21.uf.252422355201F9261A9990.jpg'
with open(path, 'rb') as f:
    img = f.read()
data = np.array(img)
stringData = data.tostring()
size = str(len(stringData)).ljust(16)

print(size)
client_sockt = socket.socket()
client_sockt.connect((HOST, PORT))
client_sockt.sendall('10'.encode())
client_sockt.sendall( size.encode() );
client_sockt.sendall( stringData );