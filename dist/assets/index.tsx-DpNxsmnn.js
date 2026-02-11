import{r as k,j as e,a as J,R as Q,G as Z,b as ee,c as te}from"./ResultView-BXWFaSCq.js";const oe=({icon:s,title:l,description:g,tier:A,index:v,children:P})=>{const[F,T]=k.useState(!1);return e.jsxs("div",{className:`tool-card ${F?"tool-card-expanded":""}`,style:{animationDelay:`${v*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>T(!F),"aria-expanded":F,"aria-label":`${l} - ${g}`,children:[e.jsx("div",{className:"tool-card-icon",children:s}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:l}),e.jsx("p",{className:"tool-card-desc",children:g})]}),e.jsx("div",{className:`tool-card-chevron ${F?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),A===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${F?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:P||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var ae=J();function K({value:s,onChange:l,options:g,placeholder:A="Select...",disabled:v=!1}){const[P,F]=k.useState(!1),T=k.useRef(null),x=k.useRef(null),[f,E]=k.useState({top:0,left:0,width:0}),a=k.useCallback(()=>{var c;const r=(c=T.current)==null?void 0:c.getRootNode();if(r&&r instanceof ShadowRoot){let j=r.querySelector("#undiffused-portal-root");return j||(j=document.createElement("div"),j.id="undiffused-portal-root",Object.assign(j.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),r.appendChild(j)),j}return document.body},[]),w=g.find(r=>r.value===s),d=r=>{l(r),F(!1)},I=()=>{if(!v)if(!P&&T.current){const r=T.current.getBoundingClientRect();E({top:r.bottom+6,left:r.left,width:r.width}),F(!0)}else F(!1)};k.useEffect(()=>{var j;if(!P)return;const r=C=>{var L,b;const h=C.target;(L=T.current)!=null&&L.contains(h)||(b=x.current)!=null&&b.contains(h)||F(!1)},c=((j=T.current)==null?void 0:j.getRootNode())||document;return c.addEventListener("mousedown",r),()=>c.removeEventListener("mousedown",r)},[P]),k.useEffect(()=>{if(!P)return;const r=()=>F(!1);return window.addEventListener("resize",r),window.addEventListener("scroll",r,{capture:!0}),()=>{window.removeEventListener("resize",r),window.removeEventListener("scroll",r,{capture:!0})}},[P]);const y=e.jsx("div",{ref:x,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:f.top,left:f.left,width:f.width,zIndex:2147483647,pointerEvents:"auto"},children:g.map(r=>e.jsxs("div",{className:`liquid-select-option ${r.value===s?"selected":""}`,onClick:()=>d(r.value),role:"option","aria-selected":r.value===s,children:[e.jsx("span",{children:r.label}),r.value===s&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(r.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:T,type:"button",className:`liquid-select-trigger ${P?"open":""} ${v?"opacity-50 cursor-not-allowed":""}`,onClick:I,disabled:v,"aria-haspopup":"listbox","aria-expanded":P,children:[e.jsx("span",{children:w?w.label:A}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),P&&ae.createPortal(y,a())]})}const G=({label:s,onClick:l,isAnalysing:g=!1,disabled:A=!1,onHelpClick:v})=>e.jsxs("div",{className:"tool-action-row",children:[e.jsx("button",{className:`tool-analyse-btn ${g?"tool-loading":""}`,onClick:l,disabled:A||g,children:g?"Analysing...":s}),e.jsx("button",{className:"tool-help-btn",onClick:v,title:"How does this tool work?",children:e.jsx("span",{className:"tool-help-icon",children:"?"})})]}),V=({value:s,min:l,max:g,style:A,...v})=>{const P=(s-l)/(g-l)*100;return e.jsx("input",{type:"range",className:"tool-slider",min:l,max:g,value:s,style:{...A,background:`linear-gradient(to right, #ffffff 0%, #ffffff ${P}%, rgba(255, 255, 255, 0.2) ${P}%, rgba(255, 255, 255, 0.2) 100%)`},...v})},ne=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(85),[v,P]=k.useState("medium"),[F,T]=k.useState(!1),[x,f]=k.useState(null),E=v==="low"?10:v==="medium"?20:40,a=k.useCallback(async()=>{T(!0),f(null);try{const w=new Image;await new Promise((n,t)=>{w.onload=()=>n(),w.onerror=()=>t(new Error("Failed to load image")),w.src=s});const d=w.naturalWidth,I=w.naturalHeight,y=document.createElement("canvas");y.width=d,y.height=I;const r=y.getContext("2d");r.drawImage(w,0,0);const c=r.getImageData(0,0,d,I),j=document.createElement("canvas");j.width=d,j.height=I;const C=j.getContext("2d");C.drawImage(w,0,0);const h=j.toDataURL("image/jpeg",g/100),L=new Image;await new Promise(n=>{L.onload=()=>n(),L.src=h}),C.drawImage(L,0,0);const b=C.getImageData(0,0,d,I),S=document.createElement("canvas");S.width=d,S.height=I;const u=S.getContext("2d"),o=u.createImageData(d,I);let p=0;for(let n=0;n<c.data.length;n+=4){const t=Math.abs(c.data[n]-b.data[n]),m=Math.abs(c.data[n+1]-b.data[n+1]),i=Math.abs(c.data[n+2]-b.data[n+2]);p+=t+m+i;const D=Math.min(255,t*E),R=Math.min(255,m*E),W=Math.min(255,i*E),O=(D+R+W)/3;O<64?(o.data[n]=0,o.data[n+1]=0,o.data[n+2]=Math.min(255,O*4)):O<128?(o.data[n]=0,o.data[n+1]=Math.min(255,(O-64)*4),o.data[n+2]=255-(O-64)*4):O<192?(o.data[n]=Math.min(255,(O-128)*4),o.data[n+1]=255,o.data[n+2]=0):(o.data[n]=255,o.data[n+1]=255-(O-192)*4,o.data[n+2]=0),o.data[n+3]=255}u.putImageData(o,0,0),l&&l(S),f({diffScore:p/(d*I)})}catch(w){console.error("[ELA] Analysis failed:",w)}finally{T(!1)}},[s,g,E,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",g,"%"]}),e.jsx(V,{min:50,max:100,value:g,onChange:w=>A(Number(w.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(K,{value:v,onChange:w=>P(w),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx(G,{label:"Analyse Error Levels",onClick:a,isAnalysing:F}),x&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:x.diffScore.toFixed(2)})]})})]})]})},se=({targetImage:s,onResult:l})=>{const[g,A]=k.useState("luminance"),[v,P]=k.useState(32),[F,T]=k.useState(!1),[x,f]=k.useState(null),E=k.useCallback(async()=>{T(!0),f(null);try{const a=new Image;await new Promise((t,m)=>{a.onload=()=>t(),a.onerror=()=>m(new Error("Failed to load image")),a.src=s});const w=a.naturalWidth,d=a.naturalHeight,I=document.createElement("canvas");I.width=w,I.height=d;const y=I.getContext("2d");y.drawImage(a,0,0);const c=y.getImageData(0,0,w,d).data,j=t=>g==="chromatic"?(c[t]-c[t+1])*.5+128:.299*c[t]+.587*c[t+1]+.114*c[t+2],C=Math.floor(w/v),h=Math.floor(d/v),L=[];for(let t=0;t<h;t++)for(let m=0;m<C;m++){const i=[];for(let W=0;W<v;W++)for(let O=0;O<v;O++){const z=m*v+O,Y=t*v+W,q=(Y*w+z)*4,B=j(q);let N=0,M=0;for(const[H,$]of[[-1,0],[1,0],[0,-1],[0,1]]){const X=z+H,_=Y+$;X>=0&&X<w&&_>=0&&_<d&&(N+=j((_*w+X)*4),M++)}const U=B-N/M;i.push(U)}const D=i.reduce((W,O)=>W+O,0)/i.length,R=i.reduce((W,O)=>W+(O-D)**2,0)/i.length;L.push(R)}const b=L.reduce((t,m)=>t+m,0)/L.length,S=Math.sqrt(L.reduce((t,m)=>t+(m-b)**2,0)/L.length),u=Math.max(0,100-S/b*100),o=document.createElement("canvas");o.width=w,o.height=d;const p=o.getContext("2d");p.globalAlpha=.3,p.drawImage(a,0,0),p.globalAlpha=1;const n=Math.max(...L);for(let t=0;t<h;t++)for(let m=0;m<C;m++){const i=L[t*C+m],D=n>0?i/n:0,R=Math.floor(255*(1-D)),W=Math.floor(255*D);p.fillStyle=`rgba(${R}, ${W}, 60, 0.5)`,p.fillRect(m*v,t*v,v,v),p.strokeStyle="rgba(255,255,255,0.1)",p.strokeRect(m*v,t*v,v,v)}l&&l(o),f({mean:b,std:S,uniformity:u})}catch(a){console.error("[Noise] Analysis failed:",a)}finally{T(!1)}},[s,g,v,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(K,{value:g,onChange:a=>A(a),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",v,"px"]}),e.jsx(V,{min:8,max:64,step:8,value:v,onChange:a=>P(Number(a.target.value))})]}),e.jsx(G,{label:"Analyse Noise",onClick:E,isAnalysing:F}),x&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:x.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:x.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${x.uniformity>70?"tool-verdict-danger":x.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[x.uniformity>70?"⚠️":x.uniformity>40?"🤔":"✅"," ","Uniformity: ",x.uniformity.toFixed(1),"% — ",x.uniformity>70?"Uniform noise (AI suspect)":x.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},re=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(5),[v,P]=k.useState(32),[F,T]=k.useState(!1),[x,f]=k.useState(null),E=(d,I,y,r,c)=>{let j=0;const C=Math.max(1,Math.floor(c/8));for(let h=0;h<c;h+=C)for(let L=0;L<c;L+=C){const b=((r+h)*I+(y+L))*4,S=d[b]*.299+d[b+1]*.587+d[b+2]*.114;j=(j<<5)-j+Math.floor(S/(12-g))|0}return j},a=(d,I,y,r,c,j,C)=>{let h=0,L=0;const b=Math.max(1,Math.floor(C/16));for(let S=0;S<C;S+=b)for(let u=0;u<C;u+=b){const o=((r+S)*I+(y+u))*4,p=((j+S)*I+(c+u))*4;h+=Math.abs(d[o]-d[p]),h+=Math.abs(d[o+1]-d[p+1]),h+=Math.abs(d[o+2]-d[p+2]),L++}return 1-h/(L*3*255)},w=k.useCallback(async()=>{T(!0),f(null);try{const d=new Image;await new Promise((t,m)=>{d.onload=()=>t(),d.onerror=()=>m(new Error("Failed to load")),d.src=s});const I=d.naturalWidth,y=d.naturalHeight,r=document.createElement("canvas");r.width=I,r.height=y;const c=r.getContext("2d");c.drawImage(d,0,0);const j=c.getImageData(0,0,I,y),C=Math.max(v/2,8),h=new Map;for(let t=0;t+v<=y;t+=C)for(let m=0;m+v<=I;m+=C){const i=E(j.data,I,m,t,v);h.has(i)||h.set(i,[]),h.get(i).push({x:m,y:t})}const L=[],b=v*2,S=.85+(g-5)*.01;for(const[,t]of h)if(!(t.length<2||t.length>50))for(let m=0;m<t.length&&m<10;m++)for(let i=m+1;i<t.length&&i<10;i++){if(Math.sqrt((t[m].x-t[i].x)**2+(t[m].y-t[i].y)**2)<b)continue;const R=a(j.data,I,t[m].x,t[m].y,t[i].x,t[i].y,v);R>=S&&L.push({ax:t[m].x,ay:t[m].y,bx:t[i].x,by:t[i].y,sim:R})}const u=document.createElement("canvas");u.width=I,u.height=y;const o=u.getContext("2d");o.drawImage(d,0,0);const p=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],n=L.slice(0,30);n.forEach((t,m)=>{const i=p[m%p.length];o.strokeStyle=i,o.lineWidth=2,o.globalAlpha=.7,o.strokeRect(t.ax,t.ay,v,v),o.strokeRect(t.bx,t.by,v,v),o.fillStyle=i,o.globalAlpha=.15,o.fillRect(t.ax,t.ay,v,v),o.fillRect(t.bx,t.by,v,v),o.globalAlpha=.4,o.setLineDash([4,4]),o.beginPath(),o.moveTo(t.ax+v/2,t.ay+v/2),o.lineTo(t.bx+v/2,t.by+v/2),o.stroke(),o.setLineDash([]),o.globalAlpha=1}),l&&l(u),f(n.length)}catch(d){console.error("[Clone] Detection failed:",d)}finally{T(!1)}},[s,g,v,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",g]}),e.jsx(V,{min:1,max:10,value:g,onChange:d=>A(Number(d.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",v,"px"]}),e.jsx(V,{min:8,max:128,step:8,value:v,onChange:d=>P(Number(d.target.value))})]}),e.jsx(G,{label:"Detect Clones",onClick:w,isAnalysing:F}),x!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${x>5?"tool-verdict-danger":x>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[x>0?"🎯":"✅"," Found ",x," clone ",x===1?"pair":"pairs"]})]})]})},ie=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(1),[v,P]=k.useState(!1),[F,T]=k.useState(null),x=(E,a)=>{const w=E.length;if(w<=1)return[E,a];const d=w/2,I=new Float64Array(d),y=new Float64Array(d),r=new Float64Array(d),c=new Float64Array(d);for(let u=0;u<d;u++)I[u]=E[2*u],y[u]=a[2*u],r[u]=E[2*u+1],c[u]=a[2*u+1];const[j,C]=x(I,y),[h,L]=x(r,c),b=new Float64Array(w),S=new Float64Array(w);for(let u=0;u<d;u++){const o=-2*Math.PI*u/w,p=Math.cos(o),n=Math.sin(o),t=p*h[u]-n*L[u],m=p*L[u]+n*h[u];b[u]=j[u]+t,S[u]=C[u]+m,b[u+d]=j[u]-t,S[u+d]=C[u]-m}return[b,S]},f=k.useCallback(async()=>{P(!0),T(null);try{const E=new Image;await new Promise((i,D)=>{E.onload=()=>i(),E.onerror=()=>D(new Error("Failed to load image")),E.src=s});const a=512,w=document.createElement("canvas");w.width=a,w.height=a;const d=w.getContext("2d");d.drawImage(E,0,0,a,a);const y=d.getImageData(0,0,a,a).data,r=new Float64Array(a*a);for(let i=0;i<a*a;i++)r[i]=(y[i*4]*.299+y[i*4+1]*.587+y[i*4+2]*.114)/255;const c=new Float64Array(r),j=new Float64Array(a*a);for(let i=0;i<a;i++){const D=new Float64Array(a),R=new Float64Array(a);for(let z=0;z<a;z++)D[z]=c[i*a+z],R[z]=j[i*a+z];const[W,O]=x(D,R);for(let z=0;z<a;z++)c[i*a+z]=W[z],j[i*a+z]=O[z]}for(let i=0;i<a;i++){const D=new Float64Array(a),R=new Float64Array(a);for(let z=0;z<a;z++)D[z]=c[z*a+i],R[z]=j[z*a+i];const[W,O]=x(D,R);for(let z=0;z<a;z++)c[z*a+i]=W[z],j[z*a+i]=O[z]}const C=new Float64Array(a*a),h=a/2;let L=0;for(let i=0;i<a;i++)for(let D=0;D<a;D++){const R=c[i*a+D],W=j[i*a+D];let O=Math.sqrt(R*R+W*W);O=Math.log(1+O)*g;const z=(i+h)%a,Y=(D+h)%a,q=z*a+Y;C[q]=O,O>L&&(L=O)}const b=C[h*a+h],u=C[0]/L*100,o=b/L*100;let p=0;for(let i=1;i<4;i++){const D=h+i*(a/8);D<a&&C[h*a+D]>C[h*a+D-1]*1.5&&p++}const n=document.createElement("canvas");n.width=a,n.height=a;const t=n.getContext("2d"),m=t.createImageData(a,a);for(let i=0;i<a*a;i++){const D=L>0?C[i]/L*255:0,R=i*4;m.data[R]=Math.min(255,D*.8),m.data[R+1]=Math.min(255,D*.9),m.data[R+2]=Math.min(255,D),m.data[R+3]=255}t.putImageData(m,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let i=30;i<h;i+=30)t.beginPath(),t.arc(h,h,i,0,Math.PI*2),t.stroke();l&&l(n),T({highFreq:u,lowFreq:o,gridArtifacts:p>3})}catch(E){console.error("[FFT] Analysis failed:",E)}finally{P(!1)}},[s,g,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",g]}),e.jsx(V,{min:1,max:10,step:.1,value:g,onChange:E=>A(Number(E.target.value))})]}),e.jsx(G,{label:"Generate Spectrum",onClick:f,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:F.gridArtifacts?"#ef4444":"#10b981"},children:F.gridArtifacts?"Detected":"None"})]})]})]})]})},le=({targetImage:s,onResult:l})=>{const[g,A]=k.useState("sobel"),[v,P]=k.useState(100),[F,T]=k.useState(!1),[x,f]=k.useState(null),[E,a]=k.useState(0),w=k.useRef(null),d=k.useRef(null),I=k.useCallback(async()=>{T(!0),f(null);try{const y=new Image;await new Promise((N,M)=>{y.onload=()=>N(),y.onerror=()=>M(new Error("Failed to load")),y.src=s});const r=y.naturalWidth,c=y.naturalHeight,j=document.createElement("canvas");j.width=r,j.height=c;const C=j.getContext("2d");C.drawImage(y,0,0);const L=C.getImageData(0,0,r,c).data,b=new Float64Array(r*c);for(let N=0;N<r*c;N++){const M=N*4;b[N]=.299*L[M]+.587*L[M+1]+.114*L[M+2]}const S=new Float64Array(r*c),u=new Uint8Array(r*c);if(g==="sobel"||g==="canny")for(let N=1;N<c-1;N++)for(let M=1;M<r-1;M++){const U=-b[(N-1)*r+(M-1)]+b[(N-1)*r+(M+1)]-2*b[N*r+(M-1)]+2*b[N*r+(M+1)]-b[(N+1)*r+(M-1)]+b[(N+1)*r+(M+1)],H=-b[(N-1)*r+(M-1)]-2*b[(N-1)*r+M]-b[(N-1)*r+(M+1)]+b[(N+1)*r+(M-1)]+2*b[(N+1)*r+M]+b[(N+1)*r+(M+1)],$=Math.sqrt(U*U+H*H);S[N*r+M]=$,u[N*r+M]=$>v?255:0}else for(let N=1;N<c-1;N++)for(let M=1;M<r-1;M++){const U=-4*b[N*r+M]+b[(N-1)*r+M]+b[(N+1)*r+M]+b[N*r+(M-1)]+b[N*r+(M+1)],H=Math.abs(U);S[N*r+M]=H,u[N*r+M]=H>v/2?255:0}let o=0,p=0;const n=32,t=[];for(let N=0;N<r*c;N++)u[N]>0&&o++,p+=S[N];for(let N=0;N<Math.floor(c/n);N++)for(let M=0;M<Math.floor(r/n);M++){let U=0;for(let H=0;H<n;H++)for(let $=0;$<n;$++)U+=S[(N*n+H)*r+(M*n+$)];t.push(U/(n*n))}const m=t.reduce((N,M)=>N+M,0)/t.length,i=Math.sqrt(t.reduce((N,M)=>N+(M-m)**2,0)/t.length),D=m>0?Math.max(0,100-i/m*50):0;f({edgeDensity:o/(r*c)*1e4,avgStrength:p/(r*c),uniformity:D});const R=document.createElement("canvas");R.width=r,R.height=c;const W=R.getContext("2d"),O=W.createImageData(r,c);for(let N=0;N<r*c;N++){const M=N*4;O.data[M]=O.data[M+1]=O.data[M+2]=u[N],O.data[M+3]=255}W.putImageData(O,0,0);const z=document.createElement("canvas");z.width=r,z.height=c;const Y=z.getContext("2d"),q=Y.createImageData(r,c),B=Math.max(...S);for(let N=0;N<r*c;N++){const M=N*4,U=B>0?S[N]/B:0;U<.25?(q.data[M]=0,q.data[M+1]=Math.floor(U*4*255),q.data[M+2]=255):U<.5?(q.data[M]=0,q.data[M+1]=255,q.data[M+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(q.data[M]=Math.floor((U-.5)*4*255),q.data[M+1]=255,q.data[M+2]=0):(q.data[M]=255,q.data[M+1]=Math.floor((1-(U-.75)*4)*255),q.data[M+2]=0),q.data[M+3]=255}Y.putImageData(q,0,0),w.current=R,d.current=z,f({edgeDensity:o/(r*c)*1e4,avgStrength:p/(r*c),uniformity:D})}catch(y){console.error("[Gradient] Analysis failed:",y)}finally{T(!1)}},[s,g,v]);return Q.useEffect(()=>{x&&l&&(E===0&&w.current?l(w.current):E===1&&d.current&&l(d.current))},[x,E,l]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(K,{value:g,onChange:y=>A(y),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",v]}),e.jsx(V,{min:20,max:300,value:v,onChange:y=>P(Number(y.target.value))})]}),e.jsx(G,{label:"Analyse Gradients",onClick:I,isAnalysing:F}),x&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${E===0?"tool-tab-active":""}`,onClick:()=>a(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${E===1?"tool-tab-active":""}`,onClick:()=>a(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[x.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:x.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${x.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[x.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",x.uniformity.toFixed(1),"%)"]})]})]})},ce=({targetImage:s,onResult:l})=>{const[g,A]=k.useState("medium"),[v,P]=k.useState(!1),[F,T]=k.useState(0),[x,f]=k.useState(null),E=k.useCallback(async()=>{P(!0),f(null),T(0);try{const a=new Image;await new Promise((B,N)=>{a.onload=()=>B(),a.onerror=()=>N(new Error("Failed to load")),a.src=s}),T(20);const w=a.naturalWidth,d=a.naturalHeight,I=document.createElement("canvas");I.width=w,I.height=d;const y=I.getContext("2d");y.drawImage(a,0,0);const c=y.getImageData(0,0,w,d).data,j=new Float64Array(w*d);for(let B=0;B<w*d;B++)j[B]=.299*c[B*4]+.587*c[B*4+1]+.114*c[B*4+2];T(40);const h=Math.floor((g==="low"?3:g==="medium"?5:7)/2),L=new Float64Array(w*d);for(let B=0;B<d;B++)for(let N=0;N<w;N++){let M=0,U=0;for(let H=-h;H<=h;H++)for(let $=-h;$<=h;$++){const X=B+H,_=N+$;X>=0&&X<d&&_>=0&&_<w&&(M+=j[X*w+_],U++)}L[B*w+N]=M/U}T(70);const b=new Float64Array(w*d);for(let B=0;B<w*d;B++)b[B]=j[B]-L[B];const S=32,u=Math.floor(w/S),o=Math.floor(d/S),p=[];for(let B=0;B<o;B++)for(let N=0;N<u;N++){const M=[];for(let $=0;$<S;$++)for(let X=0;X<S;X++)M.push(b[(B*S+$)*w+(N*S+X)]);const U=M.reduce(($,X)=>$+X,0)/M.length,H=M.reduce(($,X)=>$+(X-U)**2,0)/M.length;p.push(H)}const n=p.reduce((B,N)=>B+N,0)/p.length,t=Math.sqrt(p.reduce((B,N)=>B+(N-n)**2,0)/p.length),m=n>0?Math.min(100,t/n*100):0,i=100-m,D=m>30;f({hasFingerprint:D,consistency:m,uniformity:i}),T(90);const R=document.createElement("canvas");R.width=w,R.height=d;const W=R.getContext("2d"),O=W.createImageData(w,d);let z=1/0,Y=-1/0;for(let B=0;B<b.length;B++)b[B]<z&&(z=b[B]),b[B]>Y&&(Y=b[B]);const q=Y-z||1;for(let B=0;B<w*d;B++){const N=(b[B]-z)/q*255,M=B*4,U=Math.min(255,N*3);O.data[M]=U,O.data[M+1]=U,O.data[M+2]=U,O.data[M+3]=255}W.putImageData(O,0,0),l&&l(R),T(100),f({hasFingerprint:D,consistency:m,uniformity:i})}catch(a){console.error("[PRNU] Analysis failed:",a)}finally{P(!1)}},[s,g,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(K,{value:g,onChange:a=>A(a),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx(G,{label:"Extract PRNU",onClick:E,isAnalysing:v}),v&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${F}%`}})}),x&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[x.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[x.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${x.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:x.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},de=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(6),[v,P]=k.useState(!1),[F,T]=k.useState(null),x=k.useCallback(async()=>{P(!0),T(null);try{const f=new Image;await new Promise((u,o)=>{f.onload=()=>u(),f.onerror=()=>o(new Error("Failed to load")),f.src=s});const E=f.naturalWidth,a=f.naturalHeight,w=document.createElement("canvas");w.width=E,w.height=a;const d=w.getContext("2d");d.drawImage(f,0,0);const y=d.getImageData(0,0,E,a).data,r=200+(10-g)*5,c=[],j=16;for(let u=0;u<Math.floor(a/j);u++)for(let o=0;o<Math.floor(E/j);o++){let p=0,n=0,t=0;for(let m=0;m<j;m++)for(let i=0;i<j;i++){const D=o*j+i,R=u*j+m,W=(R*E+D)*4,O=Math.max(y[W],y[W+1],y[W+2]);O>p&&(p=O,n=D,t=R)}p>r&&c.push({x:n,y:t,intensity:p})}const C=[];for(const u of c){let o=0,p=0;const n=10;for(let m=-n;m<=n;m++)for(let i=-n;i<=n;i++){const D=u.x+i,R=u.y+m;if(D<0||D>=E||R<0||R>=a)continue;const W=(R*E+D)*4,O=.299*y[W]+.587*y[W+1]+.114*y[W+2];o+=i*O,p+=m*O}const t=Math.atan2(p,o);C.push(t)}let h=0,L=0;if(C.length>1){const u=C.reduce((o,p)=>o+p,0)/C.length;for(const o of C){const p=Math.abs(o-u);p<Math.PI/4||p>Math.PI*7/4?h++:L++}}T({highlights:c.length,consistent:h,inconsistent:L});const b=document.createElement("canvas");b.width=E,b.height=a;const S=b.getContext("2d");S.drawImage(f,0,0),c.forEach((u,o)=>{const p=o<C.length&&(()=>{const n=C.reduce((m,i)=>m+i,0)/C.length,t=Math.abs(C[o]-n);return t<Math.PI/4||t>Math.PI*7/4})();if(S.beginPath(),S.arc(u.x,u.y,12,0,Math.PI*2),S.strokeStyle=p?"#fbbf24":"#ef4444",S.lineWidth=2,S.stroke(),o<C.length){const n=C[o],t=25;S.beginPath(),S.moveTo(u.x,u.y),S.lineTo(u.x+Math.cos(n)*t,u.y+Math.sin(n)*t),S.strokeStyle=p?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",S.lineWidth=2,S.stroke()}}),l&&l(b),T({highlights:c.length,consistent:h,inconsistent:L})}catch(f){console.error("[Highlight] Analysis failed:",f)}finally{P(!1)}},[s,g,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",g]}),e.jsx(V,{min:1,max:10,value:g,onChange:f=>A(Number(f.target.value))})]}),e.jsx(G,{label:"Detect Highlights",onClick:x,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:F.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[F.consistent," / ",F.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${F.inconsistent>F.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:F.inconsistent>F.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},he=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(!1),[v,P]=k.useState(null),F=k.useCallback(async()=>{A(!0),P(null);try{const T=new Image;await new Promise((o,p)=>{T.onload=()=>o(),T.onerror=()=>p(new Error("Failed to load")),T.src=s});const x=T.naturalWidth,f=T.naturalHeight,E=document.createElement("canvas");E.width=x,E.height=f;const a=E.getContext("2d");a.drawImage(T,0,0);const d=a.getImageData(0,0,x,f).data,I=new Float64Array(x*f),y=new Float64Array(x*f),r=new Float64Array(x*f);for(let o=0;o<x*f;o++)I[o]=d[o*4],y[o]=d[o*4+1],r[o]=d[o*4+2];const c=[];for(let o=2;o<f-2;o+=4)for(let p=2;p<x-2;p+=4){const n=R=>.299*I[R]+.587*y[R]+.114*r[R],t=o*x+p,m=-n(t-x-1)+n(t-x+1)-2*n(t-1)+2*n(t+1)-n(t+x-1)+n(t+x+1),i=-n(t-x-1)-2*n(t-x)-n(t-x+1)+n(t+x-1)+2*n(t+x)+n(t+x+1),D=Math.sqrt(m*m+i*i);D>100&&c.push({x:p,y:o,strength:D})}let j=0;const C=[];for(const o of c.slice(0,200)){const p=Y=>{const q=o.y*x+o.x,B=-Y[q-x-1]+Y[q-x+1]-2*Y[q-1]+2*Y[q+1]-Y[q+x-1]+Y[q+x+1],N=-Y[q-x-1]-2*Y[q-x]-Y[q-x+1]+Y[q+x-1]+2*Y[q+x]+Y[q+x+1];return{gx:B,gy:N,mag:Math.sqrt(B*B+N*N)}},n=p(I),t=p(y),m=p(r),i=Math.atan2(n.gy,n.gx),D=Math.atan2(t.gy,t.gx),R=Math.atan2(m.gy,m.gx),W=Math.abs(i-D),O=Math.abs(R-D),z=(W+O)/2;j+=z,C.push({x:o.x,y:o.y,sep:z})}const h=c.length>0?j/Math.min(c.length,200):0,L=h>.05,b=document.createElement("canvas");b.width=x,b.height=f;const S=b.getContext("2d"),u=S.createImageData(x,f);for(let o=0;o<x*f;o++){const p=o*4;u.data[p]=Math.min(255,Math.abs(I[o]-y[o])*5),u.data[p+1]=Math.min(255,Math.abs(y[o]-r[o])*5),u.data[p+2]=Math.min(255,Math.abs(r[o]-I[o])*5),u.data[p+3]=255}S.putImageData(u,0,0);for(const o of C)S.beginPath(),S.arc(o.x,o.y,3,0,Math.PI*2),S.fillStyle=o.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",S.fill();l&&l(b),P({avgSeparation:h*100,detected:L,edgesAnalysed:Math.min(c.length,200)})}catch(T){console.error("[Aberration] Analysis failed:",T)}finally{A(!1)}},[s,l]);return e.jsxs("div",{children:[e.jsx(G,{label:"Check for Aberration",onClick:F,isAnalysing:g}),v&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[v.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:v.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${v.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:v.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},ge=({targetImage:s,onResult:l})=>{const[g,A]=k.useState(!0),[v,P]=k.useState(!1),[F,T]=k.useState(null),x=k.useCallback(async()=>{P(!0),T(null);try{const f=new Image;await new Promise((n,t)=>{f.onload=()=>n(),f.onerror=()=>t(new Error("Failed to load")),f.src=s});const E=f.naturalWidth,a=f.naturalHeight,w=document.createElement("canvas");w.width=E,w.height=a;const d=w.getContext("2d");d.drawImage(f,0,0);const I=d.getImageData(0,0,E,a).data,y=8,r=Math.floor(E/y),c=Math.floor(a/y),j=[];for(let n=0;n<c;n++)for(let t=0;t<r;t++){let m=0,i=0;if(t<r-1)for(let D=0;D<y;D++){const W=((n*y+D)*E+(t+1)*y-1)*4,O=W+4;m+=Math.abs(I[W]-I[O])+Math.abs(I[W+1]-I[O+1])+Math.abs(I[W+2]-I[O+2]),i++}if(n<c-1)for(let D=0;D<y;D++){const R=t*y+D,W=(n+1)*y-1,O=W+1,z=(W*E+R)*4,Y=(O*E+R)*4;m+=Math.abs(I[z]-I[Y])+Math.abs(I[z+1]-I[Y+1])+Math.abs(I[z+2]-I[Y+2]),i++}j.push(i>0?m/(i*3):0)}const C=j.reduce((n,t)=>n+t,0)/j.length,h=Math.sqrt(j.reduce((n,t)=>n+(t-C)**2,0)/j.length);let L=0;for(const n of j)Math.abs(n-C)>h*2&&L++;const b=Math.max(10,Math.min(100,100-C*2)),S=L>r*c*.1?2:1,u=document.createElement("canvas");u.width=E,u.height=a;const o=u.getContext("2d");o.drawImage(f,0,0);const p=Math.max(...j);for(let n=0;n<c;n++)for(let t=0;t<r;t++){const m=p>0?j[n*r+t]/p:0,i=m<.33?0:m<.66?200:220,D=m<.33||m<.66?180:50;o.fillStyle=`rgba(${i},${D},0,0.3)`,o.fillRect(t*y,n*y,y,y),g&&(o.strokeStyle="rgba(255,255,255,0.08)",o.lineWidth=.5,o.strokeRect(t*y,n*y,y,y))}l&&l(u),T({quality:b,layers:S,inconsistent:L})}catch(f){console.error("[Compression]",f)}finally{P(!1)}},[s,g,l]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:g,onChange:f=>A(f.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx(G,{label:"Analyse Compression",onClick:x,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[F.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:F.layers})]})]}),e.jsx("div",{className:`tool-verdict ${F.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:F.layers>1?`⚠️ Multiple re-compressions (${F.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},xe=({targetImage:s})=>{const[l,g]=k.useState(!1),[A,v]=k.useState(null),P=k.useCallback(async()=>{var x;g(!0),v(null);try{const f=new Image;await new Promise((i,D)=>{f.onload=()=>i(),f.onerror=()=>D(),f.src=s});const E=s,a=E.startsWith("data:"),w=E.startsWith("blob:"),d=!a&&!w?new URL(E):null,I=d?d.pathname.split("/").pop()||"unknown":"embedded",y=((x=I.split(".").pop())==null?void 0:x.toLowerCase())||"unknown";let r="",c="",j="";try{const i=await fetch(s,{method:"HEAD",mode:"cors"});r=i.headers.get("content-type")||"",c=i.headers.get("content-length")||"",j=i.headers.get("last-modified")||""}catch{}const C=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],h=E.toLowerCase(),L=C.some(i=>h.includes(i)),S=d?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(i=>d.hostname.includes(i)):!1,u={Source:a?"Data URL (embedded)":w?"Blob URL (local)":(d==null?void 0:d.hostname)||"Unknown",Filename:I,Format:r||y.toUpperCase(),Dimensions:`${f.naturalWidth} × ${f.naturalHeight}`},o={"Aspect Ratio":(f.naturalWidth/f.naturalHeight).toFixed(2),"Total Pixels":`${(f.naturalWidth*f.naturalHeight/1e6).toFixed(1)} MP`};c&&(o["File Size"]=`${(parseInt(c)/1024).toFixed(1)} KB`);const p={};j&&(p["Last Modified"]=j);const n={};L&&(n["AI Indicator"]="⚠️ AI-related keywords found in URL"),S&&(n.Hosting="⚠️ Known AI image hosting platform");let t="authentic",m="✅ No suspicious metadata detected";L||S?(t="ai",m="❌ AI generation indicators detected in metadata"):(a||w)&&(t="suspicious",m="⚠️ Embedded/local image — limited metadata available"),v({camera:u,settings:o,dates:p,software:n,verdict:t,verdictText:m})}catch(f){console.error("[Metadata]",f)}finally{g(!1)}},[s]),F=()=>{if(!A)return;const x=JSON.stringify({...A.camera,...A.settings,...A.dates,...A.software},null,2);navigator.clipboard.writeText(x)},T=(x,f,E)=>Object.keys(E).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:f}),e.jsx("h4",{children:x})]}),Object.entries(E).map(([a,w])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:a}),e.jsx("span",{className:`metadata-value ${w.includes("Not found")?"metadata-missing":""}`,children:w})]},a))]});return e.jsxs("div",{children:[e.jsx(G,{label:"Extract Metadata",onClick:P,isAnalysing:l}),A&&e.jsxs("div",{className:"tool-output-area",children:[T("Image Information","📷",A.camera),T("Properties","⚙️",A.settings),T("Dates","📅",A.dates),T("Software & AI Detection","🖥️",A.software),e.jsx("div",{className:`tool-verdict ${A.verdict==="authentic"?"tool-verdict-safe":A.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:A.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:F,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})};async function pe(s){return s.startsWith("data:")||s.startsWith("blob:")?s:new Promise((l,g)=>{chrome.runtime.sendMessage({type:"FETCH_IMAGE_AS_DATA_URL",url:s},A=>{if(chrome.runtime.lastError){g(new Error(chrome.runtime.lastError.message));return}A!=null&&A.success&&A.dataUrl?l(A.dataUrl):g(new Error((A==null?void 0:A.error)||"Failed to fetch image via background"))})})}const ue=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5z"}),e.jsx("path",{d:"M2 17l10 5 10-5"}),e.jsx("path",{d:"M2 12l10 5 10-5"})]}),me=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M2 12h2l2-6 4 12 4-12 2 6h4"}),e.jsx("circle",{cx:"12",cy:"12",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"4",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"20",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"4",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"20",r:"1",fill:l,stroke:"none"})]}),fe=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v8"}),e.jsx("path",{d:"M8 12h8"})]}),be=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M2 10s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4"}),e.jsx("path",{d:"M2 14s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4",style:{opacity:.5}}),e.jsx("rect",{x:"2",y:"6",width:"20",height:"12",rx:"2",strokeOpacity:"0.5"})]}),we=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M3 21L21 3"}),e.jsx("path",{d:"M3 15L9 21"}),e.jsx("path",{d:"M15 3L21 9"})]}),ve=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v18"}),e.jsx("path",{d:"M15 3v18"}),e.jsx("path",{d:"M3 9h18"}),e.jsx("path",{d:"M3 15h18"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",fill:l,stroke:"none"})]}),ye=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2z"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",opacity:"0.5"})]}),je=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("circle",{cx:"9",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("circle",{cx:"15",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("path",{d:"M12 9a3 3 0 010 6 3 3 0 010-6z",fill:l,fillOpacity:"0.2",stroke:"none"})]}),ke=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v6h6v6h6"}),e.jsx("path",{d:"M3 15h6v6"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",strokeOpacity:"0.5"})]}),Ne=({size:s=20,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),e.jsx("line",{x1:"10",y1:"9",x2:"8",y2:"9"})]}),Ce=({size:s=24,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M4 8V6a2 2 0 0 1 2-2h2"}),e.jsx("path",{d:"M4 16v2a2 2 0 0 0 2 2h2"}),e.jsx("path",{d:"M16 4h2a2 2 0 0 1 2 2v2"}),e.jsx("path",{d:"M16 20h2a2 2 0 0 0 2-2v-2"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v-1",opacity:"0.5"}),e.jsx("path",{d:"M12 17v-1",opacity:"0.5"}),e.jsx("path",{d:"M8 12h1",opacity:"0.5"}),e.jsx("path",{d:"M15 12h1",opacity:"0.5"})]}),Se=({size:s=24,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",strokeOpacity:"0.4"}),e.jsx("path",{d:"M7 17l1.5 1.5 2.5-2.5"})]}),Me=({size:s=24,color:l="currentColor",...g})=>e.jsxs("svg",{width:s,height:s,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...g,children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),Ae=[{icon:e.jsx(ue,{size:20}),title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ne},{icon:e.jsx(me,{size:20}),title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:se},{icon:e.jsx(fe,{size:20}),title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:re},{icon:e.jsx(be,{size:20}),title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:ie},{icon:e.jsx(we,{size:20}),title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:le},{icon:e.jsx(ve,{size:20}),title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ce},{icon:e.jsx(ye,{size:20}),title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:de},{icon:e.jsx(je,{size:20}),title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:he},{icon:e.jsx(ke,{size:20}),title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ge},{icon:e.jsx(Ne,{size:20}),title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:xe}],Ee=({targetImage:s,onBack:l,onMaximize:g})=>{var r;const[A,v]=k.useState(null),[P,F]=k.useState(null),[T,x]=k.useState(50),[f,E]=k.useState("ltr"),a=k.useRef(null),[w,d]=k.useState(null);k.useEffect(()=>{let c=!1;return d(null),pe(s).then(j=>{c||d(j)}).catch(j=>{console.error("[ForensicToolsPanel] Failed to fetch image:",j),c||d(s)}),()=>{c=!0}},[s]);const I=k.useCallback((c,j)=>{v(c.toDataURL()),F(j)},[]),y=()=>{const c=A||w||s,j=document.createElement("a");j.href=c;let C="image";try{if(!s.startsWith("data:")&&!s.startsWith("blob:")){const S=new URL(s).pathname,u=S.substring(S.lastIndexOf("/")+1);u&&(C=u)}}catch(b){console.warn("Could not extract filename",b)}const h=C.lastIndexOf(".");h>0&&(C=C.substring(0,h)),C=C.replace(/[^a-zA-Z0-9-_]/g,"_");const L=P?P.replace(/\s+/g,"_").toLowerCase():"original";j.download=`undiffused_${C}_${L}.png`,document.body.appendChild(j),j.click(),document.body.removeChild(j)};return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:l,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx(Ce,{size:24,color:"#f1f5f9"}),e.jsx("h2",{children:"Image Analysis"})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{className:"forensic-close-btn",onClick:y,"aria-label":"Download Image",title:"Download Analysis Result",children:e.jsx(Me,{size:16,color:"currentColor"})}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>g(A||s,P||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]})]}),e.jsxs("div",{className:"comparison-container",ref:a,children:[e.jsx("img",{src:w||s,alt:"Original",className:"comparison-image"}),A&&e.jsx("div",{className:"comparison-overlay",style:{width:`${f==="ltr"?T:100-T}%`,left:f==="ltr"?0:"auto",right:f==="rtl"?0:"auto",borderRight:f==="ltr"?"2px solid #fff":"none",borderLeft:f==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:A,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:f==="ltr"?0:"auto",right:f==="rtl"?0:"auto",width:((r=a.current)==null?void 0:r.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),A&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${T}%`}})]}),A&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{v(null),F(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:T,onChange:c=>x(Number(c.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>E(c=>c==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!A&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx(Se,{size:20,color:"#94a3b8"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),!w&&e.jsx("div",{style:{textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.7)"},children:e.jsx("div",{className:"tool-loading",style:{display:"inline-block",padding:"8px 20px",borderRadius:"8px",background:"rgba(255,255,255,0.1)"},children:"Preparing image for analysis..."})}),w&&e.jsx("div",{className:"forensic-tools-grid",children:Ae.map((c,j)=>e.jsx(oe,{icon:c.icon,title:c.title,description:c.desc,tier:c.tier,index:j,children:e.jsx(c.Component,{targetImage:w,onResult:C=>I(C,c.title)})},c.title))})]})},Ie=({image:s,title:l,onClose:g})=>{const[A,v]=k.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[P,F]=k.useState(!1),[T,x]=k.useState(!1),[f,E]=k.useState({scale:1,x:0,y:0}),[a,w]=k.useState(!1),d=k.useRef({x:0,y:0}),I=k.useRef({x:0,y:0,width:0,height:0}),y=k.useRef({x:0,y:0,imgX:0,imgY:0}),r=k.useRef(null),c=h=>{h.target===h.currentTarget&&(F(!0),d.current={x:h.clientX-A.x,y:h.clientY-A.y})},j=h=>{h.stopPropagation(),x(!0),I.current={x:h.clientX,y:h.clientY,width:A.width,height:A.height}},C=h=>{h.preventDefault(),w(!0),y.current={x:h.clientX,y:h.clientY,imgX:f.x,imgY:f.y}};return k.useEffect(()=>{const h=b=>{if(P&&v(S=>({...S,x:b.clientX-d.current.x,y:b.clientY-d.current.y})),T){const S=b.clientX-I.current.x,u=b.clientY-I.current.y;v(o=>({...o,width:Math.max(400,I.current.width+S),height:Math.max(300,I.current.height+u)}))}if(a){const S=b.clientX-y.current.x,u=b.clientY-y.current.y;E(o=>({...o,x:y.current.imgX+S,y:y.current.imgY+u}))}},L=()=>{F(!1),x(!1),w(!1)};return(P||T||a)&&(window.addEventListener("mousemove",h),window.addEventListener("mouseup",L)),()=>{window.removeEventListener("mousemove",h),window.removeEventListener("mouseup",L)}},[P,T,a]),k.useEffect(()=>{const h=r.current;if(!h)return;const L=p=>{p.preventDefault(),p.stopPropagation();const n=h.getBoundingClientRect(),t=p.clientX-n.left-n.width/2,m=p.clientY-n.top-n.height/2,D=-p.deltaY*.001;E(R=>{const W=Math.min(Math.max(.1,R.scale+D*R.scale*5),10);if(W===R.scale)return R;const O=W/R.scale,z=t-(t-R.x)*O,Y=m-(m-R.y)*O;return{scale:W,x:z,y:Y}})};let b=0;const S=p=>{p.touches.length===2&&(b=Math.hypot(p.touches[0].clientX-p.touches[1].clientX,p.touches[0].clientY-p.touches[1].clientY))},u=p=>{if(p.touches.length===2){p.preventDefault();const n=Math.hypot(p.touches[0].clientX-p.touches[1].clientX,p.touches[0].clientY-p.touches[1].clientY),t=(p.touches[0].clientX+p.touches[1].clientX)/2,m=(p.touches[0].clientY+p.touches[1].clientY)/2,i=h.getBoundingClientRect(),D=t-i.left-i.width/2,R=m-i.top-i.height/2;if(b>0){const O=(n-b)*.01;E(z=>{const Y=Math.min(Math.max(.1,z.scale+O*z.scale),10);if(Y===z.scale)return z;const q=Y/z.scale;return{scale:Y,x:D-(D-z.x)*q,y:R-(R-z.y)*q}})}b=n}},o=()=>{b=0};return h.addEventListener("wheel",L,{passive:!1}),h.addEventListener("touchstart",S,{passive:!1}),h.addEventListener("touchmove",u,{passive:!1}),h.addEventListener("touchend",o),()=>{h.removeEventListener("wheel",L),h.removeEventListener("touchstart",S),h.removeEventListener("touchmove",u),h.removeEventListener("touchend",o)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:A.x,top:A.y,width:A.width,height:A.height,zIndex:2147483647},children:e.jsxs(Z,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:c,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[l," Result"]})]}),e.jsx("button",{onClick:g,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:r,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:C,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${f.x}px, ${f.y}px) scale(${f.scale})`,transition:a?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:s,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(f.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:j,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},Le=()=>{const[s,l]=k.useState("idle"),[g,A]=k.useState(null),[v,P]=k.useState(null),[F,T]=k.useState(null),[x,f]=k.useState(null),[E,a]=k.useState(null),[w,d]=k.useState(!1),I=k.useRef({x:0,y:0}),y=k.useRef(null);k.useEffect(()=>{const C=h=>{switch(h.type){case"SCANNING":l("scanning"),T(h.imageUrl||null),A(null),P(null);break;case"SHOW_RESULT":l("result"),A({isAI:h.isAI||!1,confidence:h.confidence||0,heatmapData:h.heatmapData,filterData:h.filterData});break;case"ERROR":l("error"),P(h.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(C),()=>chrome.runtime.onMessage.removeListener(C)},[]),k.useEffect(()=>{const C=L=>{if(!w||!y.current)return;let b=L.clientX-I.current.x,S=L.clientY-I.current.y;const u=y.current.getBoundingClientRect(),o=window.innerWidth,p=window.innerHeight,n=Math.max(0,o-u.width),t=Math.max(0,p-u.height);b=Math.max(0,Math.min(b,n)),S=Math.max(0,Math.min(S,t)),a({x:b,y:S})},h=()=>{d(!1)};return w&&(window.addEventListener("mousemove",C),window.addEventListener("mouseup",h)),()=>{window.removeEventListener("mousemove",C),window.removeEventListener("mouseup",h)}},[w]);const r=C=>{if(!y.current)return;const h=y.current.getBoundingClientRect(),L=h.left,b=h.top;I.current={x:C.clientX-L,y:C.clientY-b},E||a({x:L,y:b}),d(!0)},c=()=>{l("idle"),A(null),P(null),T(null),a(null),f(null)};if(s==="idle")return null;const j=s==="tools"?800:400;return e.jsxs(Q.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:E?0:20},children:e.jsx("div",{ref:y,className:"pointer-events-auto transition-shadow duration-300",style:E?{position:"absolute",left:E.x,top:E.y,boxShadow:w?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(Z,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:j},children:[e.jsx("div",{onMouseDown:r,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${w?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:c,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[s==="scanning"&&e.jsxs("div",{className:"relative",children:[F&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:F,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),s==="result"&&g&&F&&e.jsx(ee,{result:g,targetImage:F,onToolsClick:()=>l("tools")}),s==="tools"&&F&&e.jsx(Ee,{targetImage:F,onBack:()=>l("result"),onClose:c,onMaximize:(C,h)=>f({url:C,title:h})}),s==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:v})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),x&&e.jsx(Ie,{image:x.url,title:x.title,onClose:()=>f(null)})]})},De=`
/* ===== TAILWIND BASE RESET ===== */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}

::before, ::after {
  --tw-content: '';
}

/* ===== CUSTOM FONTS ===== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== BASE STYLES ===== */
#undiffused-app {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif;
  font-feature-settings: normal;
  font-variation-settings: normal;
  -webkit-font-smoothing: antialiased;
}

/* ===== LAYOUT ===== */
.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }
.inset-0 { inset: 0px; }
.inset-x-0 { left: 0px; right: 0px; }
.bottom-0 { bottom: 0px; }
.top-0 { top: 0px; }
.top-2 { top: 0.5rem; }
.right-2 { right: 0.5rem; }
.block { display: block; }

/* ===== FLEXBOX ===== */
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1 1 0%; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.25rem; }
.gap-1\\.5 { gap: 0.375rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-5 { gap: 1.25rem; }
.shrink-0 { flex-shrink: 0; }

/* ===== SPACING ===== */
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.py-3\\.5 { padding-top: 0.875rem; padding-bottom: 0.875rem; }
.py-5 { padding-top: 1.25rem; padding-bottom: 1.25rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.pt-3 { padding-top: 0.75rem; }
.pt-4 { padding-top: 1rem; }
.pt-6 { padding-top: 1.5rem; }
.m-0 { margin: 0; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-16 { margin-bottom: 4rem; }
.mt-0 { margin-top: 0; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }

/* ===== SIZING ===== */
.w-2 { width: 0.5rem; }
.w-3 { width: 0.75rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.w-8 { width: 2rem; }
.w-10 { width: 2.5rem; }
.w-12 { width: 3rem; }
.w-14 { width: 3.5rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.w-full { width: 100%; }
.h-1 { height: 0.25rem; }
.h-1\\.5 { height: 0.375rem; }
.h-2 { height: 0.5rem; }
.h-3 { height: 0.75rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }
.h-8 { height: 2rem; }
.h-10 { height: 2.5rem; }
.h-32 { height: 8rem; }
.h-40 { height: 10rem; }
.h-auto { height: auto; }
.h-px { height: 1px; }
.h-full { height: 100%; }
.min-w-\\[320px\\] { min-width: 320px; }
.max-w-\\[400px\\] { max-width: 400px; }
.max-h-\\[400px\\] { max-height: 400px; }
.min-h-\\[200px\\] { min-height: 200px; }

/* ===== TYPOGRAPHY ===== */
.text-white { color: #ffffff; }
.text-white\\/30 { color: rgba(255, 255, 255, 0.3); }
.text-white\\/50 { color: rgba(255, 255, 255, 0.5); }
.text-white\\/70 { color: rgba(255, 255, 255, 0.7); }
.text-white\\/80 { color: rgba(255, 255, 255, 0.8); }
.text-white\\/90 { color: rgba(255, 255, 255, 0.9); }
.text-red-400 { color: #f87171; }
.text-red-500 { color: #ef4444; }
.text-green-400 { color: #4ade80; }
.text-\\[10px\\] { font-size: 10px; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-sans { font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'system-ui', sans-serif; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.uppercase { text-transform: uppercase; }
.leading-tight { line-height: 1.25; }
.opacity-100 { opacity: 1; }

/* ===== BACKGROUNDS ===== */
.bg-black\\/20 { background-color: rgba(0, 0, 0, 0.2); }
.bg-black\\/30 { background-color: rgba(0, 0, 0, 0.3); }
.bg-black\\/50 { background-color: rgba(0, 0, 0, 0.5); }
.bg-black\\/70 { background-color: rgba(0, 0, 0, 0.7); }
.bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05); }
.bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1); }
.bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2); }
.bg-white\\/40 { background-color: rgba(255, 255, 255, 0.4); }
.bg-white\\/80 { background-color: rgba(255, 255, 255, 0.8); }
.bg-blue-500 { background-color: #3b82f6; }
.bg-red-400 { background-color: #f87171; }
.bg-red-500 { background-color: #ef4444; }
.bg-red-500\\/20 { background-color: rgba(239, 68, 68, 0.2); }
.bg-red-500\\/80 { background-color: rgba(239, 68, 68, 0.8); }
.bg-green-400 { background-color: #4ade80; }
.bg-green-500 { background-color: #22c55e; }
.bg-green-500\\/20 { background-color: rgba(34, 197, 94, 0.2); }

/* ===== GRADIENTS ===== */
.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
.from-transparent { --tw-gradient-from: transparent; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.from-blue-500\\/30 { --tw-gradient-from: rgba(59, 130, 246, 0.3); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
.via-blue-400 { --tw-gradient-to: #60a5fa; --tw-gradient-stops: var(--tw-gradient-from), #60a5fa, var(--tw-gradient-to); }
.via-white\\/20 { --tw-gradient-to: rgba(255, 255, 255, 0.2); --tw-gradient-stops: var(--tw-gradient-from), rgba(255, 255, 255, 0.2), var(--tw-gradient-to); }
.to-transparent { --tw-gradient-to: transparent; }
.to-purple-500\\/30 { --tw-gradient-to: rgba(168, 85, 247, 0.3); }

/* ===== BORDERS ===== */
.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-white\\/5 { border-color: rgba(255, 255, 255, 0.05); }
.border-white\\/10 { border-color: rgba(255, 255, 255, 0.1); }
.border-white\\/20 { border-color: rgba(255, 255, 255, 0.2); }
.border-red-500\\/30 { border-color: rgba(239, 68, 68, 0.3); }
.border-red-400\\/50 { border-color: rgba(248, 113, 113, 0.5); }
.border-green-500\\/30 { border-color: rgba(34, 197, 94, 0.3); }
.rounded-full { border-radius: 9999px; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }

/* ===== EFFECTS ===== */
.opacity-50 { opacity: 0.5; }
.overflow-hidden { overflow: hidden; }
.object-cover { object-fit: cover; }
.object-contain { object-fit: contain; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
.cursor-pointer { cursor: pointer; }
.cursor-move { cursor: move; }
.appearance-none { appearance: none; -webkit-appearance: none; }

/* ===== Z-INDEX ===== */
.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-50 { z-index: 50; }
.z-\\[999999\\] { z-index: 999999; }

/* ===== BACKDROP FILTERS (Liquid Glass Magic) ===== */
.backdrop-blur-\\[24px\\] { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.backdrop-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.backdrop-blur-md { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.backdrop-saturate-\\[180\\%\\] { backdrop-filter: saturate(180%); -webkit-backdrop-filter: saturate(180%); }
.backdrop-brightness-\\[120\\%\\] { backdrop-filter: brightness(120%); -webkit-backdrop-filter: brightness(120%); }

/* Combined backdrop filter for glass effect */
.bg-black\\/30.backdrop-blur-\\[24px\\].backdrop-saturate-\\[180\\%\\].backdrop-brightness-\\[120\\%\\] {
  backdrop-filter: blur(24px) saturate(180%) brightness(120%);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(120%);
}

/* ===== SHADOWS ===== */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); }
.shadow-\\[inset_0_1px_0_0_rgba\\(255\\,255\\,255\\,0\\.2\\)\\,_0_8px_32px_rgba\\(0\\,0\\,0\\,0\\.4\\)\\] {
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.4);
}
.shadow-\\[0_0_20px_rgba\\(59\\,130\\,246\\,0\\.8\\)\\] {
  box-shadow: 0 0 20px rgba(59,130,246,0.8);
}

/* ===== SPACE ===== */
.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));
}

/* ===== TRANSITIONS ===== */
.transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.transition-shadow { transition-property: box-shadow; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.duration-150 { transition-duration: 150ms; }
.duration-200 { transition-duration: 200ms; }
.duration-300 { transition-duration: 300ms; }
.duration-500 { transition-duration: 500ms; }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }

/* ===== HOVER STATES ===== */
.hover\\:scale-105:hover { transform: scale(1.05); }
.hover\\:scale-\\[1\\.04\\]:hover { transform: scale(1.04); }
.hover\\:scale-\\[1\\.05\\]:hover { transform: scale(1.05); }
.hover\\:scale-110:hover { transform: scale(1.1); }
.hover\\:z-20:hover { z-index: 20; }
.hover\\:bg-white\\/10:hover { background-color: rgba(255, 255, 255, 0.1); }
.hover\\:bg-white\\/20:hover { background-color: rgba(255, 255, 255, 0.2); }
.hover\\:bg-white\\/60:hover { background-color: rgba(255, 255, 255, 0.6); }
.hover\\:bg-black\\/70:hover { background-color: rgba(0, 0, 0, 0.7); }
.hover\\:text-white:hover { color: #ffffff; }
.hover\\:rotate-90:hover { transform: rotate(90deg); }
.hover\\:border-white\\/40:hover { border-color: rgba(255, 255, 255, 0.4); }
.hover\\:bg-white\\/5:hover { background-color: rgba(255, 255, 255, 0.05); }
.group:hover .group-hover\\:text-white { color: #ffffff; }
.group:hover .group-hover\\:bg-white\\/60 { background-color: rgba(255, 255, 255, 0.6); }

/* ===== ACTIVE STATES ===== */
.active\\:scale-95:active { transform: scale(0.95); }

/* ===== SVG COLORS ===== */
.text-\\[\\#4285F4\\] { color: #4285F4; }
.text-\\[\\#34A853\\] { color: #34A853; }
.text-\\[\\#FBBC05\\] { color: #FBBC05; }
.text-\\[\\#EA4335\\] { color: #EA4335; }

/* ===== KEYFRAME ANIMATIONS ===== */
@keyframes glassIn {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

@keyframes scanner {
  0% {
    top: 0%;
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0.5;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes pulse {
  50% { opacity: .5; }
}

.animate-glass-in {
  animation: glassIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-scanner {
  animation: scanner 1.5s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ===== RANGE SLIDER STYLING ===== */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.5rem;
  border-radius: 9999px;
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

input[type="range"]::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
`;function Te(s){const l=document.createElement("style");l.textContent=De,s.appendChild(l)}const Fe=`

/* ===== ANIMATIONS ===== */
@keyframes forensicFadeIn {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes toolCardEntry {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

@keyframes modalEntry {
    from { opacity: 0; transform: scale(0.85); }
    to { opacity: 1; transform: scale(1); }
}

@keyframes liquidPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
    50% { box-shadow: 0 0 0 8px rgba(56, 189, 248, 0); }
}

/* ===== FORENSIC PANEL ===== */
.forensic-panel {
    animation: forensicFadeIn 0.3s ease-out forwards;
}

.forensic-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
}

.forensic-back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    flex-shrink: 0;
}

.forensic-back-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    transform: translateX(-2px);
}

.forensic-title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    justify-content: center;
}

.forensic-title h2 {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
    white-space: nowrap;
}

.forensic-close-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.forensic-close-btn:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    transform: scale(1.1);
}

/* ===== IMAGE PREVIEW ===== */
.forensic-image-preview {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    margin-bottom: 16px;
    max-height: 250px;
}

.forensic-image-preview img {
    width: 100%;
    height: auto;
    max-height: 250px;
    object-fit: contain;
    display: block;
}

/* ===== SECTION TITLE ===== */
.forensic-section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.forensic-section-title h3 {
    font-size: 14px;
    font-weight: 600;
    color: #cbd5e1;
    margin: 0;
}

/* ===== TOOLS GRID ===== */
.forensic-tools-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    align-items: start; /* Prevent cards from stretching to match row height */
    max-height: 50vh;
    overflow-y: auto;
    padding-right: 4px;
}

.forensic-tools-grid::-webkit-scrollbar {
    width: 4px;
}

.forensic-tools-grid::-webkit-scrollbar-track {
    background: transparent;
}

.forensic-tools-grid::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
}

.forensic-tools-grid::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* ===== TOOL CARD ===== */
.tool-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: toolCardEntry 0.4s ease-out both;
    position: relative;
}

.tool-card:not(.tool-card-expanded):hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(56, 189, 248, 0.25);
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(56, 189, 248, 0.15);
}

.tool-card-expanded {
    background: rgba(255, 255, 255, 0.15); /* Keep base opacity */
    transform: none !important; /* Prevent scale on hover/active */
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4) !important; /* Keeps shadow consistent for open card */
    border-color: rgba(56, 189, 248, 0.3); /* Slightly highlighted border when open */
}

/* Card Header */
.tool-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    cursor: pointer;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    color: inherit;
    font-family: inherit;
}

.tool-card-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(16, 185, 129, 0.15));
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.tool-card-info {
    flex: 1;
    min-width: 0;
}

.tool-card-title {
    font-size: 15px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 4px 0;
    line-height: 1.3;
}

.tool-card-desc {
    font-size: 13px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.tool-card-chevron {
    color: rgba(255, 255, 255, 0.4);
    transition: transform 0.3s ease;
    flex-shrink: 0;
}

.tool-card-chevron-open {
    transform: rotate(180deg);
}

/* Tier Badge */
.tool-card-tier-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 2px 6px;
    border-radius: 4px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3));
    color: #c4b5fd;
    border: 1px solid rgba(139, 92, 246, 0.2);
}

/* ===== TOOL CARD CONTENT (Expandable) ===== */
.tool-card-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    opacity: 0;
}

.tool-card-content-open {
    max-height: 600px;
    opacity: 1;
}

.tool-card-content-inner {
    padding: 0 14px 14px 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.tool-card-placeholder {
    padding: 16px 0;
    text-align: center;
}

.tool-card-placeholder p {
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

/* ===== TOOL CONTROLS ===== */
.tool-control-group {
    margin-bottom: 12px;
}

.tool-control-label {
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
    display: block;
}

.tool-slider {
    width: 100%;
    height: 6px; /* Slightly thicker */
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255, 255, 255, 0.2); /* More opaque track */
    border-radius: 999px;
    outline: none;
    cursor: pointer;
    overflow: visible;
}

.tool-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid rgba(255, 255, 255, 0.8);
    cursor: grab;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
}

.tool-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.tool-slider:active::-webkit-slider-thumb {
    transform: scale(1.25);
    cursor: grabbing;
    background: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.tool-select {
    width: 100%;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
}

.tool-select:focus {
    border-color: rgba(56, 189, 248, 0.5);
}

.tool-select option {
    background: #1e293b;
    color: #f1f5f9;
}

/* Primary liquid analyse button */
.tool-analyse-btn {
    flex: 1;
    padding: 10px 16px;
    border-radius: 9999px; /* Pill shape */
    border: 1px solid rgba(255, 255, 255, 0.2);
    /* Frosted matte glass - more opaque */
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) saturate(180%);
    color: #fff;
    font-size: 13px;
    font-weight: 700; /* Bold text */
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    font-family: inherit;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.tool-analyse-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.tool-analyse-btn:active {
    transform: translateY(0) scale(0.98);
}

.tool-analyse-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.05);
}

/* Tool Action Row */
.tool-action-row {
    display: flex;
    align-items: stretch;
    gap: 8px;
    margin-top: 12px;
}

/* Help Button */
.tool-help-btn {
    width: 42px; /* Matches height of analyse button roughly */
    height: 42px; /* fallback, flex should handle height */
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) saturate(180%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 16px;
    font-weight: 700;
}

.tool-help-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px) rotate(10deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
}

.tool-help-btn:active {
    transform: translateY(0) scale(0.95);
}

.tool-help-icon {
    transition: transform 0.3s ease;
}

.tool-help-btn:hover .tool-help-icon {
    transform: scale(1.2);
}

/* ===== TOOL OUTPUT / RESULTS ===== */
.tool-output-area {
    margin-top: 12px;
    padding: 12px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.tool-output-canvas {
    width: 100%;
    border-radius: 8px;
    display: block;
    background: #000;
}

.tool-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;
}

.tool-stat {
    padding: 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.tool-stat-label {
    font-size: 10px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 4px 0;
}

.tool-stat-value {
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
}

/* Verdict badges */
.tool-verdict {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
}

.tool-verdict-safe {
    background: rgba(16, 185, 129, 0.15);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #6ee7b7;
}

.tool-verdict-suspicious {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #fbbf24;
}

.tool-verdict-danger {
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
}

/* ===== LOADING / SHIMMER ===== */
.tool-loading {
    position: relative;
    overflow: hidden;
}

.tool-loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.08),
        transparent
    );
    animation: shimmer 2s infinite;
}

.tool-progress-bar {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
    margin-top: 8px;
}

.tool-progress-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #38bdf8, #10b981);
    transition: width 0.3s ease;
}

/* ===== TOOL MODAL ===== */
.tool-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: forensicFadeIn 0.2s ease-out;
}

.tool-modal {
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(40px) saturate(180%);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: modalEntry 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    box-shadow:
        0 24px 80px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.tool-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
}

.tool-modal-back {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: inherit;
}

.tool-modal-back:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.tool-modal-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tool-modal-title-icon {
    font-size: 20px;
}

.tool-modal-title h2 {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0;
}

.tool-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s ease;
}

.tool-modal-close:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.tool-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
}

.tool-modal-controls {
    padding: 14px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

/* ===== EXPORT BUTTON ===== */
.tool-export-btn {
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: inherit;
}

.tool-export-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}

/* ===== VIEW MODE TOGGLES ===== */
.tool-toggle-group {
    display: flex;
    gap: 2px;
    border-radius: 8px;
    padding: 2px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.tool-toggle-btn {
    padding: 6px 12px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
}

.tool-toggle-btn-active {
    background: rgba(56, 189, 248, 0.2);
    color: #38bdf8;
}

/* ===== OPACITY SLIDER ===== */
.tool-opacity-slider {
    flex: 1;
}

/* ===== TAB VIEW ===== */
.tool-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 12px;
    border-radius: 8px;
    padding: 2px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
}

.tool-tab {
    flex: 1;
    padding: 8px 12px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #64748b;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-family: inherit;
}

.tool-tab-active {
    background: rgba(255, 255, 255, 0.08);
    color: #f1f5f9;
}

/* ===== METADATA LIST ===== */
.metadata-section {
    margin-bottom: 16px;
}

.metadata-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.metadata-section-header h4 {
    font-size: 13px;
    font-weight: 600;
    color: #cbd5e1;
    margin: 0;
}

.metadata-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.metadata-key {
    font-size: 12px;
    color: #fff;
    font-weight: 700;
}

.metadata-value {
    font-size: 12px;
    color: #fff;
    font-weight: 700;
    text-align: right;
    word-break: break-all;
    max-width: 60%;
}

.metadata-missing {
    color: #64748b;
    font-style: italic;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 700px) {
    .forensic-tools-grid {
        grid-template-columns: 1fr;
    }
}

/* ===== REDUCED MOTION ===== */
@media (prefers-reduced-motion: reduce) {
    .tool-card,
    .forensic-panel,
    .tool-modal,
    .tool-modal-backdrop {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* ===== CUSTOM LIQUID DROPDOWN ===== */
.liquid-select-container {
    position: relative;
    width: 100%;
}

.liquid-select-trigger {
    width: 100%;
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(8px);
    color: #f1f5f9;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    outline: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.liquid-select-trigger:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.liquid-select-trigger:active, .liquid-select-trigger.active {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(56, 189, 248, 0.3);
    transform: translateY(1px);
}

.liquid-select-trigger svg {
    color: rgba(255, 255, 255, 0.5);
    transition: transform 0.3s ease;
}

.liquid-select-trigger.open svg {
    transform: rotate(180deg);
    color: #38bdf8;
}

.liquid-select-menu {
    /* position, top, left, width, z-index all set via inline styles in Portal */
    max-height: 280px;
    overflow-y: auto;
    overflow-x: hidden;
    background: rgba(15, 23, 42, 0.85);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    /* Use opacity-only animation — no transform so we don't create a containing block */
    animation: dropdownFadeIn 0.15s ease-out forwards;
}

.liquid-select-menu::-webkit-scrollbar {
    width: 5px;
}

.liquid-select-menu::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 5px;
}

.liquid-select-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
}

.liquid-select-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35);
}

@keyframes dropdownFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.liquid-select-option {
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    transition: all 0.15s ease;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.liquid-select-option:last-child {
    border-bottom: none;
}

.liquid-select-option:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    padding-left: 18px; /* Slide right effect */
}

.liquid-select-option.selected {
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
    font-weight: 600;
}

.liquid-select-icon {
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.2s ease;
}

.liquid-select-option.selected .liquid-select-icon {
    opacity: 1;
    transform: scale(1);
}

/* ===== COMPARISON SLIDER ===== */
.comparison-container {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #000;
    margin-bottom: 16px;
    user-select: none;
}

.comparison-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}

.comparison-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    border-right: 2px solid #fff;
    box-shadow: 2px 0 10px rgba(0,0,0,0.5);
}

.comparison-slider-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #fff;
    cursor: ew-resize;
    z-index: 20;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.comparison-slider-handle::after {
    content: '↔';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: #fff;
    color: #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* ===== ACTION BUTTONS ===== */
.comparison-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    align-items: center;
}

.undo-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.undo-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(-90deg);
}

.flip-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.flip-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(180deg);
}

/* ===== ADDITIONAL TAILWIND UTILITIES FOR FORENSIC PANEL ===== */
.min-w-\\[700px\\] { min-width: 700px; }
.max-w-\\[800px\\] { max-width: 800px; }
`;function Re(s){const l=document.createElement("style");l.textContent=Fe,s.appendChild(l)}if(!document.getElementById("undiffused-root")){const s=document.createElement("div");s.id="undiffused-root",document.body.appendChild(s);const l=s.attachShadow({mode:"open"});Te(l),Re(l);const g=document.createElement("div");g.id="undiffused-app",l.appendChild(g);const A=document.createElement("div");A.id="undiffused-portal-root",Object.assign(A.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),l.appendChild(A),te.createRoot(g).render(e.jsx(Le,{})),console.log("[UnDiffused] Content script injected")}
