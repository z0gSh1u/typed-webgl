# coding: utf-8
'''
  3D模型顶点坐标归一化工具
  by z0gSh1u @ https://github.com/z0gSh1u/typed-webgl
  <Usage>
    python OBJNormer.py 
      --src <obj_file_path> 
      --dist <output_file_path (contains filename and external)> 
      --div <if you know don't know the division, use -1. otherwise specify it.>
'''

import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--src', type=str)
parser.add_argument('--dist', type=str)
parser.add_argument('--div', type=float)
args = parser.parse_args()

OBJ_FILE_PATH=args.src
OUTPUT_FILE_PATH=args.dist
NEWLINE_BREAKER='\r\n'

print('Starting...')

f = open(OBJ_FILE_PATH, 'r')
maxX = -99999; maxY = -99999; maxZ = -99999
minX = 99999; minY = 99999; minZ = 99999
processed = ''

if args.div == -1:
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
  print('The div = ', diver)
else:
  diver = args.div

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