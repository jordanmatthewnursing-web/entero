'use client';
import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import type{Atlas,Teaching,Layers,Mode}from './model-types';
import{targetNames,organNames}from './model-types';
type Props={atlas:Atlas;teaching:Teaching;hormone:string;mode:Mode;layers:Layers;frame:number;organ:string;view:string;onPick:(s:string)=>void;onReady:()=>void;onError:(message:string)=>void};
function disposeLoadedScene(root:THREE.Object3D){root.traverse(object=>{if(object instanceof THREE.Mesh){object.geometry.dispose();const materials=Array.isArray(object.material)?object.material:[object.material];for(const material of materials){for(const value of Object.values(material))if(value instanceof THREE.Texture)value.dispose();material.dispose()}}})}
const transform=(p:number[])=>new THREE.Vector3(p[0],p[2],-p[1]);
export default function AnatomyViewer(p:Props){
 const host=useRef<HTMLDivElement>(null),current=useRef(p),api=useRef<{update:()=>void;camera:()=>void}|null>(null);current.current=p;
 const[status,setStatus]=useState('Loading the Blender model…');
 useEffect(()=>{
 if(!host.current)return;const el=host.current;let disposed=false,raf=0;let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch{current.current.onError('This browser could not start the 3D scene.');return}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x171916,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;el.appendChild(renderer.domElement);
 const contextLost=(event:Event)=>{event.preventDefault();current.current.onError('The 3D connection was interrupted.')};renderer.domElement.addEventListener('webglcontextlost',contextLost);
 renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D teaching model. Plus and minus zoom. Home resets the camera. Arrow keys rotate anatomy views; Shift and arrow keys pan.');renderer.domElement.setAttribute('role','group');
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-30,30,24,-24,.1,500);camera.position.set(0,4,100);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,4,0);controls.enableDamping=true;controls.minZoom=.45;controls.maxZoom=5;controls.enablePan=true;
 scene.add(new THREE.HemisphereLight(0xffecd9,0x273247,2.3));const key=new THREE.DirectionalLight(0xffe4ce,3.3);key.position.set(-30,35,50);scene.add(key);const rim=new THREE.DirectionalLight(0xb5d0ff,2.3);rim.position.set(30,20,-30);scene.add(rim);
 const anatomy=new THREE.Group(),teachingGroup=new THREE.Group(),cells=new THREE.Group(),labels=new THREE.Group();scene.add(anatomy,teachingGroup,cells,labels);
 const objects=new Map<string,THREE.Object3D>(),textObjects=new Map<string,THREE.Sprite>(),markers:THREE.Mesh[]=[];const draco=new DRACOLoader();draco.setDecoderPath('/assets/draco/');const loader=new GLTFLoader().setDRACOLoader(draco);
 const sphere=new THREE.SphereGeometry(.16,8,6),cellMaterials:Record<string,THREE.MeshBasicMaterial>={};
 for(const[k,h]of Object.entries(p.atlas.hormones)){const color=new THREE.Color('rgb('+h.color.map(c=>Math.round(c*255)).join(',')+')');cellMaterials[k]=new THREE.MeshBasicMaterial({color,toneMapped:false})}
 p.atlas.markers.forEach(m=>{const keys=m.keys.split(',');const ob=new THREE.Mesh(sphere,cellMaterials[keys[0]]);ob.position.fromArray(m.position);ob.userData.keys=keys;ob.userData.cell=m.cell;cells.add(ob);markers.push(ob)});
 function addText(name:string,body:string,position:number[],size:number,align='LEFT'){
  const lines=body.split('\n'),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d')!;ctx.font='40px Arial';const width=Math.max(16,...lines.map(x=>ctx.measureText(x).width));canvas.width=Math.ceil(width+12);canvas.height=lines.length*52+8;ctx.font='40px Arial';ctx.fillStyle=name==='mechanism_target_label'?'#182323':'#f4f2e9';ctx.textBaseline='top';lines.forEach((line,i)=>ctx.fillText(line,6,4+i*52));const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,transparent:true}));sprite.position.fromArray(position);const height=size*1.25*lines.length;sprite.scale.set(height*canvas.width/canvas.height,height,1);sprite.center.set(align==='CENTER'?.5:0,1);sprite.userData.body=body;sprite.userData.baseHeight=height;sprite.userData.ratio=canvas.width/canvas.height;sprite.userData.lines=lines.length;labels.add(sprite);textObjects.set(name,sprite);return sprite;
 }
 const retain=(name:string)=>/^(brain_label|islet_label_|pancreas_label|liver_label|gallbladder_label|adipose_label|bone_label|vagus_label|lumen_label|apical_label|basal_label|mechanism_cell_identity|mechanism_target_label|glucose_label|insulin_label|oral_key|iv_key|comparison_time)$/.test(name)||name.startsWith('islet_label_');
 const shortLabels:Record<string,string>={brain_label:'Brain',pancreas_label:'Pancreas / islets',liver_label:'Liver / biliary',gallbladder_label:'Gallbladder',adipose_label:'Adipose',bone_label:'Bone',vagus_label:'Vagal pathway',islet_label_beta:'β',islet_label_alpha:'α',islet_label_delta:'δ',glucose_label:'MATCHED GLUCOSE',insulin_label:'INSULIN RESPONSE'};for(const[name,t]of Object.entries(p.teaching.texts))if(retain(name))addText(name,shortLabels[name]||t.body,t.position,Math.max(t.size,.47),t.align);
 const regionLabels:{name:string;pos:number[]}[]=[{name:'esophagus',pos:[1,21,7]},{name:'stomach',pos:[6,16,7]},{name:'duodenum',pos:[-8,11,7]},{name:'jejunum',pos:[5,5,7]},{name:'ileum',pos:[-5,-5,7]},{name:'colon',pos:[9,-1,7]}];
 for(const r of regionLabels)addText('regionlabel_'+r.name,organNames[r.name],r.pos,.65);
 function updateText(name:string,body:string){const old=textObjects.get(name);if(!old||old.userData.body===body)return;const t=p.teaching.texts[name];labels.remove(old);old.material.map?.dispose();old.material.dispose();addText(name,body,t.position,Math.max(t.size,.47),t.align)}
 const setupCamera=()=>{const q=current.current;const diagram=q.mode==='MECHANISM'||q.mode==='LOCAL',comparison=q.mode==='COMPARE',withTargets=q.layers.Targets&&['ATLAS','FASTING'].includes(q.mode);const center=diagram?91:comparison?153:withTargets?-8:0;const aspect=Math.max(.25,el.clientWidth/el.clientHeight);const span=diagram||comparison?Math.max(28,51/aspect):withTargets?Math.max(45,50/aspect):Math.max(43,25/aspect);camera.top=span/2;camera.bottom=-span/2;camera.right=span*aspect/2;camera.left=-span*aspect/2;camera.zoom=1;
 camera.position.set(center,diagram||comparison?7:4,100);controls.target.set(center,diagram||comparison?7:4,0);
 if(!diagram&&!comparison){if(q.view==='quarter')camera.position.set(center+55,18,80);if(q.view==='side')camera.position.set(center+100,6,0);if(q.view==='stomach'){controls.target.set(2,15,0);camera.position.set(7,18,75);camera.zoom=2.4}if(q.view==='ileocecal'){controls.target.set(-6,-7,0);camera.position.set(-2,-5,75);camera.zoom=2.9}}
 controls.enableRotate=!diagram&&!comparison;camera.updateProjectionMatrix();controls.update();};
 function update(){const q=current.current,h=q.atlas.hormones[q.hormone],diagram=q.mode==='MECHANISM'||q.mode==='LOCAL',all=q.mode==='ALL',fast=q.mode==='FASTING',anatomyMode=!diagram&&q.mode!=='COMPARE';anatomy.visible=q.layers.Anatomy&&anatomyMode;cells.visible=q.layers.CellTypes&&anatomyMode&&q.mode!=='ANATOMY';
 for(const ob of markers){const keys=ob.userData.keys as string[];ob.visible=all||(fast?keys.some(k=>['MOTILIN','GHRELIN'].includes(k)):keys.includes(q.hormone));ob.material=all?cellMaterials[keys[0]]:fast?cellMaterials[keys.includes('MOTILIN')?'MOTILIN':'GHRELIN']:cellMaterials[q.hormone]}
 anatomy.traverse(ob=>{if(ob instanceof THREE.Mesh){const chosen=q.organ==='all'||ob.name.includes(q.organ)||(q.organ==='colon'&&/taenia|epiploic/.test(ob.name));const material=ob.material as THREE.MeshStandardMaterial;material.transparent=!chosen;material.opacity=chosen?1:.09;material.depthWrite=chosen;}});
 const visible=(name:string)=>{const meta=q.teaching.objects[name];if(!meta)return false;let show=diagram?meta.mode==='mechanism':q.mode==='COMPARE'?meta.mode==='comparison':q.mode==='ANATOMY'?false:meta.mode==='atlas'||(fast&&meta.mode==='fasting');if(meta.mode==='atlas'&&meta.hormone&&/^(arc_|arrow_|signal_|response_)/.test(name))show=show&&(fast?['MOTILIN','GHRELIN'].includes(meta.hormone):!all&&meta.hormone===q.hormone);if(q.mode==='LOCAL'&&(meta.fed_only||['mechanism_sensor','lumen_label','apical_label'].includes(name)))show=false;if(/^legend_|^key_/.test(name))show=false;if((name.startsWith('target_vagus')||name==='vagus_label')&&!all&&!['GLP1','PYY','CCK','SEROTONIN'].includes(q.hormone))show=false;return show;};
 for(const[name,ob]of objects){const meta=q.teaching.objects[name];const isCell=name==='mechanism_cell'||name==='mechanism_nucleus'||name==='mechanism_sensor';const isTarget=name==='mechanism_target';const layer=isCell?'CellTypes':isTarget?'Targets':meta.collection;ob.visible=visible(name)&&q.layers[layer as keyof Layers];if(diagram&&ob instanceof THREE.Mesh&&/^(mechanism_cell|mechanism_transport|mechanism_target|basolateral_signal)/.test(name)){const mat=ob.material as THREE.MeshStandardMaterial;mat.color.setRGB(...h.color as [number,number,number]);mat.emissive?.setRGB(...h.color as [number,number,number]);mat.emissiveIntensity=.2;}}
 for(const[name,ob]of textObjects){ob.visible=q.layers.Annotations&&(name.startsWith('regionlabel_')?q.mode==='ANATOMY':visible(name)&&(q.teaching.objects[name]?.collection!=='Targets'||q.layers.Targets));}
 updateText('mechanism_cell_identity',h.cell+' cell');updateText('mechanism_target_label',h.targets[0]==='local_paracrine'?'NEIGHBORING\nCELLS':h.targets[0]==='gut_epithelium'?'INTESTINAL\nMUCOSA':targetNames[h.targets[0]]?.toUpperCase()||h.targets[0]);
 }
 const cameraKey=(event:KeyboardEvent)=>{
  if(event.altKey||event.ctrlKey||event.metaKey)return;
  const key=event.key;
  if(['+','=','-','_'].includes(key)){
   event.preventDefault();camera.zoom=THREE.MathUtils.clamp(camera.zoom*(['+','='].includes(key)?1.2:1/1.2),controls.minZoom,controls.maxZoom);camera.updateProjectionMatrix();controls.update();
  }else if(key==='Home'){event.preventDefault();setupCamera()}
  else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)){
   if(event.shiftKey){
    event.preventDefault();const direction=key==='ArrowLeft'||key==='ArrowDown'?-1:1;
    const distance=(camera.top-camera.bottom)/camera.zoom*.06;
    const axis=new THREE.Vector3().setFromMatrixColumn(camera.matrix,key==='ArrowLeft'||key==='ArrowRight'?0:1).multiplyScalar(distance*direction);
    camera.position.add(axis);controls.target.add(axis);controls.update();
   }else if(controls.enableRotate){
    event.preventDefault();const offset=camera.position.clone().sub(controls.target),spherical=new THREE.Spherical().setFromVector3(offset);
    if(key==='ArrowLeft')spherical.theta-=.12;if(key==='ArrowRight')spherical.theta+=.12;
    if(key==='ArrowUp')spherical.phi-=.12;if(key==='ArrowDown')spherical.phi+=.12;
    spherical.makeSafe();camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));camera.lookAt(controls.target);controls.update();
   }
  }
 };
 renderer.domElement.addEventListener('keydown',cameraKey);
 api.current={update,camera:setupCamera};
 const loads=[loader.loadAsync('/assets/anatomy-full.glb').then(g=>{if(disposed){disposeLoadedScene(g.scene);return}anatomy.add(g.scene);g.scene.traverse(o=>{if(o instanceof THREE.Mesh){const m=o.material as THREE.MeshStandardMaterial;m.roughness=.63;m.metalness=0}})}),loader.loadAsync('/assets/teaching.glb').then(g=>{if(disposed){disposeLoadedScene(g.scene);return}teachingGroup.add(g.scene);g.scene.traverse(o=>{const name=o.userData.source_name;if(name){objects.set(name,o);if(o instanceof THREE.Mesh&&o.material){o.material=(o.material as THREE.Material).clone();const m=o.material as THREE.MeshStandardMaterial;if(m.emissiveIntensity>1)m.emissiveIntensity=.65;const meta=p.teaching.objects[name];if(meta?.hormone&&/^(arc_|arrow_|signal_|response_)/.test(name)){o.material=new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(...p.atlas.hormones[meta.hormone].color as [number,number,number]),toneMapped:false});m.dispose();}else if(/^(curve_|comparison_dot_)/.test(name)){o.material=new THREE.MeshBasicMaterial({color:name.includes('_oral')?0x23a5f5:0xf5bd43,toneMapped:false});m.dispose();}else if(/^nutrient_/.test(name)){o.material=new THREE.MeshBasicMaterial({color:0xffcc4d,toneMapped:false});m.dispose();}}}})})];
 Promise.all(loads).then(()=>{if(disposed)return;update();setStatus('');current.current.onReady()}).catch(()=>{if(!disposed)current.current.onError('The complete 3D scene could not load.')});
 const resize=()=>{if(!el.clientWidth||!el.clientHeight)return;renderer.setSize(el.clientWidth,el.clientHeight);setupCamera()};const observer=new ResizeObserver(resize);observer.observe(el);resize();
 let down=[0,0];const ray=new THREE.Raycaster();const pointerDown=(e:PointerEvent)=>{down=[e.clientX,e.clientY]};const pointerUp=(e:PointerEvent)=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||!anatomy.visible)return;const box=el.getBoundingClientRect();ray.setFromCamera(new THREE.Vector2((e.clientX-box.left)/box.width*2-1,-(e.clientY-box.top)/box.height*2+1),camera);const hit=ray.intersectObject(anatomy,true)[0];if(hit){const name=Object.keys(organNames).find(k=>k!=='all'&&hit.object.name.includes(k));if(name)current.current.onPick(name)}};renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);
 const animate=()=>{raf=requestAnimationFrame(animate);const frame=Math.max(0,Math.min(179,current.current.frame-1)),f0=Math.floor(frame),f1=Math.min(179,f0+1),u=frame-f0;for(const[name,track]of Object.entries(p.teaching.tracks)){const ob=objects.get(name);if(!ob)continue;const a=track[f0],b=track[f1],lerp=(i:number)=>a[i]+(b[i]-a[i])*u;ob.position.set(lerp(0),lerp(2),-lerp(1));ob.scale.set(lerp(7),lerp(9),lerp(8))}for(const sprite of textObjects.values()){const minHeight=(camera.top-camera.bottom)/camera.zoom/el.clientHeight*12*sprite.userData.lines;const height=Math.max(sprite.userData.baseHeight,minHeight);sprite.scale.set(height*sprite.userData.ratio,height,1)}controls.update();renderer.render(scene,camera)};animate();
 return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();controls.dispose();draco.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}if(o instanceof THREE.Sprite){o.material.map?.dispose();o.material.dispose()}});renderer.domElement.removeEventListener('keydown',cameraKey);renderer.domElement.removeEventListener('webglcontextlost',contextLost);renderer.dispose();el.removeChild(renderer.domElement);api.current=null};
 },[p.atlas,p.teaching]);
 useEffect(()=>{api.current?.update()},[p.hormone,p.mode,p.layers,p.organ]);
 useEffect(()=>{api.current?.camera()},[p.mode,p.view,p.layers.Targets]);
 return <div className="viewer-wrap"><div ref={host} className="three-view"/><p className="camera-key-help">+/− zoom · Home reset · Shift + arrows pan · Arrows rotate anatomy</p>{status&&<div className="model-loading"><span className="loading-mark">GI</span><p role="status">{status}</p></div>}</div>
}
