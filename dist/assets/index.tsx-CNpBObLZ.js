import{r as y,j as e,a as X,G as K,R as Q,c as J}from"./ResultView-C3Hhq1HA.js";const Z=({icon:R,title:w,description:q,tier:s,index:$,children:S})=>{const[T,m]=y.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${$*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>m(!T),"aria-expanded":T,"aria-label":`${w} - ${q}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:R})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:w}),e.jsx("p",{className:"tool-card-desc",children:q})]}),e.jsx("div",{className:`tool-card-chevron ${T?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),s===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${T?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:S||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var ee=X();function V({value:R,onChange:w,options:q,placeholder:s="Select...",disabled:$=!1}){const[S,T]=y.useState(!1),m=y.useRef(null),v=y.useRef(null),[h,D]=y.useState({top:0,left:0,width:0}),a=y.useCallback(()=>{var g;const t=(g=m.current)==null?void 0:g.getRootNode();if(t&&t instanceof ShadowRoot){let k=t.querySelector("#undiffused-portal-root");return k||(k=document.createElement("div"),k.id="undiffused-portal-root",Object.assign(k.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),t.appendChild(k)),k}return document.body},[]),C=q.find(t=>t.value===R),d=t=>{w(t),T(!1)},u=()=>{if(!$)if(!S&&m.current){const t=m.current.getBoundingClientRect();D({top:t.bottom+6,left:t.left,width:t.width}),T(!0)}else T(!1)};y.useEffect(()=>{var k;if(!S)return;const t=F=>{var j,E;const I=F.target;(j=m.current)!=null&&j.contains(I)||(E=v.current)!=null&&E.contains(I)||T(!1)},g=((k=m.current)==null?void 0:k.getRootNode())||document;return g.addEventListener("mousedown",t),()=>g.removeEventListener("mousedown",t)},[S]),y.useEffect(()=>{if(!S)return;const t=()=>T(!1);return window.addEventListener("resize",t),window.addEventListener("scroll",t,{capture:!0}),()=>{window.removeEventListener("resize",t),window.removeEventListener("scroll",t,{capture:!0})}},[S]);const n=e.jsx("div",{ref:v,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:h.top,left:h.left,width:h.width,zIndex:2147483647,pointerEvents:"auto"},children:q.map(t=>e.jsxs("div",{className:`liquid-select-option ${t.value===R?"selected":""}`,onClick:()=>d(t.value),role:"option","aria-selected":t.value===R,children:[e.jsx("span",{children:t.label}),t.value===R&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(t.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:m,type:"button",className:`liquid-select-trigger ${S?"open":""} ${$?"opacity-50 cursor-not-allowed":""}`,onClick:u,disabled:$,"aria-haspopup":"listbox","aria-expanded":S,children:[e.jsx("span",{children:C?C.label:s}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),S&&ee.createPortal(n,a())]})}const te=({targetImage:R})=>{const[w,q]=y.useState(85),[s,$]=y.useState("medium"),[S,T]=y.useState(!1),[m,v]=y.useState(!1),[h,D]=y.useState(100),a=y.useRef(null),C=y.useRef(null),d=s==="low"?10:s==="medium"?20:40,u=y.useCallback(async()=>{T(!0),v(!1);try{const t=new Image;t.crossOrigin="anonymous",await new Promise((l,O)=>{t.onload=()=>l(),t.onerror=()=>O(new Error("Failed to load image")),t.src=R});const g=t.naturalWidth,k=t.naturalHeight,F=C.current;if(!F)return;F.width=g,F.height=k;const I=F.getContext("2d");I.drawImage(t,0,0);const j=I.getImageData(0,0,g,k),E=document.createElement("canvas");E.width=g,E.height=k;const N=E.getContext("2d");N.drawImage(t,0,0);const M=E.toDataURL("image/jpeg",w/100),r=new Image;await new Promise(l=>{r.onload=()=>l(),r.src=M}),N.drawImage(r,0,0);const b=N.getImageData(0,0,g,k),x=a.current;if(!x)return;x.width=g,x.height=k;const o=x.getContext("2d"),c=o.createImageData(g,k);for(let l=0;l<j.data.length;l+=4){const O=Math.abs(j.data[l]-b.data[l]),f=Math.abs(j.data[l+1]-b.data[l+1]),A=Math.abs(j.data[l+2]-b.data[l+2]),L=Math.min(255,O*d),B=Math.min(255,f*d),z=Math.min(255,A*d),P=(L+B+z)/3;P<64?(c.data[l]=0,c.data[l+1]=0,c.data[l+2]=Math.min(255,P*4)):P<128?(c.data[l]=0,c.data[l+1]=Math.min(255,(P-64)*4),c.data[l+2]=255-(P-64)*4):P<192?(c.data[l]=Math.min(255,(P-128)*4),c.data[l+1]=255,c.data[l+2]=0):(c.data[l]=255,c.data[l+1]=255-(P-192)*4,c.data[l+2]=0),c.data[l+3]=255}o.putImageData(c,0,0),v(!0)}catch(t){console.error("[ELA] Analysis failed:",t)}finally{T(!1)}},[R,w,d]),n=()=>{const t=a.current;if(!t)return;const g=document.createElement("a");g.download="ela-analysis.png",g.href=t.toDataURL("image/png"),g.click()};return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",w,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:w,onChange:t=>q(Number(t.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(V,{value:s,onChange:t=>$(t),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${S?"tool-loading":""}`,onClick:u,disabled:S,children:S?"Analysing...":"🔬 Analyse"}),m&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx("canvas",{ref:C,className:"tool-output-canvas",style:{opacity:1-h/100}}),e.jsx("canvas",{ref:a,className:"tool-output-canvas",style:{position:"absolute",top:0,left:0,opacity:h/100}})]}),e.jsxs("div",{className:"tool-control-group",style:{marginTop:10},children:[e.jsxs("label",{className:"tool-control-label",children:["ELA Overlay Opacity: ",h,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:h,onChange:t=>D(Number(t.target.value))})]}),e.jsx("button",{className:"tool-export-btn",onClick:n,children:"📥 Export PNG"})]}),!m&&e.jsx("canvas",{ref:a,style:{display:"none"}}),!m&&e.jsx("canvas",{ref:C,style:{display:"none"}})]})},oe=({targetImage:R})=>{const[w,q]=y.useState("luminance"),[s,$]=y.useState(32),[S,T]=y.useState(!1),[m,v]=y.useState(null),h=y.useRef(null),D=y.useCallback(async()=>{T(!0),v(null);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((o,c)=>{a.onload=()=>o(),a.onerror=()=>c(new Error("Failed to load")),a.src=R});const C=a.naturalWidth,d=a.naturalHeight,u=document.createElement("canvas");u.width=C,u.height=d;const n=u.getContext("2d");n.drawImage(a,0,0);const g=n.getImageData(0,0,C,d).data,k=o=>w==="chromatic"?(g[o]-g[o+1])*.5+128:.299*g[o]+.587*g[o+1]+.114*g[o+2],F=Math.floor(C/s),I=Math.floor(d/s),j=[];for(let o=0;o<I;o++)for(let c=0;c<F;c++){const l=[];for(let A=0;A<s;A++)for(let L=0;L<s;L++){const B=c*s+L,z=o*s+A,P=(z*C+B)*4,i=k(P);let p=0,U=0;for(const[H,Y]of[[-1,0],[1,0],[0,-1],[0,1]]){const G=B+H,_=z+Y;G>=0&&G<C&&_>=0&&_<d&&(p+=k((_*C+G)*4),U++)}const W=i-p/U;l.push(W)}const O=l.reduce((A,L)=>A+L,0)/l.length,f=l.reduce((A,L)=>A+(L-O)**2,0)/l.length;j.push(f)}const E=j.reduce((o,c)=>o+c,0)/j.length,N=Math.sqrt(j.reduce((o,c)=>o+(c-E)**2,0)/j.length),M=Math.max(0,100-N/E*100);v({mean:E,std:N,uniformity:M});const r=h.current;if(!r)return;r.width=C,r.height=d;const b=r.getContext("2d");b.globalAlpha=.3,b.drawImage(a,0,0),b.globalAlpha=1;const x=Math.max(...j);for(let o=0;o<I;o++)for(let c=0;c<F;c++){const l=j[o*F+c],O=x>0?l/x:0,f=Math.floor(255*(1-O)),A=Math.floor(255*O);b.fillStyle=`rgba(${f}, ${A}, 60, 0.5)`,b.fillRect(c*s,o*s,s,s),b.strokeStyle="rgba(255,255,255,0.1)",b.strokeRect(c*s,o*s,s,s)}}catch(a){console.error("[Noise] Analysis failed:",a)}finally{T(!1)}},[R,w,s]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(V,{value:w,onChange:a=>q(a),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",s,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:s,onChange:a=>$(Number(a.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${S?"tool-loading":""}`,onClick:D,disabled:S,children:S?"Analysing...":"📡 Analyse Noise"}),m&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:h,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("p",{className:"tool-stat-value",children:m.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("p",{className:"tool-stat-value",children:m.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${m.uniformity>70?"tool-verdict-danger":m.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[m.uniformity>70?"⚠️":m.uniformity>40?"🤔":"✅"," ","Uniformity: ",m.uniformity.toFixed(1),"% — ",m.uniformity>70?"Uniform noise (AI suspect)":m.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]}),!m&&e.jsx("canvas",{ref:h,style:{display:"none"}})]})},ae=({targetImage:R})=>{const[w,q]=y.useState(5),[s,$]=y.useState(32),[S,T]=y.useState(!1),[m,v]=y.useState(null),h=y.useRef(null),D=(d,u,n,t,g)=>{let k=0;const F=Math.max(1,Math.floor(g/8));for(let I=0;I<g;I+=F)for(let j=0;j<g;j+=F){const E=((t+I)*u+(n+j))*4,N=d[E]*.299+d[E+1]*.587+d[E+2]*.114;k=(k<<5)-k+Math.floor(N/(12-w))|0}return k},a=(d,u,n,t,g,k,F)=>{let I=0,j=0;const E=Math.max(1,Math.floor(F/16));for(let N=0;N<F;N+=E)for(let M=0;M<F;M+=E){const r=((t+N)*u+(n+M))*4,b=((k+N)*u+(g+M))*4;I+=Math.abs(d[r]-d[b]),I+=Math.abs(d[r+1]-d[b+1]),I+=Math.abs(d[r+2]-d[b+2]),j++}return 1-I/(j*3*255)},C=y.useCallback(async()=>{T(!0),v(null);try{const d=new Image;d.crossOrigin="anonymous",await new Promise((o,c)=>{d.onload=()=>o(),d.onerror=()=>c(new Error("Failed to load")),d.src=R});const u=d.naturalWidth,n=d.naturalHeight,t=document.createElement("canvas");t.width=u,t.height=n;const g=t.getContext("2d");g.drawImage(d,0,0);const k=g.getImageData(0,0,u,n),F=Math.max(s/2,8),I=new Map;for(let o=0;o+s<=n;o+=F)for(let c=0;c+s<=u;c+=F){const l=D(k.data,u,c,o,s);I.has(l)||I.set(l,[]),I.get(l).push({x:c,y:o})}const j=[],E=s*2,N=.85+(w-5)*.01;for(const[,o]of I)if(!(o.length<2||o.length>50))for(let c=0;c<o.length&&c<10;c++)for(let l=c+1;l<o.length&&l<10;l++){if(Math.sqrt((o[c].x-o[l].x)**2+(o[c].y-o[l].y)**2)<E)continue;const f=a(k.data,u,o[c].x,o[c].y,o[l].x,o[l].y,s);f>=N&&j.push({ax:o[c].x,ay:o[c].y,bx:o[l].x,by:o[l].y,sim:f})}const M=h.current;if(!M)return;M.width=u,M.height=n;const r=M.getContext("2d");r.drawImage(d,0,0);const b=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],x=j.slice(0,30);x.forEach((o,c)=>{const l=b[c%b.length];r.strokeStyle=l,r.lineWidth=2,r.globalAlpha=.7,r.strokeRect(o.ax,o.ay,s,s),r.strokeRect(o.bx,o.by,s,s),r.fillStyle=l,r.globalAlpha=.15,r.fillRect(o.ax,o.ay,s,s),r.fillRect(o.bx,o.by,s,s),r.globalAlpha=.4,r.setLineDash([4,4]),r.beginPath(),r.moveTo(o.ax+s/2,o.ay+s/2),r.lineTo(o.bx+s/2,o.by+s/2),r.stroke(),r.setLineDash([]),r.globalAlpha=1}),v(x.length)}catch(d){console.error("[Clone] Detection failed:",d)}finally{T(!1)}},[R,w,s]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",w]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:w,onChange:d=>q(Number(d.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",s,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:s,onChange:d=>$(Number(d.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${S?"tool-loading":""}`,onClick:C,disabled:S,children:S?"Detecting...":"🎯 Detect Clones"}),m!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:h,className:"tool-output-canvas"}),e.jsxs("div",{className:`tool-verdict ${m>5?"tool-verdict-danger":m>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[m>0?"🎯":"✅"," Found ",m," clone ",m===1?"pair":"pairs"]})]}),m===null&&e.jsx("canvas",{ref:h,style:{display:"none"}})]})},ne=({targetImage:R})=>{const[w,q]=y.useState("log"),[s,$]=y.useState(!1),[S,T]=y.useState(null),m=y.useRef(null),v=(D,a)=>{const C=D.length;if(C<=1)return[D,a];const d=new Float64Array(D),u=new Float64Array(a);for(let n=1,t=0;n<C;n++){let g=C>>1;for(;t&g;)t^=g,g>>=1;t^=g,n<t&&([d[n],d[t]]=[d[t],d[n]],[u[n],u[t]]=[u[t],u[n]])}for(let n=2;n<=C;n*=2){const t=n/2,g=-2*Math.PI/n,k=Math.cos(g),F=Math.sin(g);for(let I=0;I<C;I+=n){let j=1,E=0;for(let N=0;N<t;N++){const M=j*d[I+N+t]-E*u[I+N+t],r=j*u[I+N+t]+E*d[I+N+t];d[I+N+t]=d[I+N]-M,u[I+N+t]=u[I+N]-r,d[I+N]+=M,u[I+N]+=r;const b=j*k-E*F;E=j*F+E*k,j=b}}}return[d,u]},h=y.useCallback(async()=>{$(!0),T(null);try{const D=new Image;D.crossOrigin="anonymous",await new Promise((f,A)=>{D.onload=()=>f(),D.onerror=()=>A(new Error("Failed to load")),D.src=R});const a=256,C=document.createElement("canvas");C.width=a,C.height=a;const d=C.getContext("2d");d.drawImage(D,0,0,a,a);const u=d.getImageData(0,0,a,a),n=new Float64Array(a*a);for(let f=0;f<a*a;f++){const A=f*4;n[f]=.299*u.data[A]+.587*u.data[A+1]+.114*u.data[A+2]}const t=new Float64Array(a*a),g=new Float64Array(a*a);for(let f=0;f<a;f++){const A=n.slice(f*a,(f+1)*a),L=new Float64Array(a),[B,z]=v(A,L);t.set(B,f*a),g.set(z,f*a)}const k=new Float64Array(a*a),F=new Float64Array(a*a);for(let f=0;f<a;f++){const A=new Float64Array(a),L=new Float64Array(a);for(let P=0;P<a;P++)A[P]=t[P*a+f],L[P]=g[P*a+f];const[B,z]=v(A,L);for(let P=0;P<a;P++)k[P*a+f]=B[P],F[P*a+f]=z[P]}const I=new Float64Array(a*a);let j=0,E=0,N=0;const M=a/2;for(let f=0;f<a;f++)for(let A=0;A<a;A++){const L=f*a+A,B=Math.sqrt(k[L]**2+F[L]**2),z=(f+M)%a,P=(A+M)%a,i=z*a+P;I[i]=w==="log"?Math.log(1+B):B,I[i]>j&&(j=I[i]),Math.sqrt((P-M)**2+(z-M)**2)<M*.3?N+=B:E+=B}const r=E+N,b=r>0?E/r*100:0,x=r>0?N/r*100:0;let o=0;for(let f=0;f<a;f+=8)for(let A=0;A<a;A+=8){if(A===M&&f===M)continue;const L=f*a+A;I[L]>j*.5&&o++}T({highFreq:b,lowFreq:x,gridArtifacts:o>3});const c=m.current;if(!c)return;c.width=a,c.height=a;const l=c.getContext("2d"),O=l.createImageData(a,a);for(let f=0;f<a*a;f++){const A=j>0?I[f]/j*255:0,L=f*4;O.data[L]=Math.min(255,A*.8),O.data[L+1]=Math.min(255,A*.9),O.data[L+2]=Math.min(255,A),O.data[L+3]=255}l.putImageData(O,0,0),l.strokeStyle="rgba(56, 189, 248, 0.2)",l.lineWidth=1;for(let f=30;f<M;f+=30)l.beginPath(),l.arc(M,M,f,0,Math.PI*2),l.stroke()}catch(D){console.error("[FFT] Analysis failed:",D)}finally{$(!1)}},[R,w]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Magnitude Scale"}),e.jsxs("div",{className:"tool-toggle-group",children:[e.jsx("button",{className:`tool-toggle-btn ${w==="log"?"tool-toggle-btn-active":""}`,onClick:()=>q("log"),children:"Log"}),e.jsx("button",{className:`tool-toggle-btn ${w==="linear"?"tool-toggle-btn-active":""}`,onClick:()=>q("linear"),children:"Linear"})]})]}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:h,disabled:s,children:s?"Computing FFT...":"🌊 Compute FFT"}),S&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:m,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"High Freq Energy"}),e.jsxs("p",{className:"tool-stat-value",children:[S.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Low Freq Energy"}),e.jsxs("p",{className:"tool-stat-value",children:[S.lowFreq.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${S.gridArtifacts?"tool-verdict-danger":"tool-verdict-safe"}`,children:S.gridArtifacts?"⚠️ Grid artifacts detected (GAN signature)":"✅ No repeating patterns detected"})]}),!S&&e.jsx("canvas",{ref:m,style:{display:"none"}})]})},se=({targetImage:R})=>{const[w,q]=y.useState("sobel"),[s,$]=y.useState(100),[S,T]=y.useState(!1),[m,v]=y.useState(null),[h,D]=y.useState(0),a=y.useRef(null),C=y.useRef(null),d=y.useCallback(async()=>{T(!0),v(null);try{const u=new Image;u.crossOrigin="anonymous",await new Promise((i,p)=>{u.onload=()=>i(),u.onerror=()=>p(new Error("Failed to load")),u.src=R});const n=u.naturalWidth,t=u.naturalHeight,g=document.createElement("canvas");g.width=n,g.height=t;const k=g.getContext("2d");k.drawImage(u,0,0);const I=k.getImageData(0,0,n,t).data,j=new Float64Array(n*t);for(let i=0;i<n*t;i++){const p=i*4;j[i]=.299*I[p]+.587*I[p+1]+.114*I[p+2]}const E=new Float64Array(n*t),N=new Uint8Array(n*t);if(w==="sobel"||w==="canny")for(let i=1;i<t-1;i++)for(let p=1;p<n-1;p++){const U=-j[(i-1)*n+(p-1)]+j[(i-1)*n+(p+1)]-2*j[i*n+(p-1)]+2*j[i*n+(p+1)]-j[(i+1)*n+(p-1)]+j[(i+1)*n+(p+1)],W=-j[(i-1)*n+(p-1)]-2*j[(i-1)*n+p]-j[(i-1)*n+(p+1)]+j[(i+1)*n+(p-1)]+2*j[(i+1)*n+p]+j[(i+1)*n+(p+1)],H=Math.sqrt(U*U+W*W);E[i*n+p]=H,N[i*n+p]=H>s?255:0}else for(let i=1;i<t-1;i++)for(let p=1;p<n-1;p++){const U=-4*j[i*n+p]+j[(i-1)*n+p]+j[(i+1)*n+p]+j[i*n+(p-1)]+j[i*n+(p+1)],W=Math.abs(U);E[i*n+p]=W,N[i*n+p]=W>s/2?255:0}let M=0,r=0;const b=32,x=[];for(let i=0;i<n*t;i++)N[i]>0&&M++,r+=E[i];for(let i=0;i<Math.floor(t/b);i++)for(let p=0;p<Math.floor(n/b);p++){let U=0;for(let W=0;W<b;W++)for(let H=0;H<b;H++)U+=E[(i*b+W)*n+(p*b+H)];x.push(U/(b*b))}const o=x.reduce((i,p)=>i+p,0)/x.length,c=Math.sqrt(x.reduce((i,p)=>i+(p-o)**2,0)/x.length),l=o>0?Math.max(0,100-c/o*50):0;v({edgeDensity:M/(n*t)*1e4,avgStrength:r/(n*t),uniformity:l});const O=a.current;O.width=n,O.height=t;const f=O.getContext("2d"),A=f.createImageData(n,t);for(let i=0;i<n*t;i++){const p=i*4;A.data[p]=A.data[p+1]=A.data[p+2]=N[i],A.data[p+3]=255}f.putImageData(A,0,0);const L=C.current;L.width=n,L.height=t;const B=L.getContext("2d"),z=B.createImageData(n,t),P=Math.max(...E);for(let i=0;i<n*t;i++){const p=i*4,U=P>0?E[i]/P:0;U<.25?(z.data[p]=0,z.data[p+1]=Math.floor(U*4*255),z.data[p+2]=255):U<.5?(z.data[p]=0,z.data[p+1]=255,z.data[p+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(z.data[p]=Math.floor((U-.5)*4*255),z.data[p+1]=255,z.data[p+2]=0):(z.data[p]=255,z.data[p+1]=Math.floor((1-(U-.75)*4)*255),z.data[p+2]=0),z.data[p+3]=255}B.putImageData(z,0,0)}catch(u){console.error("[Gradient] Analysis failed:",u)}finally{T(!1)}},[R,w,s]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(V,{value:w,onChange:u=>q(u),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",s]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:s,onChange:u=>$(Number(u.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${S?"tool-loading":""}`,onClick:d,disabled:S,children:S?"Analysing...":"📐 Analyse Gradients"}),m&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${h===0?"tool-tab-active":""}`,onClick:()=>D(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${h===1?"tool-tab-active":""}`,onClick:()=>D(1),children:"Gradient Magnitude"})]}),e.jsx("canvas",{ref:a,className:"tool-output-canvas",style:{display:h===0?"block":"none"}}),e.jsx("canvas",{ref:C,className:"tool-output-canvas",style:{display:h===1?"block":"none"}}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[m.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:m.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${m.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[m.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",m.uniformity.toFixed(1),"%)"]})]}),!m&&e.jsxs(e.Fragment,{children:[e.jsx("canvas",{ref:a,style:{display:"none"}}),e.jsx("canvas",{ref:C,style:{display:"none"}})]})]})},re=({targetImage:R})=>{const[w,q]=y.useState("medium"),[s,$]=y.useState(!1),[S,T]=y.useState(0),[m,v]=y.useState(null),h=y.useRef(null),D=y.useCallback(async()=>{$(!0),v(null),T(0);try{const a=new Image;a.crossOrigin="anonymous",await new Promise((i,p)=>{a.onload=()=>i(),a.onerror=()=>p(new Error("Failed to load")),a.src=R}),T(20);const C=a.naturalWidth,d=a.naturalHeight,u=document.createElement("canvas");u.width=C,u.height=d;const n=u.getContext("2d");n.drawImage(a,0,0);const g=n.getImageData(0,0,C,d).data,k=new Float64Array(C*d);for(let i=0;i<C*d;i++)k[i]=.299*g[i*4]+.587*g[i*4+1]+.114*g[i*4+2];T(40);const I=Math.floor((w==="low"?3:w==="medium"?5:7)/2),j=new Float64Array(C*d);for(let i=0;i<d;i++)for(let p=0;p<C;p++){let U=0,W=0;for(let H=-I;H<=I;H++)for(let Y=-I;Y<=I;Y++){const G=i+H,_=p+Y;G>=0&&G<d&&_>=0&&_<C&&(U+=k[G*C+_],W++)}j[i*C+p]=U/W}T(70);const E=new Float64Array(C*d);for(let i=0;i<C*d;i++)E[i]=k[i]-j[i];const N=32,M=Math.floor(C/N),r=Math.floor(d/N),b=[];for(let i=0;i<r;i++)for(let p=0;p<M;p++){const U=[];for(let Y=0;Y<N;Y++)for(let G=0;G<N;G++)U.push(E[(i*N+Y)*C+(p*N+G)]);const W=U.reduce((Y,G)=>Y+G,0)/U.length,H=U.reduce((Y,G)=>Y+(G-W)**2,0)/U.length;b.push(H)}const x=b.reduce((i,p)=>i+p,0)/b.length,o=Math.sqrt(b.reduce((i,p)=>i+(p-x)**2,0)/b.length),c=x>0?Math.min(100,o/x*100):0,l=100-c,O=c>30;v({hasFingerprint:O,consistency:c,uniformity:l}),T(90);const f=h.current;if(!f)return;f.width=C,f.height=d;const A=f.getContext("2d"),L=A.createImageData(C,d);let B=1/0,z=-1/0;for(let i=0;i<E.length;i++)E[i]<B&&(B=E[i]),E[i]>z&&(z=E[i]);const P=z-B||1;for(let i=0;i<C*d;i++){const p=(E[i]-B)/P*255,U=i*4,W=Math.min(255,p*3);L.data[U]=W,L.data[U+1]=W,L.data[U+2]=W,L.data[U+3]=255}A.putImageData(L,0,0),T(100)}catch(a){console.error("[PRNU] Analysis failed:",a)}finally{$(!1)}},[R,w]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(V,{value:w,onChange:a=>q(a),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:D,disabled:s,children:s?"Extracting PRNU...":"📷 Extract PRNU"}),s&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${S}%`}})}),m&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:h,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[m.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[m.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${m.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:m.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]}),!m&&!s&&e.jsx("canvas",{ref:h,style:{display:"none"}})]})},ie=({targetImage:R})=>{const[w,q]=y.useState(6),[s,$]=y.useState(!1),[S,T]=y.useState(null),m=y.useRef(null),v=y.useCallback(async()=>{$(!0),T(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((M,r)=>{h.onload=()=>M(),h.onerror=()=>r(new Error("Failed to load")),h.src=R});const D=h.naturalWidth,a=h.naturalHeight,C=document.createElement("canvas");C.width=D,C.height=a;const d=C.getContext("2d");d.drawImage(h,0,0);const n=d.getImageData(0,0,D,a).data,t=200+(10-w)*5,g=[],k=16;for(let M=0;M<Math.floor(a/k);M++)for(let r=0;r<Math.floor(D/k);r++){let b=0,x=0,o=0;for(let c=0;c<k;c++)for(let l=0;l<k;l++){const O=r*k+l,f=M*k+c,A=(f*D+O)*4,L=Math.max(n[A],n[A+1],n[A+2]);L>b&&(b=L,x=O,o=f)}b>t&&g.push({x,y:o,intensity:b})}const F=[];for(const M of g){let r=0,b=0;const x=10;for(let c=-x;c<=x;c++)for(let l=-x;l<=x;l++){const O=M.x+l,f=M.y+c;if(O<0||O>=D||f<0||f>=a)continue;const A=(f*D+O)*4,L=.299*n[A]+.587*n[A+1]+.114*n[A+2];r+=l*L,b+=c*L}const o=Math.atan2(b,r);F.push(o)}let I=0,j=0;if(F.length>1){const M=F.reduce((r,b)=>r+b,0)/F.length;for(const r of F){const b=Math.abs(r-M);b<Math.PI/4||b>Math.PI*7/4?I++:j++}}T({highlights:g.length,consistent:I,inconsistent:j});const E=m.current;if(!E)return;E.width=D,E.height=a;const N=E.getContext("2d");N.drawImage(h,0,0),g.forEach((M,r)=>{const b=r<F.length&&(()=>{const x=F.reduce((c,l)=>c+l,0)/F.length,o=Math.abs(F[r]-x);return o<Math.PI/4||o>Math.PI*7/4})();if(N.beginPath(),N.arc(M.x,M.y,12,0,Math.PI*2),N.strokeStyle=b?"#fbbf24":"#ef4444",N.lineWidth=2,N.stroke(),r<F.length){const x=F[r],o=25;N.beginPath(),N.moveTo(M.x,M.y),N.lineTo(M.x+Math.cos(x)*o,M.y+Math.sin(x)*o),N.strokeStyle=b?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",N.lineWidth=2,N.stroke()}})}catch(h){console.error("[Highlight] Analysis failed:",h)}finally{$(!1)}},[R,w]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",w]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:w,onChange:h=>q(Number(h.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:v,disabled:s,children:s?"Detecting...":"✨ Detect Highlights"}),S&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:m,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:S.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[S.consistent," / ",S.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${S.inconsistent>S.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:S.inconsistent>S.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]}),!S&&e.jsx("canvas",{ref:m,style:{display:"none"}})]})},le=({targetImage:R})=>{const[w,q]=y.useState(!1),[s,$]=y.useState(null),S=y.useRef(null),T=y.useCallback(async()=>{q(!0),$(null);try{const m=new Image;m.crossOrigin="anonymous",await new Promise((r,b)=>{m.onload=()=>r(),m.onerror=()=>b(new Error("Failed to load")),m.src=R});const v=m.naturalWidth,h=m.naturalHeight,D=document.createElement("canvas");D.width=v,D.height=h;const a=D.getContext("2d");a.drawImage(m,0,0);const d=a.getImageData(0,0,v,h).data,u=new Float64Array(v*h),n=new Float64Array(v*h),t=new Float64Array(v*h);for(let r=0;r<v*h;r++)u[r]=d[r*4],n[r]=d[r*4+1],t[r]=d[r*4+2];const g=[];for(let r=2;r<h-2;r+=4)for(let b=2;b<v-2;b+=4){const x=f=>.299*u[f]+.587*n[f]+.114*t[f],o=r*v+b,c=-x(o-v-1)+x(o-v+1)-2*x(o-1)+2*x(o+1)-x(o+v-1)+x(o+v+1),l=-x(o-v-1)-2*x(o-v)-x(o-v+1)+x(o+v-1)+2*x(o+v)+x(o+v+1),O=Math.sqrt(c*c+l*l);O>100&&g.push({x:b,y:r,strength:O})}let k=0;const F=[];for(const r of g.slice(0,200)){const b=z=>{const P=r.y*v+r.x,i=-z[P-v-1]+z[P-v+1]-2*z[P-1]+2*z[P+1]-z[P+v-1]+z[P+v+1],p=-z[P-v-1]-2*z[P-v]-z[P-v+1]+z[P+v-1]+2*z[P+v]+z[P+v+1];return{gx:i,gy:p,mag:Math.sqrt(i*i+p*p)}},x=b(u),o=b(n),c=b(t),l=Math.atan2(x.gy,x.gx),O=Math.atan2(o.gy,o.gx),f=Math.atan2(c.gy,c.gx),A=Math.abs(l-O),L=Math.abs(f-O),B=(A+L)/2;k+=B,F.push({x:r.x,y:r.y,sep:B})}const I=g.length>0?k/Math.min(g.length,200):0,j=I>.05;$({avgSeparation:I*100,detected:j,edgesAnalysed:Math.min(g.length,200)});const E=S.current;if(!E)return;E.width=v,E.height=h;const N=E.getContext("2d"),M=N.createImageData(v,h);for(let r=0;r<v*h;r++){const b=r*4;M.data[b]=Math.min(255,Math.abs(u[r]-n[r])*5),M.data[b+1]=Math.min(255,Math.abs(n[r]-t[r])*5),M.data[b+2]=Math.min(255,Math.abs(t[r]-u[r])*5),M.data[b+3]=255}N.putImageData(M,0,0);for(const r of F)N.beginPath(),N.arc(r.x,r.y,3,0,Math.PI*2),N.fillStyle=r.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",N.fill()}catch(m){console.error("[Aberration] Analysis failed:",m)}finally{q(!1)}},[R]);return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${w?"tool-loading":""}`,onClick:T,disabled:w,children:w?"Checking...":"🌈 Check for Aberration"}),s&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:S,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[s.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:s.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${s.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:s.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]}),!s&&e.jsx("canvas",{ref:S,style:{display:"none"}})]})},ce=({targetImage:R})=>{const[w,q]=y.useState(!0),[s,$]=y.useState(!1),[S,T]=y.useState(null),m=y.useRef(null),v=y.useCallback(async()=>{$(!0),T(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((x,o)=>{h.onload=()=>x(),h.onerror=()=>o(),h.src=R});const D=h.naturalWidth,a=h.naturalHeight,C=document.createElement("canvas");C.width=D,C.height=a;const d=C.getContext("2d");d.drawImage(h,0,0);const u=d.getImageData(0,0,D,a).data,n=8,t=Math.floor(D/n),g=Math.floor(a/n),k=[];for(let x=0;x<g;x++)for(let o=0;o<t;o++){let c=0,l=0;if(o<t-1)for(let O=0;O<n;O++){const f=x*n+O,A=(f*D+(o+1)*n-1)*4,L=A+4;c+=Math.abs(u[A]-u[L])+Math.abs(u[A+1]-u[L+1])+Math.abs(u[A+2]-u[L+2]),l++}if(x<g-1)for(let O=0;O<n;O++){const f=o*n+O,A=(x+1)*n-1,L=A+1,B=(A*D+f)*4,z=(L*D+f)*4;c+=Math.abs(u[B]-u[z])+Math.abs(u[B+1]-u[z+1])+Math.abs(u[B+2]-u[z+2]),l++}k.push(l>0?c/(l*3):0)}const F=k.reduce((x,o)=>x+o,0)/k.length,I=Math.sqrt(k.reduce((x,o)=>x+(o-F)**2,0)/k.length);let j=0;for(const x of k)Math.abs(x-F)>I*2&&j++;const E=Math.max(10,Math.min(100,100-F*2)),N=j>t*g*.1?2:1;T({quality:E,layers:N,inconsistent:j});const M=m.current;M.width=D,M.height=a;const r=M.getContext("2d");r.drawImage(h,0,0);const b=Math.max(...k);for(let x=0;x<g;x++)for(let o=0;o<t;o++){const c=b>0?k[x*t+o]/b:0,l=c<.33?0:c<.66?200:220,O=c<.33||c<.66?180:50;r.fillStyle=`rgba(${l},${O},0,0.3)`,r.fillRect(o*n,x*n,n,n),w&&(r.strokeStyle="rgba(255,255,255,0.08)",r.lineWidth=.5,r.strokeRect(o*n,x*n,n,n))}}catch(h){console.error("[Compression]",h)}finally{$(!1)}},[R,w]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:w,onChange:h=>q(h.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:v,disabled:s,children:s?"Analysing...":"🔳 Analyse Compression"}),S&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:m,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[S.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:S.layers})]})]}),e.jsx("div",{className:`tool-verdict ${S.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:S.layers>1?`⚠️ Multiple re-compressions (${S.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]}),!S&&e.jsx("canvas",{ref:m,style:{display:"none"}})]})},de=({targetImage:R})=>{const[w,q]=y.useState(!1),[s,$]=y.useState(null),S=y.useCallback(async()=>{var v;q(!0),$(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((l,O)=>{h.onload=()=>l(),h.onerror=()=>O(),h.src=R});const D=R,a=D.startsWith("data:"),C=D.startsWith("blob:"),d=!a&&!C?new URL(D):null,u=d?d.pathname.split("/").pop()||"unknown":"embedded",n=((v=u.split(".").pop())==null?void 0:v.toLowerCase())||"unknown";let t="",g="",k="";try{const l=await fetch(R,{method:"HEAD",mode:"cors"});t=l.headers.get("content-type")||"",g=l.headers.get("content-length")||"",k=l.headers.get("last-modified")||""}catch{}const F=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],I=D.toLowerCase(),j=F.some(l=>I.includes(l)),N=d?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(l=>d.hostname.includes(l)):!1,M={Source:a?"Data URL (embedded)":C?"Blob URL (local)":(d==null?void 0:d.hostname)||"Unknown",Filename:u,Format:t||n.toUpperCase(),Dimensions:`${h.naturalWidth} × ${h.naturalHeight}`},r={"Aspect Ratio":(h.naturalWidth/h.naturalHeight).toFixed(2),"Total Pixels":`${(h.naturalWidth*h.naturalHeight/1e6).toFixed(1)} MP`};g&&(r["File Size"]=`${(parseInt(g)/1024).toFixed(1)} KB`);const b={};k&&(b["Last Modified"]=k);const x={};j&&(x["AI Indicator"]="⚠️ AI-related keywords found in URL"),N&&(x.Hosting="⚠️ Known AI image hosting platform");let o="authentic",c="✅ No suspicious metadata detected";j||N?(o="ai",c="❌ AI generation indicators detected in metadata"):(a||C)&&(o="suspicious",c="⚠️ Embedded/local image — limited metadata available"),$({camera:M,settings:r,dates:b,software:x,verdict:o,verdictText:c})}catch(h){console.error("[Metadata]",h)}finally{q(!1)}},[R]),T=()=>{if(!s)return;const v=JSON.stringify({...s.camera,...s.settings,...s.dates,...s.software},null,2);navigator.clipboard.writeText(v)},m=(v,h,D)=>Object.keys(D).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:h}),e.jsx("h4",{children:v})]}),Object.entries(D).map(([a,C])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:a}),e.jsx("span",{className:`metadata-value ${C.includes("Not found")?"metadata-missing":""}`,children:C})]},a))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${w?"tool-loading":""}`,onClick:S,disabled:w,children:w?"Extracting...":"📋 Extract Metadata"}),s&&e.jsxs("div",{className:"tool-output-area",children:[m("Image Information","📷",s.camera),m("Properties","⚙️",s.settings),m("Dates","📅",s.dates),m("Software & AI Detection","🖥️",s.software),e.jsx("div",{className:`tool-verdict ${s.verdict==="authentic"?"tool-verdict-safe":s.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:s.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:T,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},ge=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:te},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:oe},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:ae},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:ne},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:se},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:re},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:ie},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:le},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ce},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:de}],pe=({targetImage:R,onBack:w,onClose:q})=>e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:w,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:q,"aria-label":"Close",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsx("div",{className:"forensic-image-preview",children:e.jsx("img",{src:R,alt:"Image under analysis"})}),e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Analysis Tools"})]}),e.jsx("div",{className:"forensic-tools-grid",children:ge.map((s,$)=>e.jsx(Z,{icon:s.icon,title:s.title,description:s.desc,tier:s.tier,index:$,children:e.jsx(s.Component,{targetImage:R})},s.title))})]}),he=()=>{const[R,w]=y.useState("idle"),[q,s]=y.useState(null),[$,S]=y.useState(null),[T,m]=y.useState(null),[v,h]=y.useState(null),[D,a]=y.useState(!1),C=y.useRef({x:0,y:0}),d=y.useRef(null);y.useEffect(()=>{const t=g=>{switch(g.type){case"SCANNING":w("scanning"),m(g.imageUrl||null),s(null),S(null);break;case"SHOW_RESULT":w("result"),s({isAI:g.isAI||!1,confidence:g.confidence||0,heatmapData:g.heatmapData,filterData:g.filterData});break;case"ERROR":w("error"),S(g.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(t),()=>chrome.runtime.onMessage.removeListener(t)},[]),y.useEffect(()=>{const t=k=>{D&&h({x:k.clientX-C.current.x,y:k.clientY-C.current.y})},g=()=>{a(!1)};return D&&(window.addEventListener("mousemove",t),window.addEventListener("mouseup",g)),()=>{window.removeEventListener("mousemove",t),window.removeEventListener("mouseup",g)}},[D]);const u=t=>{if(!d.current)return;t.preventDefault();const g=d.current.getBoundingClientRect(),k=v?v.x:g.left,F=v?v.y:g.top;C.current={x:t.clientX-k,y:t.clientY-F},v||h({x:k,y:F}),a(!0)},n=()=>{w("idle"),s(null),S(null),m(null)};return R==="idle"?null:e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",children:e.jsx("div",{ref:d,className:"pointer-events-auto absolute transition-shadow duration-300",style:v?{left:v.x,top:v.y,boxShadow:D?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:e.jsxs(K,{className:`relative overflow-hidden p-6 pt-6 transition-all duration-300 ${R==="tools"?"min-w-[700px] max-w-[800px]":"min-w-[320px] max-w-[400px]"}`,children:[e.jsx("div",{onMouseDown:u,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${D?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:n,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),R==="scanning"&&e.jsxs("div",{className:"relative",children:[T&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:T,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),R==="result"&&q&&T&&e.jsx(Q,{result:q,targetImage:T,onToolsClick:()=>w("tools")}),R==="tools"&&T&&e.jsx(pe,{targetImage:T,onBack:()=>w("result"),onClose:n}),R==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:$})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})})},me=`
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
`;function ue(R){const w=document.createElement("style");w.textContent=me,R.appendChild(w)}const be=`

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

/* ===== ADDITIONAL TAILWIND UTILITIES FOR FORENSIC PANEL ===== */
.min-w-\\[700px\\] { min-width: 700px; }
.max-w-\\[800px\\] { max-width: 800px; }
`;function xe(R){const w=document.createElement("style");w.textContent=be,R.appendChild(w)}if(!document.getElementById("undiffused-root")){const R=document.createElement("div");R.id="undiffused-root",document.body.appendChild(R);const w=R.attachShadow({mode:"open"});ue(w),xe(w);const q=document.createElement("div");q.id="undiffused-app",w.appendChild(q);const s=document.createElement("div");s.id="undiffused-portal-root",Object.assign(s.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),w.appendChild(s),J.createRoot(q).render(e.jsx(he,{})),console.log("[UnDiffused] Content script injected")}
