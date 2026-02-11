import{r as j,j as e,a as Z,R as Q,G as J,b as ee,c as te}from"./ResultView-BXWFaSCq.js";const oe=({icon:i,title:l,description:x,tier:S,index:v,children:P})=>{const[F,T]=j.useState(!1);return e.jsxs("div",{className:`tool-card ${F?"tool-card-expanded":""}`,style:{animationDelay:`${v*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>T(!F),"aria-expanded":F,"aria-label":`${l} - ${x}`,children:[e.jsx("div",{className:"tool-card-icon",children:i}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:l}),e.jsx("p",{className:"tool-card-desc",children:x})]}),e.jsx("div",{className:`tool-card-chevron ${F?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),S===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${F?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:P||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var ae=Z();function K({value:i,onChange:l,options:x,placeholder:S="Select...",disabled:v=!1}){const[P,F]=j.useState(!1),T=j.useRef(null),d=j.useRef(null),[f,A]=j.useState({top:0,left:0,width:0}),n=j.useCallback(()=>{var p;const o=(p=T.current)==null?void 0:p.getRootNode();if(o&&o instanceof ShadowRoot){let C=o.querySelector("#undiffused-portal-root");return C||(C=document.createElement("div"),C.id="undiffused-portal-root",Object.assign(C.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),o.appendChild(C)),C}return document.body},[]),b=x.find(o=>o.value===i),c=o=>{l(o),F(!1)},E=()=>{if(!v)if(!P&&T.current){const o=T.current.getBoundingClientRect();A({top:o.bottom+6,left:o.left,width:o.width}),F(!0)}else F(!1)};j.useEffect(()=>{var C;if(!P)return;const o=I=>{var L,y;const h=I.target;(L=T.current)!=null&&L.contains(h)||(y=d.current)!=null&&y.contains(h)||F(!1)},p=((C=T.current)==null?void 0:C.getRootNode())||document;return p.addEventListener("mousedown",o),()=>p.removeEventListener("mousedown",o)},[P]),j.useEffect(()=>{if(!P)return;const o=()=>F(!1);return window.addEventListener("resize",o),window.addEventListener("scroll",o,{capture:!0}),()=>{window.removeEventListener("resize",o),window.removeEventListener("scroll",o,{capture:!0})}},[P]);const w=e.jsx("div",{ref:d,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:f.top,left:f.left,width:f.width,zIndex:2147483647,pointerEvents:"auto"},children:x.map(o=>e.jsxs("div",{className:`liquid-select-option ${o.value===i?"selected":""}`,onClick:()=>c(o.value),role:"option","aria-selected":o.value===i,children:[e.jsx("span",{children:o.label}),o.value===i&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(o.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:T,type:"button",className:`liquid-select-trigger ${P?"open":""} ${v?"opacity-50 cursor-not-allowed":""}`,onClick:E,disabled:v,"aria-haspopup":"listbox","aria-expanded":P,children:[e.jsx("span",{children:b?b.label:S}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),P&&ae.createPortal(w,n())]})}const G=({label:i,onClick:l,isAnalysing:x=!1,disabled:S=!1,onHelpClick:v})=>e.jsxs("div",{className:"tool-action-row",children:[e.jsx("button",{className:`tool-analyse-btn ${x?"tool-loading":""}`,onClick:l,disabled:S||x,children:x?"Analysing...":i}),e.jsx("button",{className:"tool-help-btn",onClick:v,title:"How does this tool work?",children:e.jsx("span",{className:"tool-help-icon",children:"?"})})]}),V=({value:i,min:l,max:x,style:S,...v})=>{const P=(i-l)/(x-l)*100;return e.jsx("input",{type:"range",className:"tool-slider",min:l,max:x,value:i,style:{...S,background:`linear-gradient(to right, #ffffff 0%, #ffffff ${P}%, rgba(255, 255, 255, 0.2) ${P}%, rgba(255, 255, 255, 0.2) 100%)`},...v})},ne=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(85),[v,P]=j.useState("medium"),[F,T]=j.useState(!1),[d,f]=j.useState(null),A=v==="low"?10:v==="medium"?20:40,n=j.useCallback(async()=>{T(!0),f(null);try{const b=new Image;await new Promise((s,t)=>{b.onload=()=>s(),b.onerror=()=>t(new Error("Failed to load image")),b.src=i});const c=b.naturalWidth,E=b.naturalHeight,w=document.createElement("canvas");w.width=c,w.height=E;const o=w.getContext("2d");o.drawImage(b,0,0);const p=o.getImageData(0,0,c,E),C=document.createElement("canvas");C.width=c,C.height=E;const I=C.getContext("2d");I.drawImage(b,0,0);const h=C.toDataURL("image/jpeg",x/100),L=new Image;await new Promise(s=>{L.onload=()=>s(),L.src=h}),I.drawImage(L,0,0);const y=I.getImageData(0,0,c,E),M=document.createElement("canvas");M.width=c,M.height=E;const m=M.getContext("2d"),a=m.createImageData(c,E);let g=0;for(let s=0;s<p.data.length;s+=4){const t=Math.abs(p.data[s]-y.data[s]),u=Math.abs(p.data[s+1]-y.data[s+1]),r=Math.abs(p.data[s+2]-y.data[s+2]);g+=t+u+r;const D=Math.min(255,t*A),R=Math.min(255,u*A),W=Math.min(255,r*A),O=(D+R+W)/3;O<64?(a.data[s]=0,a.data[s+1]=0,a.data[s+2]=Math.min(255,O*4)):O<128?(a.data[s]=0,a.data[s+1]=Math.min(255,(O-64)*4),a.data[s+2]=255-(O-64)*4):O<192?(a.data[s]=Math.min(255,(O-128)*4),a.data[s+1]=255,a.data[s+2]=0):(a.data[s]=255,a.data[s+1]=255-(O-192)*4,a.data[s+2]=0),a.data[s+3]=255}m.putImageData(a,0,0),l&&l(M),f({diffScore:g/(c*E)})}catch(b){console.error("[ELA] Analysis failed:",b)}finally{T(!1)}},[i,x,A,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",x,"%"]}),e.jsx(V,{min:50,max:100,value:x,onChange:b=>S(Number(b.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(K,{value:v,onChange:b=>P(b),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx(G,{label:"Analyse Error Levels",onClick:n,isAnalysing:F}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:d.diffScore.toFixed(2)})]})})]})]})},se=({targetImage:i,onResult:l})=>{const[x,S]=j.useState("luminance"),[v,P]=j.useState(32),[F,T]=j.useState(!1),[d,f]=j.useState(null),A=j.useCallback(async()=>{T(!0),f(null);try{const n=new Image;await new Promise((t,u)=>{n.onload=()=>t(),n.onerror=()=>u(new Error("Failed to load image")),n.src=i});const b=n.naturalWidth,c=n.naturalHeight,E=document.createElement("canvas");E.width=b,E.height=c;const w=E.getContext("2d");w.drawImage(n,0,0);const p=w.getImageData(0,0,b,c).data,C=t=>x==="chromatic"?(p[t]-p[t+1])*.5+128:.299*p[t]+.587*p[t+1]+.114*p[t+2],I=Math.floor(b/v),h=Math.floor(c/v),L=[];for(let t=0;t<h;t++)for(let u=0;u<I;u++){const r=[];for(let W=0;W<v;W++)for(let O=0;O<v;O++){const z=u*v+O,Y=t*v+W,q=(Y*b+z)*4,B=C(q);let k=0,N=0;for(const[$,X]of[[-1,0],[1,0],[0,-1],[0,1]]){const H=z+$,_=Y+X;H>=0&&H<b&&_>=0&&_<c&&(k+=C((_*b+H)*4),N++)}const U=B-k/N;r.push(U)}const D=r.reduce((W,O)=>W+O,0)/r.length,R=r.reduce((W,O)=>W+(O-D)**2,0)/r.length;L.push(R)}const y=L.reduce((t,u)=>t+u,0)/L.length,M=Math.sqrt(L.reduce((t,u)=>t+(u-y)**2,0)/L.length),m=Math.max(0,100-M/y*100),a=document.createElement("canvas");a.width=b,a.height=c;const g=a.getContext("2d");g.globalAlpha=.3,g.drawImage(n,0,0),g.globalAlpha=1;const s=Math.max(...L);for(let t=0;t<h;t++)for(let u=0;u<I;u++){const r=L[t*I+u],D=s>0?r/s:0,R=Math.floor(255*(1-D)),W=Math.floor(255*D);g.fillStyle=`rgba(${R}, ${W}, 60, 0.5)`,g.fillRect(u*v,t*v,v,v),g.strokeStyle="rgba(255,255,255,0.1)",g.strokeRect(u*v,t*v,v,v)}l&&l(a),f({mean:y,std:M,uniformity:m})}catch(n){console.error("[Noise] Analysis failed:",n)}finally{T(!1)}},[i,x,v,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(K,{value:x,onChange:n=>S(n),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",v,"px"]}),e.jsx(V,{min:8,max:64,step:8,value:v,onChange:n=>P(Number(n.target.value))})]}),e.jsx(G,{label:"Analyse Noise",onClick:A,isAnalysing:F}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:d.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:d.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${d.uniformity>70?"tool-verdict-danger":d.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[d.uniformity>70?"⚠️":d.uniformity>40?"🤔":"✅"," ","Uniformity: ",d.uniformity.toFixed(1),"% — ",d.uniformity>70?"Uniform noise (AI suspect)":d.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},re=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(5),[v,P]=j.useState(32),[F,T]=j.useState(!1),[d,f]=j.useState(null),A=(c,E,w,o,p)=>{let C=0;const I=Math.max(1,Math.floor(p/8));for(let h=0;h<p;h+=I)for(let L=0;L<p;L+=I){const y=((o+h)*E+(w+L))*4,M=c[y]*.299+c[y+1]*.587+c[y+2]*.114;C=(C<<5)-C+Math.floor(M/(12-x))|0}return C},n=(c,E,w,o,p,C,I)=>{let h=0,L=0;const y=Math.max(1,Math.floor(I/16));for(let M=0;M<I;M+=y)for(let m=0;m<I;m+=y){const a=((o+M)*E+(w+m))*4,g=((C+M)*E+(p+m))*4;h+=Math.abs(c[a]-c[g]),h+=Math.abs(c[a+1]-c[g+1]),h+=Math.abs(c[a+2]-c[g+2]),L++}return 1-h/(L*3*255)},b=j.useCallback(async()=>{T(!0),f(null);try{const c=new Image;await new Promise((t,u)=>{c.onload=()=>t(),c.onerror=()=>u(new Error("Failed to load")),c.src=i});const E=c.naturalWidth,w=c.naturalHeight,o=document.createElement("canvas");o.width=E,o.height=w;const p=o.getContext("2d");p.drawImage(c,0,0);const C=p.getImageData(0,0,E,w),I=Math.max(v/2,8),h=new Map;for(let t=0;t+v<=w;t+=I)for(let u=0;u+v<=E;u+=I){const r=A(C.data,E,u,t,v);h.has(r)||h.set(r,[]),h.get(r).push({x:u,y:t})}const L=[],y=v*2,M=.85+(x-5)*.01;for(const[,t]of h)if(!(t.length<2||t.length>50))for(let u=0;u<t.length&&u<10;u++)for(let r=u+1;r<t.length&&r<10;r++){if(Math.sqrt((t[u].x-t[r].x)**2+(t[u].y-t[r].y)**2)<y)continue;const R=n(C.data,E,t[u].x,t[u].y,t[r].x,t[r].y,v);R>=M&&L.push({ax:t[u].x,ay:t[u].y,bx:t[r].x,by:t[r].y,sim:R})}const m=document.createElement("canvas");m.width=E,m.height=w;const a=m.getContext("2d");a.drawImage(c,0,0);const g=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],s=L.slice(0,30);s.forEach((t,u)=>{const r=g[u%g.length];a.strokeStyle=r,a.lineWidth=2,a.globalAlpha=.7,a.strokeRect(t.ax,t.ay,v,v),a.strokeRect(t.bx,t.by,v,v),a.fillStyle=r,a.globalAlpha=.15,a.fillRect(t.ax,t.ay,v,v),a.fillRect(t.bx,t.by,v,v),a.globalAlpha=.4,a.setLineDash([4,4]),a.beginPath(),a.moveTo(t.ax+v/2,t.ay+v/2),a.lineTo(t.bx+v/2,t.by+v/2),a.stroke(),a.setLineDash([]),a.globalAlpha=1}),l&&l(m),f(s.length)}catch(c){console.error("[Clone] Detection failed:",c)}finally{T(!1)}},[i,x,v,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",x]}),e.jsx(V,{min:1,max:10,value:x,onChange:c=>S(Number(c.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",v,"px"]}),e.jsx(V,{min:8,max:128,step:8,value:v,onChange:c=>P(Number(c.target.value))})]}),e.jsx(G,{label:"Detect Clones",onClick:b,isAnalysing:F}),d!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${d>5?"tool-verdict-danger":d>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[d>0?"🎯":"✅"," Found ",d," clone ",d===1?"pair":"pairs"]})]})]})},ie=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(1),[v,P]=j.useState(!1),[F,T]=j.useState(null),d=(A,n)=>{const b=A.length;if(b<=1)return[A,n];const c=b/2,E=new Float64Array(c),w=new Float64Array(c),o=new Float64Array(c),p=new Float64Array(c);for(let m=0;m<c;m++)E[m]=A[2*m],w[m]=n[2*m],o[m]=A[2*m+1],p[m]=n[2*m+1];const[C,I]=d(E,w),[h,L]=d(o,p),y=new Float64Array(b),M=new Float64Array(b);for(let m=0;m<c;m++){const a=-2*Math.PI*m/b,g=Math.cos(a),s=Math.sin(a),t=g*h[m]-s*L[m],u=g*L[m]+s*h[m];y[m]=C[m]+t,M[m]=I[m]+u,y[m+c]=C[m]-t,M[m+c]=I[m]-u}return[y,M]},f=j.useCallback(async()=>{P(!0),T(null);try{const A=new Image;await new Promise((r,D)=>{A.onload=()=>r(),A.onerror=()=>D(new Error("Failed to load image")),A.src=i});const n=512,b=document.createElement("canvas");b.width=n,b.height=n;const c=b.getContext("2d");c.drawImage(A,0,0,n,n);const w=c.getImageData(0,0,n,n).data,o=new Float64Array(n*n);for(let r=0;r<n*n;r++)o[r]=(w[r*4]*.299+w[r*4+1]*.587+w[r*4+2]*.114)/255;const p=new Float64Array(o),C=new Float64Array(n*n);for(let r=0;r<n;r++){const D=new Float64Array(n),R=new Float64Array(n);for(let z=0;z<n;z++)D[z]=p[r*n+z],R[z]=C[r*n+z];const[W,O]=d(D,R);for(let z=0;z<n;z++)p[r*n+z]=W[z],C[r*n+z]=O[z]}for(let r=0;r<n;r++){const D=new Float64Array(n),R=new Float64Array(n);for(let z=0;z<n;z++)D[z]=p[z*n+r],R[z]=C[z*n+r];const[W,O]=d(D,R);for(let z=0;z<n;z++)p[z*n+r]=W[z],C[z*n+r]=O[z]}const I=new Float64Array(n*n),h=n/2;let L=0;for(let r=0;r<n;r++)for(let D=0;D<n;D++){const R=p[r*n+D],W=C[r*n+D];let O=Math.sqrt(R*R+W*W);O=Math.log(1+O)*x;const z=(r+h)%n,Y=(D+h)%n,q=z*n+Y;I[q]=O,O>L&&(L=O)}const y=I[h*n+h],m=I[0]/L*100,a=y/L*100;let g=0;for(let r=1;r<4;r++){const D=h+r*(n/8);D<n&&I[h*n+D]>I[h*n+D-1]*1.5&&g++}const s=document.createElement("canvas");s.width=n,s.height=n;const t=s.getContext("2d"),u=t.createImageData(n,n);for(let r=0;r<n*n;r++){const D=L>0?I[r]/L*255:0,R=r*4;u.data[R]=Math.min(255,D*.8),u.data[R+1]=Math.min(255,D*.9),u.data[R+2]=Math.min(255,D),u.data[R+3]=255}t.putImageData(u,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let r=30;r<h;r+=30)t.beginPath(),t.arc(h,h,r,0,Math.PI*2),t.stroke();l&&l(s),T({highFreq:m,lowFreq:a,gridArtifacts:g>3})}catch(A){console.error("[FFT] Analysis failed:",A)}finally{P(!1)}},[i,x,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",x]}),e.jsx(V,{min:1,max:10,step:.1,value:x,onChange:A=>S(Number(A.target.value))})]}),e.jsx(G,{label:"Generate Spectrum",onClick:f,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:F.gridArtifacts?"#ef4444":"#10b981"},children:F.gridArtifacts?"Detected":"None"})]})]})]})]})},le=({targetImage:i,onResult:l})=>{const[x,S]=j.useState("sobel"),[v,P]=j.useState(100),[F,T]=j.useState(!1),[d,f]=j.useState(null),[A,n]=j.useState(0),b=j.useRef(null),c=j.useRef(null),E=j.useCallback(async()=>{T(!0),f(null);try{const w=new Image;await new Promise((k,N)=>{w.onload=()=>k(),w.onerror=()=>N(new Error("Failed to load")),w.src=i});const o=w.naturalWidth,p=w.naturalHeight,C=document.createElement("canvas");C.width=o,C.height=p;const I=C.getContext("2d");I.drawImage(w,0,0);const L=I.getImageData(0,0,o,p).data,y=new Float64Array(o*p);for(let k=0;k<o*p;k++){const N=k*4;y[k]=.299*L[N]+.587*L[N+1]+.114*L[N+2]}const M=new Float64Array(o*p),m=new Uint8Array(o*p);if(x==="sobel"||x==="canny")for(let k=1;k<p-1;k++)for(let N=1;N<o-1;N++){const U=-y[(k-1)*o+(N-1)]+y[(k-1)*o+(N+1)]-2*y[k*o+(N-1)]+2*y[k*o+(N+1)]-y[(k+1)*o+(N-1)]+y[(k+1)*o+(N+1)],$=-y[(k-1)*o+(N-1)]-2*y[(k-1)*o+N]-y[(k-1)*o+(N+1)]+y[(k+1)*o+(N-1)]+2*y[(k+1)*o+N]+y[(k+1)*o+(N+1)],X=Math.sqrt(U*U+$*$);M[k*o+N]=X,m[k*o+N]=X>v?255:0}else for(let k=1;k<p-1;k++)for(let N=1;N<o-1;N++){const U=-4*y[k*o+N]+y[(k-1)*o+N]+y[(k+1)*o+N]+y[k*o+(N-1)]+y[k*o+(N+1)],$=Math.abs(U);M[k*o+N]=$,m[k*o+N]=$>v/2?255:0}let a=0,g=0;const s=32,t=[];for(let k=0;k<o*p;k++)m[k]>0&&a++,g+=M[k];for(let k=0;k<Math.floor(p/s);k++)for(let N=0;N<Math.floor(o/s);N++){let U=0;for(let $=0;$<s;$++)for(let X=0;X<s;X++)U+=M[(k*s+$)*o+(N*s+X)];t.push(U/(s*s))}const u=t.reduce((k,N)=>k+N,0)/t.length,r=Math.sqrt(t.reduce((k,N)=>k+(N-u)**2,0)/t.length),D=u>0?Math.max(0,100-r/u*50):0;f({edgeDensity:a/(o*p)*1e4,avgStrength:g/(o*p),uniformity:D});const R=document.createElement("canvas");R.width=o,R.height=p;const W=R.getContext("2d"),O=W.createImageData(o,p);for(let k=0;k<o*p;k++){const N=k*4;O.data[N]=O.data[N+1]=O.data[N+2]=m[k],O.data[N+3]=255}W.putImageData(O,0,0);const z=document.createElement("canvas");z.width=o,z.height=p;const Y=z.getContext("2d"),q=Y.createImageData(o,p),B=Math.max(...M);for(let k=0;k<o*p;k++){const N=k*4,U=B>0?M[k]/B:0;U<.25?(q.data[N]=0,q.data[N+1]=Math.floor(U*4*255),q.data[N+2]=255):U<.5?(q.data[N]=0,q.data[N+1]=255,q.data[N+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(q.data[N]=Math.floor((U-.5)*4*255),q.data[N+1]=255,q.data[N+2]=0):(q.data[N]=255,q.data[N+1]=Math.floor((1-(U-.75)*4)*255),q.data[N+2]=0),q.data[N+3]=255}Y.putImageData(q,0,0),b.current=R,c.current=z,f({edgeDensity:a/(o*p)*1e4,avgStrength:g/(o*p),uniformity:D})}catch(w){console.error("[Gradient] Analysis failed:",w)}finally{T(!1)}},[i,x,v]);return Q.useEffect(()=>{d&&l&&(A===0&&b.current?l(b.current):A===1&&c.current&&l(c.current))},[d,A,l]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(K,{value:x,onChange:w=>S(w),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",v]}),e.jsx(V,{min:20,max:300,value:v,onChange:w=>P(Number(w.target.value))})]}),e.jsx(G,{label:"Analyse Gradients",onClick:E,isAnalysing:F}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${A===0?"tool-tab-active":""}`,onClick:()=>n(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${A===1?"tool-tab-active":""}`,onClick:()=>n(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[d.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:d.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${d.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[d.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",d.uniformity.toFixed(1),"%)"]})]})]})},ce=({targetImage:i,onResult:l})=>{const[x,S]=j.useState("medium"),[v,P]=j.useState(!1),[F,T]=j.useState(0),[d,f]=j.useState(null),A=j.useCallback(async()=>{P(!0),f(null),T(0);try{const n=new Image;await new Promise((B,k)=>{n.onload=()=>B(),n.onerror=()=>k(new Error("Failed to load")),n.src=i}),T(20);const b=n.naturalWidth,c=n.naturalHeight,E=document.createElement("canvas");E.width=b,E.height=c;const w=E.getContext("2d");w.drawImage(n,0,0);const p=w.getImageData(0,0,b,c).data,C=new Float64Array(b*c);for(let B=0;B<b*c;B++)C[B]=.299*p[B*4]+.587*p[B*4+1]+.114*p[B*4+2];T(40);const h=Math.floor((x==="low"?3:x==="medium"?5:7)/2),L=new Float64Array(b*c);for(let B=0;B<c;B++)for(let k=0;k<b;k++){let N=0,U=0;for(let $=-h;$<=h;$++)for(let X=-h;X<=h;X++){const H=B+$,_=k+X;H>=0&&H<c&&_>=0&&_<b&&(N+=C[H*b+_],U++)}L[B*b+k]=N/U}T(70);const y=new Float64Array(b*c);for(let B=0;B<b*c;B++)y[B]=C[B]-L[B];const M=32,m=Math.floor(b/M),a=Math.floor(c/M),g=[];for(let B=0;B<a;B++)for(let k=0;k<m;k++){const N=[];for(let X=0;X<M;X++)for(let H=0;H<M;H++)N.push(y[(B*M+X)*b+(k*M+H)]);const U=N.reduce((X,H)=>X+H,0)/N.length,$=N.reduce((X,H)=>X+(H-U)**2,0)/N.length;g.push($)}const s=g.reduce((B,k)=>B+k,0)/g.length,t=Math.sqrt(g.reduce((B,k)=>B+(k-s)**2,0)/g.length),u=s>0?Math.min(100,t/s*100):0,r=100-u,D=u>30;f({hasFingerprint:D,consistency:u,uniformity:r}),T(90);const R=document.createElement("canvas");R.width=b,R.height=c;const W=R.getContext("2d"),O=W.createImageData(b,c);let z=1/0,Y=-1/0;for(let B=0;B<y.length;B++)y[B]<z&&(z=y[B]),y[B]>Y&&(Y=y[B]);const q=Y-z||1;for(let B=0;B<b*c;B++){const k=(y[B]-z)/q*255,N=B*4,U=Math.min(255,k*3);O.data[N]=U,O.data[N+1]=U,O.data[N+2]=U,O.data[N+3]=255}W.putImageData(O,0,0),l&&l(R),T(100),f({hasFingerprint:D,consistency:u,uniformity:r})}catch(n){console.error("[PRNU] Analysis failed:",n)}finally{P(!1)}},[i,x,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(K,{value:x,onChange:n=>S(n),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx(G,{label:"Extract PRNU",onClick:A,isAnalysing:v}),v&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${F}%`}})}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[d.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[d.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${d.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:d.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},de=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(6),[v,P]=j.useState(!1),[F,T]=j.useState(null),d=j.useCallback(async()=>{P(!0),T(null);try{const f=new Image;await new Promise((m,a)=>{f.onload=()=>m(),f.onerror=()=>a(new Error("Failed to load")),f.src=i});const A=f.naturalWidth,n=f.naturalHeight,b=document.createElement("canvas");b.width=A,b.height=n;const c=b.getContext("2d");c.drawImage(f,0,0);const w=c.getImageData(0,0,A,n).data,o=200+(10-x)*5,p=[],C=16;for(let m=0;m<Math.floor(n/C);m++)for(let a=0;a<Math.floor(A/C);a++){let g=0,s=0,t=0;for(let u=0;u<C;u++)for(let r=0;r<C;r++){const D=a*C+r,R=m*C+u,W=(R*A+D)*4,O=Math.max(w[W],w[W+1],w[W+2]);O>g&&(g=O,s=D,t=R)}g>o&&p.push({x:s,y:t,intensity:g})}const I=[];for(const m of p){let a=0,g=0;const s=10;for(let u=-s;u<=s;u++)for(let r=-s;r<=s;r++){const D=m.x+r,R=m.y+u;if(D<0||D>=A||R<0||R>=n)continue;const W=(R*A+D)*4,O=.299*w[W]+.587*w[W+1]+.114*w[W+2];a+=r*O,g+=u*O}const t=Math.atan2(g,a);I.push(t)}let h=0,L=0;if(I.length>1){const m=I.reduce((a,g)=>a+g,0)/I.length;for(const a of I){const g=Math.abs(a-m);g<Math.PI/4||g>Math.PI*7/4?h++:L++}}T({highlights:p.length,consistent:h,inconsistent:L});const y=document.createElement("canvas");y.width=A,y.height=n;const M=y.getContext("2d");M.drawImage(f,0,0),p.forEach((m,a)=>{const g=a<I.length&&(()=>{const s=I.reduce((u,r)=>u+r,0)/I.length,t=Math.abs(I[a]-s);return t<Math.PI/4||t>Math.PI*7/4})();if(M.beginPath(),M.arc(m.x,m.y,12,0,Math.PI*2),M.strokeStyle=g?"#fbbf24":"#ef4444",M.lineWidth=2,M.stroke(),a<I.length){const s=I[a],t=25;M.beginPath(),M.moveTo(m.x,m.y),M.lineTo(m.x+Math.cos(s)*t,m.y+Math.sin(s)*t),M.strokeStyle=g?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",M.lineWidth=2,M.stroke()}}),l&&l(y),T({highlights:p.length,consistent:h,inconsistent:L})}catch(f){console.error("[Highlight] Analysis failed:",f)}finally{P(!1)}},[i,x,l]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",x]}),e.jsx(V,{min:1,max:10,value:x,onChange:f=>S(Number(f.target.value))})]}),e.jsx(G,{label:"Detect Highlights",onClick:d,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:F.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[F.consistent," / ",F.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${F.inconsistent>F.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:F.inconsistent>F.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},he=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(!1),[v,P]=j.useState(null),F=j.useCallback(async()=>{S(!0),P(null);try{const T=new Image;await new Promise((a,g)=>{T.onload=()=>a(),T.onerror=()=>g(new Error("Failed to load")),T.src=i});const d=T.naturalWidth,f=T.naturalHeight,A=document.createElement("canvas");A.width=d,A.height=f;const n=A.getContext("2d");n.drawImage(T,0,0);const c=n.getImageData(0,0,d,f).data,E=new Float64Array(d*f),w=new Float64Array(d*f),o=new Float64Array(d*f);for(let a=0;a<d*f;a++)E[a]=c[a*4],w[a]=c[a*4+1],o[a]=c[a*4+2];const p=[];for(let a=2;a<f-2;a+=4)for(let g=2;g<d-2;g+=4){const s=R=>.299*E[R]+.587*w[R]+.114*o[R],t=a*d+g,u=-s(t-d-1)+s(t-d+1)-2*s(t-1)+2*s(t+1)-s(t+d-1)+s(t+d+1),r=-s(t-d-1)-2*s(t-d)-s(t-d+1)+s(t+d-1)+2*s(t+d)+s(t+d+1),D=Math.sqrt(u*u+r*r);D>100&&p.push({x:g,y:a,strength:D})}let C=0;const I=[];for(const a of p.slice(0,200)){const g=Y=>{const q=a.y*d+a.x,B=-Y[q-d-1]+Y[q-d+1]-2*Y[q-1]+2*Y[q+1]-Y[q+d-1]+Y[q+d+1],k=-Y[q-d-1]-2*Y[q-d]-Y[q-d+1]+Y[q+d-1]+2*Y[q+d]+Y[q+d+1];return{gx:B,gy:k,mag:Math.sqrt(B*B+k*k)}},s=g(E),t=g(w),u=g(o),r=Math.atan2(s.gy,s.gx),D=Math.atan2(t.gy,t.gx),R=Math.atan2(u.gy,u.gx),W=Math.abs(r-D),O=Math.abs(R-D),z=(W+O)/2;C+=z,I.push({x:a.x,y:a.y,sep:z})}const h=p.length>0?C/Math.min(p.length,200):0,L=h>.05,y=document.createElement("canvas");y.width=d,y.height=f;const M=y.getContext("2d"),m=M.createImageData(d,f);for(let a=0;a<d*f;a++){const g=a*4;m.data[g]=Math.min(255,Math.abs(E[a]-w[a])*5),m.data[g+1]=Math.min(255,Math.abs(w[a]-o[a])*5),m.data[g+2]=Math.min(255,Math.abs(o[a]-E[a])*5),m.data[g+3]=255}M.putImageData(m,0,0);for(const a of I)M.beginPath(),M.arc(a.x,a.y,3,0,Math.PI*2),M.fillStyle=a.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",M.fill();l&&l(y),P({avgSeparation:h*100,detected:L,edgesAnalysed:Math.min(p.length,200)})}catch(T){console.error("[Aberration] Analysis failed:",T)}finally{S(!1)}},[i,l]);return e.jsxs("div",{children:[e.jsx(G,{label:"Check for Aberration",onClick:F,isAnalysing:x}),v&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[v.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:v.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${v.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:v.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},ge=({targetImage:i,onResult:l})=>{const[x,S]=j.useState(!0),[v,P]=j.useState(!1),[F,T]=j.useState(null),d=j.useCallback(async()=>{P(!0),T(null);try{const f=new Image;await new Promise((s,t)=>{f.onload=()=>s(),f.onerror=()=>t(new Error("Failed to load")),f.src=i});const A=f.naturalWidth,n=f.naturalHeight,b=document.createElement("canvas");b.width=A,b.height=n;const c=b.getContext("2d");c.drawImage(f,0,0);const E=c.getImageData(0,0,A,n).data,w=8,o=Math.floor(A/w),p=Math.floor(n/w),C=[];for(let s=0;s<p;s++)for(let t=0;t<o;t++){let u=0,r=0;if(t<o-1)for(let D=0;D<w;D++){const W=((s*w+D)*A+(t+1)*w-1)*4,O=W+4;u+=Math.abs(E[W]-E[O])+Math.abs(E[W+1]-E[O+1])+Math.abs(E[W+2]-E[O+2]),r++}if(s<p-1)for(let D=0;D<w;D++){const R=t*w+D,W=(s+1)*w-1,O=W+1,z=(W*A+R)*4,Y=(O*A+R)*4;u+=Math.abs(E[z]-E[Y])+Math.abs(E[z+1]-E[Y+1])+Math.abs(E[z+2]-E[Y+2]),r++}C.push(r>0?u/(r*3):0)}const I=C.reduce((s,t)=>s+t,0)/C.length,h=Math.sqrt(C.reduce((s,t)=>s+(t-I)**2,0)/C.length);let L=0;for(const s of C)Math.abs(s-I)>h*2&&L++;const y=Math.max(10,Math.min(100,100-I*2)),M=L>o*p*.1?2:1,m=document.createElement("canvas");m.width=A,m.height=n;const a=m.getContext("2d");a.drawImage(f,0,0);const g=Math.max(...C);for(let s=0;s<p;s++)for(let t=0;t<o;t++){const u=g>0?C[s*o+t]/g:0,r=u<.33?0:u<.66?200:220,D=u<.33||u<.66?180:50;a.fillStyle=`rgba(${r},${D},0,0.3)`,a.fillRect(t*w,s*w,w,w),x&&(a.strokeStyle="rgba(255,255,255,0.08)",a.lineWidth=.5,a.strokeRect(t*w,s*w,w,w))}l&&l(m),T({quality:y,layers:M,inconsistent:L})}catch(f){console.error("[Compression]",f)}finally{P(!1)}},[i,x,l]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:x,onChange:f=>S(f.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx(G,{label:"Analyse Compression",onClick:d,isAnalysing:v}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[F.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:F.layers})]})]}),e.jsx("div",{className:`tool-verdict ${F.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:F.layers>1?`⚠️ Multiple re-compressions (${F.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},xe=({targetImage:i})=>{const[l,x]=j.useState(!1),[S,v]=j.useState(null),P=j.useCallback(async()=>{var d;x(!0),v(null);try{const f=new Image;await new Promise((r,D)=>{f.onload=()=>r(),f.onerror=()=>D(),f.src=i});const A=i,n=A.startsWith("data:"),b=A.startsWith("blob:"),c=!n&&!b?new URL(A):null,E=c?c.pathname.split("/").pop()||"unknown":"embedded",w=((d=E.split(".").pop())==null?void 0:d.toLowerCase())||"unknown";let o="",p="",C="";try{const r=await fetch(i,{method:"HEAD",mode:"cors"});o=r.headers.get("content-type")||"",p=r.headers.get("content-length")||"",C=r.headers.get("last-modified")||""}catch{}const I=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],h=A.toLowerCase(),L=I.some(r=>h.includes(r)),M=c?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(r=>c.hostname.includes(r)):!1,m={Source:n?"Data URL (embedded)":b?"Blob URL (local)":(c==null?void 0:c.hostname)||"Unknown",Filename:E,Format:o||w.toUpperCase(),Dimensions:`${f.naturalWidth} × ${f.naturalHeight}`},a={"Aspect Ratio":(f.naturalWidth/f.naturalHeight).toFixed(2),"Total Pixels":`${(f.naturalWidth*f.naturalHeight/1e6).toFixed(1)} MP`};p&&(a["File Size"]=`${(parseInt(p)/1024).toFixed(1)} KB`);const g={};C&&(g["Last Modified"]=C);const s={};L&&(s["AI Indicator"]="⚠️ AI-related keywords found in URL"),M&&(s.Hosting="⚠️ Known AI image hosting platform");let t="authentic",u="✅ No suspicious metadata detected";L||M?(t="ai",u="❌ AI generation indicators detected in metadata"):(n||b)&&(t="suspicious",u="⚠️ Embedded/local image — limited metadata available"),v({camera:m,settings:a,dates:g,software:s,verdict:t,verdictText:u})}catch(f){console.error("[Metadata]",f)}finally{x(!1)}},[i]),F=()=>{if(!S)return;const d=JSON.stringify({...S.camera,...S.settings,...S.dates,...S.software},null,2);navigator.clipboard.writeText(d)},T=(d,f,A)=>Object.keys(A).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:f}),e.jsx("h4",{children:d})]}),Object.entries(A).map(([n,b])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:n}),e.jsx("span",{className:`metadata-value ${b.includes("Not found")?"metadata-missing":""}`,children:b})]},n))]});return e.jsxs("div",{children:[e.jsx(G,{label:"Extract Metadata",onClick:P,isAnalysing:l}),S&&e.jsxs("div",{className:"tool-output-area",children:[T("Image Information","📷",S.camera),T("Properties","⚙️",S.settings),T("Dates","📅",S.dates),T("Software & AI Detection","🖥️",S.software),e.jsx("div",{className:`tool-verdict ${S.verdict==="authentic"?"tool-verdict-safe":S.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:S.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:F,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})};async function pe(i){return i.startsWith("data:")||i.startsWith("blob:")?i:new Promise((l,x)=>{chrome.runtime.sendMessage({type:"FETCH_IMAGE_AS_DATA_URL",url:i},S=>{if(chrome.runtime.lastError){x(new Error(chrome.runtime.lastError.message));return}S!=null&&S.success&&S.dataUrl?l(S.dataUrl):x(new Error((S==null?void 0:S.error)||"Failed to fetch image via background"))})})}const me=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5z"}),e.jsx("path",{d:"M2 17l10 5 10-5"}),e.jsx("path",{d:"M2 12l10 5 10-5"})]}),ue=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M2 12h2l2-6 4 12 4-12 2 6h4"}),e.jsx("circle",{cx:"12",cy:"12",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"4",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"20",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"4",r:"1",fill:l,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"20",r:"1",fill:l,stroke:"none"})]}),fe=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v8"}),e.jsx("path",{d:"M8 12h8"})]}),be=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M2 10s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4"}),e.jsx("path",{d:"M2 14s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4",style:{opacity:.5}}),e.jsx("rect",{x:"2",y:"6",width:"20",height:"12",rx:"2",strokeOpacity:"0.5"})]}),we=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M3 21L21 3"}),e.jsx("path",{d:"M3 15L9 21"}),e.jsx("path",{d:"M15 3L21 9"})]}),ve=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v18"}),e.jsx("path",{d:"M15 3v18"}),e.jsx("path",{d:"M3 9h18"}),e.jsx("path",{d:"M3 15h18"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",fill:l,stroke:"none"})]}),ye=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2z"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",opacity:"0.5"})]}),je=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("circle",{cx:"9",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("circle",{cx:"15",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("path",{d:"M12 9a3 3 0 010 6 3 3 0 010-6z",fill:l,fillOpacity:"0.2",stroke:"none"})]}),ke=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v6h6v6h6"}),e.jsx("path",{d:"M3 15h6v6"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",strokeOpacity:"0.5"})]}),Ne=({size:i=20,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),e.jsx("line",{x1:"10",y1:"9",x2:"8",y2:"9"})]}),Se=({size:i=24,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("path",{d:"M4 8V6a2 2 0 0 1 2-2h2"}),e.jsx("path",{d:"M4 16v2a2 2 0 0 0 2 2h2"}),e.jsx("path",{d:"M16 4h2a2 2 0 0 1 2 2v2"}),e.jsx("path",{d:"M16 20h2a2 2 0 0 0 2-2v-2"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v-1",opacity:"0.5"}),e.jsx("path",{d:"M12 17v-1",opacity:"0.5"}),e.jsx("path",{d:"M8 12h1",opacity:"0.5"}),e.jsx("path",{d:"M15 12h1",opacity:"0.5"})]}),Ce=({size:i=24,color:l="currentColor",...x})=>e.jsxs("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:l,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...x,children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",strokeOpacity:"0.4"}),e.jsx("path",{d:"M7 17l1.5 1.5 2.5-2.5"})]}),Me=[{icon:e.jsx(me,{size:20}),title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ne},{icon:e.jsx(ue,{size:20}),title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:se},{icon:e.jsx(fe,{size:20}),title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:re},{icon:e.jsx(be,{size:20}),title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:ie},{icon:e.jsx(we,{size:20}),title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:le},{icon:e.jsx(ve,{size:20}),title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ce},{icon:e.jsx(ye,{size:20}),title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:de},{icon:e.jsx(je,{size:20}),title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:he},{icon:e.jsx(ke,{size:20}),title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ge},{icon:e.jsx(Ne,{size:20}),title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:xe}],Ae=({targetImage:i,onBack:l,onMaximize:x})=>{var w;const[S,v]=j.useState(null),[P,F]=j.useState(null),[T,d]=j.useState(50),[f,A]=j.useState("ltr"),n=j.useRef(null),[b,c]=j.useState(null);j.useEffect(()=>{let o=!1;return c(null),pe(i).then(p=>{o||c(p)}).catch(p=>{console.error("[ForensicToolsPanel] Failed to fetch image:",p),o||c(i)}),()=>{o=!0}},[i]);const E=j.useCallback((o,p)=>{v(o.toDataURL()),F(p)},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:l,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx(Se,{size:24,color:"#f1f5f9"}),e.jsx("h2",{children:"Image Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>x(S||i,P||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:n,children:[e.jsx("img",{src:b||i,alt:"Original",className:"comparison-image"}),S&&e.jsx("div",{className:"comparison-overlay",style:{width:`${f==="ltr"?T:100-T}%`,left:f==="ltr"?0:"auto",right:f==="rtl"?0:"auto",borderRight:f==="ltr"?"2px solid #fff":"none",borderLeft:f==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:S,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:f==="ltr"?0:"auto",right:f==="rtl"?0:"auto",width:((w=n.current)==null?void 0:w.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),S&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${T}%`}})]}),S&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{v(null),F(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:T,onChange:o=>d(Number(o.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>A(o=>o==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!S&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx(Ce,{size:20,color:"#94a3b8"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),!b&&e.jsx("div",{style:{textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.7)"},children:e.jsx("div",{className:"tool-loading",style:{display:"inline-block",padding:"8px 20px",borderRadius:"8px",background:"rgba(255,255,255,0.1)"},children:"Preparing image for analysis..."})}),b&&e.jsx("div",{className:"forensic-tools-grid",children:Me.map((o,p)=>e.jsx(oe,{icon:o.icon,title:o.title,description:o.desc,tier:o.tier,index:p,children:e.jsx(o.Component,{targetImage:b,onResult:C=>E(C,o.title)})},o.title))})]})},Ee=({image:i,title:l,onClose:x})=>{const[S,v]=j.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[P,F]=j.useState(!1),[T,d]=j.useState(!1),[f,A]=j.useState({scale:1,x:0,y:0}),[n,b]=j.useState(!1),c=j.useRef({x:0,y:0}),E=j.useRef({x:0,y:0,width:0,height:0}),w=j.useRef({x:0,y:0,imgX:0,imgY:0}),o=j.useRef(null),p=h=>{h.target===h.currentTarget&&(F(!0),c.current={x:h.clientX-S.x,y:h.clientY-S.y})},C=h=>{h.stopPropagation(),d(!0),E.current={x:h.clientX,y:h.clientY,width:S.width,height:S.height}},I=h=>{h.preventDefault(),b(!0),w.current={x:h.clientX,y:h.clientY,imgX:f.x,imgY:f.y}};return j.useEffect(()=>{const h=y=>{if(P&&v(M=>({...M,x:y.clientX-c.current.x,y:y.clientY-c.current.y})),T){const M=y.clientX-E.current.x,m=y.clientY-E.current.y;v(a=>({...a,width:Math.max(400,E.current.width+M),height:Math.max(300,E.current.height+m)}))}if(n){const M=y.clientX-w.current.x,m=y.clientY-w.current.y;A(a=>({...a,x:w.current.imgX+M,y:w.current.imgY+m}))}},L=()=>{F(!1),d(!1),b(!1)};return(P||T||n)&&(window.addEventListener("mousemove",h),window.addEventListener("mouseup",L)),()=>{window.removeEventListener("mousemove",h),window.removeEventListener("mouseup",L)}},[P,T,n]),j.useEffect(()=>{const h=o.current;if(!h)return;const L=g=>{g.preventDefault(),g.stopPropagation();const s=h.getBoundingClientRect(),t=g.clientX-s.left-s.width/2,u=g.clientY-s.top-s.height/2,D=-g.deltaY*.001;A(R=>{const W=Math.min(Math.max(.1,R.scale+D*R.scale*5),10);if(W===R.scale)return R;const O=W/R.scale,z=t-(t-R.x)*O,Y=u-(u-R.y)*O;return{scale:W,x:z,y:Y}})};let y=0;const M=g=>{g.touches.length===2&&(y=Math.hypot(g.touches[0].clientX-g.touches[1].clientX,g.touches[0].clientY-g.touches[1].clientY))},m=g=>{if(g.touches.length===2){g.preventDefault();const s=Math.hypot(g.touches[0].clientX-g.touches[1].clientX,g.touches[0].clientY-g.touches[1].clientY),t=(g.touches[0].clientX+g.touches[1].clientX)/2,u=(g.touches[0].clientY+g.touches[1].clientY)/2,r=h.getBoundingClientRect(),D=t-r.left-r.width/2,R=u-r.top-r.height/2;if(y>0){const O=(s-y)*.01;A(z=>{const Y=Math.min(Math.max(.1,z.scale+O*z.scale),10);if(Y===z.scale)return z;const q=Y/z.scale;return{scale:Y,x:D-(D-z.x)*q,y:R-(R-z.y)*q}})}y=s}},a=()=>{y=0};return h.addEventListener("wheel",L,{passive:!1}),h.addEventListener("touchstart",M,{passive:!1}),h.addEventListener("touchmove",m,{passive:!1}),h.addEventListener("touchend",a),()=>{h.removeEventListener("wheel",L),h.removeEventListener("touchstart",M),h.removeEventListener("touchmove",m),h.removeEventListener("touchend",a)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:S.x,top:S.y,width:S.width,height:S.height,zIndex:2147483647},children:e.jsxs(J,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:p,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[l," Result"]})]}),e.jsx("button",{onClick:x,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:o,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:I,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${f.x}px, ${f.y}px) scale(${f.scale})`,transition:n?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:i,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(f.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:C,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},Ie=()=>{const[i,l]=j.useState("idle"),[x,S]=j.useState(null),[v,P]=j.useState(null),[F,T]=j.useState(null),[d,f]=j.useState(null),[A,n]=j.useState(null),[b,c]=j.useState(!1),E=j.useRef({x:0,y:0}),w=j.useRef(null);j.useEffect(()=>{const I=h=>{switch(h.type){case"SCANNING":l("scanning"),T(h.imageUrl||null),S(null),P(null);break;case"SHOW_RESULT":l("result"),S({isAI:h.isAI||!1,confidence:h.confidence||0,heatmapData:h.heatmapData,filterData:h.filterData});break;case"ERROR":l("error"),P(h.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(I),()=>chrome.runtime.onMessage.removeListener(I)},[]),j.useEffect(()=>{const I=L=>{if(!b||!w.current)return;let y=L.clientX-E.current.x,M=L.clientY-E.current.y;const m=w.current.getBoundingClientRect(),a=window.innerWidth,g=window.innerHeight,s=Math.max(0,a-m.width),t=Math.max(0,g-m.height);y=Math.max(0,Math.min(y,s)),M=Math.max(0,Math.min(M,t)),n({x:y,y:M})},h=()=>{c(!1)};return b&&(window.addEventListener("mousemove",I),window.addEventListener("mouseup",h)),()=>{window.removeEventListener("mousemove",I),window.removeEventListener("mouseup",h)}},[b]);const o=I=>{if(!w.current)return;const h=w.current.getBoundingClientRect(),L=h.left,y=h.top;E.current={x:I.clientX-L,y:I.clientY-y},A||n({x:L,y}),c(!0)},p=()=>{l("idle"),S(null),P(null),T(null),n(null),f(null)};if(i==="idle")return null;const C=i==="tools"?800:400;return e.jsxs(Q.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:A?0:20},children:e.jsx("div",{ref:w,className:"pointer-events-auto transition-shadow duration-300",style:A?{position:"absolute",left:A.x,top:A.y,boxShadow:b?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(J,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:C},children:[e.jsx("div",{onMouseDown:o,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${b?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:p,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[i==="scanning"&&e.jsxs("div",{className:"relative",children:[F&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:F,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),i==="result"&&x&&F&&e.jsx(ee,{result:x,targetImage:F,onToolsClick:()=>l("tools")}),i==="tools"&&F&&e.jsx(Ae,{targetImage:F,onBack:()=>l("result"),onClose:p,onMaximize:(I,h)=>f({url:I,title:h})}),i==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:v})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),d&&e.jsx(Ee,{image:d.url,title:d.title,onClose:()=>f(null)})]})},Le=`
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
`;function De(i){const l=document.createElement("style");l.textContent=Le,i.appendChild(l)}const Te=`

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
`;function Fe(i){const l=document.createElement("style");l.textContent=Te,i.appendChild(l)}if(!document.getElementById("undiffused-root")){const i=document.createElement("div");i.id="undiffused-root",document.body.appendChild(i);const l=i.attachShadow({mode:"open"});De(l),Fe(l);const x=document.createElement("div");x.id="undiffused-app",l.appendChild(x);const S=document.createElement("div");S.id="undiffused-portal-root",Object.assign(S.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),l.appendChild(S),te.createRoot(x).render(e.jsx(Ie,{})),console.log("[UnDiffused] Content script injected")}
