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
    cur.execute("DELETE FROM data WHERE Valid='F'")
    cur.execute("DELETE FROM data WHERE State=2")
    cur.execute("SELECT time,id FROM data")

    rows = cur.fetchall()

    arr = []
    for (time,id) in rows:
        arr.append((time.encode('ascii'),id,"DATA"))
    return arr

def getAllPairs(conn):
    cur = conn.cursor()
        
    cur.execute("SELECT imgId,dataId FROM imgData")

    rows = cur.fetchall()
    return rows

def pairImgData(db,conn):
    imgs = getAllImgs(conn)
    arr = [x[0] for x in imgs]

    data = getAllData(conn)
    pairs = getAllPairs(conn)

    mergedArr = imgs + data
    mergedArr = sorted(mergedArr, key = lambda x: x[0])
    
    sql = "INSERT INTO imgData(imgId,dataId) VALUES(?,?)"
    for i in range(0,len(mergedArr)-1):
        if mergedArr[i][2] == "IMG" and mergedArr[i+1][2] == "DATA":
            imgDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s")) 
            dataDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            if abs(imgDate - dataDate) <= 1 and ((mergedArr[i][1],mergedArr[i+1][1]) not in pairs):
                cur = conn.cursor()
                cur.execute(sql, (mergedArr[i][1],mergedArr[i+1][1]))
                if mergedArr[i][0] in arr:
                    arr.remove(mergedArr[i][0])

        elif mergedArr[i][2] == "DATA" and mergedArr[i+1][2] == "IMG":
            imgDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            dataDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
            if abs(imgDate - dataDate) <= 1 and ((mergedArr[i+1][1],mergedArr[i][1]) not in pairs):
                cur = conn.cursor()
                cur.execute(sql, (mergedArr[i+1][1],mergedArr[i][1]))
                if mergedArr[i+1][0] in arr:
                    arr.remove(mergedArr[i+1][0])
    print("Done making pairs")

    """sql = "DELETE FROM images WHERE filename=?"
    for img in arr:
        cur = conn.cursor()
        cur.execute(sql, [img])
        os.remove("./static-content/images/" + img + ".jpg")
    print("Removed unneccessary imgs")"""


def getTime(ms):
    s = ms/10000.0
    return datetime.fromtimestamp(s).strftime('%d:%m:%y:%H:%M:%S:%f')[0:-2]

def splitVideo(db,conn,filepath,millisec):
    filename = filepath.split("/")[-1]
    print(filename)
    date = int(datetime.strptime(filename, '%d:%m:%y:%H:%M:%S:%f').strftime("%s")) * 10000
    ms = date + int(filename[-4:])

    vidcap = cv2.VideoCapture(filepath +".mp4")

    length = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    duration = length/fps * 1000 
    print(length,fps,length/fps * 1000)


    count = 1
    success = True
    fn = getTime(ms)
    sql = "INSERT INTO images(filename) VALUES(?)"

    while success:
        dur = (count*(millisec/10))
        vidcap.set(cv2.CAP_PROP_POS_MSEC,dur)      
        success,image = vidcap.read()

        lfn = fn

        ms += millisec
        fn = getTime(ms)

        image = np.rot90(image,3)

        if dur > duration:
            break

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
