import{r as w,j as e,a as X,R as K,G as Q,b as J,c as Z}from"./ResultView-BXWFaSCq.js";const ee=({icon:D,title:N,description:A,tier:O,index:d,children:q})=>{const[C,S]=w.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${d*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>S(!C),"aria-expanded":C,"aria-label":`${N} - ${A}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:D})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:N}),e.jsx("p",{className:"tool-card-desc",children:A})]}),e.jsx("div",{className:`tool-card-chevron ${C?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),O===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${C?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:q||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var te=X();function V({value:D,onChange:N,options:A,placeholder:O="Select...",disabled:d=!1}){const[q,C]=w.useState(!1),S=w.useRef(null),l=w.useRef(null),[h,v]=w.useState({top:0,left:0,width:0}),o=w.useCallback(()=>{var c;const a=(c=S.current)==null?void 0:c.getRootNode();if(a&&a instanceof ShadowRoot){let f=a.querySelector("#undiffused-portal-root");return f||(f=document.createElement("div"),f.id="undiffused-portal-root",Object.assign(f.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),a.appendChild(f)),f}return document.body},[]),m=A.find(a=>a.value===D),s=a=>{N(a),C(!1)},k=()=>{if(!d)if(!q&&S.current){const a=S.current.getBoundingClientRect();v({top:a.bottom+6,left:a.left,width:a.width}),C(!0)}else C(!1)};w.useEffect(()=>{var f;if(!q)return;const a=I=>{var L,j;const F=I.target;(L=S.current)!=null&&L.contains(F)||(j=l.current)!=null&&j.contains(F)||C(!1)},c=((f=S.current)==null?void 0:f.getRootNode())||document;return c.addEventListener("mousedown",a),()=>c.removeEventListener("mousedown",a)},[q]),w.useEffect(()=>{if(!q)return;const a=()=>C(!1);return window.addEventListener("resize",a),window.addEventListener("scroll",a,{capture:!0}),()=>{window.removeEventListener("resize",a),window.removeEventListener("scroll",a,{capture:!0})}},[q]);const b=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:h.top,left:h.left,width:h.width,zIndex:2147483647,pointerEvents:"auto"},children:A.map(a=>e.jsxs("div",{className:`liquid-select-option ${a.value===D?"selected":""}`,onClick:()=>s(a.value),role:"option","aria-selected":a.value===D,children:[e.jsx("span",{children:a.label}),a.value===D&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(a.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:S,type:"button",className:`liquid-select-trigger ${q?"open":""} ${d?"opacity-50 cursor-not-allowed":""}`,onClick:k,disabled:d,"aria-haspopup":"listbox","aria-expanded":q,children:[e.jsx("span",{children:m?m.label:O}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),q&&te.createPortal(b,o())]})}const oe=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(85),[d,q]=w.useState("medium"),[C,S]=w.useState(!1),[l,h]=w.useState(null),v=d==="low"?10:d==="medium"?20:40,o=w.useCallback(async()=>{S(!0),h(null);try{const m=new Image;m.crossOrigin="anonymous",await new Promise((i,t)=>{m.onload=()=>i(),m.onerror=()=>t(new Error("Failed to load image")),m.src=D});const s=m.naturalWidth,k=m.naturalHeight,b=document.createElement("canvas");b.width=s,b.height=k;const a=b.getContext("2d");a.drawImage(m,0,0);const c=a.getImageData(0,0,s,k),f=document.createElement("canvas");f.width=s,f.height=k;const I=f.getContext("2d");I.drawImage(m,0,0);const F=f.toDataURL("image/jpeg",A/100),L=new Image;await new Promise(i=>{L.onload=()=>i(),L.src=F}),I.drawImage(L,0,0);const j=I.getImageData(0,0,s,k),M=document.createElement("canvas");M.width=s,M.height=k;const p=M.getContext("2d"),n=p.createImageData(s,k);let y=0;for(let i=0;i<c.data.length;i+=4){const t=Math.abs(c.data[i]-j.data[i]),g=Math.abs(c.data[i+1]-j.data[i+1]),r=Math.abs(c.data[i+2]-j.data[i+2]);y+=t+g+r;const E=Math.min(255,t*v),z=Math.min(255,g*v),B=Math.min(255,r*v),T=(E+z+B)/3;T<64?(n.data[i]=0,n.data[i+1]=0,n.data[i+2]=Math.min(255,T*4)):T<128?(n.data[i]=0,n.data[i+1]=Math.min(255,(T-64)*4),n.data[i+2]=255-(T-64)*4):T<192?(n.data[i]=Math.min(255,(T-128)*4),n.data[i+1]=255,n.data[i+2]=0):(n.data[i]=255,n.data[i+1]=255-(T-192)*4,n.data[i+2]=0),n.data[i+3]=255}p.putImageData(n,0,0),N&&N(M),h({diffScore:y/(s*k)})}catch(m){console.error("[ELA] Analysis failed:",m)}finally{S(!1)}},[D,A,v,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",A,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:A,onChange:m=>O(Number(m.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(V,{value:d,onChange:m=>q(m),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${C?"tool-loading":""} `,onClick:o,disabled:C,children:C?"Analysing...":"🔬 Analyse Error Levels"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},ae=({targetImage:D,onResult:N})=>{const[A,O]=w.useState("luminance"),[d,q]=w.useState(32),[C,S]=w.useState(!1),[l,h]=w.useState(null),v=w.useCallback(async()=>{S(!0),h(null);try{const o=new Image;o.crossOrigin="anonymous",await new Promise((t,g)=>{o.onload=()=>t(),o.onerror=()=>g(new Error("Failed to load image")),o.src=D});const m=o.naturalWidth,s=o.naturalHeight,k=document.createElement("canvas");k.width=m,k.height=s;const b=k.getContext("2d");b.drawImage(o,0,0);const c=b.getImageData(0,0,m,s).data,f=t=>A==="chromatic"?(c[t]-c[t+1])*.5+128:.299*c[t]+.587*c[t+1]+.114*c[t+2],I=Math.floor(m/d),F=Math.floor(s/d),L=[];for(let t=0;t<F;t++)for(let g=0;g<I;g++){const r=[];for(let B=0;B<d;B++)for(let T=0;T<d;T++){const R=g*d+T,U=t*d+B,$=(U*m+R)*4,P=f($);let u=0,x=0;for(const[H,G]of[[-1,0],[1,0],[0,-1],[0,1]]){const Y=R+H,_=U+G;Y>=0&&Y<m&&_>=0&&_<s&&(u+=f((_*m+Y)*4),x++)}const W=P-u/x;r.push(W)}const E=r.reduce((B,T)=>B+T,0)/r.length,z=r.reduce((B,T)=>B+(T-E)**2,0)/r.length;L.push(z)}const j=L.reduce((t,g)=>t+g,0)/L.length,M=Math.sqrt(L.reduce((t,g)=>t+(g-j)**2,0)/L.length),p=Math.max(0,100-M/j*100),n=document.createElement("canvas");n.width=m,n.height=s;const y=n.getContext("2d");y.globalAlpha=.3,y.drawImage(o,0,0),y.globalAlpha=1;const i=Math.max(...L);for(let t=0;t<F;t++)for(let g=0;g<I;g++){const r=L[t*I+g],E=i>0?r/i:0,z=Math.floor(255*(1-E)),B=Math.floor(255*E);y.fillStyle=`rgba(${z}, ${B}, 60, 0.5)`,y.fillRect(g*d,t*d,d,d),y.strokeStyle="rgba(255,255,255,0.1)",y.strokeRect(g*d,t*d,d,d)}N&&N(n),h({mean:j,std:M,uniformity:p})}catch(o){console.error("[Noise] Analysis failed:",o)}finally{S(!1)}},[D,A,d,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(V,{value:A,onChange:o=>O(o),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",d,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:d,onChange:o=>q(Number(o.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${C?"tool-loading":""}`,onClick:v,disabled:C,children:C?"Analysing...":"📡 Analyse Noise"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},ne=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(5),[d,q]=w.useState(32),[C,S]=w.useState(!1),[l,h]=w.useState(null),v=(s,k,b,a,c)=>{let f=0;const I=Math.max(1,Math.floor(c/8));for(let F=0;F<c;F+=I)for(let L=0;L<c;L+=I){const j=((a+F)*k+(b+L))*4,M=s[j]*.299+s[j+1]*.587+s[j+2]*.114;f=(f<<5)-f+Math.floor(M/(12-A))|0}return f},o=(s,k,b,a,c,f,I)=>{let F=0,L=0;const j=Math.max(1,Math.floor(I/16));for(let M=0;M<I;M+=j)for(let p=0;p<I;p+=j){const n=((a+M)*k+(b+p))*4,y=((f+M)*k+(c+p))*4;F+=Math.abs(s[n]-s[y]),F+=Math.abs(s[n+1]-s[y+1]),F+=Math.abs(s[n+2]-s[y+2]),L++}return 1-F/(L*3*255)},m=w.useCallback(async()=>{S(!0),h(null);try{const s=new Image;s.crossOrigin="anonymous",await new Promise((t,g)=>{s.onload=()=>t(),s.onerror=()=>g(new Error("Failed to load")),s.src=D});const k=s.naturalWidth,b=s.naturalHeight,a=document.createElement("canvas");a.width=k,a.height=b;const c=a.getContext("2d");c.drawImage(s,0,0);const f=c.getImageData(0,0,k,b),I=Math.max(d/2,8),F=new Map;for(let t=0;t+d<=b;t+=I)for(let g=0;g+d<=k;g+=I){const r=v(f.data,k,g,t,d);F.has(r)||F.set(r,[]),F.get(r).push({x:g,y:t})}const L=[],j=d*2,M=.85+(A-5)*.01;for(const[,t]of F)if(!(t.length<2||t.length>50))for(let g=0;g<t.length&&g<10;g++)for(let r=g+1;r<t.length&&r<10;r++){if(Math.sqrt((t[g].x-t[r].x)**2+(t[g].y-t[r].y)**2)<j)continue;const z=o(f.data,k,t[g].x,t[g].y,t[r].x,t[r].y,d);z>=M&&L.push({ax:t[g].x,ay:t[g].y,bx:t[r].x,by:t[r].y,sim:z})}const p=document.createElement("canvas");p.width=k,p.height=b;const n=p.getContext("2d");n.drawImage(s,0,0);const y=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],i=L.slice(0,30);i.forEach((t,g)=>{const r=y[g%y.length];n.strokeStyle=r,n.lineWidth=2,n.globalAlpha=.7,n.strokeRect(t.ax,t.ay,d,d),n.strokeRect(t.bx,t.by,d,d),n.fillStyle=r,n.globalAlpha=.15,n.fillRect(t.ax,t.ay,d,d),n.fillRect(t.bx,t.by,d,d),n.globalAlpha=.4,n.setLineDash([4,4]),n.beginPath(),n.moveTo(t.ax+d/2,t.ay+d/2),n.lineTo(t.bx+d/2,t.by+d/2),n.stroke(),n.setLineDash([]),n.globalAlpha=1}),N&&N(p),h(i.length)}catch(s){console.error("[Clone] Detection failed:",s)}finally{S(!1)}},[D,A,d,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:A,onChange:s=>O(Number(s.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",d,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:d,onChange:s=>q(Number(s.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${C?"tool-loading":""}`,onClick:m,disabled:C,children:C?"Detecting...":"🎯 Detect Clones"}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},se=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(1),[d,q]=w.useState(!1),[C,S]=w.useState(null),l=(v,o)=>{const m=v.length;if(m<=1)return[v,o];const s=m/2,k=new Float64Array(s),b=new Float64Array(s),a=new Float64Array(s),c=new Float64Array(s);for(let p=0;p<s;p++)k[p]=v[2*p],b[p]=o[2*p],a[p]=v[2*p+1],c[p]=o[2*p+1];const[f,I]=l(k,b),[F,L]=l(a,c),j=new Float64Array(m),M=new Float64Array(m);for(let p=0;p<s;p++){const n=-2*Math.PI*p/m,y=Math.cos(n),i=Math.sin(n),t=y*F[p]-i*L[p],g=y*L[p]+i*F[p];j[p]=f[p]+t,M[p]=I[p]+g,j[p+s]=f[p]-t,M[p+s]=I[p]-g}return[j,M]},h=w.useCallback(async()=>{q(!0),S(null);try{const v=new Image;v.crossOrigin="anonymous",await new Promise((r,E)=>{v.onload=()=>r(),v.onerror=()=>E(new Error("Failed to load image")),v.src=D});const o=512,m=document.createElement("canvas");m.width=o,m.height=o;const s=m.getContext("2d");s.drawImage(v,0,0,o,o);const b=s.getImageData(0,0,o,o).data,a=new Float64Array(o*o);for(let r=0;r<o*o;r++)a[r]=(b[r*4]*.299+b[r*4+1]*.587+b[r*4+2]*.114)/255;const c=new Float64Array(a),f=new Float64Array(o*o);for(let r=0;r<o;r++){const E=new Float64Array(o),z=new Float64Array(o);for(let R=0;R<o;R++)E[R]=c[r*o+R],z[R]=f[r*o+R];const[B,T]=l(E,z);for(let R=0;R<o;R++)c[r*o+R]=B[R],f[r*o+R]=T[R]}for(let r=0;r<o;r++){const E=new Float64Array(o),z=new Float64Array(o);for(let R=0;R<o;R++)E[R]=c[R*o+r],z[R]=f[R*o+r];const[B,T]=l(E,z);for(let R=0;R<o;R++)c[R*o+r]=B[R],f[R*o+r]=T[R]}const I=new Float64Array(o*o),F=o/2;let L=0;for(let r=0;r<o;r++)for(let E=0;E<o;E++){const z=c[r*o+E],B=f[r*o+E];let T=Math.sqrt(z*z+B*B);T=Math.log(1+T)*A;const R=(r+F)%o,U=(E+F)%o,$=R*o+U;I[$]=T,T>L&&(L=T)}const j=I[F*o+F],p=I[0]/L*100,n=j/L*100;let y=0;for(let r=1;r<4;r++){const E=F+r*(o/8);E<o&&I[F*o+E]>I[F*o+E-1]*1.5&&y++}const i=document.createElement("canvas");i.width=o,i.height=o;const t=i.getContext("2d"),g=t.createImageData(o,o);for(let r=0;r<o*o;r++){const E=L>0?I[r]/L*255:0,z=r*4;g.data[z]=Math.min(255,E*.8),g.data[z+1]=Math.min(255,E*.9),g.data[z+2]=Math.min(255,E),g.data[z+3]=255}t.putImageData(g,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let r=30;r<F;r+=30)t.beginPath(),t.arc(F,F,r,0,Math.PI*2),t.stroke();N&&N(i),S({highFreq:p,lowFreq:n,gridArtifacts:y>3})}catch(v){console.error("[FFT] Analysis failed:",v)}finally{q(!1)}},[D,A,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",step:"0.1",value:A,onChange:v=>O(Number(v.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""} `,onClick:h,disabled:d,children:d?"Analysing...":"🌊 Generate Spectrum"}),C&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[C.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[C.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:C.gridArtifacts?"#ef4444":"#10b981"},children:C.gridArtifacts?"Detected":"None"})]})]})]})]})},re=({targetImage:D,onResult:N})=>{const[A,O]=w.useState("sobel"),[d,q]=w.useState(100),[C,S]=w.useState(!1),[l,h]=w.useState(null),[v,o]=w.useState(0),m=w.useRef(null),s=w.useRef(null),k=w.useCallback(async()=>{S(!0),h(null);try{const b=new Image;b.crossOrigin="anonymous",await new Promise((u,x)=>{b.onload=()=>u(),b.onerror=()=>x(new Error("Failed to load")),b.src=D});const a=b.naturalWidth,c=b.naturalHeight,f=document.createElement("canvas");f.width=a,f.height=c;const I=f.getContext("2d");I.drawImage(b,0,0);const L=I.getImageData(0,0,a,c).data,j=new Float64Array(a*c);for(let u=0;u<a*c;u++){const x=u*4;j[u]=.299*L[x]+.587*L[x+1]+.114*L[x+2]}const M=new Float64Array(a*c),p=new Uint8Array(a*c);if(A==="sobel"||A==="canny")for(let u=1;u<c-1;u++)for(let x=1;x<a-1;x++){const W=-j[(u-1)*a+(x-1)]+j[(u-1)*a+(x+1)]-2*j[u*a+(x-1)]+2*j[u*a+(x+1)]-j[(u+1)*a+(x-1)]+j[(u+1)*a+(x+1)],H=-j[(u-1)*a+(x-1)]-2*j[(u-1)*a+x]-j[(u-1)*a+(x+1)]+j[(u+1)*a+(x-1)]+2*j[(u+1)*a+x]+j[(u+1)*a+(x+1)],G=Math.sqrt(W*W+H*H);M[u*a+x]=G,p[u*a+x]=G>d?255:0}else for(let u=1;u<c-1;u++)for(let x=1;x<a-1;x++){const W=-4*j[u*a+x]+j[(u-1)*a+x]+j[(u+1)*a+x]+j[u*a+(x-1)]+j[u*a+(x+1)],H=Math.abs(W);M[u*a+x]=H,p[u*a+x]=H>d/2?255:0}let n=0,y=0;const i=32,t=[];for(let u=0;u<a*c;u++)p[u]>0&&n++,y+=M[u];for(let u=0;u<Math.floor(c/i);u++)for(let x=0;x<Math.floor(a/i);x++){let W=0;for(let H=0;H<i;H++)for(let G=0;G<i;G++)W+=M[(u*i+H)*a+(x*i+G)];t.push(W/(i*i))}const g=t.reduce((u,x)=>u+x,0)/t.length,r=Math.sqrt(t.reduce((u,x)=>u+(x-g)**2,0)/t.length),E=g>0?Math.max(0,100-r/g*50):0;h({edgeDensity:n/(a*c)*1e4,avgStrength:y/(a*c),uniformity:E});const z=document.createElement("canvas");z.width=a,z.height=c;const B=z.getContext("2d"),T=B.createImageData(a,c);for(let u=0;u<a*c;u++){const x=u*4;T.data[x]=T.data[x+1]=T.data[x+2]=p[u],T.data[x+3]=255}B.putImageData(T,0,0);const R=document.createElement("canvas");R.width=a,R.height=c;const U=R.getContext("2d"),$=U.createImageData(a,c),P=Math.max(...M);for(let u=0;u<a*c;u++){const x=u*4,W=P>0?M[u]/P:0;W<.25?($.data[x]=0,$.data[x+1]=Math.floor(W*4*255),$.data[x+2]=255):W<.5?($.data[x]=0,$.data[x+1]=255,$.data[x+2]=Math.floor((1-(W-.25)*4)*255)):W<.75?($.data[x]=Math.floor((W-.5)*4*255),$.data[x+1]=255,$.data[x+2]=0):($.data[x]=255,$.data[x+1]=Math.floor((1-(W-.75)*4)*255),$.data[x+2]=0),$.data[x+3]=255}U.putImageData($,0,0),m.current=z,s.current=R,h({edgeDensity:n/(a*c)*1e4,avgStrength:y/(a*c),uniformity:E})}catch(b){console.error("[Gradient] Analysis failed:",b)}finally{S(!1)}},[D,A,d]);return K.useEffect(()=>{l&&N&&(v===0&&m.current?N(m.current):v===1&&s.current&&N(s.current))},[l,v,N]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(V,{value:A,onChange:b=>O(b),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",d]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:d,onChange:b=>q(Number(b.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${C?"tool-loading":""}`,onClick:k,disabled:C,children:C?"Analysing...":"📐 Analyse Gradients"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${v===0?"tool-tab-active":""}`,onClick:()=>o(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${v===1?"tool-tab-active":""}`,onClick:()=>o(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},ie=({targetImage:D,onResult:N})=>{const[A,O]=w.useState("medium"),[d,q]=w.useState(!1),[C,S]=w.useState(0),[l,h]=w.useState(null),v=w.useCallback(async()=>{q(!0),h(null),S(0);try{const o=new Image;o.crossOrigin="anonymous",await new Promise((P,u)=>{o.onload=()=>P(),o.onerror=()=>u(new Error("Failed to load")),o.src=D}),S(20);const m=o.naturalWidth,s=o.naturalHeight,k=document.createElement("canvas");k.width=m,k.height=s;const b=k.getContext("2d");b.drawImage(o,0,0);const c=b.getImageData(0,0,m,s).data,f=new Float64Array(m*s);for(let P=0;P<m*s;P++)f[P]=.299*c[P*4]+.587*c[P*4+1]+.114*c[P*4+2];S(40);const F=Math.floor((A==="low"?3:A==="medium"?5:7)/2),L=new Float64Array(m*s);for(let P=0;P<s;P++)for(let u=0;u<m;u++){let x=0,W=0;for(let H=-F;H<=F;H++)for(let G=-F;G<=F;G++){const Y=P+H,_=u+G;Y>=0&&Y<s&&_>=0&&_<m&&(x+=f[Y*m+_],W++)}L[P*m+u]=x/W}S(70);const j=new Float64Array(m*s);for(let P=0;P<m*s;P++)j[P]=f[P]-L[P];const M=32,p=Math.floor(m/M),n=Math.floor(s/M),y=[];for(let P=0;P<n;P++)for(let u=0;u<p;u++){const x=[];for(let G=0;G<M;G++)for(let Y=0;Y<M;Y++)x.push(j[(P*M+G)*m+(u*M+Y)]);const W=x.reduce((G,Y)=>G+Y,0)/x.length,H=x.reduce((G,Y)=>G+(Y-W)**2,0)/x.length;y.push(H)}const i=y.reduce((P,u)=>P+u,0)/y.length,t=Math.sqrt(y.reduce((P,u)=>P+(u-i)**2,0)/y.length),g=i>0?Math.min(100,t/i*100):0,r=100-g,E=g>30;h({hasFingerprint:E,consistency:g,uniformity:r}),S(90);const z=document.createElement("canvas");z.width=m,z.height=s;const B=z.getContext("2d"),T=B.createImageData(m,s);let R=1/0,U=-1/0;for(let P=0;P<j.length;P++)j[P]<R&&(R=j[P]),j[P]>U&&(U=j[P]);const $=U-R||1;for(let P=0;P<m*s;P++){const u=(j[P]-R)/$*255,x=P*4,W=Math.min(255,u*3);T.data[x]=W,T.data[x+1]=W,T.data[x+2]=W,T.data[x+3]=255}B.putImageData(T,0,0),N&&N(z),S(100),h({hasFingerprint:E,consistency:g,uniformity:r})}catch(o){console.error("[PRNU] Analysis failed:",o)}finally{q(!1)}},[D,A,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(V,{value:A,onChange:o=>O(o),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:v,disabled:d,children:d?"Extracting PRNU...":"📷 Extract PRNU"}),d&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${C}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},le=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(6),[d,q]=w.useState(!1),[C,S]=w.useState(null),l=w.useCallback(async()=>{q(!0),S(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((p,n)=>{h.onload=()=>p(),h.onerror=()=>n(new Error("Failed to load")),h.src=D});const v=h.naturalWidth,o=h.naturalHeight,m=document.createElement("canvas");m.width=v,m.height=o;const s=m.getContext("2d");s.drawImage(h,0,0);const b=s.getImageData(0,0,v,o).data,a=200+(10-A)*5,c=[],f=16;for(let p=0;p<Math.floor(o/f);p++)for(let n=0;n<Math.floor(v/f);n++){let y=0,i=0,t=0;for(let g=0;g<f;g++)for(let r=0;r<f;r++){const E=n*f+r,z=p*f+g,B=(z*v+E)*4,T=Math.max(b[B],b[B+1],b[B+2]);T>y&&(y=T,i=E,t=z)}y>a&&c.push({x:i,y:t,intensity:y})}const I=[];for(const p of c){let n=0,y=0;const i=10;for(let g=-i;g<=i;g++)for(let r=-i;r<=i;r++){const E=p.x+r,z=p.y+g;if(E<0||E>=v||z<0||z>=o)continue;const B=(z*v+E)*4,T=.299*b[B]+.587*b[B+1]+.114*b[B+2];n+=r*T,y+=g*T}const t=Math.atan2(y,n);I.push(t)}let F=0,L=0;if(I.length>1){const p=I.reduce((n,y)=>n+y,0)/I.length;for(const n of I){const y=Math.abs(n-p);y<Math.PI/4||y>Math.PI*7/4?F++:L++}}S({highlights:c.length,consistent:F,inconsistent:L});const j=document.createElement("canvas");j.width=v,j.height=o;const M=j.getContext("2d");M.drawImage(h,0,0),c.forEach((p,n)=>{const y=n<I.length&&(()=>{const i=I.reduce((g,r)=>g+r,0)/I.length,t=Math.abs(I[n]-i);return t<Math.PI/4||t>Math.PI*7/4})();if(M.beginPath(),M.arc(p.x,p.y,12,0,Math.PI*2),M.strokeStyle=y?"#fbbf24":"#ef4444",M.lineWidth=2,M.stroke(),n<I.length){const i=I[n],t=25;M.beginPath(),M.moveTo(p.x,p.y),M.lineTo(p.x+Math.cos(i)*t,p.y+Math.sin(i)*t),M.strokeStyle=y?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",M.lineWidth=2,M.stroke()}}),N&&N(j),S({highlights:c.length,consistent:F,inconsistent:L})}catch(h){console.error("[Highlight] Analysis failed:",h)}finally{q(!1)}},[D,A,N]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:A,onChange:h=>O(Number(h.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:l,disabled:d,children:d?"Detecting...":"✨ Detect Highlights"}),C&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:C.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[C.consistent," / ",C.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${C.inconsistent>C.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:C.inconsistent>C.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},ce=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(!1),[d,q]=w.useState(null),C=w.useCallback(async()=>{O(!0),q(null);try{const S=new Image;S.crossOrigin="anonymous",await new Promise((n,y)=>{S.onload=()=>n(),S.onerror=()=>y(new Error("Failed to load")),S.src=D});const l=S.naturalWidth,h=S.naturalHeight,v=document.createElement("canvas");v.width=l,v.height=h;const o=v.getContext("2d");o.drawImage(S,0,0);const s=o.getImageData(0,0,l,h).data,k=new Float64Array(l*h),b=new Float64Array(l*h),a=new Float64Array(l*h);for(let n=0;n<l*h;n++)k[n]=s[n*4],b[n]=s[n*4+1],a[n]=s[n*4+2];const c=[];for(let n=2;n<h-2;n+=4)for(let y=2;y<l-2;y+=4){const i=z=>.299*k[z]+.587*b[z]+.114*a[z],t=n*l+y,g=-i(t-l-1)+i(t-l+1)-2*i(t-1)+2*i(t+1)-i(t+l-1)+i(t+l+1),r=-i(t-l-1)-2*i(t-l)-i(t-l+1)+i(t+l-1)+2*i(t+l)+i(t+l+1),E=Math.sqrt(g*g+r*r);E>100&&c.push({x:y,y:n,strength:E})}let f=0;const I=[];for(const n of c.slice(0,200)){const y=U=>{const $=n.y*l+n.x,P=-U[$-l-1]+U[$-l+1]-2*U[$-1]+2*U[$+1]-U[$+l-1]+U[$+l+1],u=-U[$-l-1]-2*U[$-l]-U[$-l+1]+U[$+l-1]+2*U[$+l]+U[$+l+1];return{gx:P,gy:u,mag:Math.sqrt(P*P+u*u)}},i=y(k),t=y(b),g=y(a),r=Math.atan2(i.gy,i.gx),E=Math.atan2(t.gy,t.gx),z=Math.atan2(g.gy,g.gx),B=Math.abs(r-E),T=Math.abs(z-E),R=(B+T)/2;f+=R,I.push({x:n.x,y:n.y,sep:R})}const F=c.length>0?f/Math.min(c.length,200):0,L=F>.05,j=document.createElement("canvas");j.width=l,j.height=h;const M=j.getContext("2d"),p=M.createImageData(l,h);for(let n=0;n<l*h;n++){const y=n*4;p.data[y]=Math.min(255,Math.abs(k[n]-b[n])*5),p.data[y+1]=Math.min(255,Math.abs(b[n]-a[n])*5),p.data[y+2]=Math.min(255,Math.abs(a[n]-k[n])*5),p.data[y+3]=255}M.putImageData(p,0,0);for(const n of I)M.beginPath(),M.arc(n.x,n.y,3,0,Math.PI*2),M.fillStyle=n.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",M.fill();N&&N(j),q({avgSeparation:F*100,detected:L,edgesAnalysed:Math.min(c.length,200)})}catch(S){console.error("[Aberration] Analysis failed:",S)}finally{O(!1)}},[D,N]);return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""}`,onClick:C,disabled:A,children:A?"Checking...":"🌈 Check for Aberration"}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[d.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:d.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${d.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:d.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},de=({targetImage:D,onResult:N})=>{const[A,O]=w.useState(!0),[d,q]=w.useState(!1),[C,S]=w.useState(null),l=w.useCallback(async()=>{q(!0),S(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((i,t)=>{h.onload=()=>i(),h.onerror=()=>t(new Error("Failed to load")),h.src=D});const v=h.naturalWidth,o=h.naturalHeight,m=document.createElement("canvas");m.width=v,m.height=o;const s=m.getContext("2d");s.drawImage(h,0,0);const k=s.getImageData(0,0,v,o).data,b=8,a=Math.floor(v/b),c=Math.floor(o/b),f=[];for(let i=0;i<c;i++)for(let t=0;t<a;t++){let g=0,r=0;if(t<a-1)for(let E=0;E<b;E++){const B=((i*b+E)*v+(t+1)*b-1)*4,T=B+4;g+=Math.abs(k[B]-k[T])+Math.abs(k[B+1]-k[T+1])+Math.abs(k[B+2]-k[T+2]),r++}if(i<c-1)for(let E=0;E<b;E++){const z=t*b+E,B=(i+1)*b-1,T=B+1,R=(B*v+z)*4,U=(T*v+z)*4;g+=Math.abs(k[R]-k[U])+Math.abs(k[R+1]-k[U+1])+Math.abs(k[R+2]-k[U+2]),r++}f.push(r>0?g/(r*3):0)}const I=f.reduce((i,t)=>i+t,0)/f.length,F=Math.sqrt(f.reduce((i,t)=>i+(t-I)**2,0)/f.length);let L=0;for(const i of f)Math.abs(i-I)>F*2&&L++;const j=Math.max(10,Math.min(100,100-I*2)),M=L>a*c*.1?2:1,p=document.createElement("canvas");p.width=v,p.height=o;const n=p.getContext("2d");n.drawImage(h,0,0);const y=Math.max(...f);for(let i=0;i<c;i++)for(let t=0;t<a;t++){const g=y>0?f[i*a+t]/y:0,r=g<.33?0:g<.66?200:220,E=g<.33||g<.66?180:50;n.fillStyle=`rgba(${r},${E},0,0.3)`,n.fillRect(t*b,i*b,b,b),A&&(n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=.5,n.strokeRect(t*b,i*b,b,b))}N&&N(p),S({quality:j,layers:M,inconsistent:L})}catch(h){console.error("[Compression]",h)}finally{q(!1)}},[D,A,N]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:A,onChange:h=>O(h.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${d?"tool-loading":""}`,onClick:l,disabled:d,children:d?"Analysing...":"🔳 Analyse Compression"}),C&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[C.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:C.layers})]})]}),e.jsx("div",{className:`tool-verdict ${C.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:C.layers>1?`⚠️ Multiple re-compressions (${C.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},ge=({targetImage:D})=>{const[N,A]=w.useState(!1),[O,d]=w.useState(null),q=w.useCallback(async()=>{var l;A(!0),d(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((r,E)=>{h.onload=()=>r(),h.onerror=()=>E(),h.src=D});const v=D,o=v.startsWith("data:"),m=v.startsWith("blob:"),s=!o&&!m?new URL(v):null,k=s?s.pathname.split("/").pop()||"unknown":"embedded",b=((l=k.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let a="",c="",f="";try{const r=await fetch(D,{method:"HEAD",mode:"cors"});a=r.headers.get("content-type")||"",c=r.headers.get("content-length")||"",f=r.headers.get("last-modified")||""}catch{}const I=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],F=v.toLowerCase(),L=I.some(r=>F.includes(r)),M=s?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(r=>s.hostname.includes(r)):!1,p={Source:o?"Data URL (embedded)":m?"Blob URL (local)":(s==null?void 0:s.hostname)||"Unknown",Filename:k,Format:a||b.toUpperCase(),Dimensions:`${h.naturalWidth} × ${h.naturalHeight}`},n={"Aspect Ratio":(h.naturalWidth/h.naturalHeight).toFixed(2),"Total Pixels":`${(h.naturalWidth*h.naturalHeight/1e6).toFixed(1)} MP`};c&&(n["File Size"]=`${(parseInt(c)/1024).toFixed(1)} KB`);const y={};f&&(y["Last Modified"]=f);const i={};L&&(i["AI Indicator"]="⚠️ AI-related keywords found in URL"),M&&(i.Hosting="⚠️ Known AI image hosting platform");let t="authentic",g="✅ No suspicious metadata detected";L||M?(t="ai",g="❌ AI generation indicators detected in metadata"):(o||m)&&(t="suspicious",g="⚠️ Embedded/local image — limited metadata available"),d({camera:p,settings:n,dates:y,software:i,verdict:t,verdictText:g})}catch(h){console.error("[Metadata]",h)}finally{A(!1)}},[D]),C=()=>{if(!O)return;const l=JSON.stringify({...O.camera,...O.settings,...O.dates,...O.software},null,2);navigator.clipboard.writeText(l)},S=(l,h,v)=>Object.keys(v).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:h}),e.jsx("h4",{children:l})]}),Object.entries(v).map(([o,m])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:o}),e.jsx("span",{className:`metadata-value ${m.includes("Not found")?"metadata-missing":""}`,children:m})]},o))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${N?"tool-loading":""}`,onClick:q,disabled:N,children:N?"Extracting...":"📋 Extract Metadata"}),O&&e.jsxs("div",{className:"tool-output-area",children:[S("Image Information","📷",O.camera),S("Properties","⚙️",O.settings),S("Dates","📅",O.dates),S("Software & AI Detection","🖥️",O.software),e.jsx("div",{className:`tool-verdict ${O.verdict==="authentic"?"tool-verdict-safe":O.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:O.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:C,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},he=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:oe},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ae},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:ne},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:se},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:re},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ie},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:le},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:ce},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:de},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:ge}],me=({targetImage:D,onBack:N,onClose:A})=>{var m;const[O,d]=w.useState(null),[q,C]=w.useState(50),[S,l]=w.useState("ltr"),h=w.useRef(null),v=w.useCallback(s=>{d(s.toDataURL())},[]),o=s=>{if(!h.current)return;const k=h.current.getBoundingClientRect(),b="touches"in s?s.touches[0].clientX:s.clientX,a=Math.max(0,Math.min(b-k.left,k.width));C(a/k.width*100)};return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:N,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:A,"aria-label":"Close",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:h,onMouseMove:o,onTouchMove:o,children:[e.jsx("img",{src:D,alt:"Original",className:"comparison-image"}),O&&e.jsx("div",{className:"comparison-overlay",style:{width:`${S==="ltr"?q:100-q}%`,left:S==="ltr"?0:"auto",right:S==="rtl"?0:"auto",borderRight:S==="ltr"?"2px solid #fff":"none",borderLeft:S==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:O,alt:"Analyzed",className:"comparison-image",style:{width:((m=h.current)==null?void 0:m.offsetWidth)||"100%",marginLeft:S==="ltr"?0:`-${100-q}%`}})}),O&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${q}%`}})]}),O&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>d(null),title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:q,onChange:s=>C(Number(s.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>l(s=>s==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!O&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),e.jsx("div",{className:"forensic-tools-grid",children:he.map((s,k)=>e.jsx(ee,{icon:s.icon,title:s.title,description:s.desc,tier:s.tier,index:k,children:e.jsx(s.Component,{targetImage:D,onResult:v})},s.title))})]})},pe=()=>{const[D,N]=w.useState("idle"),[A,O]=w.useState(null),[d,q]=w.useState(null),[C,S]=w.useState(null),[l,h]=w.useState(null),[v,o]=w.useState(!1),m=w.useRef({x:0,y:0}),s=w.useRef(null);w.useEffect(()=>{const a=c=>{switch(c.type){case"SCANNING":N("scanning"),S(c.imageUrl||null),O(null),q(null);break;case"SHOW_RESULT":N("result"),O({isAI:c.isAI||!1,confidence:c.confidence||0,heatmapData:c.heatmapData,filterData:c.filterData});break;case"ERROR":N("error"),q(c.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(a),()=>chrome.runtime.onMessage.removeListener(a)},[]),w.useEffect(()=>{const a=f=>{v&&h({x:f.clientX-m.current.x,y:f.clientY-m.current.y})},c=()=>{o(!1)};return v&&(window.addEventListener("mousemove",a),window.addEventListener("mouseup",c)),()=>{window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",c)}},[v]);const k=a=>{if(!s.current)return;a.preventDefault();const c=s.current.getBoundingClientRect(),f=l?l.x:c.left,I=l?l.y:c.top;m.current={x:a.clientX-f,y:a.clientY-I},l||h({x:f,y:I}),o(!0)},b=()=>{N("idle"),O(null),q(null),S(null)};return D==="idle"?null:e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",children:e.jsx("div",{ref:s,className:"pointer-events-auto absolute transition-shadow duration-300",style:l?{left:l.x,top:l.y,boxShadow:v?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:e.jsxs(Q,{className:`relative overflow-hidden p-6 pt-6 transition-all duration-300 ${D==="tools"?"min-w-[700px] max-w-[800px]":"min-w-[320px] max-w-[400px]"}`,children:[e.jsx("div",{onMouseDown:k,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${v?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:b,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),D==="scanning"&&e.jsxs("div",{className:"relative",children:[C&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:C,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),D==="result"&&A&&C&&e.jsx(J,{result:A,targetImage:C,onToolsClick:()=>N("tools")}),D==="tools"&&C&&e.jsx(me,{targetImage:C,onBack:()=>N("result"),onClose:b}),D==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:d})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})})},ue=`
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
`;function be(D){const N=document.createElement("style");N.textContent=ue,D.appendChild(N)}const xe=`

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
`;function fe(D){const N=document.createElement("style");N.textContent=xe,D.appendChild(N)}if(!document.getElementById("undiffused-root")){const D=document.createElement("div");D.id="undiffused-root",document.body.appendChild(D);const N=D.attachShadow({mode:"open"});be(N),fe(N);const A=document.createElement("div");A.id="undiffused-app",N.appendChild(A);const O=document.createElement("div");O.id="undiffused-portal-root",Object.assign(O.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),N.appendChild(O),Z.createRoot(A).render(e.jsx(pe,{})),console.log("[UnDiffused] Content script injected")}
