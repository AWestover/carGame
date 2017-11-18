# converts white to transparent backgruond
from PIL import Image

import sys
import os

name = ''

if len(sys.argv) < 2:
	name = input('which file name would you like to convert')
else:
	name = sys.argv[1]

print("I will convert your files of the name " + name)
print("if (the provided word is in the png)")


def imgTransparent(imgPath):

	img = Image.open(imgPath)
	img = img.convert("RGBA")
	datas = img.getdata()

	newData = []
	for item in datas:
		if item[0] == 255 and item[1] == 255 and item[2] == 255:
			newData.append((255, 255, 255, 0))
		else:
			newData.append(item)

	img.putdata(newData)

	img.save("batch\{}".format(imgPath), "PNG")

if not os.path.exists("batch"):
	os.mkdir("batch")

for f in os.listdir():
	if '.png' in f and name in f:
		imgTransparent(f)
