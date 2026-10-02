import bpy
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from export_args import export_paths
source,root=export_paths(['anatomy-full.glb'])
bpy.ops.wm.open_mainfile(filepath=str(source))
bpy.ops.object.select_all(action='DESELECT')
obs=list(bpy.data.collections['Anatomy'].all_objects)
for o in obs:
 o.hide_select=False;o.hide_set(False);o.hide_viewport=False;o.hide_render=False;o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(root/'anatomy-full.glb'),export_format='GLB',use_selection=True,export_apply=True,export_animations=False,export_extras=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=16,export_draco_normal_quantization=12)
print('FULL ANATOMY EXPORTED',len(obs))
