import bpy,json,os,math
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from export_args import export_paths
source,root=export_paths(['teaching.glb','teaching.json'])
bpy.ops.wm.open_mainfile(filepath=str(source))
s=bpy.context.scene
# Capture original teaching assets in memory only. Never save over the source.
originals=[o for o in list(s.objects) if o.type in {'MESH','CURVE','FONT'} and any(c.name in {'Targets','Hormones','Annotations'} for c in o.users_collection) and not o.get('retired') and not o.get('phase2_only')]
animated=[o for o in originals if o.animation_data and o.animation_data.action]
tracks={o.name:[] for o in animated}
for frame in range(1,181):
 s.frame_set(frame)
 for o in animated:
  tracks[o.name].append([round(v,6) for v in [*o.location,*o.rotation_quaternion,*o.scale]])
s.frame_set(1)
metadata={};texts={};camera={}
for o in s.objects:
 if o.type=='CAMERA':camera[o.name]={'position':list(o.location),'quaternion':list(o.rotation_quaternion),'ortho':o.data.ortho_scale}
for o in originals:
 metadata[o.name]={'mode':o.get('mode','atlas'),'collection':next((c.name for c in o.users_collection if c.name in {'Targets','Hormones','Annotations'}),'Hormones'),'hormone':o.get('hormone'),'target':o.get('target'),'fed_only':bool(o.get('fed_only')), 'text':o.type=='FONT'}
 if o.type=='FONT':texts[o.name]={'body':o.data.body,'position':[o.location.x,o.location.z,-o.location.y],'size':o.data.size,'align':o.data.align_x}
# Freeze evaluated geometry at frame 1, preserving transforms for exact animation samples.
col=bpy.data.collections.new('WebTeachingExport');s.collection.children.link(col)
deps=bpy.context.evaluated_depsgraph_get()
exports=[]
for o in originals:
 if o.type=='FONT':continue
 mesh=bpy.data.meshes.new_from_object(o.evaluated_get(deps),preserve_all_data_layers=True,depsgraph=deps)
 ob=bpy.data.objects.new('web_'+o.name,mesh);col.objects.link(ob);ob.matrix_world=o.matrix_world.copy();ob['source_name']=o.name
 exports.append(ob)
# Hide source collection selection without mutating its iteration.
bpy.ops.object.select_all(action='DESELECT')
for ob in exports:ob.hide_select=False;ob.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(root/'teaching.glb'),export_format='GLB',use_selection=True,export_animations=False,export_extras=True)
json.dump({'objects':metadata,'texts':texts,'tracks':tracks,'cameras':camera,'frames':180,'fps':24},open(root/'teaching.json','w'),separators=(',',':'))
print('TEACHING_EXPORT',len(exports),'objects',len(tracks),'tracks',len(texts),'annotations',os.path.getsize(root/'teaching.glb'))
