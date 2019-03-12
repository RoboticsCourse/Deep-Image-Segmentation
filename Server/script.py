import sqlite3
import cv2
import numpy as np
from datetime import datetime
import time
import os
import sys


def create_conn(db_file):
    try:
        conn = sqlite3.connect(db_file,isolation_level=None)
        return conn
    except:
        print("err connecting")
    return None

def getAllImgs(conn):
    cur = conn.cursor()
    cur.execute("SELECT filename,id FROM images")

    rows = cur.fetchall()

    arr = []
    for (filename,id) in rows:
        arr.append((filename.encode('ascii'),id,"IMG"))
    return arr

def getAllData(conn):
    cur = conn.cursor()
    cur.execute("SELECT time,id FROM data")

    rows = cur.fetchall()

    arr = []
    for (time,id) in rows:
        arr.append((time.encode('ascii'),id,"DATA"))
    return arr

def pairImgData(db,conn):
    imgs = getAllImgs(conn)
    data = getAllData(conn)
    pairs = 0

    mergedArr = imgs + data
    mergedArr = sorted(mergedArr, key = lambda x: x[0])
    
    sql = "INSERT INTO imgData(imgId,dataId) VALUES(?,?)"
    for i in range(0,len(mergedArr)-1):
        if mergedArr[i][2] == "IMG" and mergedArr[i+1][2] == "DATA":
            imgDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s")) 
            dataDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            if abs(imgDate - dataDate) <= 5:
                pairs =+ 1
                cur = conn.cursor()
                cur.execute(sql, (mergedArr[i][1],mergedArr[i+1][1]))

        elif mergedArr[i][2] == "DATA" and mergedArr[i+1][2] == "IMG":
            imgDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            dataDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            if abs(imgDate - dataDate) <= 5:
                pairs =+ 1
                cur = conn.cursor()
                cur.execute(sql, (mergedArr[i+1][1],mergedArr[i][1]))
        
    print("Made " + str(pairs) + " pairs")

def getTime(ms):
    s = ms/10000.0
    return datetime.fromtimestamp(s).strftime('%d:%m:%y:%H:%M:%S:%f')[0:-2]

def splitVideo(db,conn,filename,millisec):
    date = int(datetime.strptime(filename, '%d:%m:%y:%H:%M:%S:%f').strftime("%s")) * 10000
    ms = date + int(filename[-4:])

    vidcap = cv2.VideoCapture(filename +".mp4")

    try:
        if not os.path.exists('Images'):
            os.makedirs('Images')
    except OSError:
        print ('Error: Creating directory of data')

    count = 1
    success = True
    fn = getTime(ms)
    sql = "INSERT INTO images(filename) VALUES(?)"

    while success:
        vidcap.set(cv2.CAP_PROP_POS_MSEC,(count*(millisec/10)))      
        success,image = vidcap.read()

        lfn = fn

        ms += millisec
        fn = getTime(ms)

        image_last = cv2.imread("./static-content/images/{}.jpg".format(lfn))
        if np.array_equal(image,image_last):
            break

        (h, w) = image.shape[:2]
        M = cv2.getRotationMatrix2D((w / 2, h / 2), 270, 1.0)
        image = cv2.warpAffine(image, M, (h, w))

        cv2.imwrite("./static-content/images/" + fn  + ".jpg", image)     # save frame as PNG file
        cur = conn.cursor()
        cur.execute(sql, [fn])   
        count += 1

    print("Finished splitting video to images and saving it to the db")

def main():
    db = "db/database.db"
    conn = create_conn(db)

    if len(sys.argv) == 4 and str(sys.argv[1]) == "split":
        splitVideo(db,conn,str(sys.argv[2]),int(sys.argv[3]))
    elif len(sys.argv) == 2 and str(sys.argv[1]) == "pair":
        pairImgData(db,conn)
    else:
        print("USAGE")
        print("python script.py split filename ms (Ex: python script.py split 11:03:19:22:04:54:6550 10000)")
        print("python script.py pair")


main()

