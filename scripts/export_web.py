"""Atlas-only export; legacy decimated anatomy export intentionally removed."""
import bpy,json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from export_args import export_paths
source,root=export_paths(['atlas.json'])
bpy.ops.wm.open_mainfile(filepath=str(source))
s=bpy.context.scene
print('SCENE',s.name,list(s.keys()))
h=json.loads(s['hormones_json'])
markers=[]
for o in bpy.data.collections['CellTypes'].all_objects:
 if o.type=='MESH' and 'hormone_keys' in o:
  p=o.matrix_world.translation
  markers.append(dict(position=[p.x,p.z,-p.y],keys=o['hormone_keys'],cell=o.get('cell_type','')))
json.dump(dict(hormones=h,markers=markers,paths=json.loads(s['signal_paths']),targets=json.loads(s['target_positions'])),open(root/'atlas.json','w'))
