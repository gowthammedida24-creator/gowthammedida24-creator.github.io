import * as T from 'three';
const D=window.DATA,G=window.gsap,$=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KI=3.3,HI=2.1,FOV=26,BW=2.3,BH=3.15,BT=.2,GAP=3.05,CREAM='#fcf2e0';
const BOOKS=[{id:'me',name:'Gowtham Kumar',sub:'Motion designer',cover:'#050505',wall:'#100c0a',ink:'#fcf2e0',coverInk:'#fcf2e0',about:'Motion design, reels, posters and launch films. The client work from the showreel is on this shelf, filed by client.',chapters:[],pieces:[],me:true},...D.books];
if(!document.createElement('canvas').getContext('webgl2')){document.body.classList.add('nogl');throw new Error('WebGL unavailable')}
const renderer=new T.WebGLRenderer({canvas:$('#gl'),antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;
const scene=new T.Scene(),cam=new T.PerspectiveCamera(FOV,1,.05,80);scene.background=new T.Color('#000');
const maxA=renderer.capabilities.getMaxAnisotropy();
/* one light, upper left, agrees with every shadow */
const hemi=new T.HemisphereLight('#fff','#776',0),key=new T.DirectionalLight('#fff4e4',0);key.position.set(-6,9,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-12,right:12,top:8,bottom:-4,far:30});key.shadow.radius=6;key.shadow.bias=-.0004;scene.add(hemi,key,key.target);
const wallM=new T.MeshBasicMaterial({color:'#000'}),wall=new T.Mesh(new T.PlaneGeometry(120,40),wallM);wall.position.set(20,4,-.9);scene.add(wall);const shade=new T.Mesh(new T.PlaneGeometry(120,40),new T.ShadowMaterial({opacity:.3}));shade.position.set(20,4,-.89);shade.receiveShadow=true;scene.add(shade);
const woodM=new T.MeshStandardMaterial({color:'#2a1712',roughness:.6,transparent:true}),shelf=new T.Mesh(new T.BoxGeometry(120,.26,1.9),woodM);shelf.position.set(20,-.13,.05);shelf.receiveShadow=true;shelf.castShadow=true;scene.add(shelf);
const uiCol=c=>{document.documentElement.style.setProperty('--ink',c)};
function noise(x,w,h,a){const d=x.getImageData(0,0,w,h),p=d.data;for(let i=0;i<p.length;i+=4){const n=(Math.random()-.5)*a;p[i]+=n;p[i+1]+=n;p[i+2]+=n}x.putImageData(d,0,0)}
const img=src=>new Promise(r=>{const i=new Image;i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
const tex=c=>{const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=maxA;return t};
function fit(cw,ch,w,h){const s=Math.min(cw/w,ch/h);return[w*s,h*s]}
async function coverCanvas(b,i){const c=document.createElement('canvas');c.width=900;c.height=1232;const x=c.getContext('2d');x.fillStyle=b.cover;x.fillRect(0,0,900,1232);noise(x,900,1232,b.me?5:11);
 if(b.me){x.fillStyle=b.ink;x.font='400 40px News';x.fillText('Selected work, 2026',76,1150);return c}
 const l=await img(b.logo);if(l){const[w,h]=fit(600,600,l.naturalWidth||l.width,l.naturalHeight||l.height),ox=(900-w)/2,oy=(1232-h)/2-30;x.shadowColor='#0009';x.shadowBlur=3;x.shadowOffsetY=2;x.drawImage(l,ox,oy,w,h);x.shadowColor='transparent'}return c}
function paperCanvas(){const c=document.createElement('canvas');c.width=900;c.height=1232;const x=c.getContext('2d');x.fillStyle='#f5efe3';x.fillRect(0,0,900,1232);noise(x,900,1232,6);return[c,x]}
const pageRect=(p,c)=>{const[w,h]=fit(740,1010,p.w,p.h);return{l:(900-w)/2,t:80+(1010-h)/2,w,h}};
const cache=new Map();
async function pageCanvas(b,idx){const key=b.id+idx;if(cache.has(key))return cache.get(key);const[c,x]=paperCanvas();
 if(idx<0){x.fillStyle=b.cover;x.fillRect(0,0,900,1232);noise(x,900,1232,11)}
 else if(idx===0){x.fillStyle='#1b1712';let fs=78;x.font=`400 ${fs}px News`;while(x.measureText(b.name).width>700){fs-=4;x.font=`400 ${fs}px News`}x.fillText(b.name,100,520);x.font='italic 400 36px News';x.fillText(b.sub,100,580);x.font='500 17px Lab';x.letterSpacing='3px';const n=b.pieces.length;if(n)x.fillText(`${n} PIECE${n>1?'S':''}`,100,1120);x.letterSpacing='0px'}
 else{const n=idx-1,p=b.pieces[n];if(p){const i=await img(p.th),r=pageRect(p);x.fillStyle='#000';x.shadowColor='#0003';x.shadowBlur=18;x.shadowOffsetY=6;x.fillRect(r.l,r.t,r.w,r.h);x.shadowColor='transparent';if(i)x.drawImage(i,r.l,r.t,r.w,r.h);x.fillStyle='#1b1712';x.font='italic 400 27px News';x.fillText(p.ch,80,1168);x.textAlign='right';x.font='500 17px Lab';x.fillText(String(n+1).padStart(2,'0'),820,1166);x.textAlign='left'}}
 const t=tex(c);cache.set(key,t);return t}
/* books */
const books=[],picks=[];const pageM=new T.MeshStandardMaterial({color:'#efe7d8',roughness:.85});
function mkBook(b,i){const g=new T.Group(),h=BH*(b.me?1:[1,.94,1.03,.97,1.01,.95,1,.98,1.02,.96][(i-1)%10]),hinge=new T.Group();
 g.position.set((i)*GAP,0,0);
 const col=new T.MeshStandardMaterial({color:b.cover,roughness:.72});
 const back=new T.Mesh(new T.BoxGeometry(BW,h,.03),col);back.position.set(BW/2,h/2,-BT/2);back.castShadow=true;
 const block=new T.Mesh(new T.BoxGeometry(BW-.07,h-.08,BT-.04),pageM);block.position.set(BW/2-.02,h/2,0);block.castShadow=true;
 const spine=new T.Mesh(new T.BoxGeometry(.03,h,BT+.03),col);spine.position.set(-.012,h/2,0);spine.castShadow=true;
 const front=new T.Mesh(new T.BoxGeometry(BW,h,.03),[col,col,col,col,new T.MeshStandardMaterial({color:'#fff',roughness:.75}),new T.MeshStandardMaterial({color:b.cover,roughness:.8})]);front.position.set(BW/2,0,0);front.castShadow=true;hinge.add(front);hinge.position.set(0,h/2,BT/2);
 const inner=new T.Group();inner.add(back,block,spine,hinge);inner.position.x=-BW/2;g.add(inner);scene.add(g);
 const rec={b,i,g,inner,hinge,front,h,lift:0};front.userData.rec=rec;block.userData.rec=rec;picks.push(front,block);books.push(rec);return rec}
BOOKS.forEach(mkBook);
/* the reel's ball, now a disc on book 00's cover */
const me=books[0],discY=1.74,R=.66;const disc=new T.Mesh(new T.CircleGeometry(R,96),new T.MeshBasicMaterial({color:'#fff',toneMapped:false}));disc.position.set(0,discY-me.h/2,.0165);me.front.add(disc);
const glowC=document.createElement('canvas');glowC.width=glowC.height=256;{const x=glowC.getContext('2d'),g=x.createRadialGradient(128,128,70,128,128,128);g.addColorStop(0,'#ffe2bb88');g.addColorStop(1,'#ffe2bb00');x.fillStyle=g;x.fillRect(0,0,256,256)}
const glow=new T.Mesh(new T.PlaneGeometry(R*2*1.12*1.0,R*2*1.12),new T.MeshBasicMaterial({map:tex(glowC),transparent:true,depthWrite:false}));glow.position.set(0,discY-me.h/2,.0162);me.front.add(glow);

new T.TextureLoader().load('media/disc.png',t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=maxA;disc.material.map=t;disc.material.needsUpdate=true});
const ball=new T.Mesh(new T.SphereGeometry(.075,32,24),new T.MeshStandardMaterial({color:'#ff6a1a',emissive:'#ff4a00',emissiveIntensity:.45,roughness:.3}));ball.castShadow=true;ball.visible=false;scene.add(ball);
/* open-book pages: left and right are fixed, a bending leaf turns between them */
const PW=BW-.04;let PH=BH-.08;const mkPage=()=>new T.Mesh(new T.PlaneGeometry(PW,PH,1,1),new T.MeshStandardMaterial({roughness:.9}));
const spread=new T.Group(),pL=mkPage(),pR=mkPage();pL.position.x=-PW/2;pR.position.x=PW/2;spread.add(pL,pR);spread.visible=false;scene.add(spread);pL.receiveShadow=pR.receiveShadow=true;
const leafGeo=new T.PlaneGeometry(PW,PH,28,1);leafGeo.translate(PW/2,0,0);const leafBack=leafGeo.clone();{const u=leafBack.attributes.uv;for(let i=0;i<u.count;i++)u.setX(i,1-u.getX(i))}const leafF=new T.Mesh(leafGeo,new T.MeshStandardMaterial({roughness:.9})),leafB=new T.Mesh(leafBack,new T.MeshStandardMaterial({roughness:.9,side:T.BackSide}));leafF.visible=leafB.visible=false;spread.add(leafF,leafB);
const base=leafGeo.attributes.position.array.slice();
function bendLeaf(a){/* a 0..PI: paper lags near the free edge, so it curves mid-turn */
 for(const g of[leafGeo,leafBack]){const p=g.attributes.position.array;for(let i=0;i<p.length;i+=3){const u=base[i]/PW,lag=Math.sin(a)*.42*u*u,th=a-lag*(a<Math.PI/2?1:1),seg=base[i];p[i]=Math.cos(th)*seg;p[i+2]=Math.sin(th)*seg+.012}g.attributes.position.needsUpdate=true;g.computeVertexNormals()}}
const mkOver=()=>{const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({toneMapped:false}));m.visible=false;m.position.z=.006;spread.add(m);return m},ovL=mkOver(),ovR=mkOver();
const vids=[0,1].map(()=>{const v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='auto';return v});
ovL.userData.v=vids[0];ovR.userData.v=vids[1];
function placeOver(o,p,side){if(!p||!p.v){o.visible=false;o.userData.v.pause();o.userData.v.removeAttribute('src');return}const r=pageRect(p),sx=PW/900,sy=PH/1232;o.scale.set(r.w*sx,r.h*sy,1);o.position.x=(r.l+r.w/2)*sx-PW/2+(side?PW/2:-PW/2);o.position.y=PH/2-(r.t+r.h/2)*sy;const v=o.userData.v;v.src=p.v;v.play().catch(()=>{});const t=new T.VideoTexture(v);t.colorSpace=T.SRGBColorSpace;o.material.map&&o.material.map.dispose();o.material.map=t;o.material.needsUpdate=true;v.onplaying=()=>{if(state.open!=null&&!turning)o.visible=true}}
/* state */
const state={mode:'reel',focus:1,open:null,page:0};let turning=false,mx=0,my=0,camBase={x:0,y:0,z:0,lx:0,ly:0},aspect=1;
function homeDist(){const v=Math.max(BH*1.72,(innerHeight/innerWidth>1?GAP*1.25:GAP*3.9)/aspect*1);return v/(2*Math.tan(T.MathUtils.degToRad(FOV/2)))}
function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);aspect=w/h;cam.aspect=aspect;cam.updateProjectionMatrix();if(state.mode==='shelf')shelfCam(0);else if(state.mode==='book')bookCam(0)}
addEventListener('resize',resize);
const shelfPose=()=>({x:books[state.focus].g.position.x,y:1.62,z:homeDist(),lx:books[state.focus].g.position.x,ly:1.5});
function shelfCam(d){const p=shelfPose();G.to(camBase,{...p,duration:d,ease:'power3.inOut',overwrite:true})}
const narrow=()=>innerWidth<=760||aspect<1;
function bookCam(d){const r=books[state.open],sx=r.i*GAP,tn=Math.tan(T.MathUtils.degToRad(FOV/2));let z,x,y;
 if(narrow()){z=Math.max((2*BW*1.05)/(2*tn*aspect),(r.h*1.1/.5)/(2*tn));const vh=2*z*tn;x=sx;y=r.h/2-vh*.25}
 else{const f=1-$('#panel').offsetWidth/innerWidth;z=Math.max(r.h*1.24/(2*tn),(2*BW*1.12/f)/(2*tn*aspect));x=sx+2*z*tn*aspect*(.5-f/2);y=r.h/2}
 z+=BT/2+.25;G.to(camBase,{x,y,z,lx:x,ly:y,duration:d,ease:'power3.inOut',overwrite:true})}
function wallTo(c,d=.7){const t=new T.Color(c),hs={};t.getHSL(hs);const sh=new T.Color().setHSL(hs.h,hs.s*.7,hs.l*.3);G.to(wallM.color,{r:t.r,g:t.g,b:t.b,duration:d,ease:'power2.inOut',overwrite:true});G.to(shade.material.color,{r:sh.r,g:sh.g,b:sh.b,duration:d,ease:'power2.inOut',overwrite:true})}
function inkTo(b){$('#top').style.color=$('#nav').style.color=b.ink;$('#panel').style.color=b.ink}
function label(){const b=books[state.focus].b;$('#label').textContent=b.me?'Start here':`Volume ${String(state.focus).padStart(2,'0')}, ${b.name}`}
function focus(i,d=.75){i=Math.max(0,Math.min(books.length-1,i));if(i===state.focus&&d)return;state.focus=i;const b=books[i].b;wallTo(b.wall);inkTo(b);label();shelfCam(d)}
/* open and close */
async function openBook(i){if(state.mode!=='shelf'||turning)return;state.mode='book';state.open=i;state.page=0;const r=books[i],b=r.b;focus(i,0);document.body.classList.add('booked');$('#tip').style.opacity=0;
 PH=r.h-.08;[pL,pR,leafF,leafB].forEach(m=>{m.scale.y=PH/(BH-.08)});
 const[tl,tr]=await Promise.all([pageCanvas(b,-1),pageCanvas(b,0)]);pL.material.map=tl;pR.material.map=tr;pL.material.needsUpdate=pR.material.needsUpdate=true;
 spread.position.set(r.g.position.x-BW/2+.0,r.h/2,BT/2+.03);spread.visible=false;
 bookCam(reduce?0:1.1);panel();G.killTweensOf($('#panel'));G.fromTo('#panel',{opacity:0,x:reduce?0:30},{opacity:1,x:0,duration:.6,delay:reduce?0:.45,ease:'power3.out'});
 books.forEach(o=>{if(o!==r)G.to(o.g.position,{x:o.i*GAP+(o.i<r.i?-5:5),duration:.8,ease:'power3.inOut'})});G.to(woodM,{opacity:0,duration:reduce?0:.6,delay:reduce?0:.2,onComplete(){shelf.visible=false}});
 G.timeline().to(r.g.position,{x:r.i*GAP+BW/2,z:.25,y:.02,duration:reduce?0:.9,ease:'power3.inOut',onUpdate(){spread.position.x=r.g.position.x-BW/2;spread.position.z=r.g.position.z+BT/2+.03}},0)
  .to(r.hinge.rotation,{y:-Math.PI,duration:reduce?0:1,ease:'power3.inOut',onComplete(){spread.visible=true}},.1).to(r.hinge.scale,{y:.986,duration:reduce?0:.8},.2);
 bookCam(reduce?0:1.1)}
function closeBook(){if(state.mode!=='book'||turning)return;const r=books[state.open];G.to('#panel',{opacity:0,duration:.25});[ovL,ovR].forEach(o=>placeOver(o,null));spread.visible=false;r.front.visible=true;state.mode='closing';document.body.classList.remove('booked');
 books.forEach(o=>{if(o!==r)G.to(o.g.position,{x:o.i*GAP,duration:.85,ease:'power3.inOut'})});shelf.visible=true;G.to(woodM,{opacity:1,duration:.6,delay:.25});G.timeline({onComplete(){state.mode='shelf';state.open=null}}).to(r.hinge.rotation,{y:0,duration:.8,ease:'power3.inOut'},0).to(r.hinge.scale,{y:1,duration:.5},0).to(r.g.position,{x:r.i*GAP,z:0,y:0,duration:.8,ease:'power3.inOut'},0);
 const p=shelfPose();G.to(camBase,{...p,duration:.9,ease:'power3.inOut',overwrite:true})}
/* spreads: 0 = endpaper + title; n = pages */
const spreadPages=s=>s===0?[-1,0]:[2*s-1,2*s];
const lastSpread=b=>Math.floor((b.pieces.length+1)/2);
async function showSpread(s,dir){const r=books[state.open],b=r.b;if(turning||s<0||s>lastSpread(b)||s===state.page)return;
 const[oL,oR]=spreadPages(state.page),[nL,nR]=spreadPages(s),toI=i=>i>b.pieces.length?null:i;
 const blank=async i=>i===null?pageCanvas({...b,id:b.id+'x',pieces:[]},1):pageCanvas(b,i);
 const[tNL,tNR]=await Promise.all([blank(toI(nL)),blank(toI(nR))]);
 [ovL,ovR].forEach(o=>{o.visible=false});
 if(reduce||!dir){pL.material.map=tNL;pR.material.map=tNR;pL.material.needsUpdate=pR.material.needsUpdate=true;state.page=s;panel();overlay();return}
 turning=true;const fwd=dir>0;leafF.material.map=fwd?pR.material.map:tNR;leafB.material.map=fwd?tNL:pL.material.map;leafF.material.needsUpdate=leafB.material.needsUpdate=true;
 if(fwd){pR.material.map=tNR}else{pL.material.map=tNL}pL.material.needsUpdate=pR.material.needsUpdate=true;leafF.visible=leafB.visible=true;
 const o={a:fwd?0:Math.PI};bendLeaf(o.a);state.page=s;panel();
 G.to(o,{a:fwd?Math.PI:0,duration:.72,ease:'power2.inOut',onUpdate(){bendLeaf(o.a)},onComplete(){if(fwd)pL.material.map=tNL;else pR.material.map=tNR;pL.material.needsUpdate=pR.material.needsUpdate=true;leafF.visible=leafB.visible=false;turning=false;overlay()}})}
function curPieces(){const b=books[state.open].b,[l,r]=spreadPages(state.page);return[l>0?{p:b.pieces[l-1],n:l-1}:null,r>0?{p:b.pieces[r-1],n:r-1}:null]}
function overlay(){const[a,c]=curPieces();placeOver(ovL,a&&a.p,0);placeOver(ovR,c&&c.p,1)}
function panel(){const r=books[state.open],b=r.b,el=$('#panel'),last=lastSpread(b),cur=curPieces().find(Boolean);
 if(b.me){el.innerHTML=`<div class="vol">Colophon</div><h1>${b.name}</h1><p class="sub">${b.sub}</p><p class="tx">${b.about}</p><a class="contact" href="tel:+918328353823">+91 83283 53823</a><a class="contact" href="mailto:gowtham.medida24@gmail.com">gowtham.medida24@gmail.com</a><a class="contact" href="https://www.instagram.com/gowtham_kumar24/" target="_blank" rel="noopener">@gowtham_kumar24</a><div class="bot"><button id="cl">Close book</button></div>`}
 else{const n=b.pieces.length,at=cur?cur.n:-1,chNow=cur?cur.p.ch:'Title page';
 el.innerHTML=`<div class="vol">Volume ${String(r.i).padStart(2,'0')}</div><h1>${b.name}</h1><p class="sub">${b.sub}</p><p class="tx">${b.about}</p><p class="tx">${b.made}</p><ol>${b.chapters.map(c=>`<li class="${c.t===chNow?'on':''}"><button data-go="${c.start}">${c.t}<span>${c.n}</span></button></li>`).join('')}</ol><div class="pn"><button class="a" id="pv" aria-label="Previous page" ${state.page?'':'disabled'}>‹</button><div>${chNow}<small>${(()=>{const c=curPieces().filter(Boolean),f=x=>String(x).padStart(2,'0');return c.length?(c.length>1?f(c[0].n+1)+'-'+f(c[1].n+1):f(c[0].n+1)):'00'})()} / ${String(n).padStart(2,'0')}</small></div><button class="a" id="nx" aria-label="Next page" ${state.page<last?'':'disabled'}>›</button></div><div class="bot"><button id="cl">Close book</button><span class="cr">Made at Mark Creatives</span></div>`}
 const on=(s,f)=>{const n=el.querySelector(s);if(n)n.onclick=f};on('#cl',closeBook);on('#pv',()=>showSpread(state.page-1,-1));on('#nx',()=>showSpread(state.page+1,1));el.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>{const t=Math.floor((+x.dataset.go+2)/2);showSpread(t,t>=state.page?1:-1)})}
/* lightbox */
let lb=null;function lightbox(n){const b=books[state.open].b;lb=n;const p=b.pieces[n],s=$('#lstage');s.innerHTML=p.v?`<video src="${p.v}" controls autoplay playsinline></video>`:`<img src="${p.th}" alt="${b.name}, ${p.ch}">`;$('#lcap').textContent=`${b.name}, ${p.ch}, ${n+1} of ${b.pieces.length}`;$('#light').hidden=false;vids.forEach(v=>v.pause())}
function lbClose(){$('#light').hidden=true;$('#lstage').innerHTML='';lb=null;vids.forEach(v=>v.src&&v.play().catch(()=>{}))}
$('#lx').onclick=lbClose;$('#lp').onclick=()=>{const n=books[state.open].b.pieces.length;lightbox((lb-1+n)%n)};$('#ln').onclick=()=>{const n=books[state.open].b.pieces.length;lightbox((lb+1)%n)};
/* pointer */
const ray=new T.Raycaster(),ptr=new T.Vector2();let hover=null;
function pickAt(e){ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ptr,cam);return ray.intersectObjects(picks,false)[0]}
addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;if(state.mode==='book'&&!turning){ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ptr,cam);const hit=ray.intersectObjects([pL,pR],false)[0],c=curPieces();document.body.style.cursor=hit&&c[hit.object===pL?0:1]?'zoom-in':''}if(state.mode!=='shelf')return;const h=pickAt(e),r=h&&h.object.userData.rec;if(r!==hover){if(hover)G.to(hover.g.position,{y:0,duration:.35,ease:'power3.out'});hover=r;if(r)G.to(r.g.position,{y:.09,duration:.3,ease:'back.out(2.4)'})}document.body.style.cursor=r?'pointer':'';const t=$('#tip');if(r&&!r.b.me&&r.i!==state.focus){t.innerHTML=`<small>Volume ${String(r.i).padStart(2,'0')}</small>${r.b.name}`;t.style.left=e.clientX+14+'px';t.style.top=e.clientY-54+'px';t.style.opacity=1}else t.style.opacity=0});
$('#gl').addEventListener('click',e=>{if(state.mode==='shelf'){const h=pickAt(e);if(!h)return;const i=h.object.userData.rec.i;i===state.focus?openBook(i):focus(i)}else if(state.mode==='book'&&!turning){ptr.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(ptr,cam);const hit=ray.intersectObjects([pL,pR],false)[0];if(!hit)return;const[a,c]=curPieces(),q=hit.object===pL?a:c;if(q){lightbox(q.n)}else if(hit.object===pR)showSpread(state.page+1,1)}});
let wheelT=0,wheelSum=0;addEventListener('wheel',e=>{if(state.mode==='reel'){wheelSum=Math.max(0,wheelSum+e.deltaY);if(wheelSum>160)go(true);return}if(!$('#light').hidden)return;const now=performance.now();if(now-wheelT<420||Math.abs(e.deltaY)+Math.abs(e.deltaX)<8)return;wheelT=now;const d=Math.sign(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY);if(state.mode==='shelf')focus(state.focus+d);else if(state.mode==='book')showSpread(state.page+d,d)},{passive:true});
let ty=0;addEventListener('touchstart',e=>{ty=e.touches[0].clientX+e.touches[0].clientY},{passive:true});addEventListener('touchend',e=>{const t=e.changedTouches[0],d=ty-(t.clientX+t.clientY);if(Math.abs(d)<40)return;const s=Math.sign(d);if(state.mode==='reel')go(true);else if(state.mode==='shelf')focus(state.focus+s);else if(state.mode==='book')showSpread(state.page+s,s)},{passive:true});
addEventListener('keydown',e=>{if(!$('#light').hidden){if(e.key==='Escape')lbClose();if(e.key==='ArrowLeft')$('#lp').click();if(e.key==='ArrowRight')$('#ln').click();return}const k=e.key;if(state.mode==='reel'){if(k==='ArrowDown'||k==='PageDown')go(true);if(k===' '&&!(e.target&&e.target.tagName==='BUTTON')){e.preventDefault();rv.paused?rv.play():rv.pause()}}if(state.mode==='shelf'){if(k==='ArrowLeft')focus(state.focus-1);if(k==='ArrowRight')focus(state.focus+1);if(k==='Enter')openBook(state.focus)}if(state.mode==='book'){if(k==='Escape')closeBook();if(k==='ArrowLeft')showSpread(state.page-1,-1);if(k==='ArrowRight')showSpread(state.page+1,1)}});
$('#prev').onclick=()=>focus(state.focus-1);$('#next').onclick=()=>focus(state.focus+1);$('#open').onclick=()=>openBook(state.focus);
/* reel */
const rv=$('#rv');rv.src=D.reel;rv.muted=true;rv.play().catch(()=>{});rv.onclick=()=>{rv.paused?rv.play():rv.pause()};
$('#snd').onclick=()=>{rv.currentTime=0;rv.muted=false;rv.play();$('#snd').style.display='none'};$('#skip').onclick=()=>go(true);
rv.addEventListener('ended',()=>{if(state.mode==='reel')go(false)});
function closeUp(){/* place the camera so the disc matches the reel's end ball: 840/1080 of the video height */
 const vh=Math.min(innerHeight,innerWidth*9/16),frac=(770/1080)*vh/innerHeight,viewH=2*R/frac,d=viewH/(2*Math.tan(T.MathUtils.degToRad(FOV/2)));return{x:0,y:discY,z:d+BT/2+.03,lx:0,ly:discY}}
function setBooksDown(){books.slice(1).forEach(r=>{r.g.rotation.x=-Math.PI/2+.012;r.g.position.z=.55});}
let played=false;
function go(skip){if(state.mode!=='reel')return;state.mode='moving';played=true;$('#reelui').style.opacity=0;const land=()=>{wallTo(books[1].b.wall,1.1);inkTo(books[1].b)};setBooksDown();resize();Object.assign(camBase,closeUp());
 me.g.rotation.x=0;key.intensity=0;hemi.intensity=0;wallM.color.set('#000');scene.background.set('#000');ball.visible=false;
 if(reduce){books.forEach(r=>{r.g.rotation.x=0;r.g.position.z=0});key.intensity=KI;hemi.intensity=HI;$('#reel').style.display='none';state.mode='shelf';state.focus=1;focus(1,0);land();document.body.classList.add('shelf');label();rv.pause();return}
 const T0=.28;const tl=G.timeline({onComplete(){state.mode='shelf';document.body.classList.add('shelf');label()}});
 if(skip)G.to(rv,{volume:0,duration:1.2,onComplete(){rv.pause()}});
 $('#floor').style.opacity=.47;
 tl.to('#rv',{opacity:0,duration:T0,ease:'none'},0);tl.set('#reel',{background:'transparent'},T0);tl.to('#floor',{opacity:0,duration:.5,ease:'power2.in'},T0);tl.set('#reel',{display:'none'},T0+.55);
 const c=closeUp(),hx=books[1].g.position.x,p=shelfPose();state.focus=1;const pp=shelfPose();
 tl.to(camBase,{z:c.z*.94,duration:.32,ease:'sine.inOut'},T0+.12);                /* anticipation: push in, then pull */
 tl.to(camBase,{z:p.z*.74,y:2.02,ly:1.72,duration:1.4,ease:'expo.inOut'},T0+.44);
 tl.to(hemi,{intensity:HI,duration:1.25,ease:'power2.in'},T0+.8);tl.to(key,{intensity:KI,duration:1.25,ease:'power2.in'},T0+.8);
 tl.to(glow.material,{opacity:.22,duration:.8},T0+.6);
 /* the ball drops off the disc, lands on the shelf and stands each book up as it rolls past */
 const bs=T0+1.5;ball.position.set(-R*.65,discY-R*.65,BT/2+.12);tl.set(ball,{visible:true},bs-.25);
 tl.to(ball.position,{y:.075,duration:.42,ease:'power2.in'},bs-.25);tl.to(ball.position,{x:-.3,z:.55,duration:.42,ease:'none'},bs-.25);tl.to(ball.position,{y:.3,duration:.13,ease:'power2.out'},bs+.17);tl.to(ball.position,{y:.075,duration:.13,ease:'power2.in'},bs+.3);
 const roll=2.0,end=GAP*(books.length);tl.to(ball.position,{x:end,duration:roll,ease:'power1.in'},bs+.17);
 books.slice(1).forEach(r=>{const when=bs+.17+roll*Math.pow(((r.g.position.x+.3)/(end+.3)),1/2.0)-.04;tl.to(r.g.rotation,{x:.05,duration:.26,ease:'power3.out'},when).to(r.g.rotation,{x:0,duration:.34,ease:'sine.inOut'},when+.26).to(r.g.position,{z:0,duration:.34,ease:'power2.out'},when)});
 tl.call(land,null,bs+.05);tl.to(camBase,{x:pp.x,y:pp.y,z:pp.z,lx:pp.lx,ly:pp.ly,duration:1.5,ease:'power3.inOut'},bs+.35);tl.set(ball,{visible:false},bs+.17+roll)}
function replay(){if(state.mode!=='shelf')return;state.mode='reel';document.body.classList.remove('shelf');const rl=$('#reel');G.set(rl,{display:'block',background:'#000'});G.set('#rv',{opacity:1});$('#floor').style.opacity=0;$('#reelui').style.opacity=1;$('#snd').style.display='none';rv.volume=1;rv.muted=false;rv.currentTime=0;rv.play()}
$('#replay').onclick=replay;
/* frame */
const look=new T.Vector3;function frame(){if(state.mode==='reel'&&rv.currentTime>=D.cut)go(false);const k=state.mode==='shelf'?1:state.mode==='book'?.25:0;cam.position.set(camBase.x+mx*.22*k,camBase.y-my*.12*k,camBase.z);look.set(camBase.lx,camBase.ly,0);cam.lookAt(look);key.target.position.set(camBase.lx,0,0);key.position.set(camBase.lx-6,9,9);renderer.render(scene,cam);requestAnimationFrame(frame)}
if(location.hash==='#qc')Object.assign(window,{__s:state,__go:go,__rv:rv,__open:openBook,__spread:showSpread,__focus:focus,__books:books,__cam:camBase});
(async()=>{await document.fonts.ready;await Promise.all([document.fonts.load('400 40px News'),document.fonts.load('italic 400 34px News'),document.fonts.load('500 19px Lab')]);
 await Promise.all(books.map(async(r,i)=>{const c=await coverCanvas(r.b,i),t=tex(c);r.front.material[4].map=t;r.front.material[4].needsUpdate=true}));
 Object.assign(camBase,closeUp());resize();frame()})();
