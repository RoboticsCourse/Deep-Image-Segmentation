import pickle

multi = []
with open ('array.txt','rb') as fp:
    multi = pickle.load(fp)

with open ('./models/model1.txt') as f:
    lines = f.readlines()

arr = []
for line in lines:
  info = line.split(" ")
  mid = int(info[1][5:])
  acc = float(info[9][:-2])
  arr.append([acc,multi[mid]])

arr.sort(key = lambda x: x[0])

for ele in arr:
  print(ele)
