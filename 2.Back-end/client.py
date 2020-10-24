import socket
import cv2
import numpy as np

HOST = 'localhost'
PORT = 8080

client_sockt = socket.socket()
client_sockt.connect((HOST, PORT))

path = './cfile21.uf.252422355201F9261A9990.jpg'
with open(path, 'rb') as f:
    img = f.read()
data = np.array(img)
stringData = data.tostring()
size = str(len(stringData)).ljust(16)

client_sockt.sendall('10'.encode())
client_sockt.sendall( size.encode() );
client_sockt.sendall( stringData );
recvData = client_sockt.recv(1024).decode()
client_sockt.close()
print(recvData)
