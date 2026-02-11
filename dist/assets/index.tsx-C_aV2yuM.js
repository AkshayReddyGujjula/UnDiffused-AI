import{r as v,j as e,a as J,R as K,G as Q,b as Z,c as ee}from"./ResultView-BXWFaSCq.js";const te=({icon:T,title:C,description:I,tier:L,index:f,children:q})=>{const[R,D]=v.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${f*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>D(!R),"aria-expanded":R,"aria-label":`${C} - ${I}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:T})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:C}),e.jsx("p",{className:"tool-card-desc",children:I})]}),e.jsx("div",{className:`tool-card-chevron ${R?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),L===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${R?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:q||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var oe=J();function _({value:T,onChange:C,options:I,placeholder:L="Select...",disabled:f=!1}){const[q,R]=v.useState(!1),D=v.useRef(null),l=v.useRef(null),[g,j]=v.useState({top:0,left:0,width:0}),a=v.useCallback(()=>{var b;const s=(b=D.current)==null?void 0:b.getRootNode();if(s&&s instanceof ShadowRoot){let S=s.querySelector("#undiffused-portal-root");return S||(S=document.createElement("div"),S.id="undiffused-portal-root",Object.assign(S.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),s.appendChild(S)),S}return document.body},[]),x=I.find(s=>s.value===T),i=s=>{C(s),R(!1)},w=()=>{if(!f)if(!q&&D.current){const s=D.current.getBoundingClientRect();j({top:s.bottom+6,left:s.left,width:s.width}),R(!0)}else R(!1)};v.useEffect(()=>{var S;if(!q)return;const s=M=>{var E,u;const c=M.target;(E=D.current)!=null&&E.contains(c)||(u=l.current)!=null&&u.contains(c)||R(!1)},b=((S=D.current)==null?void 0:S.getRootNode())||document;return b.addEventListener("mousedown",s),()=>b.removeEventListener("mousedown",s)},[q]),v.useEffect(()=>{if(!q)return;const s=()=>R(!1);return window.addEventListener("resize",s),window.addEventListener("scroll",s,{capture:!0}),()=>{window.removeEventListener("resize",s),window.removeEventListener("scroll",s,{capture:!0})}},[q]);const p=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:g.top,left:g.left,width:g.width,zIndex:2147483647,pointerEvents:"auto"},children:I.map(s=>e.jsxs("div",{className:`liquid-select-option ${s.value===T?"selected":""}`,onClick:()=>i(s.value),role:"option","aria-selected":s.value===T,children:[e.jsx("span",{children:s.label}),s.value===T&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(s.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:D,type:"button",className:`liquid-select-trigger ${q?"open":""} ${f?"opacity-50 cursor-not-allowed":""}`,onClick:w,disabled:f,"aria-haspopup":"listbox","aria-expanded":q,children:[e.jsx("span",{children:x?x.label:L}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),q&&oe.createPortal(p,a())]})}const G=({label:T,onClick:C,isAnalysing:I=!1,disabled:L=!1,onHelpClick:f})=>e.jsxs("div",{className:"tool-action-row",children:[e.jsx("button",{className:`tool-analyse-btn ${I?"tool-loading":""}`,onClick:C,disabled:L||I,children:I?"Analysing...":T}),e.jsx("button",{className:"tool-help-btn",onClick:f,title:"How does this tool work?",children:e.jsx("span",{className:"tool-help-icon",children:"?"})})]}),ae=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(85),[f,q]=v.useState("medium"),[R,D]=v.useState(!1),[l,g]=v.useState(null),j=f==="low"?10:f==="medium"?20:40,a=v.useCallback(async()=>{D(!0),g(null);try{const x=new Image;x.crossOrigin="anonymous",await new Promise((n,t)=>{x.onload=()=>n(),x.onerror=()=>t(new Error("Failed to load image")),x.src=T});const i=x.naturalWidth,w=x.naturalHeight,p=document.createElement("canvas");p.width=i,p.height=w;const s=p.getContext("2d");s.drawImage(x,0,0);const b=s.getImageData(0,0,i,w),S=document.createElement("canvas");S.width=i,S.height=w;const M=S.getContext("2d");M.drawImage(x,0,0);const c=S.toDataURL("image/jpeg",I/100),E=new Image;await new Promise(n=>{E.onload=()=>n(),E.src=c}),M.drawImage(E,0,0);const u=M.getImageData(0,0,i,w),N=document.createElement("canvas");N.width=i,N.height=w;const h=N.getContext("2d"),o=h.createImageData(i,w);let d=0;for(let n=0;n<b.data.length;n+=4){const t=Math.abs(b.data[n]-u.data[n]),m=Math.abs(b.data[n+1]-u.data[n+1]),r=Math.abs(b.data[n+2]-u.data[n+2]);d+=t+m+r;const A=Math.min(255,t*j),F=Math.min(255,m*j),B=Math.min(255,r*j),O=(A+F+B)/3;O<64?(o.data[n]=0,o.data[n+1]=0,o.data[n+2]=Math.min(255,O*4)):O<128?(o.data[n]=0,o.data[n+1]=Math.min(255,(O-64)*4),o.data[n+2]=255-(O-64)*4):O<192?(o.data[n]=Math.min(255,(O-128)*4),o.data[n+1]=255,o.data[n+2]=0):(o.data[n]=255,o.data[n+1]=255-(O-192)*4,o.data[n+2]=0),o.data[n+3]=255}h.putImageData(o,0,0),C&&C(N),g({diffScore:d/(i*w)})}catch(x){console.error("[ELA] Analysis failed:",x)}finally{D(!1)}},[T,I,j,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",I,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:I,onChange:x=>L(Number(x.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(_,{value:f,onChange:x=>q(x),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx(G,{label:"Analyse Error Levels",onClick:a,isAnalysing:R}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},ne=({targetImage:T,onResult:C})=>{const[I,L]=v.useState("luminance"),[f,q]=v.useState(32),[R,D]=v.useState(!1),[l,g]=v.useState(null),j=v.useCallback(async()=>{D(!0),g(null);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((t,m)=>{a.onload=()=>t(),a.onerror=()=>m(new Error("Failed to load image")),a.src=T});const x=a.naturalWidth,i=a.naturalHeight,w=document.createElement("canvas");w.width=x,w.height=i;const p=w.getContext("2d");p.drawImage(a,0,0);const b=p.getImageData(0,0,x,i).data,S=t=>I==="chromatic"?(b[t]-b[t+1])*.5+128:.299*b[t]+.587*b[t+1]+.114*b[t+2],M=Math.floor(x/f),c=Math.floor(i/f),E=[];for(let t=0;t<c;t++)for(let m=0;m<M;m++){const r=[];for(let B=0;B<f;B++)for(let O=0;O<f;O++){const z=m*f+O,W=t*f+B,Y=(W*x+z)*4,P=S(Y);let y=0,k=0;for(const[$,X]of[[-1,0],[1,0],[0,-1],[0,1]]){const H=z+$,V=W+X;H>=0&&H<x&&V>=0&&V<i&&(y+=S((V*x+H)*4),k++)}const U=P-y/k;r.push(U)}const A=r.reduce((B,O)=>B+O,0)/r.length,F=r.reduce((B,O)=>B+(O-A)**2,0)/r.length;E.push(F)}const u=E.reduce((t,m)=>t+m,0)/E.length,N=Math.sqrt(E.reduce((t,m)=>t+(m-u)**2,0)/E.length),h=Math.max(0,100-N/u*100),o=document.createElement("canvas");o.width=x,o.height=i;const d=o.getContext("2d");d.globalAlpha=.3,d.drawImage(a,0,0),d.globalAlpha=1;const n=Math.max(...E);for(let t=0;t<c;t++)for(let m=0;m<M;m++){const r=E[t*M+m],A=n>0?r/n:0,F=Math.floor(255*(1-A)),B=Math.floor(255*A);d.fillStyle=`rgba(${F}, ${B}, 60, 0.5)`,d.fillRect(m*f,t*f,f,f),d.strokeStyle="rgba(255,255,255,0.1)",d.strokeRect(m*f,t*f,f,f)}C&&C(o),g({mean:u,std:N,uniformity:h})}catch(a){console.error("[Noise] Analysis failed:",a)}finally{D(!1)}},[T,I,f,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(_,{value:I,onChange:a=>L(a),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",f,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:f,onChange:a=>q(Number(a.target.value))})]}),e.jsx(G,{label:"Analyse Noise",onClick:j,isAnalysing:R}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},se=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(5),[f,q]=v.useState(32),[R,D]=v.useState(!1),[l,g]=v.useState(null),j=(i,w,p,s,b)=>{let S=0;const M=Math.max(1,Math.floor(b/8));for(let c=0;c<b;c+=M)for(let E=0;E<b;E+=M){const u=((s+c)*w+(p+E))*4,N=i[u]*.299+i[u+1]*.587+i[u+2]*.114;S=(S<<5)-S+Math.floor(N/(12-I))|0}return S},a=(i,w,p,s,b,S,M)=>{let c=0,E=0;const u=Math.max(1,Math.floor(M/16));for(let N=0;N<M;N+=u)for(let h=0;h<M;h+=u){const o=((s+N)*w+(p+h))*4,d=((S+N)*w+(b+h))*4;c+=Math.abs(i[o]-i[d]),c+=Math.abs(i[o+1]-i[d+1]),c+=Math.abs(i[o+2]-i[d+2]),E++}return 1-c/(E*3*255)},x=v.useCallback(async()=>{D(!0),g(null);try{const i=new Image;i.crossOrigin="anonymous",await new Promise((t,m)=>{i.onload=()=>t(),i.onerror=()=>m(new Error("Failed to load")),i.src=T});const w=i.naturalWidth,p=i.naturalHeight,s=document.createElement("canvas");s.width=w,s.height=p;const b=s.getContext("2d");b.drawImage(i,0,0);const S=b.getImageData(0,0,w,p),M=Math.max(f/2,8),c=new Map;for(let t=0;t+f<=p;t+=M)for(let m=0;m+f<=w;m+=M){const r=j(S.data,w,m,t,f);c.has(r)||c.set(r,[]),c.get(r).push({x:m,y:t})}const E=[],u=f*2,N=.85+(I-5)*.01;for(const[,t]of c)if(!(t.length<2||t.length>50))for(let m=0;m<t.length&&m<10;m++)for(let r=m+1;r<t.length&&r<10;r++){if(Math.sqrt((t[m].x-t[r].x)**2+(t[m].y-t[r].y)**2)<u)continue;const F=a(S.data,w,t[m].x,t[m].y,t[r].x,t[r].y,f);F>=N&&E.push({ax:t[m].x,ay:t[m].y,bx:t[r].x,by:t[r].y,sim:F})}const h=document.createElement("canvas");h.width=w,h.height=p;const o=h.getContext("2d");o.drawImage(i,0,0);const d=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],n=E.slice(0,30);n.forEach((t,m)=>{const r=d[m%d.length];o.strokeStyle=r,o.lineWidth=2,o.globalAlpha=.7,o.strokeRect(t.ax,t.ay,f,f),o.strokeRect(t.bx,t.by,f,f),o.fillStyle=r,o.globalAlpha=.15,o.fillRect(t.ax,t.ay,f,f),o.fillRect(t.bx,t.by,f,f),o.globalAlpha=.4,o.setLineDash([4,4]),o.beginPath(),o.moveTo(t.ax+f/2,t.ay+f/2),o.lineTo(t.bx+f/2,t.by+f/2),o.stroke(),o.setLineDash([]),o.globalAlpha=1}),C&&C(h),g(n.length)}catch(i){console.error("[Clone] Detection failed:",i)}finally{D(!1)}},[T,I,f,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",I]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:I,onChange:i=>L(Number(i.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",f,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:f,onChange:i=>q(Number(i.target.value))})]}),e.jsx(G,{label:"Detect Clones",onClick:x,isAnalysing:R}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},re=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(1),[f,q]=v.useState(!1),[R,D]=v.useState(null),l=(j,a)=>{const x=j.length;if(x<=1)return[j,a];const i=x/2,w=new Float64Array(i),p=new Float64Array(i),s=new Float64Array(i),b=new Float64Array(i);for(let h=0;h<i;h++)w[h]=j[2*h],p[h]=a[2*h],s[h]=j[2*h+1],b[h]=a[2*h+1];const[S,M]=l(w,p),[c,E]=l(s,b),u=new Float64Array(x),N=new Float64Array(x);for(let h=0;h<i;h++){const o=-2*Math.PI*h/x,d=Math.cos(o),n=Math.sin(o),t=d*c[h]-n*E[h],m=d*E[h]+n*c[h];u[h]=S[h]+t,N[h]=M[h]+m,u[h+i]=S[h]-t,N[h+i]=M[h]-m}return[u,N]},g=v.useCallback(async()=>{q(!0),D(null);try{const j=new Image;j.crossOrigin="anonymous",await new Promise((r,A)=>{j.onload=()=>r(),j.onerror=()=>A(new Error("Failed to load image")),j.src=T});const a=512,x=document.createElement("canvas");x.width=a,x.height=a;const i=x.getContext("2d");i.drawImage(j,0,0,a,a);const p=i.getImageData(0,0,a,a).data,s=new Float64Array(a*a);for(let r=0;r<a*a;r++)s[r]=(p[r*4]*.299+p[r*4+1]*.587+p[r*4+2]*.114)/255;const b=new Float64Array(s),S=new Float64Array(a*a);for(let r=0;r<a;r++){const A=new Float64Array(a),F=new Float64Array(a);for(let z=0;z<a;z++)A[z]=b[r*a+z],F[z]=S[r*a+z];const[B,O]=l(A,F);for(let z=0;z<a;z++)b[r*a+z]=B[z],S[r*a+z]=O[z]}for(let r=0;r<a;r++){const A=new Float64Array(a),F=new Float64Array(a);for(let z=0;z<a;z++)A[z]=b[z*a+r],F[z]=S[z*a+r];const[B,O]=l(A,F);for(let z=0;z<a;z++)b[z*a+r]=B[z],S[z*a+r]=O[z]}const M=new Float64Array(a*a),c=a/2;let E=0;for(let r=0;r<a;r++)for(let A=0;A<a;A++){const F=b[r*a+A],B=S[r*a+A];let O=Math.sqrt(F*F+B*B);O=Math.log(1+O)*I;const z=(r+c)%a,W=(A+c)%a,Y=z*a+W;M[Y]=O,O>E&&(E=O)}const u=M[c*a+c],h=M[0]/E*100,o=u/E*100;let d=0;for(let r=1;r<4;r++){const A=c+r*(a/8);A<a&&M[c*a+A]>M[c*a+A-1]*1.5&&d++}const n=document.createElement("canvas");n.width=a,n.height=a;const t=n.getContext("2d"),m=t.createImageData(a,a);for(let r=0;r<a*a;r++){const A=E>0?M[r]/E*255:0,F=r*4;m.data[F]=Math.min(255,A*.8),m.data[F+1]=Math.min(255,A*.9),m.data[F+2]=Math.min(255,A),m.data[F+3]=255}t.putImageData(m,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let r=30;r<c;r+=30)t.beginPath(),t.arc(c,c,r,0,Math.PI*2),t.stroke();C&&C(n),D({highFreq:h,lowFreq:o,gridArtifacts:d>3})}catch(j){console.error("[FFT] Analysis failed:",j)}finally{q(!1)}},[T,I,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",I]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",step:"0.1",value:I,onChange:j=>L(Number(j.target.value))})]}),e.jsx(G,{label:"Generate Spectrum",onClick:g,isAnalysing:f}),R&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[R.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[R.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:R.gridArtifacts?"#ef4444":"#10b981"},children:R.gridArtifacts?"Detected":"None"})]})]})]})]})},ie=({targetImage:T,onResult:C})=>{const[I,L]=v.useState("sobel"),[f,q]=v.useState(100),[R,D]=v.useState(!1),[l,g]=v.useState(null),[j,a]=v.useState(0),x=v.useRef(null),i=v.useRef(null),w=v.useCallback(async()=>{D(!0),g(null);try{const p=new Image;p.crossOrigin="anonymous",await new Promise((y,k)=>{p.onload=()=>y(),p.onerror=()=>k(new Error("Failed to load")),p.src=T});const s=p.naturalWidth,b=p.naturalHeight,S=document.createElement("canvas");S.width=s,S.height=b;const M=S.getContext("2d");M.drawImage(p,0,0);const E=M.getImageData(0,0,s,b).data,u=new Float64Array(s*b);for(let y=0;y<s*b;y++){const k=y*4;u[y]=.299*E[k]+.587*E[k+1]+.114*E[k+2]}const N=new Float64Array(s*b),h=new Uint8Array(s*b);if(I==="sobel"||I==="canny")for(let y=1;y<b-1;y++)for(let k=1;k<s-1;k++){const U=-u[(y-1)*s+(k-1)]+u[(y-1)*s+(k+1)]-2*u[y*s+(k-1)]+2*u[y*s+(k+1)]-u[(y+1)*s+(k-1)]+u[(y+1)*s+(k+1)],$=-u[(y-1)*s+(k-1)]-2*u[(y-1)*s+k]-u[(y-1)*s+(k+1)]+u[(y+1)*s+(k-1)]+2*u[(y+1)*s+k]+u[(y+1)*s+(k+1)],X=Math.sqrt(U*U+$*$);N[y*s+k]=X,h[y*s+k]=X>f?255:0}else for(let y=1;y<b-1;y++)for(let k=1;k<s-1;k++){const U=-4*u[y*s+k]+u[(y-1)*s+k]+u[(y+1)*s+k]+u[y*s+(k-1)]+u[y*s+(k+1)],$=Math.abs(U);N[y*s+k]=$,h[y*s+k]=$>f/2?255:0}let o=0,d=0;const n=32,t=[];for(let y=0;y<s*b;y++)h[y]>0&&o++,d+=N[y];for(let y=0;y<Math.floor(b/n);y++)for(let k=0;k<Math.floor(s/n);k++){let U=0;for(let $=0;$<n;$++)for(let X=0;X<n;X++)U+=N[(y*n+$)*s+(k*n+X)];t.push(U/(n*n))}const m=t.reduce((y,k)=>y+k,0)/t.length,r=Math.sqrt(t.reduce((y,k)=>y+(k-m)**2,0)/t.length),A=m>0?Math.max(0,100-r/m*50):0;g({edgeDensity:o/(s*b)*1e4,avgStrength:d/(s*b),uniformity:A});const F=document.createElement("canvas");F.width=s,F.height=b;const B=F.getContext("2d"),O=B.createImageData(s,b);for(let y=0;y<s*b;y++){const k=y*4;O.data[k]=O.data[k+1]=O.data[k+2]=h[y],O.data[k+3]=255}B.putImageData(O,0,0);const z=document.createElement("canvas");z.width=s,z.height=b;const W=z.getContext("2d"),Y=W.createImageData(s,b),P=Math.max(...N);for(let y=0;y<s*b;y++){const k=y*4,U=P>0?N[y]/P:0;U<.25?(Y.data[k]=0,Y.data[k+1]=Math.floor(U*4*255),Y.data[k+2]=255):U<.5?(Y.data[k]=0,Y.data[k+1]=255,Y.data[k+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(Y.data[k]=Math.floor((U-.5)*4*255),Y.data[k+1]=255,Y.data[k+2]=0):(Y.data[k]=255,Y.data[k+1]=Math.floor((1-(U-.75)*4)*255),Y.data[k+2]=0),Y.data[k+3]=255}W.putImageData(Y,0,0),x.current=F,i.current=z,g({edgeDensity:o/(s*b)*1e4,avgStrength:d/(s*b),uniformity:A})}catch(p){console.error("[Gradient] Analysis failed:",p)}finally{D(!1)}},[T,I,f]);return K.useEffect(()=>{l&&C&&(j===0&&x.current?C(x.current):j===1&&i.current&&C(i.current))},[l,j,C]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(_,{value:I,onChange:p=>L(p),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",f]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:f,onChange:p=>q(Number(p.target.value))})]}),e.jsx(G,{label:"Analyse Gradients",onClick:w,isAnalysing:R}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${j===0?"tool-tab-active":""}`,onClick:()=>a(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${j===1?"tool-tab-active":""}`,onClick:()=>a(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},le=({targetImage:T,onResult:C})=>{const[I,L]=v.useState("medium"),[f,q]=v.useState(!1),[R,D]=v.useState(0),[l,g]=v.useState(null),j=v.useCallback(async()=>{q(!0),g(null),D(0);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((P,y)=>{a.onload=()=>P(),a.onerror=()=>y(new Error("Failed to load")),a.src=T}),D(20);const x=a.naturalWidth,i=a.naturalHeight,w=document.createElement("canvas");w.width=x,w.height=i;const p=w.getContext("2d");p.drawImage(a,0,0);const b=p.getImageData(0,0,x,i).data,S=new Float64Array(x*i);for(let P=0;P<x*i;P++)S[P]=.299*b[P*4]+.587*b[P*4+1]+.114*b[P*4+2];D(40);const c=Math.floor((I==="low"?3:I==="medium"?5:7)/2),E=new Float64Array(x*i);for(let P=0;P<i;P++)for(let y=0;y<x;y++){let k=0,U=0;for(let $=-c;$<=c;$++)for(let X=-c;X<=c;X++){const H=P+$,V=y+X;H>=0&&H<i&&V>=0&&V<x&&(k+=S[H*x+V],U++)}E[P*x+y]=k/U}D(70);const u=new Float64Array(x*i);for(let P=0;P<x*i;P++)u[P]=S[P]-E[P];const N=32,h=Math.floor(x/N),o=Math.floor(i/N),d=[];for(let P=0;P<o;P++)for(let y=0;y<h;y++){const k=[];for(let X=0;X<N;X++)for(let H=0;H<N;H++)k.push(u[(P*N+X)*x+(y*N+H)]);const U=k.reduce((X,H)=>X+H,0)/k.length,$=k.reduce((X,H)=>X+(H-U)**2,0)/k.length;d.push($)}const n=d.reduce((P,y)=>P+y,0)/d.length,t=Math.sqrt(d.reduce((P,y)=>P+(y-n)**2,0)/d.length),m=n>0?Math.min(100,t/n*100):0,r=100-m,A=m>30;g({hasFingerprint:A,consistency:m,uniformity:r}),D(90);const F=document.createElement("canvas");F.width=x,F.height=i;const B=F.getContext("2d"),O=B.createImageData(x,i);let z=1/0,W=-1/0;for(let P=0;P<u.length;P++)u[P]<z&&(z=u[P]),u[P]>W&&(W=u[P]);const Y=W-z||1;for(let P=0;P<x*i;P++){const y=(u[P]-z)/Y*255,k=P*4,U=Math.min(255,y*3);O.data[k]=U,O.data[k+1]=U,O.data[k+2]=U,O.data[k+3]=255}B.putImageData(O,0,0),C&&C(F),D(100),g({hasFingerprint:A,consistency:m,uniformity:r})}catch(a){console.error("[PRNU] Analysis failed:",a)}finally{q(!1)}},[T,I,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(_,{value:I,onChange:a=>L(a),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx(G,{label:"Extract PRNU",onClick:j,isAnalysing:f}),f&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${R}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},ce=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(6),[f,q]=v.useState(!1),[R,D]=v.useState(null),l=v.useCallback(async()=>{q(!0),D(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((h,o)=>{g.onload=()=>h(),g.onerror=()=>o(new Error("Failed to load")),g.src=T});const j=g.naturalWidth,a=g.naturalHeight,x=document.createElement("canvas");x.width=j,x.height=a;const i=x.getContext("2d");i.drawImage(g,0,0);const p=i.getImageData(0,0,j,a).data,s=200+(10-I)*5,b=[],S=16;for(let h=0;h<Math.floor(a/S);h++)for(let o=0;o<Math.floor(j/S);o++){let d=0,n=0,t=0;for(let m=0;m<S;m++)for(let r=0;r<S;r++){const A=o*S+r,F=h*S+m,B=(F*j+A)*4,O=Math.max(p[B],p[B+1],p[B+2]);O>d&&(d=O,n=A,t=F)}d>s&&b.push({x:n,y:t,intensity:d})}const M=[];for(const h of b){let o=0,d=0;const n=10;for(let m=-n;m<=n;m++)for(let r=-n;r<=n;r++){const A=h.x+r,F=h.y+m;if(A<0||A>=j||F<0||F>=a)continue;const B=(F*j+A)*4,O=.299*p[B]+.587*p[B+1]+.114*p[B+2];o+=r*O,d+=m*O}const t=Math.atan2(d,o);M.push(t)}let c=0,E=0;if(M.length>1){const h=M.reduce((o,d)=>o+d,0)/M.length;for(const o of M){const d=Math.abs(o-h);d<Math.PI/4||d>Math.PI*7/4?c++:E++}}D({highlights:b.length,consistent:c,inconsistent:E});const u=document.createElement("canvas");u.width=j,u.height=a;const N=u.getContext("2d");N.drawImage(g,0,0),b.forEach((h,o)=>{const d=o<M.length&&(()=>{const n=M.reduce((m,r)=>m+r,0)/M.length,t=Math.abs(M[o]-n);return t<Math.PI/4||t>Math.PI*7/4})();if(N.beginPath(),N.arc(h.x,h.y,12,0,Math.PI*2),N.strokeStyle=d?"#fbbf24":"#ef4444",N.lineWidth=2,N.stroke(),o<M.length){const n=M[o],t=25;N.beginPath(),N.moveTo(h.x,h.y),N.lineTo(h.x+Math.cos(n)*t,h.y+Math.sin(n)*t),N.strokeStyle=d?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",N.lineWidth=2,N.stroke()}}),C&&C(u),D({highlights:b.length,consistent:c,inconsistent:E})}catch(g){console.error("[Highlight] Analysis failed:",g)}finally{q(!1)}},[T,I,C]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",I]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:I,onChange:g=>L(Number(g.target.value))})]}),e.jsx(G,{label:"Detect Highlights",onClick:l,isAnalysing:f}),R&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:R.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[R.consistent," / ",R.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${R.inconsistent>R.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:R.inconsistent>R.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},de=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(!1),[f,q]=v.useState(null),R=v.useCallback(async()=>{L(!0),q(null);try{const D=new Image;D.crossOrigin="anonymous",await new Promise((o,d)=>{D.onload=()=>o(),D.onerror=()=>d(new Error("Failed to load")),D.src=T});const l=D.naturalWidth,g=D.naturalHeight,j=document.createElement("canvas");j.width=l,j.height=g;const a=j.getContext("2d");a.drawImage(D,0,0);const i=a.getImageData(0,0,l,g).data,w=new Float64Array(l*g),p=new Float64Array(l*g),s=new Float64Array(l*g);for(let o=0;o<l*g;o++)w[o]=i[o*4],p[o]=i[o*4+1],s[o]=i[o*4+2];const b=[];for(let o=2;o<g-2;o+=4)for(let d=2;d<l-2;d+=4){const n=F=>.299*w[F]+.587*p[F]+.114*s[F],t=o*l+d,m=-n(t-l-1)+n(t-l+1)-2*n(t-1)+2*n(t+1)-n(t+l-1)+n(t+l+1),r=-n(t-l-1)-2*n(t-l)-n(t-l+1)+n(t+l-1)+2*n(t+l)+n(t+l+1),A=Math.sqrt(m*m+r*r);A>100&&b.push({x:d,y:o,strength:A})}let S=0;const M=[];for(const o of b.slice(0,200)){const d=W=>{const Y=o.y*l+o.x,P=-W[Y-l-1]+W[Y-l+1]-2*W[Y-1]+2*W[Y+1]-W[Y+l-1]+W[Y+l+1],y=-W[Y-l-1]-2*W[Y-l]-W[Y-l+1]+W[Y+l-1]+2*W[Y+l]+W[Y+l+1];return{gx:P,gy:y,mag:Math.sqrt(P*P+y*y)}},n=d(w),t=d(p),m=d(s),r=Math.atan2(n.gy,n.gx),A=Math.atan2(t.gy,t.gx),F=Math.atan2(m.gy,m.gx),B=Math.abs(r-A),O=Math.abs(F-A),z=(B+O)/2;S+=z,M.push({x:o.x,y:o.y,sep:z})}const c=b.length>0?S/Math.min(b.length,200):0,E=c>.05,u=document.createElement("canvas");u.width=l,u.height=g;const N=u.getContext("2d"),h=N.createImageData(l,g);for(let o=0;o<l*g;o++){const d=o*4;h.data[d]=Math.min(255,Math.abs(w[o]-p[o])*5),h.data[d+1]=Math.min(255,Math.abs(p[o]-s[o])*5),h.data[d+2]=Math.min(255,Math.abs(s[o]-w[o])*5),h.data[d+3]=255}N.putImageData(h,0,0);for(const o of M)N.beginPath(),N.arc(o.x,o.y,3,0,Math.PI*2),N.fillStyle=o.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",N.fill();C&&C(u),q({avgSeparation:c*100,detected:E,edgesAnalysed:Math.min(b.length,200)})}catch(D){console.error("[Aberration] Analysis failed:",D)}finally{L(!1)}},[T,C]);return e.jsxs("div",{children:[e.jsx(G,{label:"Check for Aberration",onClick:R,isAnalysing:I}),f&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[f.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:f.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${f.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:f.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},ge=({targetImage:T,onResult:C})=>{const[I,L]=v.useState(!0),[f,q]=v.useState(!1),[R,D]=v.useState(null),l=v.useCallback(async()=>{q(!0),D(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((n,t)=>{g.onload=()=>n(),g.onerror=()=>t(new Error("Failed to load")),g.src=T});const j=g.naturalWidth,a=g.naturalHeight,x=document.createElement("canvas");x.width=j,x.height=a;const i=x.getContext("2d");i.drawImage(g,0,0);const w=i.getImageData(0,0,j,a).data,p=8,s=Math.floor(j/p),b=Math.floor(a/p),S=[];for(let n=0;n<b;n++)for(let t=0;t<s;t++){let m=0,r=0;if(t<s-1)for(let A=0;A<p;A++){const B=((n*p+A)*j+(t+1)*p-1)*4,O=B+4;m+=Math.abs(w[B]-w[O])+Math.abs(w[B+1]-w[O+1])+Math.abs(w[B+2]-w[O+2]),r++}if(n<b-1)for(let A=0;A<p;A++){const F=t*p+A,B=(n+1)*p-1,O=B+1,z=(B*j+F)*4,W=(O*j+F)*4;m+=Math.abs(w[z]-w[W])+Math.abs(w[z+1]-w[W+1])+Math.abs(w[z+2]-w[W+2]),r++}S.push(r>0?m/(r*3):0)}const M=S.reduce((n,t)=>n+t,0)/S.length,c=Math.sqrt(S.reduce((n,t)=>n+(t-M)**2,0)/S.length);let E=0;for(const n of S)Math.abs(n-M)>c*2&&E++;const u=Math.max(10,Math.min(100,100-M*2)),N=E>s*b*.1?2:1,h=document.createElement("canvas");h.width=j,h.height=a;const o=h.getContext("2d");o.drawImage(g,0,0);const d=Math.max(...S);for(let n=0;n<b;n++)for(let t=0;t<s;t++){const m=d>0?S[n*s+t]/d:0,r=m<.33?0:m<.66?200:220,A=m<.33||m<.66?180:50;o.fillStyle=`rgba(${r},${A},0,0.3)`,o.fillRect(t*p,n*p,p,p),I&&(o.strokeStyle="rgba(255,255,255,0.08)",o.lineWidth=.5,o.strokeRect(t*p,n*p,p,p))}C&&C(h),D({quality:u,layers:N,inconsistent:E})}catch(g){console.error("[Compression]",g)}finally{q(!1)}},[T,I,C]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:I,onChange:g=>L(g.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx(G,{label:"Analyse Compression",onClick:l,isAnalysing:f}),R&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[R.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:R.layers})]})]}),e.jsx("div",{className:`tool-verdict ${R.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:R.layers>1?`⚠️ Multiple re-compressions (${R.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},he=({targetImage:T})=>{const[C,I]=v.useState(!1),[L,f]=v.useState(null),q=v.useCallback(async()=>{var l;I(!0),f(null);try{const g=new Image;g.crossOrigin="anonymous",await new Promise((r,A)=>{g.onload=()=>r(),g.onerror=()=>A(),g.src=T});const j=T,a=j.startsWith("data:"),x=j.startsWith("blob:"),i=!a&&!x?new URL(j):null,w=i?i.pathname.split("/").pop()||"unknown":"embedded",p=((l=w.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let s="",b="",S="";try{const r=await fetch(T,{method:"HEAD",mode:"cors"});s=r.headers.get("content-type")||"",b=r.headers.get("content-length")||"",S=r.headers.get("last-modified")||""}catch{}const M=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],c=j.toLowerCase(),E=M.some(r=>c.includes(r)),N=i?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(r=>i.hostname.includes(r)):!1,h={Source:a?"Data URL (embedded)":x?"Blob URL (local)":(i==null?void 0:i.hostname)||"Unknown",Filename:w,Format:s||p.toUpperCase(),Dimensions:`${g.naturalWidth} × ${g.naturalHeight}`},o={"Aspect Ratio":(g.naturalWidth/g.naturalHeight).toFixed(2),"Total Pixels":`${(g.naturalWidth*g.naturalHeight/1e6).toFixed(1)} MP`};b&&(o["File Size"]=`${(parseInt(b)/1024).toFixed(1)} KB`);const d={};S&&(d["Last Modified"]=S);const n={};E&&(n["AI Indicator"]="⚠️ AI-related keywords found in URL"),N&&(n.Hosting="⚠️ Known AI image hosting platform");let t="authentic",m="✅ No suspicious metadata detected";E||N?(t="ai",m="❌ AI generation indicators detected in metadata"):(a||x)&&(t="suspicious",m="⚠️ Embedded/local image — limited metadata available"),f({camera:h,settings:o,dates:d,software:n,verdict:t,verdictText:m})}catch(g){console.error("[Metadata]",g)}finally{I(!1)}},[T]),R=()=>{if(!L)return;const l=JSON.stringify({...L.camera,...L.settings,...L.dates,...L.software},null,2);navigator.clipboard.writeText(l)},D=(l,g,j)=>Object.keys(j).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:g}),e.jsx("h4",{children:l})]}),Object.entries(j).map(([a,x])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:a}),e.jsx("span",{className:`metadata-value ${x.includes("Not found")?"metadata-missing":""}`,children:x})]},a))]});return e.jsxs("div",{children:[e.jsx(G,{label:"Extract Metadata",onClick:q,isAnalysing:C}),L&&e.jsxs("div",{className:"tool-output-area",children:[D("Image Information","📷",L.camera),D("Properties","⚙️",L.settings),D("Dates","📅",L.dates),D("Software & AI Detection","🖥️",L.software),e.jsx("div",{className:`tool-verdict ${L.verdict==="authentic"?"tool-verdict-safe":L.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:L.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:R,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},me=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ae},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ne},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:se},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:re},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:ie},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:le},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:ce},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:de},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ge},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:he}],pe=({targetImage:T,onBack:C,onMaximize:I})=>{var i;const[L,f]=v.useState(null),[q,R]=v.useState(null),[D,l]=v.useState(50),[g,j]=v.useState("ltr"),a=v.useRef(null),x=v.useCallback((w,p)=>{f(w.toDataURL()),R(p)},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:C,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>I(L||T,q||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:a,children:[e.jsx("img",{src:T,alt:"Original",className:"comparison-image"}),L&&e.jsx("div",{className:"comparison-overlay",style:{width:`${g==="ltr"?D:100-D}%`,left:g==="ltr"?0:"auto",right:g==="rtl"?0:"auto",borderRight:g==="ltr"?"2px solid #fff":"none",borderLeft:g==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:L,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:g==="ltr"?0:"auto",right:g==="rtl"?0:"auto",width:((i=a.current)==null?void 0:i.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),L&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${D}%`}})]}),L&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{f(null),R(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:D,onChange:w=>l(Number(w.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>j(w=>w==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!L&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),e.jsx("div",{className:"forensic-tools-grid",children:me.map((w,p)=>e.jsx(te,{icon:w.icon,title:w.title,description:w.desc,tier:w.tier,index:p,children:e.jsx(w.Component,{targetImage:T,onResult:s=>x(s,w.title)})},w.title))})]})},ue=({image:T,title:C,onClose:I})=>{const[L,f]=v.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[q,R]=v.useState(!1),[D,l]=v.useState(!1),[g,j]=v.useState({scale:1,x:0,y:0}),[a,x]=v.useState(!1),i=v.useRef({x:0,y:0}),w=v.useRef({x:0,y:0,width:0,height:0}),p=v.useRef({x:0,y:0,imgX:0,imgY:0}),s=v.useRef(null),b=c=>{c.target===c.currentTarget&&(R(!0),i.current={x:c.clientX-L.x,y:c.clientY-L.y})},S=c=>{c.stopPropagation(),l(!0),w.current={x:c.clientX,y:c.clientY,width:L.width,height:L.height}},M=c=>{c.preventDefault(),x(!0),p.current={x:c.clientX,y:c.clientY,imgX:g.x,imgY:g.y}};return v.useEffect(()=>{const c=u=>{if(q&&f(N=>({...N,x:u.clientX-i.current.x,y:u.clientY-i.current.y})),D){const N=u.clientX-w.current.x,h=u.clientY-w.current.y;f(o=>({...o,width:Math.max(400,w.current.width+N),height:Math.max(300,w.current.height+h)}))}if(a){const N=u.clientX-p.current.x,h=u.clientY-p.current.y;j(o=>({...o,x:p.current.imgX+N,y:p.current.imgY+h}))}},E=()=>{R(!1),l(!1),x(!1)};return(q||D||a)&&(window.addEventListener("mousemove",c),window.addEventListener("mouseup",E)),()=>{window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",E)}},[q,D,a]),v.useEffect(()=>{const c=s.current;if(!c)return;const E=d=>{d.preventDefault(),d.stopPropagation();const n=c.getBoundingClientRect(),t=d.clientX-n.left-n.width/2,m=d.clientY-n.top-n.height/2,A=-d.deltaY*.001;j(F=>{const B=Math.min(Math.max(.1,F.scale+A*F.scale*5),10);if(B===F.scale)return F;const O=B/F.scale,z=t-(t-F.x)*O,W=m-(m-F.y)*O;return{scale:B,x:z,y:W}})};let u=0;const N=d=>{d.touches.length===2&&(u=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY))},h=d=>{if(d.touches.length===2){d.preventDefault();const n=Math.hypot(d.touches[0].clientX-d.touches[1].clientX,d.touches[0].clientY-d.touches[1].clientY),t=(d.touches[0].clientX+d.touches[1].clientX)/2,m=(d.touches[0].clientY+d.touches[1].clientY)/2,r=c.getBoundingClientRect(),A=t-r.left-r.width/2,F=m-r.top-r.height/2;if(u>0){const O=(n-u)*.01;j(z=>{const W=Math.min(Math.max(.1,z.scale+O*z.scale),10);if(W===z.scale)return z;const Y=W/z.scale;return{scale:W,x:A-(A-z.x)*Y,y:F-(F-z.y)*Y}})}u=n}},o=()=>{u=0};return c.addEventListener("wheel",E,{passive:!1}),c.addEventListener("touchstart",N,{passive:!1}),c.addEventListener("touchmove",h,{passive:!1}),c.addEventListener("touchend",o),()=>{c.removeEventListener("wheel",E),c.removeEventListener("touchstart",N),c.removeEventListener("touchmove",h),c.removeEventListener("touchend",o)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:L.x,top:L.y,width:L.width,height:L.height,zIndex:2147483647},children:e.jsxs(Q,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:b,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[C," Result"]})]}),e.jsx("button",{onClick:I,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:s,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:M,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${g.x}px, ${g.y}px) scale(${g.scale})`,transition:a?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:T,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(g.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:S,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},xe=()=>{const[T,C]=v.useState("idle"),[I,L]=v.useState(null),[f,q]=v.useState(null),[R,D]=v.useState(null),[l,g]=v.useState(null),[j,a]=v.useState(null),[x,i]=v.useState(!1),w=v.useRef({x:0,y:0}),p=v.useRef(null);v.useEffect(()=>{const M=c=>{switch(c.type){case"SCANNING":C("scanning"),D(c.imageUrl||null),L(null),q(null);break;case"SHOW_RESULT":C("result"),L({isAI:c.isAI||!1,confidence:c.confidence||0,heatmapData:c.heatmapData,filterData:c.filterData});break;case"ERROR":C("error"),q(c.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(M),()=>chrome.runtime.onMessage.removeListener(M)},[]),v.useEffect(()=>{const M=E=>{if(!x||!p.current)return;let u=E.clientX-w.current.x,N=E.clientY-w.current.y;const h=p.current.getBoundingClientRect(),o=window.innerWidth,d=window.innerHeight,n=Math.max(0,o-h.width),t=Math.max(0,d-h.height);u=Math.max(0,Math.min(u,n)),N=Math.max(0,Math.min(N,t)),a({x:u,y:N})},c=()=>{i(!1)};return x&&(window.addEventListener("mousemove",M),window.addEventListener("mouseup",c)),()=>{window.removeEventListener("mousemove",M),window.removeEventListener("mouseup",c)}},[x]);const s=M=>{if(!p.current)return;const c=p.current.getBoundingClientRect(),E=c.left,u=c.top;w.current={x:M.clientX-E,y:M.clientY-u},j||a({x:E,y:u}),i(!0)},b=()=>{C("idle"),L(null),q(null),D(null),a(null),g(null)};if(T==="idle")return null;const S=T==="tools"?800:400;return e.jsxs(K.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:j?0:20},children:e.jsx("div",{ref:p,className:"pointer-events-auto transition-shadow duration-300",style:j?{position:"absolute",left:j.x,top:j.y,boxShadow:x?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(Q,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:S},children:[e.jsx("div",{onMouseDown:s,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${x?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:b,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[T==="scanning"&&e.jsxs("div",{className:"relative",children:[R&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:R,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),T==="result"&&I&&R&&e.jsx(Z,{result:I,targetImage:R,onToolsClick:()=>C("tools")}),T==="tools"&&R&&e.jsx(pe,{targetImage:R,onBack:()=>C("result"),onClose:b,onMaximize:(M,c)=>g({url:M,title:c})}),T==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:f})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),l&&e.jsx(ue,{image:l.url,title:l.title,onClose:()=>g(null)})]})},be=`
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
`;function fe(T){const C=document.createElement("style");C.textContent=be,T.appendChild(C)}const we=`

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
`;function ve(T){const C=document.createElement("style");C.textContent=we,T.appendChild(C)}if(!document.getElementById("undiffused-root")){const T=document.createElement("div");T.id="undiffused-root",document.body.appendChild(T);const C=T.attachShadow({mode:"open"});fe(C),ve(C);const I=document.createElement("div");I.id="undiffused-app",C.appendChild(I);const L=document.createElement("div");L.id="undiffused-portal-root",Object.assign(L.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),C.appendChild(L),ee.createRoot(I).render(e.jsx(xe,{})),console.log("[UnDiffused] Content script injected")}
