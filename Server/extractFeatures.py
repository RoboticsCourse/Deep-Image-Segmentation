#!/usr/bin/python3
# https://pillow.readthedocs.io/en/stable/
import PIL
from PIL import Image
import json
import math

def getBucket(fw,sp):
    radius = 15
    if (math.pow(fw,2) + math.pow(sp,2) <= math.pow(radius,2)):
        return 4

    bin1Size = int((255*2+1)/3)
    bin1Num = int((fw+254)/bin1Size)

    bin2Size = int((150*2+1)/3)
    bin2Num = int((sp+149)/bin2Size)

    binNum = bin1Num + 3*bin2Num # 0,...,binNum

    if binNum == 3:
        if sp > 0:
            return 6
        return 0
    elif binNum == 4:
        if sp > 0:
            return 3
        return 5
    elif binNum == 5:
        if sp > 0:
            return 8
        return 2
    else:
        return binNum

def loadImage(f):
    filename = f["Filename"]
    filename = filename.replace("_",":")
    im = Image.open("./static-content/images/"+ filename + ".jpg")
    im = im.convert("L") # comment out for rgb
    newSize = (50,50) # CHANGE DIMENSION OF IMAGE HERE
    im = im.resize(newSize,PIL.Image.NEAREST)
    #im.show()
    pix = im.load()
    (dx,dy)=im.size  

    s = []
    for x in range(dx):
        for y in range(dy):
            # s.extend(pix[x,y]) # for rgb
            s.append(pix[x,y]) # for greyscale
            #s += str(pix[x,y]) + ","

    forward = int(f["Forward"])
    speed= int(f["Speed"])
    label = getBucket(forward,speed)

    #s += str(label) + "\n"
    s.append(label)
    s=map(str, s)
    #print(s)
    print(",".join(s))

    # l = len(s)
    #print(str(forward)+" "+str(flabel) +" " +str(speed)+" "+str(slabel))
    #return s
    
def loadData():
    try:
        with open ("./static-content/images/data.json", "r") as myfile:
            data = ''.join(myfile.readlines())
            data = json.loads(data)
    except:
        data = []

    #file = open("features.txt", "w")
    for f in data:
        #file.write(loadImage(f))
        loadImage(f)

    #file.close()

loadData()

