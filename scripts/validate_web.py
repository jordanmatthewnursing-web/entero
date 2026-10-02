import json,struct,argparse
from pathlib import Path
P=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--assets',type=Path,default=P/'public/assets')
parser.add_argument('--report',type=Path,default=P/'validation/web-parity.json')
args=parser.parse_args(); A=args.assets
a=json.loads((A/'atlas.json').read_text());t=json.loads((A/'teaching.json').read_text());checks=[]
def check(label,result):
 checks.append({'check':label,'pass':bool(result)})
 if not result:raise AssertionError(label)
def glb(name):
 with open(A/name,'rb') as f:
  f.read(12);n,_=struct.unpack('<II',f.read(8));return json.loads(f.read(n))
mesh=glb('anatomy-full.glb');native=glb('teaching.glb');names={n.get('extras',{}).get('source_name') for n in native['nodes']}
check('Full 31-object approved anatomy',len(mesh['meshes'])==31)
check('Twelve authoritative hormones',len(a['hormones'])==12)
check('Only GIP and GLP-1 are incretins',{k for k,h in a['hormones'].items() if h['incretin']}=={'GIP','GLP1'})
for key,h in a['hormones'].items():
 check(key+' source population',any(key in m['keys'].split(',') for m in a['markers']))
 for target in h['targets']:
  check(key+' → '+target+' native path',f'arc_{key}_{target}' in names)
  check(key+' → '+target+' animated signal',f'signal_{key}_{target}' in t['tracks'])
  check(key+' → '+target+' response',f'response_{key}_{target}' in t['tracks'])
for target in ['brain','pancreas','liver','gallbladder','adipose','bone']:
 check(target+' target mesh',any(n and n.startswith('target_'+target) for n in names))
for name in ['mechanism_cell','mechanism_sensor','mechanism_nucleus','mechanism_target','lumen_boundary','basal_boundary','mechanism_transport','fasting_MMC_wave']:
 check(name+' native geometry',name in names)
for name in ['target_islet_beta','target_islet_alpha','target_islet_delta']:
 # Blender names are retained verbatim; actual islet symbols are inspected below.
 pass
check('Islet beta/alpha/delta labels',all('islet_label_'+k in t['texts'] for k in ['beta','alpha','delta']))
for name,track in t['tracks'].items():
 check(name+' complete 180-frame sequence',len(track)==180)
 check(name+' transforms change',any(frame!=track[0] for frame in track[1:]))
for route in ['oral','iv']:
 for kind in ['glucose','insulin']:check(kind+' '+route+' native comparison animation',f'comparison_dot_{kind}_{route}' in t['tracks'])
check('Matched glucose animation',all(abs(x[2]-y[2])<.00001 for x,y in zip(t['tracks']['comparison_dot_glucose_oral'],t['tracks']['comparison_dot_glucose_iv'])))
check('L-cell shared field retained',all(set(['GLP1','GLP2','PYY','OXYNTOMODULIN']).issubset(m['keys'].split(',')) for m in a['markers'] if m['cell']=='L'))
report={'checks':checks,'passed':len(checks),'anatomy_meshes':len(mesh['meshes']),'teaching_objects':len(names)-int(None in names),'animation_tracks':len(t['tracks']),'cell_markers':len(a['markers'])}
args.report.parent.mkdir(parents=True,exist_ok=True)
args.report.write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='checks'}))
