import pickle

multi = []
print("Making multi list")

for a in range (1,11):
  for b in range (1,11):
    for c in range (1,11):
      for d in range (1,11):
        for e in range (1,11):
          for f in range (1,11):
            print([a,b,c,d,e,f,1,1,1]) 
            multi.append([a,b,c,d,e,f,1,1,1])


with open('array.txt', 'wb') as fp:
    pickle.dump(multi, fp)

