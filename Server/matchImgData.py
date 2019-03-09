import sqlite3
from datetime import datetime

def create_conn(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except:
        print("err connecting")
    return None

def selectImg(conn):
    cur = conn.cursor()
    cur.execute("SELECT filename,id FROM images")

    rows = cur.fetchall()

    arr = []
    for (filename,id) in rows:
        arr.append((filename.encode('ascii'),id,"IMG"))
    return arr

def selectData(conn):
    cur = conn.cursor()
    cur.execute("SELECT time,id FROM data")

    rows = cur.fetchall()

    arr = []
    for (time,id) in rows:
        arr.append((time.encode('ascii'),id,"DATA"))
    return arr

def main():
    db = "db/database.db"
    conn = create_conn(db)
    with conn:
        imgs = selectImg(conn)
        data = selectData(conn)

        mergedArr = imgs + data
        mergedArr = sorted(mergedArr, key = lambda x: x[0])
        
        sql = "INSERT INTO imgData(imgId,dataId) VALUES(?,?)"
        for i in range(0,len(mergedArr)-1):
            if mergedArr[i][2] == "IMG" and mergedArr[i+1][2] == "DATA":
                imgDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s")) 
                dataDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
                if abs(imgDate - dataDate) <= 5:
                    cur = conn.cursor()
                    cur.execute(sql, (mergedArr[i][1],mergedArr[i+1][1]))

            elif mergedArr[i][2] == "DATA" and mergedArr[i+1][2] == "IMG":
                imgDate = int(datetime.strptime(mergedArr[i+1][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
                dataDate = int(datetime.strptime(mergedArr[i][0], '%d:%m:%y:%H:%M:%S:%f').strftime("%s"))
                if abs(imgDate - dataDate) <= 5:
                    cur = conn.cursor()
                    cur.execute(sql, (mergedArr[i+1][1],mergedArr[i][1]))
         
if __name__ == '__main__':
    main()

