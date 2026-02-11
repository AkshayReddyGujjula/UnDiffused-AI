import{r as w,j as e,a as Q,R as _,G as K,b as J,c as Z}from"./ResultView-BXWFaSCq.js";const ee=({icon:T,title:M,description:D,tier:L,index:d,children:q})=>{const[A,I]=w.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${d*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>I(!A),"aria-expanded":A,"aria-label":`${M} - ${D}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:T})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:M}),e.jsx("p",{className:"tool-card-desc",children:D})]}),e.jsx("div",{className:`tool-card-chevron ${A?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),L===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${A?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:q||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var te=Q();function V({value:T,onChange:M,options:D,placeholder:L="Select...",disabled:d=!1}){const[q,A]=w.useState(!1),I=w.useRef(null),l=w.useRef(null),[c,j]=w.useState({top:0,left:0,width:0}),a=w.useCallback(()=>{var x;const n=(x=I.current)==null?void 0:x.getRootNode();if(n&&n instanceof ShadowRoot){let N=n.querySelector("#undiffused-portal-root");return N||(N=document.createElement("div"),N.id="undiffused-portal-root",Object.assign(N.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),n.appendChild(N)),N}return document.body},[]),u=D.find(n=>n.value===T),i=n=>{M(n),A(!1)},f=()=>{if(!d)if(!q&&I.current){const n=I.current.getBoundingClientRect();j({top:n.bottom+6,left:n.left,width:n.width}),A(!0)}else A(!1)};w.useEffect(()=>{var N;if(!q)return;const n=E=>{var C,b;const m=E.target;(C=I.current)!=null&&C.contains(m)||(b=l.current)!=null&&b.contains(m)||A(!1)},x=((N=I.current)==null?void 0:N.getRootNode())||document;return x.addEventListener("mousedown",n),()=>x.removeEventListener("mousedown",n)},[q]),w.useEffect(()=>{if(!q)return;const n=()=>A(!1);return window.addEventListener("resize",n),window.addEventListener("scroll",n,{capture:!0}),()=>{window.removeEventListener("resize",n),window.removeEventListener("scroll",n,{capture:!0})}},[q]);const h=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:c.top,left:c.left,width:c.width,zIndex:2147483647,pointerEvents:"auto"},children:D.map(n=>e.jsxs("div",{className:`liquid-select-option ${n.value===T?"selected":""}`,onClick:()=>i(n.value),role:"option","aria-selected":n.value===T,children:[e.jsx("span",{children:n.label}),n.value===T&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(n.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:I,type:"button",className:`liquid-select-trigger ${q?"open":""} ${d?"opacity-50 cursor-not-allowed":""}`,onClick:f,disabled:d,"aria-haspopup":"listbox","aria-expanded":q,children:[e.jsx("span",{children:u?u.label:L}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),q&&te.createPortal(h,a())]})}const oe=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(85),[d,q]=w.useState("medium"),[A,I]=w.useState(!1),[l,c]=w.useState(null),j=d==="low"?10:d==="medium"?20:40,a=w.useCallback(async()=>{I(!0),c(null);try{const u=new Image;u.crossOrigin="anonymous",await new Promise((s,t)=>{u.onload=()=>s(),u.onerror=()=>t(new Error("Failed to load image")),u.src=T});const i=u.naturalWidth,f=u.naturalHeight,h=document.createElement("canvas");h.width=i,h.height=f;const n=h.getContext("2d");n.drawImage(u,0,0);const x=n.getImageData(0,0,i,f),N=document.createElement("canvas");N.width=i,N.height=f;const E=N.getContext("2d");E.drawImage(u,0,0);const m=N.toDataURL("image/jpeg",D/100),C=new Image;await new Promise(s=>{C.onload=()=>s(),C.src=m}),E.drawImage(C,0,0);const b=E.getImageData(0,0,i,f),S=document.createElement("canvas");S.width=i,S.height=f;const g=S.getContext("2d"),o=g.createImageData(i,f);let k=0;for(let s=0;s<x.data.length;s+=4){const t=Math.abs(x.data[s]-b.data[s]),p=Math.abs(x.data[s+1]-b.data[s+1]),r=Math.abs(x.data[s+2]-b.data[s+2]);k+=t+p+r;const F=Math.min(255,t*j),z=Math.min(255,p*j),B=Math.min(255,r*j),R=(F+z+B)/3;R<64?(o.data[s]=0,o.data[s+1]=0,o.data[s+2]=Math.min(255,R*4)):R<128?(o.data[s]=0,o.data[s+1]=Math.min(255,(R-64)*4),o.data[s+2]=255-(R-64)*4):R<192?(o.data[s]=Math.min(255,(R-128)*4),o.data[s+1]=255,o.data[s+2]=0):(o.data[s]=255,o.data[s+1]=255-(R-192)*4,o.data[s+2]=0),o.data[s+3]=255}g.putImageData(o,0,0),M&&M(S),c({diffScore:k/(i*f)})}catch(u){console.error("[ELA] Analysis failed:",u)}finally{I(!1)}},[T,D,j,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",D,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:D,onChange:u=>L(Number(u.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(V,{value:d,onChange:u=>q(u),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""} `,onClick:a,disabled:A,children:A?"Analysing...":"🔬 Analyse Error Levels"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},ae=({targetImage:T,onResult:M})=>{const[D,L]=w.useState("luminance"),[d,q]=w.useState(32),[A,I]=w.useState(!1),[l,c]=w.useState(null),j=w.useCallback(async()=>{I(!0),c(null);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((t,p)=>{a.onload=()=>t(),a.onerror=()=>p(new Error("Failed to load image")),a.src=T});const u=a.naturalWidth,i=a.naturalHeight,f=document.createElement("canvas");f.width=u,f.height=i;const h=f.getContext("2d");h.drawImage(a,0,0);const x=h.getImageData(0,0,u,i).data,N=t=>D==="chromatic"?(x[t]-x[t+1])*.5+128:.299*x[t]+.587*x[t+1]+.114*x[t+2],E=Math.floor(u/d),m=Math.floor(i/d),C=[];for(let t=0;t<m;t++)for(let p=0;p<E;p++){const r=[];for(let B=0;B<d;B++)for(let R=0;R<d;R++){const O=p*d+R,$=t*d+B,W=($*u+O)*4,P=N(W);let y=0,v=0;for(const[H,Y]of[[-1,0],[1,0],[0,-1],[0,1]]){const G=O+H,X=$+Y;G>=0&&G<u&&X>=0&&X<i&&(y+=N((X*u+G)*4),v++)}const U=P-y/v;r.push(U)}const F=r.reduce((B,R)=>B+R,0)/r.length,z=r.reduce((B,R)=>B+(R-F)**2,0)/r.length;C.push(z)}const b=C.reduce((t,p)=>t+p,0)/C.length,S=Math.sqrt(C.reduce((t,p)=>t+(p-b)**2,0)/C.length),g=Math.max(0,100-S/b*100),o=document.createElement("canvas");o.width=u,o.height=i;const k=o.getContext("2d");k.globalAlpha=.3,k.drawImage(a,0,0),k.globalAlpha=1;const s=Math.max(...C);for(let t=0;t<m;t++)for(let p=0;p<E;p++){const r=C[t*E+p],F=s>0?r/s:0,z=Math.floor(255*(1-F)),B=Math.floor(255*F);k.fillStyle=`rgba(${z}, ${B}, 60, 0.5)`,k.fillRect(p*d,t*d,d,d),k.strokeStyle="rgba(255,255,255,0.1)",k.strokeRect(p*d,t*d,d,d)}M&&M(o),c({mean:b,std:S,uniformity:g})}catch(a){console.error("[Noise] Analysis failed:",a)}finally{I(!1)}},[T,D,d,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(V,{value:D,onChange:a=>L(a),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",d,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:d,onChange:a=>q(Number(a.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""}`,onClick:j,disabled:A,children:A?"Analysing...":"📡 Analyse Noise"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},ne=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(5),[d,q]=w.useState(32),[A,I]=w.useState(!1),[l,c]=w.useState(null),j=(i,f,h,n,x)=>{let N=0;const E=Math.max(1,Math.floor(x/8));for(let m=0;m<x;m+=E)for(let C=0;C<x;C+=E){const b=((n+m)*f+(h+C))*4,S=i[b]*.299+i[b+1]*.587+i[b+2]*.114;N=(N<<5)-N+Math.floor(S/(12-D))|0}return N},a=(i,f,h,n,x,N,E)=>{let m=0,C=0;const b=Math.max(1,Math.floor(E/16));for(let S=0;S<E;S+=b)for(let g=0;g<E;g+=b){const o=((n+S)*f+(h+g))*4,k=((N+S)*f+(x+g))*4;m+=Math.abs(i[o]-i[k]),m+=Math.abs(i[o+1]-i[k+1]),m+=Math.abs(i[o+2]-i[k+2]),C++}return 1-m/(C*3*255)},u=w.useCallback(async()=>{I(!0),c(null);try{const i=new Image;i.crossOrigin="anonymous",await new Promise((t,p)=>{i.onload=()=>t(),i.onerror=()=>p(new Error("Failed to load")),i.src=T});const f=i.naturalWidth,h=i.naturalHeight,n=document.createElement("canvas");n.width=f,n.height=h;const x=n.getContext("2d");x.drawImage(i,0,0);const N=x.getImageData(0,0,f,h),E=Math.max(d/2,8),m=new Map;for(let t=0;t+d<=h;t+=E)for(let p=0;p+d<=f;p+=E){const r=j(N.data,f,p,t,d);m.has(r)||m.set(r,[]),m.get(r).push({x:p,y:t})}const C=[],b=d*2,S=.85+(D-5)*.01;for(const[,t]of m)if(!(t.length<2||t.length>50))for(let p=0;p<t.length&&p<10;p++)for(let r=p+1;r<t.length&&r<10;r++){if(Math.sqrt((t[p].x-t[r].x)**2+(t[p].y-t[r].y)**2)<b)continue;const z=a(N.data,f,t[p].x,t[p].y,t[r].x,t[r].y,d);z>=S&&C.push({ax:t[p].x,ay:t[p].y,bx:t[r].x,by:t[r].y,sim:z})}const g=document.createElement("canvas");g.width=f,g.height=h;const o=g.getContext("2d");o.drawImage(i,0,0);const k=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],s=C.slice(0,30);s.forEach((t,p)=>{const r=k[p%k.length];o.strokeStyle=r,o.lineWidth=2,o.globalAlpha=.7,o.strokeRect(t.ax,t.ay,d,d),o.strokeRect(t.bx,t.by,d,d),o.fillStyle=r,o.globalAlpha=.15,o.fillRect(t.ax,t.ay,d,d),o.fillRect(t.bx,t.by,d,d),o.globalAlpha=.4,o.setLineDash([4,4]),o.beginPath(),o.moveTo(t.ax+d/2,t.ay+d/2),o.lineTo(t.bx+d/2,t.by+d/2),o.stroke(),o.setLineDash([]),o.globalAlpha=1}),M&&M(g),c(s.length)}catch(i){console.error("[Clone] Detection failed:",i)}finally{I(!1)}},[T,D,d,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",D]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:D,onChange:i=>L(Number(i.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",d,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:d,onChange:i=>q(Number(i.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""}`,onClick:u,disabled:A,children:A?"Detecting...":"🎯 Detect Clones"}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},se=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(1),[d,q]=w.useState(!1),[A,I]=w.useState(null),l=(j,a)=>{const u=j.length;if(u<=1)return[j,a];const i=u/2,f=new Float64Array(i),h=new Float64Array(i),n=new Float64Array(i),x=new Float64Array(i);for(let g=0;g<i;g++)f[g]=j[2*g],h[g]=a[2*g],n[g]=j[2*g+1],x[g]=a[2*g+1];const[N,E]=l(f,h),[m,C]=l(n,x),b=new Float64Array(u),S=new Float64Array(u);for(let g=0;g<i;g++){const o=-2*Math.PI*g/u,k=Math.cos(o),s=Math.sin(o),t=k*m[g]-s*C[g],p=k*C[g]+s*m[g];b[g]=N[g]+t,S[g]=E[g]+p,b[g+i]=N[g]-t,S[g+i]=E[g]-p}return[b,S]},c=w.useCallback(async()=>{q(!0),I(null);try{const j=new Image;j.crossOrigin="anonymous",await new Promise((r,F)=>{j.onload=()=>r(),j.onerror=()=>F(new Error("Failed to load image")),j.src=T});const a=512,u=document.createElement("canvas");u.width=a,u.height=a;const i=u.getContext("2d");i.drawImage(j,0,0,a,a);const h=i.getImageData(0,0,a,a).data,n=new Float64Array(a*a);for(let r=0;r<a*a;r++)n[r]=(h[r*4]*.299+h[r*4+1]*.587+h[r*4+2]*.114)/255;const x=new Float64Array(n),N=new Float64Array(a*a);for(let r=0;r<a;r++){const F=new Float64Array(a),z=new Float64Array(a);for(let O=0;O<a;O++)F[O]=x[r*a+O],z[O]=N[r*a+O];const[B,R]=l(F,z);for(let O=0;O<a;O++)x[r*a+O]=B[O],N[r*a+O]=R[O]}for(let r=0;r<a;r++){const F=new Float64Array(a),z=new Float64Array(a);for(let O=0;O<a;O++)F[O]=x[O*a+r],z[O]=N[O*a+r];const[B,R]=l(F,z);for(let O=0;O<a;O++)x[O*a+r]=B[O],N[O*a+r]=R[O]}const E=new Float64Array(a*a),m=a/2;let C=0;for(let r=0;r<a;r++)for(let F=0;F<a;F++){const z=x[r*a+F],B=N[r*a+F];let R=Math.sqrt(z*z+B*B);R=Math.log(1+R)*D;const O=(r+m)%a,$=(F+m)%a,W=O*a+$;E[W]=R,R>C&&(C=R)}const b=E[m*a+m],g=E[0]/C*100,o=b/C*100;let k=0;for(let r=1;r<4;r++){const F=m+r*(a/8);F<a&&E[m*a+F]>E[m*a+F-1]*1.5&&k++}const s=document.createElement("canvas");s.width=a,s.height=a;const t=s.getContext("2d"),p=t.createImageData(a,a);for(let r=0;r<a*a;r++){const F=C>0?E[r]/C*255:0,z=r*4;p.data[z]=Math.min(255,F*.8),p.data[z+1]=Math.min(255,F*.9),p.data[z+2]=Math.min(255,F),p.data[z+3]=255}t.putImageData(p,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let r=30;r<m;r+=30)t.beginPath(),t.arc(m,m,r,0,Math.PI*2),t.stroke();M&&M(s),I({highFreq:g,lowFreq:o,gridArtifacts:k>3})}catch(j){console.error("[FFT] Analysis failed:",j)}finally{q(!1)}},[T,D,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",D]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",step:"0.1",value:D,onChange:j=>L(Number(j.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""} `,onClick:c,disabled:d,children:d?"Analysing...":"🌊 Generate Spectrum"}),A&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[A.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[A.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:A.gridArtifacts?"#ef4444":"#10b981"},children:A.gridArtifacts?"Detected":"None"})]})]})]})]})},re=({targetImage:T,onResult:M})=>{const[D,L]=w.useState("sobel"),[d,q]=w.useState(100),[A,I]=w.useState(!1),[l,c]=w.useState(null),[j,a]=w.useState(0),u=w.useRef(null),i=w.useRef(null),f=w.useCallback(async()=>{I(!0),c(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((y,v)=>{h.onload=()=>y(),h.onerror=()=>v(new Error("Failed to load")),h.src=T});const n=h.naturalWidth,x=h.naturalHeight,N=document.createElement("canvas");N.width=n,N.height=x;const E=N.getContext("2d");E.drawImage(h,0,0);const C=E.getImageData(0,0,n,x).data,b=new Float64Array(n*x);for(let y=0;y<n*x;y++){const v=y*4;b[y]=.299*C[v]+.587*C[v+1]+.114*C[v+2]}const S=new Float64Array(n*x),g=new Uint8Array(n*x);if(D==="sobel"||D==="canny")for(let y=1;y<x-1;y++)for(let v=1;v<n-1;v++){const U=-b[(y-1)*n+(v-1)]+b[(y-1)*n+(v+1)]-2*b[y*n+(v-1)]+2*b[y*n+(v+1)]-b[(y+1)*n+(v-1)]+b[(y+1)*n+(v+1)],H=-b[(y-1)*n+(v-1)]-2*b[(y-1)*n+v]-b[(y-1)*n+(v+1)]+b[(y+1)*n+(v-1)]+2*b[(y+1)*n+v]+b[(y+1)*n+(v+1)],Y=Math.sqrt(U*U+H*H);S[y*n+v]=Y,g[y*n+v]=Y>d?255:0}else for(let y=1;y<x-1;y++)for(let v=1;v<n-1;v++){const U=-4*b[y*n+v]+b[(y-1)*n+v]+b[(y+1)*n+v]+b[y*n+(v-1)]+b[y*n+(v+1)],H=Math.abs(U);S[y*n+v]=H,g[y*n+v]=H>d/2?255:0}let o=0,k=0;const s=32,t=[];for(let y=0;y<n*x;y++)g[y]>0&&o++,k+=S[y];for(let y=0;y<Math.floor(x/s);y++)for(let v=0;v<Math.floor(n/s);v++){let U=0;for(let H=0;H<s;H++)for(let Y=0;Y<s;Y++)U+=S[(y*s+H)*n+(v*s+Y)];t.push(U/(s*s))}const p=t.reduce((y,v)=>y+v,0)/t.length,r=Math.sqrt(t.reduce((y,v)=>y+(v-p)**2,0)/t.length),F=p>0?Math.max(0,100-r/p*50):0;c({edgeDensity:o/(n*x)*1e4,avgStrength:k/(n*x),uniformity:F});const z=document.createElement("canvas");z.width=n,z.height=x;const B=z.getContext("2d"),R=B.createImageData(n,x);for(let y=0;y<n*x;y++){const v=y*4;R.data[v]=R.data[v+1]=R.data[v+2]=g[y],R.data[v+3]=255}B.putImageData(R,0,0);const O=document.createElement("canvas");O.width=n,O.height=x;const $=O.getContext("2d"),W=$.createImageData(n,x),P=Math.max(...S);for(let y=0;y<n*x;y++){const v=y*4,U=P>0?S[y]/P:0;U<.25?(W.data[v]=0,W.data[v+1]=Math.floor(U*4*255),W.data[v+2]=255):U<.5?(W.data[v]=0,W.data[v+1]=255,W.data[v+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(W.data[v]=Math.floor((U-.5)*4*255),W.data[v+1]=255,W.data[v+2]=0):(W.data[v]=255,W.data[v+1]=Math.floor((1-(U-.75)*4)*255),W.data[v+2]=0),W.data[v+3]=255}$.putImageData(W,0,0),u.current=z,i.current=O,c({edgeDensity:o/(n*x)*1e4,avgStrength:k/(n*x),uniformity:F})}catch(h){console.error("[Gradient] Analysis failed:",h)}finally{I(!1)}},[T,D,d]);return _.useEffect(()=>{l&&M&&(j===0&&u.current?M(u.current):j===1&&i.current&&M(i.current))},[l,j,M]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(V,{value:D,onChange:h=>L(h),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",d]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:d,onChange:h=>q(Number(h.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""}`,onClick:f,disabled:A,children:A?"Analysing...":"📐 Analyse Gradients"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${j===0?"tool-tab-active":""}`,onClick:()=>a(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${j===1?"tool-tab-active":""}`,onClick:()=>a(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},ie=({targetImage:T,onResult:M})=>{const[D,L]=w.useState("medium"),[d,q]=w.useState(!1),[A,I]=w.useState(0),[l,c]=w.useState(null),j=w.useCallback(async()=>{q(!0),c(null),I(0);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((P,y)=>{a.onload=()=>P(),a.onerror=()=>y(new Error("Failed to load")),a.src=T}),I(20);const u=a.naturalWidth,i=a.naturalHeight,f=document.createElement("canvas");f.width=u,f.height=i;const h=f.getContext("2d");h.drawImage(a,0,0);const x=h.getImageData(0,0,u,i).data,N=new Float64Array(u*i);for(let P=0;P<u*i;P++)N[P]=.299*x[P*4]+.587*x[P*4+1]+.114*x[P*4+2];I(40);const m=Math.floor((D==="low"?3:D==="medium"?5:7)/2),C=new Float64Array(u*i);for(let P=0;P<i;P++)for(let y=0;y<u;y++){let v=0,U=0;for(let H=-m;H<=m;H++)for(let Y=-m;Y<=m;Y++){const G=P+H,X=y+Y;G>=0&&G<i&&X>=0&&X<u&&(v+=N[G*u+X],U++)}C[P*u+y]=v/U}I(70);const b=new Float64Array(u*i);for(let P=0;P<u*i;P++)b[P]=N[P]-C[P];const S=32,g=Math.floor(u/S),o=Math.floor(i/S),k=[];for(let P=0;P<o;P++)for(let y=0;y<g;y++){const v=[];for(let Y=0;Y<S;Y++)for(let G=0;G<S;G++)v.push(b[(P*S+Y)*u+(y*S+G)]);const U=v.reduce((Y,G)=>Y+G,0)/v.length,H=v.reduce((Y,G)=>Y+(G-U)**2,0)/v.length;k.push(H)}const s=k.reduce((P,y)=>P+y,0)/k.length,t=Math.sqrt(k.reduce((P,y)=>P+(y-s)**2,0)/k.length),p=s>0?Math.min(100,t/s*100):0,r=100-p,F=p>30;c({hasFingerprint:F,consistency:p,uniformity:r}),I(90);const z=document.createElement("canvas");z.width=u,z.height=i;const B=z.getContext("2d"),R=B.createImageData(u,i);let O=1/0,$=-1/0;for(let P=0;P<b.length;P++)b[P]<O&&(O=b[P]),b[P]>$&&($=b[P]);const W=$-O||1;for(let P=0;P<u*i;P++){const y=(b[P]-O)/W*255,v=P*4,U=Math.min(255,y*3);R.data[v]=U,R.data[v+1]=U,R.data[v+2]=U,R.data[v+3]=255}B.putImageData(R,0,0),M&&M(z),I(100),c({hasFingerprint:F,consistency:p,uniformity:r})}catch(a){console.error("[PRNU] Analysis failed:",a)}finally{q(!1)}},[T,D,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(V,{value:D,onChange:a=>L(a),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:j,disabled:d,children:d?"Extracting PRNU...":"📷 Extract PRNU"}),d&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${A}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},le=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(6),[d,q]=w.useState(!1),[A,I]=w.useState(null),l=w.useCallback(async()=>{q(!0),I(null);try{const c=new Image;c.crossOrigin="anonymous",await new Promise((g,o)=>{c.onload=()=>g(),c.onerror=()=>o(new Error("Failed to load")),c.src=T});const j=c.naturalWidth,a=c.naturalHeight,u=document.createElement("canvas");u.width=j,u.height=a;const i=u.getContext("2d");i.drawImage(c,0,0);const h=i.getImageData(0,0,j,a).data,n=200+(10-D)*5,x=[],N=16;for(let g=0;g<Math.floor(a/N);g++)for(let o=0;o<Math.floor(j/N);o++){let k=0,s=0,t=0;for(let p=0;p<N;p++)for(let r=0;r<N;r++){const F=o*N+r,z=g*N+p,B=(z*j+F)*4,R=Math.max(h[B],h[B+1],h[B+2]);R>k&&(k=R,s=F,t=z)}k>n&&x.push({x:s,y:t,intensity:k})}const E=[];for(const g of x){let o=0,k=0;const s=10;for(let p=-s;p<=s;p++)for(let r=-s;r<=s;r++){const F=g.x+r,z=g.y+p;if(F<0||F>=j||z<0||z>=a)continue;const B=(z*j+F)*4,R=.299*h[B]+.587*h[B+1]+.114*h[B+2];o+=r*R,k+=p*R}const t=Math.atan2(k,o);E.push(t)}let m=0,C=0;if(E.length>1){const g=E.reduce((o,k)=>o+k,0)/E.length;for(const o of E){const k=Math.abs(o-g);k<Math.PI/4||k>Math.PI*7/4?m++:C++}}I({highlights:x.length,consistent:m,inconsistent:C});const b=document.createElement("canvas");b.width=j,b.height=a;const S=b.getContext("2d");S.drawImage(c,0,0),x.forEach((g,o)=>{const k=o<E.length&&(()=>{const s=E.reduce((p,r)=>p+r,0)/E.length,t=Math.abs(E[o]-s);return t<Math.PI/4||t>Math.PI*7/4})();if(S.beginPath(),S.arc(g.x,g.y,12,0,Math.PI*2),S.strokeStyle=k?"#fbbf24":"#ef4444",S.lineWidth=2,S.stroke(),o<E.length){const s=E[o],t=25;S.beginPath(),S.moveTo(g.x,g.y),S.lineTo(g.x+Math.cos(s)*t,g.y+Math.sin(s)*t),S.strokeStyle=k?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",S.lineWidth=2,S.stroke()}}),M&&M(b),I({highlights:x.length,consistent:m,inconsistent:C})}catch(c){console.error("[Highlight] Analysis failed:",c)}finally{q(!1)}},[T,D,M]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",D]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:D,onChange:c=>L(Number(c.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:l,disabled:d,children:d?"Detecting...":"✨ Detect Highlights"}),A&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:A.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[A.consistent," / ",A.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${A.inconsistent>A.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:A.inconsistent>A.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},ce=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(!1),[d,q]=w.useState(null),A=w.useCallback(async()=>{L(!0),q(null);try{const I=new Image;I.crossOrigin="anonymous",await new Promise((o,k)=>{I.onload=()=>o(),I.onerror=()=>k(new Error("Failed to load")),I.src=T});const l=I.naturalWidth,c=I.naturalHeight,j=document.createElement("canvas");j.width=l,j.height=c;const a=j.getContext("2d");a.drawImage(I,0,0);const i=a.getImageData(0,0,l,c).data,f=new Float64Array(l*c),h=new Float64Array(l*c),n=new Float64Array(l*c);for(let o=0;o<l*c;o++)f[o]=i[o*4],h[o]=i[o*4+1],n[o]=i[o*4+2];const x=[];for(let o=2;o<c-2;o+=4)for(let k=2;k<l-2;k+=4){const s=z=>.299*f[z]+.587*h[z]+.114*n[z],t=o*l+k,p=-s(t-l-1)+s(t-l+1)-2*s(t-1)+2*s(t+1)-s(t+l-1)+s(t+l+1),r=-s(t-l-1)-2*s(t-l)-s(t-l+1)+s(t+l-1)+2*s(t+l)+s(t+l+1),F=Math.sqrt(p*p+r*r);F>100&&x.push({x:k,y:o,strength:F})}let N=0;const E=[];for(const o of x.slice(0,200)){const k=$=>{const W=o.y*l+o.x,P=-$[W-l-1]+$[W-l+1]-2*$[W-1]+2*$[W+1]-$[W+l-1]+$[W+l+1],y=-$[W-l-1]-2*$[W-l]-$[W-l+1]+$[W+l-1]+2*$[W+l]+$[W+l+1];return{gx:P,gy:y,mag:Math.sqrt(P*P+y*y)}},s=k(f),t=k(h),p=k(n),r=Math.atan2(s.gy,s.gx),F=Math.atan2(t.gy,t.gx),z=Math.atan2(p.gy,p.gx),B=Math.abs(r-F),R=Math.abs(z-F),O=(B+R)/2;N+=O,E.push({x:o.x,y:o.y,sep:O})}const m=x.length>0?N/Math.min(x.length,200):0,C=m>.05,b=document.createElement("canvas");b.width=l,b.height=c;const S=b.getContext("2d"),g=S.createImageData(l,c);for(let o=0;o<l*c;o++){const k=o*4;g.data[k]=Math.min(255,Math.abs(f[o]-h[o])*5),g.data[k+1]=Math.min(255,Math.abs(h[o]-n[o])*5),g.data[k+2]=Math.min(255,Math.abs(n[o]-f[o])*5),g.data[k+3]=255}S.putImageData(g,0,0);for(const o of E)S.beginPath(),S.arc(o.x,o.y,3,0,Math.PI*2),S.fillStyle=o.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",S.fill();M&&M(b),q({avgSeparation:m*100,detected:C,edgesAnalysed:Math.min(x.length,200)})}catch(I){console.error("[Aberration] Analysis failed:",I)}finally{L(!1)}},[T,M]);return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${D?"tool-loading":""}`,onClick:A,disabled:D,children:D?"Checking...":"🌈 Check for Aberration"}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[d.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:d.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${d.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:d.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},de=({targetImage:T,onResult:M})=>{const[D,L]=w.useState(!0),[d,q]=w.useState(!1),[A,I]=w.useState(null),l=w.useCallback(async()=>{q(!0),I(null);try{const c=new Image;c.crossOrigin="anonymous",await new Promise((s,t)=>{c.onload=()=>s(),c.onerror=()=>t(new Error("Failed to load")),c.src=T});const j=c.naturalWidth,a=c.naturalHeight,u=document.createElement("canvas");u.width=j,u.height=a;const i=u.getContext("2d");i.drawImage(c,0,0);const f=i.getImageData(0,0,j,a).data,h=8,n=Math.floor(j/h),x=Math.floor(a/h),N=[];for(let s=0;s<x;s++)for(let t=0;t<n;t++){let p=0,r=0;if(t<n-1)for(let F=0;F<h;F++){const B=((s*h+F)*j+(t+1)*h-1)*4,R=B+4;p+=Math.abs(f[B]-f[R])+Math.abs(f[B+1]-f[R+1])+Math.abs(f[B+2]-f[R+2]),r++}if(s<x-1)for(let F=0;F<h;F++){const z=t*h+F,B=(s+1)*h-1,R=B+1,O=(B*j+z)*4,$=(R*j+z)*4;p+=Math.abs(f[O]-f[$])+Math.abs(f[O+1]-f[$+1])+Math.abs(f[O+2]-f[$+2]),r++}N.push(r>0?p/(r*3):0)}const E=N.reduce((s,t)=>s+t,0)/N.length,m=Math.sqrt(N.reduce((s,t)=>s+(t-E)**2,0)/N.length);let C=0;for(const s of N)Math.abs(s-E)>m*2&&C++;const b=Math.max(10,Math.min(100,100-E*2)),S=C>n*x*.1?2:1,g=document.createElement("canvas");g.width=j,g.height=a;const o=g.getContext("2d");o.drawImage(c,0,0);const k=Math.max(...N);for(let s=0;s<x;s++)for(let t=0;t<n;t++){const p=k>0?N[s*n+t]/k:0,r=p<.33?0:p<.66?200:220,F=p<.33||p<.66?180:50;o.fillStyle=`rgba(${r},${F},0,0.3)`,o.fillRect(t*h,s*h,h,h),D&&(o.strokeStyle="rgba(255,255,255,0.08)",o.lineWidth=.5,o.strokeRect(t*h,s*h,h,h))}M&&M(g),I({quality:b,layers:S,inconsistent:C})}catch(c){console.error("[Compression]",c)}finally{q(!1)}},[T,D,M]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:D,onChange:c=>L(c.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:l,disabled:d,children:d?"Analysing...":"🔳 Analyse Compression"}),A&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[A.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:A.layers})]})]}),e.jsx("div",{className:`tool-verdict ${A.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:A.layers>1?`⚠️ Multiple re-compressions (${A.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},ge=({targetImage:T})=>{const[M,D]=w.useState(!1),[L,d]=w.useState(null),q=w.useCallback(async()=>{var l;D(!0),d(null);try{const c=new Image;c.crossOrigin="anonymous",await new Promise((r,F)=>{c.onload=()=>r(),c.onerror=()=>F(),c.src=T});const j=T,a=j.startsWith("data:"),u=j.startsWith("blob:"),i=!a&&!u?new URL(j):null,f=i?i.pathname.split("/").pop()||"unknown":"embedded",h=((l=f.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let n="",x="",N="";try{const r=await fetch(T,{method:"HEAD",mode:"cors"});n=r.headers.get("content-type")||"",x=r.headers.get("content-length")||"",N=r.headers.get("last-modified")||""}catch{}const E=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],m=j.toLowerCase(),C=E.some(r=>m.includes(r)),S=i?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(r=>i.hostname.includes(r)):!1,g={Source:a?"Data URL (embedded)":u?"Blob URL (local)":(i==null?void 0:i.hostname)||"Unknown",Filename:f,Format:n||h.toUpperCase(),Dimensions:`${c.naturalWidth} × ${c.naturalHeight}`},o={"Aspect Ratio":(c.naturalWidth/c.naturalHeight).toFixed(2),"Total Pixels":`${(c.naturalWidth*c.naturalHeight/1e6).toFixed(1)} MP`};x&&(o["File Size"]=`${(parseInt(x)/1024).toFixed(1)} KB`);const k={};N&&(k["Last Modified"]=N);const s={};C&&(s["AI Indicator"]="⚠️ AI-related keywords found in URL"),S&&(s.Hosting="⚠️ Known AI image hosting platform");let t="authentic",p="✅ No suspicious metadata detected";C||S?(t="ai",p="❌ AI generation indicators detected in metadata"):(a||u)&&(t="suspicious",p="⚠️ Embedded/local image — limited metadata available"),d({camera:g,settings:o,dates:k,software:s,verdict:t,verdictText:p})}catch(c){console.error("[Metadata]",c)}finally{D(!1)}},[T]),A=()=>{if(!L)return;const l=JSON.stringify({...L.camera,...L.settings,...L.dates,...L.software},null,2);navigator.clipboard.writeText(l)},I=(l,c,j)=>Object.keys(j).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:c}),e.jsx("h4",{children:l})]}),Object.entries(j).map(([a,u])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:a}),e.jsx("span",{className:`metadata-value ${u.includes("Not found")?"metadata-missing":""}`,children:u})]},a))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${M?"tool-loading":""}`,onClick:q,disabled:M,children:M?"Extracting...":"📋 Extract Metadata"}),L&&e.jsxs("div",{className:"tool-output-area",children:[I("Image Information","📷",L.camera),I("Properties","⚙️",L.settings),I("Dates","📅",L.dates),I("Software & AI Detection","🖥️",L.software),e.jsx("div",{className:`tool-verdict ${L.verdict==="authentic"?"tool-verdict-safe":L.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:L.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:A,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},he=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:oe},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ae},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:ne},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:se},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:re},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ie},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:le},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:ce},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:de},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:ge}],me=({targetImage:T,onBack:M,onMaximize:D})=>{var i;const[L,d]=w.useState(null),[q,A]=w.useState(null),[I,l]=w.useState(50),[c,j]=w.useState("ltr"),a=w.useRef(null),u=w.useCallback((f,h)=>{d(f.toDataURL()),A(h)},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:M,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>D(L||T,q||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:a,children:[e.jsx("img",{src:T,alt:"Original",className:"comparison-image"}),L&&e.jsx("div",{className:"comparison-overlay",style:{width:`${c==="ltr"?I:100-I}%`,left:c==="ltr"?0:"auto",right:c==="rtl"?0:"auto",borderRight:c==="ltr"?"2px solid #fff":"none",borderLeft:c==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:L,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:c==="ltr"?0:"auto",right:c==="rtl"?0:"auto",width:((i=a.current)==null?void 0:i.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),L&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${I}%`}})]}),L&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{d(null),A(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:I,onChange:f=>l(Number(f.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>j(f=>f==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!L&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),e.jsx("div",{className:"forensic-tools-grid",children:he.map((f,h)=>e.jsx(ee,{icon:f.icon,title:f.title,description:f.desc,tier:f.tier,index:h,children:e.jsx(f.Component,{targetImage:T,onResult:n=>u(n,f.title)})},f.title))})]})},pe=({image:T,title:M,onClose:D})=>{const[L,d]=w.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[q,A]=w.useState(!1),[I,l]=w.useState(!1),[c,j]=w.useState({scale:1,x:0,y:0}),[a,u]=w.useState(!1),i=w.useRef({x:0,y:0}),f=w.useRef({x:0,y:0,width:0,height:0}),h=w.useRef({x:0,y:0,imgX:0,imgY:0}),n=w.useRef(null),x=m=>{m.target===m.currentTarget&&(A(!0),i.current={x:m.clientX-L.x,y:m.clientY-L.y})},N=m=>{m.stopPropagation(),l(!0),f.current={x:m.clientX,y:m.clientY,width:L.width,height:L.height}},E=m=>{m.preventDefault(),u(!0),h.current={x:m.clientX,y:m.clientY,imgX:c.x,imgY:c.y}};return w.useEffect(()=>{const m=b=>{if(q&&d(S=>({...S,x:b.clientX-i.current.x,y:b.clientY-i.current.y})),I){const S=b.clientX-f.current.x,g=b.clientY-f.current.y;d(o=>({...o,width:Math.max(400,f.current.width+S),height:Math.max(300,f.current.height+g)}))}if(a){const S=b.clientX-h.current.x,g=b.clientY-h.current.y;j(o=>({...o,x:h.current.imgX+S,y:h.current.imgY+g}))}},C=()=>{A(!1),l(!1),u(!1)};return(q||I||a)&&(window.addEventListener("mousemove",m),window.addEventListener("mouseup",C)),()=>{window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",C)}},[q,I,a]),w.useEffect(()=>{const m=b=>{b.preventDefault(),b.stopPropagation();const g=-b.deltaY*.001;j(o=>{const k=Math.min(Math.max(.1,o.scale+g*o.scale*5),10);return{...o,scale:k}})},C=n.current;return C&&C.addEventListener("wheel",m,{passive:!1}),()=>{C&&C.removeEventListener("wheel",m)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:L.x,top:L.y,width:L.width,height:L.height,zIndex:2147483647},children:e.jsxs(K,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:x,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[M," Result"]})]}),e.jsx("button",{onClick:D,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:n,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:E,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${c.x}px, ${c.y}px) scale(${c.scale})`,transition:a?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:T,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(c.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:N,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},ue=()=>{const[T,M]=w.useState("idle"),[D,L]=w.useState(null),[d,q]=w.useState(null),[A,I]=w.useState(null),[l,c]=w.useState(null),[j,a]=w.useState(null),[u,i]=w.useState(!1),f=w.useRef({x:0,y:0}),h=w.useRef(null);w.useEffect(()=>{const E=m=>{switch(m.type){case"SCANNING":M("scanning"),I(m.imageUrl||null),L(null),q(null);break;case"SHOW_RESULT":M("result"),L({isAI:m.isAI||!1,confidence:m.confidence||0,heatmapData:m.heatmapData,filterData:m.filterData});break;case"ERROR":M("error"),q(m.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(E),()=>chrome.runtime.onMessage.removeListener(E)},[]),w.useEffect(()=>{const E=C=>{if(!u||!h.current)return;let b=C.clientX-f.current.x,S=C.clientY-f.current.y;const g=h.current.getBoundingClientRect(),o=window.innerWidth,k=window.innerHeight,s=Math.max(0,o-g.width),t=Math.max(0,k-g.height);b=Math.max(0,Math.min(b,s)),S=Math.max(0,Math.min(S,t)),a({x:b,y:S})},m=()=>{i(!1)};return u&&(window.addEventListener("mousemove",E),window.addEventListener("mouseup",m)),()=>{window.removeEventListener("mousemove",E),window.removeEventListener("mouseup",m)}},[u]);const n=E=>{if(!h.current)return;const m=h.current.getBoundingClientRect(),C=m.left,b=m.top;f.current={x:E.clientX-C,y:E.clientY-b},j||a({x:C,y:b}),i(!0)},x=()=>{M("idle"),L(null),q(null),I(null),a(null),c(null)};if(T==="idle")return null;const N=T==="tools"?800:400;return e.jsxs(_.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:j?0:20},children:e.jsx("div",{ref:h,className:"pointer-events-auto transition-shadow duration-300",style:j?{position:"absolute",left:j.x,top:j.y,boxShadow:u?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(K,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:N},children:[e.jsx("div",{onMouseDown:n,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${u?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:x,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[T==="scanning"&&e.jsxs("div",{className:"relative",children:[A&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:A,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),T==="result"&&D&&A&&e.jsx(J,{result:D,targetImage:A,onToolsClick:()=>M("tools")}),T==="tools"&&A&&e.jsx(me,{targetImage:A,onBack:()=>M("result"),onClose:x,onMaximize:(E,m)=>c({url:E,title:m})}),T==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:d})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),l&&e.jsx(pe,{image:l.url,title:l.title,onClose:()=>c(null)})]})},xe=`
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
`;function be(T){const M=document.createElement("style");M.textContent=xe,T.appendChild(M)}const fe=`

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
`;function we(T){const M=document.createElement("style");M.textContent=fe,T.appendChild(M)}if(!document.getElementById("undiffused-root")){const T=document.createElement("div");T.id="undiffused-root",document.body.appendChild(T);const M=T.attachShadow({mode:"open"});be(M),we(M);const D=document.createElement("div");D.id="undiffused-app",M.appendChild(D);const L=document.createElement("div");L.id="undiffused-portal-root",Object.assign(L.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),M.appendChild(L),Z.createRoot(D).render(e.jsx(ue,{})),console.log("[UnDiffused] Content script injected")}
