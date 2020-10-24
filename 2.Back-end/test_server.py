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

reSizing = lambda img : cv2.resize(img, None, fx=image_w/img.shape[1], fy=image_h/img.shape[0])

def recv(sock, count):
       buf = b''
       while count:
           newbuf = sock.recv(count)
           if not newbuf: return None
           buf += newbuf
           count -= len(newbuf)
       return buf

if __name__ == '__main__' :
    server_socket.listen()
    print('wait')
    client_socket, addr = server_socket.accept()
    useLang = recv(client_socket,2).decode()
    print(useLang)
    length = recv(client_socket,16).decode()
    print(int(length))
    recvData = recv(client_socket, int(length))
    data = np.fromstring(recvData, dtype=np.uint8)
    img = cv2.imdecode(data, 1)
    img = reSizing(img) 
    client_socket.close()
    server_socket.close()