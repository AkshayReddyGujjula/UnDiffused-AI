import{r as y,j as e,a as Q,R as _,G as K,b as J,c as Z}from"./ResultView-BXWFaSCq.js";const ee=({icon:R,title:C,description:L,tier:T,index:u,children:q})=>{const[M,D]=y.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${u*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>D(!M),"aria-expanded":M,"aria-label":`${C} - ${L}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:R})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:C}),e.jsx("p",{className:"tool-card-desc",children:L})]}),e.jsx("div",{className:`tool-card-chevron ${M?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),T===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${M?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:q||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var te=Q();function V({value:R,onChange:C,options:L,placeholder:T="Select...",disabled:u=!1}){const[q,M]=y.useState(!1),D=y.useRef(null),l=y.useRef(null),[g,j]=y.useState({top:0,left:0,width:0}),a=y.useCallback(()=>{var f;const s=(f=D.current)==null?void 0:f.getRootNode();if(s&&s instanceof ShadowRoot){let S=s.querySelector("#undiffused-portal-root");return S||(S=document.createElement("div"),S.id="undiffused-portal-root",Object.assign(S.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),s.appendChild(S)),S}return document.body},[]),b=L.find(s=>s.value===R),i=s=>{C(s),M(!1)},w=()=>{if(!u)if(!q&&D.current){const s=D.current.getBoundingClientRect();j({top:s.bottom+6,left:s.left,width:s.width}),M(!0)}else M(!1)};y.useEffect(()=>{var S;if(!q)return;const s=A=>{var E,x;const c=A.target;(E=D.current)!=null&&E.contains(c)||(x=l.current)!=null&&x.contains(c)||M(!1)},f=((S=D.current)==null?void 0:S.getRootNode())||document;return f.addEventListener("mousedown",s),()=>f.removeEventListener("mousedown",s)},[q]),y.useEffect(()=>{if(!q)return;const s=()=>M(!1);return window.addEventListener("resize",s),window.addEventListener("scroll",s,{capture:!0}),()=>{window.removeEventListener("resize",s),window.removeEventListener("scroll",s,{capture:!0})}},[q]);const p=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:g.top,left:g.left,width:g.width,zIndex:2147483647,pointerEvents:"auto"},children:L.map(s=>e.jsxs("div",{className:`liquid-select-option ${s.value===R?"selected":""}`,onClick:()=>i(s.value),role:"option","aria-selected":s.value===R,children:[e.jsx("span",{children:s.label}),s.value===R&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(s.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:D,type:"button",className:`liquid-select-trigger ${q?"open":""} ${u?"opacity-50 cursor-not-allowed":""}`,onClick:w,disabled:u,"aria-haspopup":"listbox","aria-expanded":q,children:[e.jsx("span",{children:b?b.label:T}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),q&&te.createPortal(p,a())]})}const oe=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(85),[u,q]=y.useState("medium"),[M,D]=y.useState(!1),[l,g]=y.useState(null),j=u==="low"?10:u==="medium"?20:40,a=y.useCallback(async()=>{D(!0),g(null);try{const b=new Image;b.crossOrigin="anonymous",await new Promise((n,t)=>{b.onload=()=>n(),b.onerror=()=>t(new Error("Failed to load image")),b.src=R});const i=b.naturalWidth,w=b.naturalHeight,p=document.createElement("canvas");p.width=i,p.height=w;const s=p.getContext("2d");s.drawImage(b,0,0);const f=s.getImageData(0,0,i,w),S=document.createElement("canvas");S.width=i,S.height=w;const A=S.getContext("2d");A.drawImage(b,0,0);const c=S.toDataURL("image/jpeg",L/100),E=new Image;await new Promise(n=>{E.onload=()=>n(),E.src=c}),A.drawImage(E,0,0);const x=A.getImageData(0,0,i,w),N=document.createElement("canvas");N.width=i,N.height=w;const h=N.getContext("2d"),o=h.createImageData(i,w);let d=0;for(let n=0;n<f.data.length;n+=4){const t=Math.abs(f.data[n]-x.data[n]),m=Math.abs(f.data[n+1]-x.data[n+1]),r=Math.abs(f.data[n+2]-x.data[n+2]);d+=t+m+r;const I=Math.min(255,t*j),F=Math.min(255,m*j),B=Math.min(255,r*j),O=(I+F+B)/3;O<64?(o.data[n]=0,o.data[n+1]=0,o.data[n+2]=Math.min(255,O*4)):O<128?(o.data[n]=0,o.data[n+1]=Math.min(255,(O-64)*4),o.data[n+2]=255-(O-64)*4):O<192?(o.data[n]=Math.min(255,(O-128)*4),o.data[n+1]=255,o.data[n+2]=0):(o.data[n]=255,o.data[n+1]=255-(O-192)*4,o.data[n+2]=0),o.data[n+3]=255}h.putImageData(o,0,0),C&&C(N),g({diffScore:d/(i*w)})}catch(b){console.error("[ELA] Analysis failed:",b)}finally{D(!1)}},[R,L,j,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",L,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:L,onChange:b=>T(Number(b.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(V,{value:u,onChange:b=>q(b),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${M?"tool-loading":""} `,onClick:a,disabled:M,children:M?"Analysing...":"🔬 Analyse Error Levels"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},ae=({targetImage:R,onResult:C})=>{const[L,T]=y.useState("luminance"),[u,q]=y.useState(32),[M,D]=y.useState(!1),[l,g]=y.useState(null),j=y.useCallback(async()=>{D(!0),g(null);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((t,m)=>{a.onload=()=>t(),a.onerror=()=>m(new Error("Failed to load image")),a.src=R});const b=a.naturalWidth,i=a.naturalHeight,w=document.createElement("canvas");w.width=b,w.height=i;const p=w.getContext("2d");p.drawImage(a,0,0);const f=p.getImageData(0,0,b,i).data,S=t=>L==="chromatic"?(f[t]-f[t+1])*.5+128:.299*f[t]+.587*f[t+1]+.114*f[t+2],A=Math.floor(b/u),c=Math.floor(i/u),E=[];for(let t=0;t<c;t++)for(let m=0;m<A;m++){const r=[];for(let B=0;B<u;B++)for(let O=0;O<u;O++){const z=m*u+O,Y=t*u+B,W=(Y*b+z)*4,P=S(W);let v=0,k=0;for(const[X,U]of[[-1,0],[1,0],[0,-1],[0,1]]){const H=z+X,G=Y+U;H>=0&&H<b&&G>=0&&G<i&&(v+=S((G*b+H)*4),k++)}const $=P-v/k;r.push($)}const I=r.reduce((B,O)=>B+O,0)/r.length,F=r.reduce((B,O)=>B+(O-I)**2,0)/r.length;E.push(F)}const x=E.reduce((t,m)=>t+m,0)/E.length,N=Math.sqrt(E.reduce((t,m)=>t+(m-x)**2,0)/E.length),h=Math.max(0,100-N/x*100),o=document.createElement("canvas");o.width=b,o.height=i;const d=o.getContext("2d");d.globalAlpha=.3,d.drawImage(a,0,0),d.globalAlpha=1;const n=Math.max(...E);for(let t=0;t<c;t++)for(let m=0;m<A;m++){const r=E[t*A+m],I=n>0?r/n:0,F=Math.floor(255*(1-I)),B=Math.floor(255*I);d.fillStyle=`rgba(${F}, ${B}, 60, 0.5)`,d.fillRect(m*u,t*u,u,u),d.strokeStyle="rgba(255,255,255,0.1)",d.strokeRect(m*u,t*u,u,u)}C&&C(o),g({mean:x,std:N,uniformity:h})}catch(a){console.error("[Noise] Analysis failed:",a)}finally{D(!1)}},[R,L,u,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(V,{value:L,onChange:a=>T(a),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",u,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:u,onChange:a=>q(Number(a.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${M?"tool-loading":""}`,onClick:j,disabled:M,children:M?"Analysing...":"📡 Analyse Noise"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},ne=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(5),[u,q]=y.useState(32),[M,D]=y.useState(!1),[l,g]=y.useState(null),j=(i,w,p,s,f)=>{let S=0;const A=Math.max(1,Math.floor(f/8));for(let c=0;c<f;c+=A)for(let E=0;E<f;E+=A){const x=((s+c)*w+(p+E))*4,N=i[x]*.299+i[x+1]*.587+i[x+2]*.114;S=(S<<5)-S+Math.floor(N/(12-L))|0}return S},a=(i,w,p,s,f,S,A)=>{let c=0,E=0;const x=Math.max(1,Math.floor(A/16));for(let N=0;N<A;N+=x)for(let h=0;h<A;h+=x){const o=((s+N)*w+(p+h))*4,d=((S+N)*w+(f+h))*4;c+=Math.abs(i[o]-i[d]),c+=Math.abs(i[o+1]-i[d+1]),c+=Math.abs(i[o+2]-i[d+2]),E++}return 1-c/(E*3*255)},b=y.useCallback(async()=>{D(!0),g(null);try{const i=new Image;i.crossOrigin="anonymous",await new Promise((t,m)=>{i.onload=()=>t(),i.onerror=()=>m(new Error("Failed to load")),i.src=R});const w=i.naturalWidth,p=i.naturalHeight,s=document.createElement("canvas");s.width=w,s.height=p;const f=s.getContext("2d");f.drawImage(i,0,0);const S=f.getImageData(0,0,w,p),A=Math.max(u/2,8),c=new Map;for(let t=0;t+u<=p;t+=A)for(let m=0;m+u<=w;m+=A){const r=j(S.data,w,m,t,u);c.has(r)||c.set(r,[]),c.get(r).push({x:m,y:t})}const E=[],x=u*2,N=.85+(L-5)*.01;for(const[,t]of c)if(!(t.length<2||t.length>50))for(let m=0;m<t.length&&m<10;m++)for(let r=m+1;r<t.length&&r<10;r++){if(Math.sqrt((t[m].x-t[r].x)**2+(t[m].y-t[r].y)**2)<x)continue;const F=a(S.data,w,t[m].x,t[m].y,t[r].x,t[r].y,u);F>=N&&E.push({ax:t[m].x,ay:t[m].y,bx:t[r].x,by:t[r].y,sim:F})}const h=document.createElement("canvas");h.width=w,h.height=p;const o=h.getContext("2d");o.drawImage(i,0,0);const d=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],n=E.slice(0,30);n.forEach((t,m)=>{const r=d[m%d.length];o.strokeStyle=r,o.lineWidth=2,o.globalAlpha=.7,o.strokeRect(t.ax,t.ay,u,u),o.strokeRect(t.bx,t.by,u,u),o.fillStyle=r,o.globalAlpha=.15,o.fillRect(t.ax,t.ay,u,u),o.fillRect(t.bx,t.by,u,u),o.globalAlpha=.4,o.setLineDash([4,4]),o.beginPath(),o.moveTo(t.ax+u/2,t.ay+u/2),o.lineTo(t.bx+u/2,t.by+u/2),o.stroke(),o.setLineDash([]),o.globalAlpha=1}),C&&C(h),g(n.length)}catch(i){console.error("[Clone] Detection failed:",i)}finally{D(!1)}},[R,L,u,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",L]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:L,onChange:i=>T(Number(i.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",u,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:u,onChange:i=>q(Number(i.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${M?"tool-loading":""}`,onClick:b,disabled:M,children:M?"Detecting...":"🎯 Detect Clones"}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},se=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(1),[u,q]=y.useState(!1),[M,D]=y.useState(null),l=(j,a)=>{const b=j.length;if(b<=1)return[j,a];const i=b/2,w=new Float64Array(i),p=new Float64Array(i),s=new Float64Array(i),f=new Float64Array(i);for(let h=0;h<i;h++)w[h]=j[2*h],p[h]=a[2*h],s[h]=j[2*h+1],f[h]=a[2*h+1];const[S,A]=l(w,p),[c,E]=l(s,f),x=new Float64Array(b),N=new Float64Array(b);for(let h=0;h<i;h++){const o=-2*Math.PI*h/b,d=Math.cos(o),n=Math.sin(o),t=d*c[h]-n*E[h],m=d*E[h]+n*c[h];x[h]=S[h]+t,N[h]=A[h]+m,x[h+i]=S[h]-t,N[h+i]=A[h]-m}return[x,N]},g=y.useCallback(async()=>{q(!0),D(null);try{const j=new Image;j.crossOrigin="anonymous",await new Promise((r,I)=>{j.onload=()=>r(),j.onerror=()=>I(new Error("Failed to load image")),j.src=R});const a=512,b=document.createElement("canvas");b.width=a,b.height=a;const i=b.getContext("2d");i.drawImage(j,0,0,a,a);const p=i.getImageData(0,0,a,a).data,s=new Float64Array(a*a);for(let r=0;r<a*a;r++)s[r]=(p[r*4]*.299+p[r*4+1]*.587+p[r*4+2]*.114)/255;const f=new Float64Array(s),S=new Float64Array(a*a);for(let r=0;r<a;r++){const I=new Float64Array(a),F=new Float64Array(a);for(let z=0;z<a;z++)I[z]=f[r*a+z],F[z]=S[r*a+z];const[B,O]=l(I,F);for(let z=0;z<a;z++)f[r*a+z]=B[z],S[r*a+z]=O[z]}for(let r=0;r<a;r++){const I=new Float64Array(a),F=new Float64Array(a);for(let z=0;z<a;z++)I[z]=f[z*a+r],F[z]=S[z*a+r];const[B,O]=l(I,F);for(let z=0;z<a;z++)f[z*a+r]=B[z],S[z*a+r]=O[z]}const A=new Float64Array(a*a),c=a/2;let E=0;for(let r=0;r<a;r++)for(let I=0;I<a;I++){const F=f[r*a+I],B=S[r*a+I];let O=Math.sqrt(F*F+B*B);O=Math.log(1+O)*L;const z=(r+c)%a,Y=(I+c)%a,W=z*a+Y;A[W]=O,O>E&&(E=O)}const x=A[c*a+c],h=A[0]/E*100,o=x/E*100;let d=0;for(let r=1;r<4;r++){const I=c+r*(a/8);I<a&&A[c*a+I]>A[c*a+I-1]*1.5&&d++}const n=document.createElement("canvas");n.width=a,n.height=a;const t=n.getContext("2d"),m=t.createImageData(a,a);for(let r=0;r<a*a;r++){const I=E>0?A[r]/E*255:0,F=r*4;m.data[F]=Math.min(255,I*.8),m.data[F+1]=Math.min(255,I*.9),m.data[F+2]=Math.min(255,I),m.data[F+3]=255}t.putImageData(m,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let r=30;r<c;r+=30)t.beginPath(),t.arc(c,c,r,0,Math.PI*2),t.stroke();C&&C(n),D({highFreq:h,lowFreq:o,gridArtifacts:d>3})}catch(j){console.error("[FFT] Analysis failed:",j)}finally{q(!1)}},[R,L,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",L]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",step:"0.1",value:L,onChange:j=>T(Number(j.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${u?"tool-loading":""} `,onClick:g,disabled:u,children:u?"Analysing...":"🌊 Generate Spectrum"}),M&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[M.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[M.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:M.gridArtifacts?"#ef4444":"#10b981"},children:M.gridArtifacts?"Detected":"None"})]})]})]})]})},re=({targetImage:R,onResult:C})=>{const[L,T]=y.useState("sobel"),[u,q]=y.useState(100),[M,D]=y.useState(!1),[l,g]=y.useState(null),[j,a]=y.useState(0),b=y.useRef(null),i=y.useRef(null),w=y.useCallback(async()=>{D(!0),g(null);try{const p=new Image;p.crossOrigin="anonymous",await new Promise((v,k)=>{p.onload=()=>v(),p.onerror=()=>k(new Error("Failed to load")),p.src=R});const s=p.naturalWidth,f=p.naturalHeight,S=document.createElement("canvas");S.width=s,S.height=f;const A=S.getContext("2d");A.drawImage(p,0,0);const E=A.getImageData(0,0,s,f).data,x=new Float64Array(s*f);for(let v=0;v<s*f;v++){const k=v*4;x[v]=.299*E[k]+.587*E[k+1]+.114*E[k+2]}const N=new Float64Array(s*f),h=new Uint8Array(s*f);if(L==="sobel"||L==="canny")for(let v=1;v<f-1;v++)for(let k=1;k<s-1;k++){const $=-x[(v-1)*s+(k-1)]+x[(v-1)*s+(k+1)]-2*x[v*s+(k-1)]+2*x[v*s+(k+1)]-x[(v+1)*s+(k-1)]+x[(v+1)*s+(k+1)],X=-x[(v-1)*s+(k-1)]-2*x[(v-1)*s+k]-x[(v-1)*s+(k+1)]+x[(v+1)*s+(k-1)]+2*x[(v+1)*s+k]+x[(v+1)*s+(k+1)],U=Math.sqrt($*$+X*X);N[v*s+k]=U,h[v*s+k]=U>u?255:0}else for(let v=1;v<f-1;v++)for(let k=1;k<s-1;k++){const $=-4*x[v*s+k]+x[(v-1)*s+k]+x[(v+1)*s+k]+x[v*s+(k-1)]+x[v*s+(k+1)],X=Math.abs($);N[v*s+k]=X,h[v*s+k]=X>u/2?255:0}let o=0,d=0;const n=32,t=[];for(let v=0;v<s*f;v++)h[v]>0&&o++,d+=N[v];for(let v=0;v<Math.floor(f/n);v++)for(let k=0;k<Math.floor(s/n);k++){let $=0;for(let X=0;X<n;X++)for(let U=0;U<n;U++)$+=N[(v*n+X)*s+(k*n+U)];t.push($/(n*n))}const m=t.reduce((v,k)=>v+k,0)/t.length,r=Math.sqrt(t.reduce((v,k)=>v+(k-m)**2,0)/t.length),I=m>0?Math.max(0,100-r/m*50):0;g({edgeDensity:o/(s*f)*1e4,avgStrength:d/(s*f),uniformity:I});const F=document.createElement("canvas");F.width=s,F.height=f;const B=F.getContext("2d"),O=B.createImageData(s,f);for(let v=0;v<s*f;v++){const k=v*4;O.data[k]=O.data[k+1]=O.data[k+2]=h[v],O.data[k+3]=255}B.putImageData(O,0,0);const z=document.createElement("canvas");z.width=s,z.height=f;const Y=z.getContext("2d"),W=Y.createImageData(s,f),P=Math.max(...N);for(let v=0;v<s*f;v++){const k=v*4,$=P>0?N[v]/P:0;$<.25?(W.data[k]=0,W.data[k+1]=Math.floor($*4*255),W.data[k+2]=255):$<.5?(W.data[k]=0,W.data[k+1]=255,W.data[k+2]=Math.floor((1-($-.25)*4)*255)):$<.75?(W.data[k]=Math.floor(($-.5)*4*255),W.data[k+1]=255,W.data[k+2]=0):(W.data[k]=255,W.data[k+1]=Math.floor((1-($-.75)*4)*255),W.data[k+2]=0),W.data[k+3]=255}Y.putImageData(W,0,0),b.current=F,i.current=z,g({edgeDensity:o/(s*f)*1e4,avgStrength:d/(s*f),uniformity:I})}catch(p){console.error("[Gradient] Analysis failed:",p)}finally{D(!1)}},[R,L,u]);return _.useEffect(()=>{l&&C&&(j===0&&b.current?C(b.current):j===1&&i.current&&C(i.current))},[l,j,C]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(V,{value:L,onChange:p=>T(p),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",u]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:u,onChange:p=>q(Number(p.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${M?"tool-loading":""}`,onClick:w,disabled:M,children:M?"Analysing...":"📐 Analyse Gradients"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${j===0?"tool-tab-active":""}`,onClick:()=>a(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${j===1?"tool-tab-active":""}`,onClick:()=>a(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},ie=({targetImage:R,onResult:C})=>{const[L,T]=y.useState("medium"),[u,q]=y.useState(!1),[M,D]=y.useState(0),[l,g]=y.useState(null),j=y.useCallback(async()=>{q(!0),g(null),D(0);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((P,v)=>{a.onload=()=>P(),a.onerror=()=>v(new Error("Failed to load")),a.src=R}),D(20);const b=a.naturalWidth,i=a.naturalHeight,w=document.createElement("canvas");w.width=b,w.height=i;const p=w.getContext("2d");p.drawImage(a,0,0);const f=p.getImageData(0,0,b,i).data,S=new Float64Array(b*i);for(let P=0;P<b*i;P++)S[P]=.299*f[P*4]+.587*f[P*4+1]+.114*f[P*4+2];D(40);const c=Math.floor((L==="low"?3:L==="medium"?5:7)/2),E=new Float64Array(b*i);for(let P=0;P<i;P++)for(let v=0;v<b;v++){let k=0,$=0;for(let X=-c;X<=c;X++)for(let U=-c;U<=c;U++){const H=P+X,G=v+U;H>=0&&H<i&&G>=0&&G<b&&(k+=S[H*b+G],$++)}E[P*b+v]=k/$}D(70);const x=new Float64Array(b*i);for(let P=0;P<b*i;P++)x[P]=S[P]-E[P];const N=32,h=Math.floor(b/N),o=Math.floor(i/N),d=[];for(let P=0;P<o;P++)for(let v=0;v<h;v++){const k=[];for(let U=0;U<N;U++)for(let H=0;H<N;H++)k.push(x[(P*N+U)*b+(v*N+H)]);const $=k.reduce((U,H)=>U+H,0)/k.length,X=k.reduce((U,H)=>U+(H-$)**2,0)/k.length;d.push(X)}const n=d.reduce((P,v)=>P+v,0)/d.length,t=Math.sqrt(d.reduce((P,v)=>P+(v-n)**2,0)/d.length),m=n>0?Math.min(100,t/n*100):0,r=100-m,I=m>30;g({hasFingerprint:I,consistency:m,uniformity:r}),D(90);const F=document.createElement("canvas");F.width=b,F.height=i;const B=F.getContext("2d"),O=B.createImageData(b,i);let z=1/0,Y=-1/0;for(let P=0;P<x.length;P++)x[P]<z&&(z=x[P]),x[P]>Y&&(Y=x[P]);const W=Y-z||1;for(let P=0;P<b*i;P++){const v=(x[P]-z)/W*255,k=P*4,$=Math.min(255,v*3);O.data[k]=$,O.data[k+1]=$,O.data[k+2]=$,O.data[k+3]=255}B.putImageData(O,0,0),C&&C(F),D(100),g({hasFingerprint:I,consistency:m,uniformity:r})}catch(a){console.error("[PRNU] Analysis failed:",a)}finally{q(!1)}},[R,L,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(V,{value:L,onChange:a=>T(a),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${u?"tool-loading":""}`,onClick:j,disabled:u,children:u?"Extracting PRNU...":"📷 Extract PRNU"}),u&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${M}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},le=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(6),[u,q]=y.useState(!1),[M,D]=y.useState(null),l=y.useCallback(async()=>{q(!0),D(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((h,o)=>{g.onload=()=>h(),g.onerror=()=>o(new Error("Failed to load")),g.src=R});const j=g.naturalWidth,a=g.naturalHeight,b=document.createElement("canvas");b.width=j,b.height=a;const i=b.getContext("2d");i.drawImage(g,0,0);const p=i.getImageData(0,0,j,a).data,s=200+(10-L)*5,f=[],S=16;for(let h=0;h<Math.floor(a/S);h++)for(let o=0;o<Math.floor(j/S);o++){let d=0,n=0,t=0;for(let m=0;m<S;m++)for(let r=0;r<S;r++){const I=o*S+r,F=h*S+m,B=(F*j+I)*4,O=Math.max(p[B],p[B+1],p[B+2]);O>d&&(d=O,n=I,t=F)}d>s&&f.push({x:n,y:t,intensity:d})}const A=[];for(const h of f){let o=0,d=0;const n=10;for(let m=-n;m<=n;m++)for(let r=-n;r<=n;r++){const I=h.x+r,F=h.y+m;if(I<0||I>=j||F<0||F>=a)continue;const B=(F*j+I)*4,O=.299*p[B]+.587*p[B+1]+.114*p[B+2];o+=r*O,d+=m*O}const t=Math.atan2(d,o);A.push(t)}let c=0,E=0;if(A.length>1){const h=A.reduce((o,d)=>o+d,0)/A.length;for(const o of A){const d=Math.abs(o-h);d<Math.PI/4||d>Math.PI*7/4?c++:E++}}D({highlights:f.length,consistent:c,inconsistent:E});const x=document.createElement("canvas");x.width=j,x.height=a;const N=x.getContext("2d");N.drawImage(g,0,0),f.forEach((h,o)=>{const d=o<A.length&&(()=>{const n=A.reduce((m,r)=>m+r,0)/A.length,t=Math.abs(A[o]-n);return t<Math.PI/4||t>Math.PI*7/4})();if(N.beginPath(),N.arc(h.x,h.y,12,0,Math.PI*2),N.strokeStyle=d?"#fbbf24":"#ef4444",N.lineWidth=2,N.stroke(),o<A.length){const n=A[o],t=25;N.beginPath(),N.moveTo(h.x,h.y),N.lineTo(h.x+Math.cos(n)*t,h.y+Math.sin(n)*t),N.strokeStyle=d?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",N.lineWidth=2,N.stroke()}}),C&&C(x),D({highlights:f.length,consistent:c,inconsistent:E})}catch(g){console.error("[Highlight] Analysis failed:",g)}finally{q(!1)}},[R,L,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",L]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:L,onChange:g=>T(Number(g.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${u?"tool-loading":""}`,onClick:l,disabled:u,children:u?"Detecting...":"✨ Detect Highlights"}),M&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:M.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[M.consistent," / ",M.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${M.inconsistent>M.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:M.inconsistent>M.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},ce=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(!1),[u,q]=y.useState(null),M=y.useCallback(async()=>{T(!0),q(null);try{const D=new Image;D.crossOrigin="anonymous",await new Promise((o,d)=>{D.onload=()=>o(),D.onerror=()=>d(new Error("Failed to load")),D.src=R});const l=D.naturalWidth,g=D.naturalHeight,j=document.createElement("canvas");j.width=l,j.height=g;const a=j.getContext("2d");a.drawImage(D,0,0);const i=a.getImageData(0,0,l,g).data,w=new Float64Array(l*g),p=new Float64Array(l*g),s=new Float64Array(l*g);for(let o=0;o<l*g;o++)w[o]=i[o*4],p[o]=i[o*4+1],s[o]=i[o*4+2];const f=[];for(let o=2;o<g-2;o+=4)for(let d=2;d<l-2;d+=4){const n=F=>.299*w[F]+.587*p[F]+.114*s[F],t=o*l+d,m=-n(t-l-1)+n(t-l+1)-2*n(t-1)+2*n(t+1)-n(t+l-1)+n(t+l+1),r=-n(t-l-1)-2*n(t-l)-n(t-l+1)+n(t+l-1)+2*n(t+l)+n(t+l+1),I=Math.sqrt(m*m+r*r);I>100&&f.push({x:d,y:o,strength:I})}let S=0;const A=[];for(const o of f.slice(0,200)){const d=Y=>{const W=o.y*l+o.x,P=-Y[W-l-1]+Y[W-l+1]-2*Y[W-1]+2*Y[W+1]-Y[W+l-1]+Y[W+l+1],v=-Y[W-l-1]-2*Y[W-l]-Y[W-l+1]+Y[W+l-1]+2*Y[W+l]+Y[W+l+1];return{gx:P,gy:v,mag:Math.sqrt(P*P+v*v)}},n=d(w),t=d(p),m=d(s),r=Math.atan2(n.gy,n.gx),I=Math.atan2(t.gy,t.gx),F=Math.atan2(m.gy,m.gx),B=Math.abs(r-I),O=Math.abs(F-I),z=(B+O)/2;S+=z,A.push({x:o.x,y:o.y,sep:z})}const c=f.length>0?S/Math.min(f.length,200):0,E=c>.05,x=document.createElement("canvas");x.width=l,x.height=g;const N=x.getContext("2d"),h=N.createImageData(l,g);for(let o=0;o<l*g;o++){const d=o*4;h.data[d]=Math.min(255,Math.abs(w[o]-p[o])*5),h.data[d+1]=Math.min(255,Math.abs(p[o]-s[o])*5),h.data[d+2]=Math.min(255,Math.abs(s[o]-w[o])*5),h.data[d+3]=255}N.putImageData(h,0,0);for(const o of A)N.beginPath(),N.arc(o.x,o.y,3,0,Math.PI*2),N.fillStyle=o.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",N.fill();C&&C(x),q({avgSeparation:c*100,detected:E,edgesAnalysed:Math.min(f.length,200)})}catch(D){console.error("[Aberration] Analysis failed:",D)}finally{T(!1)}},[R,C]);return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${L?"tool-loading":""}`,onClick:M,disabled:L,children:L?"Checking...":"🌈 Check for Aberration"}),u&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[u.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:u.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${u.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:u.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},de=({targetImage:R,onResult:C})=>{const[L,T]=y.useState(!0),[u,q]=y.useState(!1),[M,D]=y.useState(null),l=y.useCallback(async()=>{q(!0),D(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((n,t)=>{g.onload=()=>n(),g.onerror=()=>t(new Error("Failed to load")),g.src=R});const j=g.naturalWidth,a=g.naturalHeight,b=document.createElement("canvas");b.width=j,b.height=a;const i=b.getContext("2d");i.drawImage(g,0,0);const w=i.getImageData(0,0,j,a).data,p=8,s=Math.floor(j/p),f=Math.floor(a/p),S=[];for(let n=0;n<f;n++)for(let t=0;t<s;t++){let m=0,r=0;if(t<s-1)for(let I=0;I<p;I++){const B=((n*p+I)*j+(t+1)*p-1)*4,O=B+4;m+=Math.abs(w[B]-w[O])+Math.abs(w[B+1]-w[O+1])+Math.abs(w[B+2]-w[O+2]),r++}if(n<f-1)for(let I=0;I<p;I++){const F=t*p+I,B=(n+1)*p-1,O=B+1,z=(B*j+F)*4,Y=(O*j+F)*4;m+=Math.abs(w[z]-w[Y])+Math.abs(w[z+1]-w[Y+1])+Math.abs(w[z+2]-w[Y+2]),r++}S.push(r>0?m/(r*3):0)}const A=S.reduce((n,t)=>n+t,0)/S.length,c=Math.sqrt(S.reduce((n,t)=>n+(t-A)**2,0)/S.length);let E=0;for(const n of S)Math.abs(n-A)>c*2&&E++;const x=Math.max(10,Math.min(100,100-A*2)),N=E>s*f*.1?2:1,h=document.createElement("canvas");h.width=j,h.height=a;const o=h.getContext("2d");o.drawImage(g,0,0);const d=Math.max(...S);for(let n=0;n<f;n++)for(let t=0;t<s;t++){const m=d>0?S[n*s+t]/d:0,r=m<.33?0:m<.66?200:220,I=m<.33||m<.66?180:50;o.fillStyle=`rgba(${r},${I},0,0.3)`,o.fillRect(t*p,n*p,p,p),L&&(o.strokeStyle="rgba(255,255,255,0.08)",o.lineWidth=.5,o.strokeRect(t*p,n*p,p,p))}C&&C(h),D({quality:x,layers:N,inconsistent:E})}catch(g){console.error("[Compression]",g)}finally{q(!1)}},[R,L,C]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:L,onChange:g=>T(g.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${u?"tool-loading":""}`,onClick:l,disabled:u,children:u?"Analysing...":"🔳 Analyse Compression"}),M&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[M.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:M.layers})]})]}),e.jsx("div",{className:`tool-verdict ${M.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:M.layers>1?`⚠️ Multiple re-compressions (${M.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},ge=({targetImage:R})=>{const[C,L]=y.useState(!1),[T,u]=y.useState(null),q=y.useCallback(async()=>{var l;L(!0),u(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((r,I)=>{g.onload=()=>r(),g.onerror=()=>I(),g.src=R});const j=R,a=j.startsWith("data:"),b=j.startsWith("blob:"),i=!a&&!b?new URL(j):null,w=i?i.pathname.split("/").pop()||"unknown":"embedded",p=((l=w.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let s="",f="",S="";try{const r=await fetch(R,{method:"HEAD",mode:"cors"});s=r.headers.get("content-type")||"",f=r.headers.get("content-length")||"",S=r.headers.get("last-modified")||""}catch{}const A=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],c=j.toLowerCase(),E=A.some(r=>c.includes(r)),N=i?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(r=>i.hostname.includes(r)):!1,h={Source:a?"Data URL (embedded)":b?"Blob URL (local)":(i==null?void 0:i.hostname)||"Unknown",Filename:w,Format:s||p.toUpperCase(),Dimensions:`${g.naturalWidth} × ${g.naturalHeight}`},o={"Aspect Ratio":(g.naturalWidth/g.naturalHeight).toFixed(2),"Total Pixels":`${(g.naturalWidth*g.naturalHeight/1e6).toFixed(1)} MP`};f&&(o["File Size"]=`${(parseInt(f)/1024).toFixed(1)} KB`);const d={};S&&(d["Last Modified"]=S);const n={};E&&(n["AI Indicator"]="⚠️ AI-related keywords found in URL"),N&&(n.Hosting="⚠️ Known AI image hosting platform");let t="authentic",m="✅ No suspicious metadata detected";E||N?(t="ai",m="❌ AI generation indicators detected in metadata"):(a||b)&&(t="suspicious",m="⚠️ Embedded/local image — limited metadata available"),u({camera:h,settings:o,dates:d,software:n,verdict:t,verdictText:m})}catch(g){console.error("[Metadata]",g)}finally{L(!1)}},[R]),M=()=>{if(!T)return;const l=JSON.stringify({...T.camera,...T.settings,...T.dates,...T.software},null,2);navigator.clipboard.writeText(l)},D=(l,g,j)=>Object.keys(j).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:g}),e.jsx("h4",{children:l})]}),Object.entries(j).map(([a,b])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:a}),e.jsx("span",{className:`metadata-value ${b.includes("Not found")?"metadata-missing":""}`,children:b})]},a))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${C?"tool-loading":""}`,onClick:q,disabled:C,children:C?"Extracting...":"📋 Extract Metadata"}),T&&e.jsxs("div",{className:"tool-output-area",children:[D("Image Information","📷",T.camera),D("Properties","⚙️",T.settings),D("Dates","📅",T.dates),D("Software & AI Detection","🖥️",T.software),e.jsx("div",{className:`tool-verdict ${T.verdict==="authentic"?"tool-verdict-safe":T.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:T.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:M,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},he=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:oe},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ae},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:ne},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:se},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:re},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ie},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:le},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:ce},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:de},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:ge}],me=({targetImage:R,onBack:C,onMaximize:L})=>{var i;const[T,u]=y.useState(null),[q,M]=y.useState(null),[D,l]=y.useState(50),[g,j]=y.useState("ltr"),a=y.useRef(null),b=y.useCallback((w,p)=>{u(w.toDataURL()),M(p)},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:C,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>L(T||R,q||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:a,children:[e.jsx("img",{src:R,alt:"Original",className:"comparison-image"}),T&&e.jsx("div",{className:"comparison-overlay",style:{width:`${g==="ltr"?D:100-D}%`,left:g==="ltr"?0:"auto",right:g==="rtl"?0:"auto",borderRight:g==="ltr"?"2px solid #fff":"none",borderLeft:g==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:T,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:g==="ltr"?0:"auto",right:g==="rtl"?0:"auto",width:((i=a.current)==null?void 0:i.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),T&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${D}%`}})]}),T&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{u(null),M(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:D,onChange:w=>l(Number(w.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>j(w=>w==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!T&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),e.jsx("div",{className:"forensic-tools-grid",children:he.map((w,p)=>e.jsx(ee,{icon:w.icon,title:w.title,description:w.desc,tier:w.tier,index:p,children:e.jsx(w.Component,{targetImage:R,onResult:s=>b(s,w.title)})},w.title))})]})},ue=({image:R,title:C,onClose:L})=>{const[T,u]=y.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[q,M]=y.useState(!1),[D,l]=y.useState(!1),[g,j]=y.useState({scale:1,x:0,y:0}),[a,b]=y.useState(!1),i=y.useRef({x:0,y:0}),w=y.useRef({x:0,y:0,width:0,height:0}),p=y.useRef({x:0,y:0,imgX:0,imgY:0}),s=y.useRef(null),f=c=>{c.target===c.currentTarget&&(M(!0),i.current={x:c.clientX-T.x,y:c.clientY-T.y})},S=c=>{c.stopPropagation(),l(!0),w.current={x:c.clientX,y:c.clientY,width:T.width,height:T.height}},A=c=>{c.preventDefault(),b(!0),p.current={x:c.clientX,y:c.clientY,imgX:g.x,imgY:g.y}};return y.useEffect(()=>{const c=x=>{if(q&&u(N=>({...N,x:x.clientX-i.current.x,y:x.clientY-i.current.y})),D){const N=x.clientX-w.current.x,h=x.clientY-w.current.y;u(o=>({...o,width:Math.max(400,w.current.width+N),height:Math.max(300,w.current.height+h)}))}if(a){const N=x.clientX-p.current.x,h=x.clientY-p.current.y;j(o=>({...o,x:p.current.imgX+N,y:p.current.imgY+h}))}},E=()=>{M(!1),l(!1),b(!1)};return(q||D||a)&&(window.addEventListener("mousemove",c),window.addEventListener("mouseup",E)),()=>{window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",E)}},[q,D,a]),y.useEffect(()=>{const c=s.current;if(!c)return;const E=d=>{d.preventDefault(),d.stopPropagation();const n=c.getBoundingClientRect(),t=d.clientX-n.left-n.width/2,m=d.clientY-n.top-n.height/2,I=-d.deltaY*.001;j(F=>{const B=Math.min(Math.max(.1,F.scale+I*F.scale*5),10);if(B===F.scale)return F;const O=B/F.scale,z=t-(t-F.x)*O,Y=m-(m-F.y)*O;return{scale:B,x:z,y:Y}})};let x=0;const N=d=>{d.touches.length===2&&(x=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY))},h=d=>{if(d.touches.length===2){d.preventDefault();const n=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY),t=(d.touches[0].clientX+d.touches[1].clientX)/2,m=(d.touches[0].clientY+d.touches[1].clientY)/2,r=c.getBoundingClientRect(),I=t-r.left-r.width/2,F=m-r.top-r.height/2;if(x>0){const O=(n-x)*.01;j(z=>{const Y=Math.min(Math.max(.1,z.scale+O*z.scale),10);if(Y===z.scale)return z;const W=Y/z.scale;return{scale:Y,x:I-(I-z.x)*W,y:F-(F-z.y)*W}})}x=n}},o=()=>{x=0};return c.addEventListener("wheel",E,{passive:!1}),c.addEventListener("touchstart",N,{passive:!1}),c.addEventListener("touchmove",h,{passive:!1}),c.addEventListener("touchend",o),()=>{c.removeEventListener("wheel",E),c.removeEventListener("touchstart",N),c.removeEventListener("touchmove",h),c.removeEventListener("touchend",o)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:T.x,top:T.y,width:T.width,height:T.height,zIndex:2147483647},children:e.jsxs(K,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:f,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[C," Result"]})]}),e.jsx("button",{onClick:L,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:s,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:A,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${g.x}px, ${g.y}px) scale(${g.scale})`,transition:a?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:R,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(g.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:S,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},pe=()=>{const[R,C]=y.useState("idle"),[L,T]=y.useState(null),[u,q]=y.useState(null),[M,D]=y.useState(null),[l,g]=y.useState(null),[j,a]=y.useState(null),[b,i]=y.useState(!1),w=y.useRef({x:0,y:0}),p=y.useRef(null);y.useEffect(()=>{const A=c=>{switch(c.type){case"SCANNING":C("scanning"),D(c.imageUrl||null),T(null),q(null);break;case"SHOW_RESULT":C("result"),T({isAI:c.isAI||!1,confidence:c.confidence||0,heatmapData:c.heatmapData,filterData:c.filterData});break;case"ERROR":C("error"),q(c.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(A),()=>chrome.runtime.onMessage.removeListener(A)},[]),y.useEffect(()=>{const A=E=>{if(!b||!p.current)return;let x=E.clientX-w.current.x,N=E.clientY-w.current.y;const h=p.current.getBoundingClientRect(),o=window.innerWidth,d=window.innerHeight,n=Math.max(0,o-h.width),t=Math.max(0,d-h.height);x=Math.max(0,Math.min(x,n)),N=Math.max(0,Math.min(N,t)),a({x,y:N})},c=()=>{i(!1)};return b&&(window.addEventListener("mousemove",A),window.addEventListener("mouseup",c)),()=>{window.removeEventListener("mousemove",A),window.removeEventListener("mouseup",c)}},[b]);const s=A=>{if(!p.current)return;const c=p.current.getBoundingClientRect(),E=c.left,x=c.top;w.current={x:A.clientX-E,y:A.clientY-x},j||a({x:E,y:x}),i(!0)},f=()=>{C("idle"),T(null),q(null),D(null),a(null),g(null)};if(R==="idle")return null;const S=R==="tools"?800:400;return e.jsxs(_.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:j?0:20},children:e.jsx("div",{ref:p,className:"pointer-events-auto transition-shadow duration-300",style:j?{position:"absolute",left:j.x,top:j.y,boxShadow:b?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(K,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:S},children:[e.jsx("div",{onMouseDown:s,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${b?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:f,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[R==="scanning"&&e.jsxs("div",{className:"relative",children:[M&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:M,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),R==="result"&&L&&M&&e.jsx(J,{result:L,targetImage:M,onToolsClick:()=>C("tools")}),R==="tools"&&M&&e.jsx(me,{targetImage:M,onBack:()=>C("result"),onClose:f,onMaximize:(A,c)=>g({url:A,title:c})}),R==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:u})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),l&&e.jsx(ue,{image:l.url,title:l.title,onClose:()=>g(null)})]})},xe=`
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
`;function be(R){const C=document.createElement("style");C.textContent=xe,R.appendChild(C)}const fe=`

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
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: toolCardEntry 0.4s ease-out both;
    position: relative;
}

.tool-card:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(56, 189, 248, 0.25);
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(56, 189, 248, 0.15);
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
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    margin: 0 0 2px 0;
    line-height: 1.3;
}

.tool-card-desc {
    font-size: 11px;
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
    color: #64748b;
    margin: 0;
}

/* ===== TOOL CONTROLS ===== */
.tool-control-group {
    margin-bottom: 12px;
}

.tool-control-label {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
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
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    border: none;
    /* Dark blue / Purple gradient */
    background: linear-gradient(135deg, #2563eb 0%, #9333ea 100%);
    color: #fff;
    font-size: 13px;
    font-weight: 700; /* Bolder text */
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    font-family: inherit;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.tool-analyse-btn:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 8px 20px rgba(147, 51, 234, 0.4);
    filter: brightness(1.1);
}

.tool-analyse-btn:active {
    transform: translateY(0) scale(0.98);
}

.tool-analyse-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
    font-weight: 500;
    color: #64748b;
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
    color: #94a3b8;
}

.metadata-value {
    font-size: 12px;
    color: #f1f5f9;
    font-weight: 500;
    text-align: right;
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
`;function we(R){const C=document.createElement("style");C.textContent=fe,R.appendChild(C)}if(!document.getElementById("undiffused-root")){const R=document.createElement("div");R.id="undiffused-root",document.body.appendChild(R);const C=R.attachShadow({mode:"open"});be(C),we(C);const L=document.createElement("div");L.id="undiffused-app",C.appendChild(L);const T=document.createElement("div");T.id="undiffused-portal-root",Object.assign(T.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),C.appendChild(T),Z.createRoot(L).render(e.jsx(pe,{})),console.log("[UnDiffused] Content script injected")}
