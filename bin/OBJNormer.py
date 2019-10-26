# coding: utf-8
'''
  3D模型顶点坐标归一化工具
  by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
'''

# edit this before running this script
OBJ_FILE_PATH=r'F:\\CG-lesson\\dec-rewrite\\dist\\work\\2-pony\\unnorm.obj'
OUTPUT_FILE_PATH=r'F:\\CG-lesson\\dec-rewrite\\dist\\work\\2-pony\\norm.obj'
NEWLINE_BREAKER='\r\n'

f = open(OBJ_FILE_PATH, 'r')
maxX = -99999; maxY = -99999; maxZ = -99999
minX = 99999; minY = 99999; minZ = 99999
processed = ''

for line in f.readlines():
  line = line.strip()
  if line[0] == 'v' and line[1] == ' ':
    linesplit = line.split(' ')
    if float(linesplit[1]) > maxX:
      maxX = float(linesplit[1])
    if float(linesplit[2]) > maxY:
      maxY = float(linesplit[2])
    if float(linesplit[3]) > maxZ:
      maxZ = float(linesplit[3])
    if float(linesplit[1]) < minX:
      minX = float(linesplit[1])
    if float(linesplit[2]) < minY:
      minY = float(linesplit[2])
    if float(linesplit[3]) < minZ:
      minZ = float(linesplit[3])
diver = max(maxX - minX, maxY - minY, maxZ - minZ)
f.close()

f = open(OBJ_FILE_PATH, 'r')
for line in f.readlines():
  line = line.strip()
  if line[0] == 'v' and line[1] == ' ':
    linesplit = line.split(' ')
    linesplit[1] = str(float(linesplit[1]) / diver)
    linesplit[2] = str(float(linesplit[2]) / diver)
    linesplit[3] = str(float(linesplit[3]) / diver)
    nl = linesplit[0] + ' ' + linesplit[1] + ' ' + linesplit[2] + ' ' + linesplit[3] + NEWLINE_BREAKER
  else:
    nl = line + NEWLINE_BREAKER
  processed += nl
f.close()

fn = open(OUTPUT_FILE_PATH, 'w')
fn.write(processed)
fn.close()
print("Finished.")