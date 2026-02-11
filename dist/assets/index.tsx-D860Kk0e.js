import{r as w,j as e,a as Z,R as Q,G as J,b as ee,c as te}from"./ResultView-BXWFaSCq.js";const oe=({icon:M,title:k,description:E,tier:j,index:b,children:P})=>{const[F,T]=w.useState(!1);return e.jsxs("div",{className:`tool-card ${F?"tool-card-expanded":""}`,style:{animationDelay:`${b*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>T(!F),"aria-expanded":F,"aria-label":`${k} - ${E}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:M})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:k}),e.jsx("p",{className:"tool-card-desc",children:E})]}),e.jsx("div",{className:`tool-card-chevron ${F?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),j===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${F?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:P||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var ae=Z();function K({value:M,onChange:k,options:E,placeholder:j="Select...",disabled:b=!1}){const[P,F]=w.useState(!1),T=w.useRef(null),l=w.useRef(null),[p,C]=w.useState({top:0,left:0,width:0}),n=w.useCallback(()=>{var g;const o=(g=T.current)==null?void 0:g.getRootNode();if(o&&o instanceof ShadowRoot){let N=o.querySelector("#undiffused-portal-root");return N||(N=document.createElement("div"),N.id="undiffused-portal-root",Object.assign(N.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),o.appendChild(N)),N}return document.body},[]),u=E.find(o=>o.value===M),i=o=>{k(o),F(!1)},A=()=>{if(!b)if(!P&&T.current){const o=T.current.getBoundingClientRect();C({top:o.bottom+6,left:o.left,width:o.width}),F(!0)}else F(!1)};w.useEffect(()=>{var N;if(!P)return;const o=I=>{var D,f;const c=I.target;(D=T.current)!=null&&D.contains(c)||(f=l.current)!=null&&f.contains(c)||F(!1)},g=((N=T.current)==null?void 0:N.getRootNode())||document;return g.addEventListener("mousedown",o),()=>g.removeEventListener("mousedown",o)},[P]),w.useEffect(()=>{if(!P)return;const o=()=>F(!1);return window.addEventListener("resize",o),window.addEventListener("scroll",o,{capture:!0}),()=>{window.removeEventListener("resize",o),window.removeEventListener("scroll",o,{capture:!0})}},[P]);const x=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:p.top,left:p.left,width:p.width,zIndex:2147483647,pointerEvents:"auto"},children:E.map(o=>e.jsxs("div",{className:`liquid-select-option ${o.value===M?"selected":""}`,onClick:()=>i(o.value),role:"option","aria-selected":o.value===M,children:[e.jsx("span",{children:o.label}),o.value===M&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(o.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:T,type:"button",className:`liquid-select-trigger ${P?"open":""} ${b?"opacity-50 cursor-not-allowed":""}`,onClick:A,disabled:b,"aria-haspopup":"listbox","aria-expanded":P,children:[e.jsx("span",{children:u?u.label:j}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),P&&ae.createPortal(x,n())]})}const G=({label:M,onClick:k,isAnalysing:E=!1,disabled:j=!1,onHelpClick:b})=>e.jsxs("div",{className:"tool-action-row",children:[e.jsx("button",{className:`tool-analyse-btn ${E?"tool-loading":""}`,onClick:k,disabled:j||E,children:E?"Analysing...":M}),e.jsx("button",{className:"tool-help-btn",onClick:b,title:"How does this tool work?",children:e.jsx("span",{className:"tool-help-icon",children:"?"})})]}),V=({value:M,min:k,max:E,style:j,...b})=>{const P=(M-k)/(E-k)*100;return e.jsx("input",{type:"range",className:"tool-slider",min:k,max:E,value:M,style:{...j,background:`linear-gradient(to right, #ffffff 0%, #ffffff ${P}%, rgba(255, 255, 255, 0.2) ${P}%, rgba(255, 255, 255, 0.2) 100%)`},...b})},ne=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(85),[b,P]=w.useState("medium"),[F,T]=w.useState(!1),[l,p]=w.useState(null),C=b==="low"?10:b==="medium"?20:40,n=w.useCallback(async()=>{T(!0),p(null);try{const u=new Image;await new Promise((r,t)=>{u.onload=()=>r(),u.onerror=()=>t(new Error("Failed to load image")),u.src=M});const i=u.naturalWidth,A=u.naturalHeight,x=document.createElement("canvas");x.width=i,x.height=A;const o=x.getContext("2d");o.drawImage(u,0,0);const g=o.getImageData(0,0,i,A),N=document.createElement("canvas");N.width=i,N.height=A;const I=N.getContext("2d");I.drawImage(u,0,0);const c=N.toDataURL("image/jpeg",E/100),D=new Image;await new Promise(r=>{D.onload=()=>r(),D.src=c}),I.drawImage(D,0,0);const f=I.getImageData(0,0,i,A),S=document.createElement("canvas");S.width=i,S.height=A;const h=S.getContext("2d"),a=h.createImageData(i,A);let d=0;for(let r=0;r<g.data.length;r+=4){const t=Math.abs(g.data[r]-f.data[r]),m=Math.abs(g.data[r+1]-f.data[r+1]),s=Math.abs(g.data[r+2]-f.data[r+2]);d+=t+m+s;const L=Math.min(255,t*C),R=Math.min(255,m*C),q=Math.min(255,s*C),O=(L+R+q)/3;O<64?(a.data[r]=0,a.data[r+1]=0,a.data[r+2]=Math.min(255,O*4)):O<128?(a.data[r]=0,a.data[r+1]=Math.min(255,(O-64)*4),a.data[r+2]=255-(O-64)*4):O<192?(a.data[r]=Math.min(255,(O-128)*4),a.data[r+1]=255,a.data[r+2]=0):(a.data[r]=255,a.data[r+1]=255-(O-192)*4,a.data[r+2]=0),a.data[r+3]=255}h.putImageData(a,0,0),k&&k(S),p({diffScore:d/(i*A)})}catch(u){console.error("[ELA] Analysis failed:",u)}finally{T(!1)}},[M,E,C,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",E,"%"]}),e.jsx(V,{min:50,max:100,value:E,onChange:u=>j(Number(u.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(K,{value:b,onChange:u=>P(u),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx(G,{label:"Analyse Error Levels",onClick:n,isAnalysing:F}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},re=({targetImage:M,onResult:k})=>{const[E,j]=w.useState("luminance"),[b,P]=w.useState(32),[F,T]=w.useState(!1),[l,p]=w.useState(null),C=w.useCallback(async()=>{T(!0),p(null);try{const n=new Image;await new Promise((t,m)=>{n.onload=()=>t(),n.onerror=()=>m(new Error("Failed to load image")),n.src=M});const u=n.naturalWidth,i=n.naturalHeight,A=document.createElement("canvas");A.width=u,A.height=i;const x=A.getContext("2d");x.drawImage(n,0,0);const g=x.getImageData(0,0,u,i).data,N=t=>E==="chromatic"?(g[t]-g[t+1])*.5+128:.299*g[t]+.587*g[t+1]+.114*g[t+2],I=Math.floor(u/b),c=Math.floor(i/b),D=[];for(let t=0;t<c;t++)for(let m=0;m<I;m++){const s=[];for(let q=0;q<b;q++)for(let O=0;O<b;O++){const z=m*b+O,Y=t*b+q,W=(Y*u+z)*4,B=N(W);let v=0,y=0;for(const[$,X]of[[-1,0],[1,0],[0,-1],[0,1]]){const H=z+$,_=Y+X;H>=0&&H<u&&_>=0&&_<i&&(v+=N((_*u+H)*4),y++)}const U=B-v/y;s.push(U)}const L=s.reduce((q,O)=>q+O,0)/s.length,R=s.reduce((q,O)=>q+(O-L)**2,0)/s.length;D.push(R)}const f=D.reduce((t,m)=>t+m,0)/D.length,S=Math.sqrt(D.reduce((t,m)=>t+(m-f)**2,0)/D.length),h=Math.max(0,100-S/f*100),a=document.createElement("canvas");a.width=u,a.height=i;const d=a.getContext("2d");d.globalAlpha=.3,d.drawImage(n,0,0),d.globalAlpha=1;const r=Math.max(...D);for(let t=0;t<c;t++)for(let m=0;m<I;m++){const s=D[t*I+m],L=r>0?s/r:0,R=Math.floor(255*(1-L)),q=Math.floor(255*L);d.fillStyle=`rgba(${R}, ${q}, 60, 0.5)`,d.fillRect(m*b,t*b,b,b),d.strokeStyle="rgba(255,255,255,0.1)",d.strokeRect(m*b,t*b,b,b)}k&&k(a),p({mean:f,std:S,uniformity:h})}catch(n){console.error("[Noise] Analysis failed:",n)}finally{T(!1)}},[M,E,b,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(K,{value:E,onChange:n=>j(n),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",b,"px"]}),e.jsx(V,{min:8,max:64,step:8,value:b,onChange:n=>P(Number(n.target.value))})]}),e.jsx(G,{label:"Analyse Noise",onClick:C,isAnalysing:F}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},se=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(5),[b,P]=w.useState(32),[F,T]=w.useState(!1),[l,p]=w.useState(null),C=(i,A,x,o,g)=>{let N=0;const I=Math.max(1,Math.floor(g/8));for(let c=0;c<g;c+=I)for(let D=0;D<g;D+=I){const f=((o+c)*A+(x+D))*4,S=i[f]*.299+i[f+1]*.587+i[f+2]*.114;N=(N<<5)-N+Math.floor(S/(12-E))|0}return N},n=(i,A,x,o,g,N,I)=>{let c=0,D=0;const f=Math.max(1,Math.floor(I/16));for(let S=0;S<I;S+=f)for(let h=0;h<I;h+=f){const a=((o+S)*A+(x+h))*4,d=((N+S)*A+(g+h))*4;c+=Math.abs(i[a]-i[d]),c+=Math.abs(i[a+1]-i[d+1]),c+=Math.abs(i[a+2]-i[d+2]),D++}return 1-c/(D*3*255)},u=w.useCallback(async()=>{T(!0),p(null);try{const i=new Image;await new Promise((t,m)=>{i.onload=()=>t(),i.onerror=()=>m(new Error("Failed to load")),i.src=M});const A=i.naturalWidth,x=i.naturalHeight,o=document.createElement("canvas");o.width=A,o.height=x;const g=o.getContext("2d");g.drawImage(i,0,0);const N=g.getImageData(0,0,A,x),I=Math.max(b/2,8),c=new Map;for(let t=0;t+b<=x;t+=I)for(let m=0;m+b<=A;m+=I){const s=C(N.data,A,m,t,b);c.has(s)||c.set(s,[]),c.get(s).push({x:m,y:t})}const D=[],f=b*2,S=.85+(E-5)*.01;for(const[,t]of c)if(!(t.length<2||t.length>50))for(let m=0;m<t.length&&m<10;m++)for(let s=m+1;s<t.length&&s<10;s++){if(Math.sqrt((t[m].x-t[s].x)**2+(t[m].y-t[s].y)**2)<f)continue;const R=n(N.data,A,t[m].x,t[m].y,t[s].x,t[s].y,b);R>=S&&D.push({ax:t[m].x,ay:t[m].y,bx:t[s].x,by:t[s].y,sim:R})}const h=document.createElement("canvas");h.width=A,h.height=x;const a=h.getContext("2d");a.drawImage(i,0,0);const d=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],r=D.slice(0,30);r.forEach((t,m)=>{const s=d[m%d.length];a.strokeStyle=s,a.lineWidth=2,a.globalAlpha=.7,a.strokeRect(t.ax,t.ay,b,b),a.strokeRect(t.bx,t.by,b,b),a.fillStyle=s,a.globalAlpha=.15,a.fillRect(t.ax,t.ay,b,b),a.fillRect(t.bx,t.by,b,b),a.globalAlpha=.4,a.setLineDash([4,4]),a.beginPath(),a.moveTo(t.ax+b/2,t.ay+b/2),a.lineTo(t.bx+b/2,t.by+b/2),a.stroke(),a.setLineDash([]),a.globalAlpha=1}),k&&k(h),p(r.length)}catch(i){console.error("[Clone] Detection failed:",i)}finally{T(!1)}},[M,E,b,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",E]}),e.jsx(V,{min:1,max:10,value:E,onChange:i=>j(Number(i.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",b,"px"]}),e.jsx(V,{min:8,max:128,step:8,value:b,onChange:i=>P(Number(i.target.value))})]}),e.jsx(G,{label:"Detect Clones",onClick:u,isAnalysing:F}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},ie=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(1),[b,P]=w.useState(!1),[F,T]=w.useState(null),l=(C,n)=>{const u=C.length;if(u<=1)return[C,n];const i=u/2,A=new Float64Array(i),x=new Float64Array(i),o=new Float64Array(i),g=new Float64Array(i);for(let h=0;h<i;h++)A[h]=C[2*h],x[h]=n[2*h],o[h]=C[2*h+1],g[h]=n[2*h+1];const[N,I]=l(A,x),[c,D]=l(o,g),f=new Float64Array(u),S=new Float64Array(u);for(let h=0;h<i;h++){const a=-2*Math.PI*h/u,d=Math.cos(a),r=Math.sin(a),t=d*c[h]-r*D[h],m=d*D[h]+r*c[h];f[h]=N[h]+t,S[h]=I[h]+m,f[h+i]=N[h]-t,S[h+i]=I[h]-m}return[f,S]},p=w.useCallback(async()=>{P(!0),T(null);try{const C=new Image;await new Promise((s,L)=>{C.onload=()=>s(),C.onerror=()=>L(new Error("Failed to load image")),C.src=M});const n=512,u=document.createElement("canvas");u.width=n,u.height=n;const i=u.getContext("2d");i.drawImage(C,0,0,n,n);const x=i.getImageData(0,0,n,n).data,o=new Float64Array(n*n);for(let s=0;s<n*n;s++)o[s]=(x[s*4]*.299+x[s*4+1]*.587+x[s*4+2]*.114)/255;const g=new Float64Array(o),N=new Float64Array(n*n);for(let s=0;s<n;s++){const L=new Float64Array(n),R=new Float64Array(n);for(let z=0;z<n;z++)L[z]=g[s*n+z],R[z]=N[s*n+z];const[q,O]=l(L,R);for(let z=0;z<n;z++)g[s*n+z]=q[z],N[s*n+z]=O[z]}for(let s=0;s<n;s++){const L=new Float64Array(n),R=new Float64Array(n);for(let z=0;z<n;z++)L[z]=g[z*n+s],R[z]=N[z*n+s];const[q,O]=l(L,R);for(let z=0;z<n;z++)g[z*n+s]=q[z],N[z*n+s]=O[z]}const I=new Float64Array(n*n),c=n/2;let D=0;for(let s=0;s<n;s++)for(let L=0;L<n;L++){const R=g[s*n+L],q=N[s*n+L];let O=Math.sqrt(R*R+q*q);O=Math.log(1+O)*E;const z=(s+c)%n,Y=(L+c)%n,W=z*n+Y;I[W]=O,O>D&&(D=O)}const f=I[c*n+c],h=I[0]/D*100,a=f/D*100;let d=0;for(let s=1;s<4;s++){const L=c+s*(n/8);L<n&&I[c*n+L]>I[c*n+L-1]*1.5&&d++}const r=document.createElement("canvas");r.width=n,r.height=n;const t=r.getContext("2d"),m=t.createImageData(n,n);for(let s=0;s<n*n;s++){const L=D>0?I[s]/D*255:0,R=s*4;m.data[R]=Math.min(255,L*.8),m.data[R+1]=Math.min(255,L*.9),m.data[R+2]=Math.min(255,L),m.data[R+3]=255}t.putImageData(m,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let s=30;s<c;s+=30)t.beginPath(),t.arc(c,c,s,0,Math.PI*2),t.stroke();k&&k(r),T({highFreq:h,lowFreq:a,gridArtifacts:d>3})}catch(C){console.error("[FFT] Analysis failed:",C)}finally{P(!1)}},[M,E,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",E]}),e.jsx(V,{min:1,max:10,step:.1,value:E,onChange:C=>j(Number(C.target.value))})]}),e.jsx(G,{label:"Generate Spectrum",onClick:p,isAnalysing:b}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[F.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:F.gridArtifacts?"#ef4444":"#10b981"},children:F.gridArtifacts?"Detected":"None"})]})]})]})]})},le=({targetImage:M,onResult:k})=>{const[E,j]=w.useState("sobel"),[b,P]=w.useState(100),[F,T]=w.useState(!1),[l,p]=w.useState(null),[C,n]=w.useState(0),u=w.useRef(null),i=w.useRef(null),A=w.useCallback(async()=>{T(!0),p(null);try{const x=new Image;await new Promise((v,y)=>{x.onload=()=>v(),x.onerror=()=>y(new Error("Failed to load")),x.src=M});const o=x.naturalWidth,g=x.naturalHeight,N=document.createElement("canvas");N.width=o,N.height=g;const I=N.getContext("2d");I.drawImage(x,0,0);const D=I.getImageData(0,0,o,g).data,f=new Float64Array(o*g);for(let v=0;v<o*g;v++){const y=v*4;f[v]=.299*D[y]+.587*D[y+1]+.114*D[y+2]}const S=new Float64Array(o*g),h=new Uint8Array(o*g);if(E==="sobel"||E==="canny")for(let v=1;v<g-1;v++)for(let y=1;y<o-1;y++){const U=-f[(v-1)*o+(y-1)]+f[(v-1)*o+(y+1)]-2*f[v*o+(y-1)]+2*f[v*o+(y+1)]-f[(v+1)*o+(y-1)]+f[(v+1)*o+(y+1)],$=-f[(v-1)*o+(y-1)]-2*f[(v-1)*o+y]-f[(v-1)*o+(y+1)]+f[(v+1)*o+(y-1)]+2*f[(v+1)*o+y]+f[(v+1)*o+(y+1)],X=Math.sqrt(U*U+$*$);S[v*o+y]=X,h[v*o+y]=X>b?255:0}else for(let v=1;v<g-1;v++)for(let y=1;y<o-1;y++){const U=-4*f[v*o+y]+f[(v-1)*o+y]+f[(v+1)*o+y]+f[v*o+(y-1)]+f[v*o+(y+1)],$=Math.abs(U);S[v*o+y]=$,h[v*o+y]=$>b/2?255:0}let a=0,d=0;const r=32,t=[];for(let v=0;v<o*g;v++)h[v]>0&&a++,d+=S[v];for(let v=0;v<Math.floor(g/r);v++)for(let y=0;y<Math.floor(o/r);y++){let U=0;for(let $=0;$<r;$++)for(let X=0;X<r;X++)U+=S[(v*r+$)*o+(y*r+X)];t.push(U/(r*r))}const m=t.reduce((v,y)=>v+y,0)/t.length,s=Math.sqrt(t.reduce((v,y)=>v+(y-m)**2,0)/t.length),L=m>0?Math.max(0,100-s/m*50):0;p({edgeDensity:a/(o*g)*1e4,avgStrength:d/(o*g),uniformity:L});const R=document.createElement("canvas");R.width=o,R.height=g;const q=R.getContext("2d"),O=q.createImageData(o,g);for(let v=0;v<o*g;v++){const y=v*4;O.data[y]=O.data[y+1]=O.data[y+2]=h[v],O.data[y+3]=255}q.putImageData(O,0,0);const z=document.createElement("canvas");z.width=o,z.height=g;const Y=z.getContext("2d"),W=Y.createImageData(o,g),B=Math.max(...S);for(let v=0;v<o*g;v++){const y=v*4,U=B>0?S[v]/B:0;U<.25?(W.data[y]=0,W.data[y+1]=Math.floor(U*4*255),W.data[y+2]=255):U<.5?(W.data[y]=0,W.data[y+1]=255,W.data[y+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(W.data[y]=Math.floor((U-.5)*4*255),W.data[y+1]=255,W.data[y+2]=0):(W.data[y]=255,W.data[y+1]=Math.floor((1-(U-.75)*4)*255),W.data[y+2]=0),W.data[y+3]=255}Y.putImageData(W,0,0),u.current=R,i.current=z,p({edgeDensity:a/(o*g)*1e4,avgStrength:d/(o*g),uniformity:L})}catch(x){console.error("[Gradient] Analysis failed:",x)}finally{T(!1)}},[M,E,b]);return Q.useEffect(()=>{l&&k&&(C===0&&u.current?k(u.current):C===1&&i.current&&k(i.current))},[l,C,k]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(K,{value:E,onChange:x=>j(x),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",b]}),e.jsx(V,{min:20,max:300,value:b,onChange:x=>P(Number(x.target.value))})]}),e.jsx(G,{label:"Analyse Gradients",onClick:A,isAnalysing:F}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${C===0?"tool-tab-active":""}`,onClick:()=>n(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${C===1?"tool-tab-active":""}`,onClick:()=>n(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},ce=({targetImage:M,onResult:k})=>{const[E,j]=w.useState("medium"),[b,P]=w.useState(!1),[F,T]=w.useState(0),[l,p]=w.useState(null),C=w.useCallback(async()=>{P(!0),p(null),T(0);try{const n=new Image;await new Promise((B,v)=>{n.onload=()=>B(),n.onerror=()=>v(new Error("Failed to load")),n.src=M}),T(20);const u=n.naturalWidth,i=n.naturalHeight,A=document.createElement("canvas");A.width=u,A.height=i;const x=A.getContext("2d");x.drawImage(n,0,0);const g=x.getImageData(0,0,u,i).data,N=new Float64Array(u*i);for(let B=0;B<u*i;B++)N[B]=.299*g[B*4]+.587*g[B*4+1]+.114*g[B*4+2];T(40);const c=Math.floor((E==="low"?3:E==="medium"?5:7)/2),D=new Float64Array(u*i);for(let B=0;B<i;B++)for(let v=0;v<u;v++){let y=0,U=0;for(let $=-c;$<=c;$++)for(let X=-c;X<=c;X++){const H=B+$,_=v+X;H>=0&&H<i&&_>=0&&_<u&&(y+=N[H*u+_],U++)}D[B*u+v]=y/U}T(70);const f=new Float64Array(u*i);for(let B=0;B<u*i;B++)f[B]=N[B]-D[B];const S=32,h=Math.floor(u/S),a=Math.floor(i/S),d=[];for(let B=0;B<a;B++)for(let v=0;v<h;v++){const y=[];for(let X=0;X<S;X++)for(let H=0;H<S;H++)y.push(f[(B*S+X)*u+(v*S+H)]);const U=y.reduce((X,H)=>X+H,0)/y.length,$=y.reduce((X,H)=>X+(H-U)**2,0)/y.length;d.push($)}const r=d.reduce((B,v)=>B+v,0)/d.length,t=Math.sqrt(d.reduce((B,v)=>B+(v-r)**2,0)/d.length),m=r>0?Math.min(100,t/r*100):0,s=100-m,L=m>30;p({hasFingerprint:L,consistency:m,uniformity:s}),T(90);const R=document.createElement("canvas");R.width=u,R.height=i;const q=R.getContext("2d"),O=q.createImageData(u,i);let z=1/0,Y=-1/0;for(let B=0;B<f.length;B++)f[B]<z&&(z=f[B]),f[B]>Y&&(Y=f[B]);const W=Y-z||1;for(let B=0;B<u*i;B++){const v=(f[B]-z)/W*255,y=B*4,U=Math.min(255,v*3);O.data[y]=U,O.data[y+1]=U,O.data[y+2]=U,O.data[y+3]=255}q.putImageData(O,0,0),k&&k(R),T(100),p({hasFingerprint:L,consistency:m,uniformity:s})}catch(n){console.error("[PRNU] Analysis failed:",n)}finally{P(!1)}},[M,E,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(K,{value:E,onChange:n=>j(n),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx(G,{label:"Extract PRNU",onClick:C,isAnalysing:b}),b&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${F}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},de=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(6),[b,P]=w.useState(!1),[F,T]=w.useState(null),l=w.useCallback(async()=>{P(!0),T(null);try{const p=new Image;await new Promise((h,a)=>{p.onload=()=>h(),p.onerror=()=>a(new Error("Failed to load")),p.src=M});const C=p.naturalWidth,n=p.naturalHeight,u=document.createElement("canvas");u.width=C,u.height=n;const i=u.getContext("2d");i.drawImage(p,0,0);const x=i.getImageData(0,0,C,n).data,o=200+(10-E)*5,g=[],N=16;for(let h=0;h<Math.floor(n/N);h++)for(let a=0;a<Math.floor(C/N);a++){let d=0,r=0,t=0;for(let m=0;m<N;m++)for(let s=0;s<N;s++){const L=a*N+s,R=h*N+m,q=(R*C+L)*4,O=Math.max(x[q],x[q+1],x[q+2]);O>d&&(d=O,r=L,t=R)}d>o&&g.push({x:r,y:t,intensity:d})}const I=[];for(const h of g){let a=0,d=0;const r=10;for(let m=-r;m<=r;m++)for(let s=-r;s<=r;s++){const L=h.x+s,R=h.y+m;if(L<0||L>=C||R<0||R>=n)continue;const q=(R*C+L)*4,O=.299*x[q]+.587*x[q+1]+.114*x[q+2];a+=s*O,d+=m*O}const t=Math.atan2(d,a);I.push(t)}let c=0,D=0;if(I.length>1){const h=I.reduce((a,d)=>a+d,0)/I.length;for(const a of I){const d=Math.abs(a-h);d<Math.PI/4||d>Math.PI*7/4?c++:D++}}T({highlights:g.length,consistent:c,inconsistent:D});const f=document.createElement("canvas");f.width=C,f.height=n;const S=f.getContext("2d");S.drawImage(p,0,0),g.forEach((h,a)=>{const d=a<I.length&&(()=>{const r=I.reduce((m,s)=>m+s,0)/I.length,t=Math.abs(I[a]-r);return t<Math.PI/4||t>Math.PI*7/4})();if(S.beginPath(),S.arc(h.x,h.y,12,0,Math.PI*2),S.strokeStyle=d?"#fbbf24":"#ef4444",S.lineWidth=2,S.stroke(),a<I.length){const r=I[a],t=25;S.beginPath(),S.moveTo(h.x,h.y),S.lineTo(h.x+Math.cos(r)*t,h.y+Math.sin(r)*t),S.strokeStyle=d?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",S.lineWidth=2,S.stroke()}}),k&&k(f),T({highlights:g.length,consistent:c,inconsistent:D})}catch(p){console.error("[Highlight] Analysis failed:",p)}finally{P(!1)}},[M,E,k]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",E]}),e.jsx(V,{min:1,max:10,value:E,onChange:p=>j(Number(p.target.value))})]}),e.jsx(G,{label:"Detect Highlights",onClick:l,isAnalysing:b}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:F.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[F.consistent," / ",F.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${F.inconsistent>F.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:F.inconsistent>F.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},ge=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(!1),[b,P]=w.useState(null),F=w.useCallback(async()=>{j(!0),P(null);try{const T=new Image;await new Promise((a,d)=>{T.onload=()=>a(),T.onerror=()=>d(new Error("Failed to load")),T.src=M});const l=T.naturalWidth,p=T.naturalHeight,C=document.createElement("canvas");C.width=l,C.height=p;const n=C.getContext("2d");n.drawImage(T,0,0);const i=n.getImageData(0,0,l,p).data,A=new Float64Array(l*p),x=new Float64Array(l*p),o=new Float64Array(l*p);for(let a=0;a<l*p;a++)A[a]=i[a*4],x[a]=i[a*4+1],o[a]=i[a*4+2];const g=[];for(let a=2;a<p-2;a+=4)for(let d=2;d<l-2;d+=4){const r=R=>.299*A[R]+.587*x[R]+.114*o[R],t=a*l+d,m=-r(t-l-1)+r(t-l+1)-2*r(t-1)+2*r(t+1)-r(t+l-1)+r(t+l+1),s=-r(t-l-1)-2*r(t-l)-r(t-l+1)+r(t+l-1)+2*r(t+l)+r(t+l+1),L=Math.sqrt(m*m+s*s);L>100&&g.push({x:d,y:a,strength:L})}let N=0;const I=[];for(const a of g.slice(0,200)){const d=Y=>{const W=a.y*l+a.x,B=-Y[W-l-1]+Y[W-l+1]-2*Y[W-1]+2*Y[W+1]-Y[W+l-1]+Y[W+l+1],v=-Y[W-l-1]-2*Y[W-l]-Y[W-l+1]+Y[W+l-1]+2*Y[W+l]+Y[W+l+1];return{gx:B,gy:v,mag:Math.sqrt(B*B+v*v)}},r=d(A),t=d(x),m=d(o),s=Math.atan2(r.gy,r.gx),L=Math.atan2(t.gy,t.gx),R=Math.atan2(m.gy,m.gx),q=Math.abs(s-L),O=Math.abs(R-L),z=(q+O)/2;N+=z,I.push({x:a.x,y:a.y,sep:z})}const c=g.length>0?N/Math.min(g.length,200):0,D=c>.05,f=document.createElement("canvas");f.width=l,f.height=p;const S=f.getContext("2d"),h=S.createImageData(l,p);for(let a=0;a<l*p;a++){const d=a*4;h.data[d]=Math.min(255,Math.abs(A[a]-x[a])*5),h.data[d+1]=Math.min(255,Math.abs(x[a]-o[a])*5),h.data[d+2]=Math.min(255,Math.abs(o[a]-A[a])*5),h.data[d+3]=255}S.putImageData(h,0,0);for(const a of I)S.beginPath(),S.arc(a.x,a.y,3,0,Math.PI*2),S.fillStyle=a.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",S.fill();k&&k(f),P({avgSeparation:c*100,detected:D,edgesAnalysed:Math.min(g.length,200)})}catch(T){console.error("[Aberration] Analysis failed:",T)}finally{j(!1)}},[M,k]);return e.jsxs("div",{children:[e.jsx(G,{label:"Check for Aberration",onClick:F,isAnalysing:E}),b&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[b.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:b.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${b.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:b.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},he=({targetImage:M,onResult:k})=>{const[E,j]=w.useState(!0),[b,P]=w.useState(!1),[F,T]=w.useState(null),l=w.useCallback(async()=>{P(!0),T(null);try{const p=new Image;await new Promise((r,t)=>{p.onload=()=>r(),p.onerror=()=>t(new Error("Failed to load")),p.src=M});const C=p.naturalWidth,n=p.naturalHeight,u=document.createElement("canvas");u.width=C,u.height=n;const i=u.getContext("2d");i.drawImage(p,0,0);const A=i.getImageData(0,0,C,n).data,x=8,o=Math.floor(C/x),g=Math.floor(n/x),N=[];for(let r=0;r<g;r++)for(let t=0;t<o;t++){let m=0,s=0;if(t<o-1)for(let L=0;L<x;L++){const q=((r*x+L)*C+(t+1)*x-1)*4,O=q+4;m+=Math.abs(A[q]-A[O])+Math.abs(A[q+1]-A[O+1])+Math.abs(A[q+2]-A[O+2]),s++}if(r<g-1)for(let L=0;L<x;L++){const R=t*x+L,q=(r+1)*x-1,O=q+1,z=(q*C+R)*4,Y=(O*C+R)*4;m+=Math.abs(A[z]-A[Y])+Math.abs(A[z+1]-A[Y+1])+Math.abs(A[z+2]-A[Y+2]),s++}N.push(s>0?m/(s*3):0)}const I=N.reduce((r,t)=>r+t,0)/N.length,c=Math.sqrt(N.reduce((r,t)=>r+(t-I)**2,0)/N.length);let D=0;for(const r of N)Math.abs(r-I)>c*2&&D++;const f=Math.max(10,Math.min(100,100-I*2)),S=D>o*g*.1?2:1,h=document.createElement("canvas");h.width=C,h.height=n;const a=h.getContext("2d");a.drawImage(p,0,0);const d=Math.max(...N);for(let r=0;r<g;r++)for(let t=0;t<o;t++){const m=d>0?N[r*o+t]/d:0,s=m<.33?0:m<.66?200:220,L=m<.33||m<.66?180:50;a.fillStyle=`rgba(${s},${L},0,0.3)`,a.fillRect(t*x,r*x,x,x),E&&(a.strokeStyle="rgba(255,255,255,0.08)",a.lineWidth=.5,a.strokeRect(t*x,r*x,x,x))}k&&k(h),T({quality:f,layers:S,inconsistent:D})}catch(p){console.error("[Compression]",p)}finally{P(!1)}},[M,E,k]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:E,onChange:p=>j(p.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx(G,{label:"Analyse Compression",onClick:l,isAnalysing:b}),F&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[F.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:F.layers})]})]}),e.jsx("div",{className:`tool-verdict ${F.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:F.layers>1?`⚠️ Multiple re-compressions (${F.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},me=({targetImage:M})=>{const[k,E]=w.useState(!1),[j,b]=w.useState(null),P=w.useCallback(async()=>{var l;E(!0),b(null);try{const p=new Image;await new Promise((s,L)=>{p.onload=()=>s(),p.onerror=()=>L(),p.src=M});const C=M,n=C.startsWith("data:"),u=C.startsWith("blob:"),i=!n&&!u?new URL(C):null,A=i?i.pathname.split("/").pop()||"unknown":"embedded",x=((l=A.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let o="",g="",N="";try{const s=await fetch(M,{method:"HEAD",mode:"cors"});o=s.headers.get("content-type")||"",g=s.headers.get("content-length")||"",N=s.headers.get("last-modified")||""}catch{}const I=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],c=C.toLowerCase(),D=I.some(s=>c.includes(s)),S=i?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(s=>i.hostname.includes(s)):!1,h={Source:n?"Data URL (embedded)":u?"Blob URL (local)":(i==null?void 0:i.hostname)||"Unknown",Filename:A,Format:o||x.toUpperCase(),Dimensions:`${p.naturalWidth} × ${p.naturalHeight}`},a={"Aspect Ratio":(p.naturalWidth/p.naturalHeight).toFixed(2),"Total Pixels":`${(p.naturalWidth*p.naturalHeight/1e6).toFixed(1)} MP`};g&&(a["File Size"]=`${(parseInt(g)/1024).toFixed(1)} KB`);const d={};N&&(d["Last Modified"]=N);const r={};D&&(r["AI Indicator"]="⚠️ AI-related keywords found in URL"),S&&(r.Hosting="⚠️ Known AI image hosting platform");let t="authentic",m="✅ No suspicious metadata detected";D||S?(t="ai",m="❌ AI generation indicators detected in metadata"):(n||u)&&(t="suspicious",m="⚠️ Embedded/local image — limited metadata available"),b({camera:h,settings:a,dates:d,software:r,verdict:t,verdictText:m})}catch(p){console.error("[Metadata]",p)}finally{E(!1)}},[M]),F=()=>{if(!j)return;const l=JSON.stringify({...j.camera,...j.settings,...j.dates,...j.software},null,2);navigator.clipboard.writeText(l)},T=(l,p,C)=>Object.keys(C).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:p}),e.jsx("h4",{children:l})]}),Object.entries(C).map(([n,u])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:n}),e.jsx("span",{className:`metadata-value ${u.includes("Not found")?"metadata-missing":""}`,children:u})]},n))]});return e.jsxs("div",{children:[e.jsx(G,{label:"Extract Metadata",onClick:P,isAnalysing:k}),j&&e.jsxs("div",{className:"tool-output-area",children:[T("Image Information","📷",j.camera),T("Properties","⚙️",j.settings),T("Dates","📅",j.dates),T("Software & AI Detection","🖥️",j.software),e.jsx("div",{className:`tool-verdict ${j.verdict==="authentic"?"tool-verdict-safe":j.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:j.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:F,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})};async function pe(M){return M.startsWith("data:")||M.startsWith("blob:")?M:new Promise((k,E)=>{chrome.runtime.sendMessage({type:"FETCH_IMAGE_AS_DATA_URL",url:M},j=>{if(chrome.runtime.lastError){E(new Error(chrome.runtime.lastError.message));return}j!=null&&j.success&&j.dataUrl?k(j.dataUrl):E(new Error((j==null?void 0:j.error)||"Failed to fetch image via background"))})})}const ue=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ne},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:re},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:se},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:ie},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:le},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ce},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:de},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:ge},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:he},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:me}],xe=({targetImage:M,onBack:k,onMaximize:E})=>{var x;const[j,b]=w.useState(null),[P,F]=w.useState(null),[T,l]=w.useState(50),[p,C]=w.useState("ltr"),n=w.useRef(null),[u,i]=w.useState(null);w.useEffect(()=>{let o=!1;return i(null),pe(M).then(g=>{o||i(g)}).catch(g=>{console.error("[ForensicToolsPanel] Failed to fetch image:",g),o||i(M)}),()=>{o=!0}},[M]);const A=w.useCallback((o,g)=>{b(o.toDataURL()),F(g)},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:k,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>E(j||M,P||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:n,children:[e.jsx("img",{src:u||M,alt:"Original",className:"comparison-image"}),j&&e.jsx("div",{className:"comparison-overlay",style:{width:`${p==="ltr"?T:100-T}%`,left:p==="ltr"?0:"auto",right:p==="rtl"?0:"auto",borderRight:p==="ltr"?"2px solid #fff":"none",borderLeft:p==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:j,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:p==="ltr"?0:"auto",right:p==="rtl"?0:"auto",width:((x=n.current)==null?void 0:x.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),j&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${T}%`}})]}),j&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{b(null),F(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:T,onChange:o=>l(Number(o.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>C(o=>o==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!j&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),!u&&e.jsx("div",{style:{textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.7)"},children:e.jsx("div",{className:"tool-loading",style:{display:"inline-block",padding:"8px 20px",borderRadius:"8px",background:"rgba(255,255,255,0.1)"},children:"Preparing image for analysis..."})}),u&&e.jsx("div",{className:"forensic-tools-grid",children:ue.map((o,g)=>e.jsx(oe,{icon:o.icon,title:o.title,description:o.desc,tier:o.tier,index:g,children:e.jsx(o.Component,{targetImage:u,onResult:N=>A(N,o.title)})},o.title))})]})},be=({image:M,title:k,onClose:E})=>{const[j,b]=w.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[P,F]=w.useState(!1),[T,l]=w.useState(!1),[p,C]=w.useState({scale:1,x:0,y:0}),[n,u]=w.useState(!1),i=w.useRef({x:0,y:0}),A=w.useRef({x:0,y:0,width:0,height:0}),x=w.useRef({x:0,y:0,imgX:0,imgY:0}),o=w.useRef(null),g=c=>{c.target===c.currentTarget&&(F(!0),i.current={x:c.clientX-j.x,y:c.clientY-j.y})},N=c=>{c.stopPropagation(),l(!0),A.current={x:c.clientX,y:c.clientY,width:j.width,height:j.height}},I=c=>{c.preventDefault(),u(!0),x.current={x:c.clientX,y:c.clientY,imgX:p.x,imgY:p.y}};return w.useEffect(()=>{const c=f=>{if(P&&b(S=>({...S,x:f.clientX-i.current.x,y:f.clientY-i.current.y})),T){const S=f.clientX-A.current.x,h=f.clientY-A.current.y;b(a=>({...a,width:Math.max(400,A.current.width+S),height:Math.max(300,A.current.height+h)}))}if(n){const S=f.clientX-x.current.x,h=f.clientY-x.current.y;C(a=>({...a,x:x.current.imgX+S,y:x.current.imgY+h}))}},D=()=>{F(!1),l(!1),u(!1)};return(P||T||n)&&(window.addEventListener("mousemove",c),window.addEventListener("mouseup",D)),()=>{window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",D)}},[P,T,n]),w.useEffect(()=>{const c=o.current;if(!c)return;const D=d=>{d.preventDefault(),d.stopPropagation();const r=c.getBoundingClientRect(),t=d.clientX-r.left-r.width/2,m=d.clientY-r.top-r.height/2,L=-d.deltaY*.001;C(R=>{const q=Math.min(Math.max(.1,R.scale+L*R.scale*5),10);if(q===R.scale)return R;const O=q/R.scale,z=t-(t-R.x)*O,Y=m-(m-R.y)*O;return{scale:q,x:z,y:Y}})};let f=0;const S=d=>{d.touches.length===2&&(f=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY))},h=d=>{if(d.touches.length===2){d.preventDefault();const r=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY),t=(d.touches[0].clientX+d.touches[1].clientX)/2,m=(d.touches[0].clientY+d.touches[1].clientY)/2,s=c.getBoundingClientRect(),L=t-s.left-s.width/2,R=m-s.top-s.height/2;if(f>0){const O=(r-f)*.01;C(z=>{const Y=Math.min(Math.max(.1,z.scale+O*z.scale),10);if(Y===z.scale)return z;const W=Y/z.scale;return{scale:Y,x:L-(L-z.x)*W,y:R-(R-z.y)*W}})}f=r}},a=()=>{f=0};return c.addEventListener("wheel",D,{passive:!1}),c.addEventListener("touchstart",S,{passive:!1}),c.addEventListener("touchmove",h,{passive:!1}),c.addEventListener("touchend",a),()=>{c.removeEventListener("wheel",D),c.removeEventListener("touchstart",S),c.removeEventListener("touchmove",h),c.removeEventListener("touchend",a)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:j.x,top:j.y,width:j.width,height:j.height,zIndex:2147483647},children:e.jsxs(J,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:g,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[k," Result"]})]}),e.jsx("button",{onClick:E,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:o,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:I,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${p.x}px, ${p.y}px) scale(${p.scale})`,transition:n?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:M,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(p.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:N,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},fe=()=>{const[M,k]=w.useState("idle"),[E,j]=w.useState(null),[b,P]=w.useState(null),[F,T]=w.useState(null),[l,p]=w.useState(null),[C,n]=w.useState(null),[u,i]=w.useState(!1),A=w.useRef({x:0,y:0}),x=w.useRef(null);w.useEffect(()=>{const I=c=>{switch(c.type){case"SCANNING":k("scanning"),T(c.imageUrl||null),j(null),P(null);break;case"SHOW_RESULT":k("result"),j({isAI:c.isAI||!1,confidence:c.confidence||0,heatmapData:c.heatmapData,filterData:c.filterData});break;case"ERROR":k("error"),P(c.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(I),()=>chrome.runtime.onMessage.removeListener(I)},[]),w.useEffect(()=>{const I=D=>{if(!u||!x.current)return;let f=D.clientX-A.current.x,S=D.clientY-A.current.y;const h=x.current.getBoundingClientRect(),a=window.innerWidth,d=window.innerHeight,r=Math.max(0,a-h.width),t=Math.max(0,d-h.height);f=Math.max(0,Math.min(f,r)),S=Math.max(0,Math.min(S,t)),n({x:f,y:S})},c=()=>{i(!1)};return u&&(window.addEventListener("mousemove",I),window.addEventListener("mouseup",c)),()=>{window.removeEventListener("mousemove",I),window.removeEventListener("mouseup",c)}},[u]);const o=I=>{if(!x.current)return;const c=x.current.getBoundingClientRect(),D=c.left,f=c.top;A.current={x:I.clientX-D,y:I.clientY-f},C||n({x:D,y:f}),i(!0)},g=()=>{k("idle"),j(null),P(null),T(null),n(null),p(null)};if(M==="idle")return null;const N=M==="tools"?800:400;return e.jsxs(Q.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:C?0:20},children:e.jsx("div",{ref:x,className:"pointer-events-auto transition-shadow duration-300",style:C?{position:"absolute",left:C.x,top:C.y,boxShadow:u?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(J,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:N},children:[e.jsx("div",{onMouseDown:o,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${u?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:g,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[M==="scanning"&&e.jsxs("div",{className:"relative",children:[F&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:F,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),M==="result"&&E&&F&&e.jsx(ee,{result:E,targetImage:F,onToolsClick:()=>k("tools")}),M==="tools"&&F&&e.jsx(xe,{targetImage:F,onBack:()=>k("result"),onClose:g,onMaximize:(I,c)=>p({url:I,title:c})}),M==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:b})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),l&&e.jsx(be,{image:l.url,title:l.title,onClose:()=>p(null)})]})},we=`
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
`;function ve(M){const k=document.createElement("style");k.textContent=we,M.appendChild(k)}const ye=`

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
`;function ke(M){const k=document.createElement("style");k.textContent=ye,M.appendChild(k)}if(!document.getElementById("undiffused-root")){const M=document.createElement("div");M.id="undiffused-root",document.body.appendChild(M);const k=M.attachShadow({mode:"open"});ve(k),ke(k);const E=document.createElement("div");E.id="undiffused-app",k.appendChild(E);const j=document.createElement("div");j.id="undiffused-portal-root",Object.assign(j.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),k.appendChild(j),te.createRoot(E).render(e.jsx(fe,{})),console.log("[UnDiffused] Content script injected")}
