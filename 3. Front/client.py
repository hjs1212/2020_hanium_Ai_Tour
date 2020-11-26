import socket
#import cv2
#import numpy as np

HOST = '10.0.2.4'
PORT = 8080

client_sockt = socket.socket()
client_sockt.connect((HOST, PORT))

path = './uploadFile/100.png'

with open(path, 'rb') as f:
    img = f.read()
    #print(img)
#data = np.array(img)
# stringData = data.tostring()
# size = str(len(stringData)).ljust(16)

imgdata = img

# client_sockt.sendall('10'.encode())
# client_sockt.sendall( size.encode() );
client_sockt.sendall( imgdata );
recvData = client_sockt.recv(1024).decode()
client_sockt.close()
print(recvData)