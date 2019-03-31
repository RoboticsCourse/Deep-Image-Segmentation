import matplotlib.pyplot as plt
import numpy as np
import json
import math

def getBucket(fw,sp):
    
    radius = 15
    if (math.pow(fw,2) + math.pow(sp,2) <= math.pow(radius,2)):
        print(fw,sp)
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

FS = [[],[],[],[],[],[],[],[],[]]
SP = [[],[],[],[],[],[],[],[],[]]
colors = ["red","green","blue","black","pink","yellow","purple","cyan","magenta"]
labels = ["B0","B1","B2","B3","B4","B5","B6","B7","B8"]

try:
    with open ("./static-content/images/data.json", "r") as myfile:
        data = ''.join(myfile.readlines())
        data = json.loads(data)
except:
    data = []

for img in data:
    fw = int(img["Forward"])
    sp = int(img["Speed"])
    b = getBucket(fw,sp)

    FS[b].append(fw)
    SP[b].append(sp)

for i in range (0,9):
    print(len(FS[i]))

fig = plt.figure()
ax = fig.add_subplot(111)
 
for fs,sp,color,lbl in zip(FS,SP,colors,labels):
    ax.scatter(fs, sp, alpha=0.8, c=color, edgecolors='none', s=30, label=lbl)

plt.title("extraFeatures4")
plt.xlabel('Forward', fontsize=16)
plt.ylabel('Speed', fontsize=16)
plt.legend(loc=1)
plt.savefig('map.png')

"""linepoints = np.array([])

def onclick(event):
    if event.button == 3:
        global linepoints

        x = event.xdata
        y = event.ydata

        linepoints = np.append(linepoints, x)
        linepoints = np.append(linepoints, y)

        if np.size(linepoints) == 4:
            plt.plot((linepoints[0], linepoints[2]), (linepoints[1], linepoints[3]), '-')
            linepoints = np.array([])
            plt.show()

cid = fig.canvas.mpl_connect('button_press_event', onclick)"""





