import{r as u,j as e,a as Q,R as V,G as J,b as Z,c as ee}from"./ResultView-BXWFaSCq.js";const te=({icon:T,title:k,description:$,tier:s,index:U,children:y})=>{const[L,d]=u.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${U*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>d(!L),"aria-expanded":L,"aria-label":`${k} - ${$}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:T})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:k}),e.jsx("p",{className:"tool-card-desc",children:$})]}),e.jsx("div",{className:`tool-card-chevron ${L?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),s===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${L?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:y||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var oe=Q();function K({value:T,onChange:k,options:$,placeholder:s="Select...",disabled:U=!1}){const[y,L]=u.useState(!1),d=u.useRef(null),E=u.useRef(null),[l,h]=u.useState({top:0,left:0,width:0}),I=u.useCallback(()=>{var r;const o=(r=d.current)==null?void 0:r.getRootNode();if(o&&o instanceof ShadowRoot){let n=o.querySelector("#undiffused-portal-root");return n||(n=document.createElement("div"),n.id="undiffused-portal-root",Object.assign(n.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),o.appendChild(n)),n}return document.body},[]),t=$.find(o=>o.value===T),j=o=>{k(o),L(!1)},c=()=>{if(!U)if(!y&&d.current){const o=d.current.getBoundingClientRect();h({top:o.bottom+6,left:o.left,width:o.width}),L(!0)}else L(!1)};u.useEffect(()=>{var n;if(!y)return;const o=M=>{var R,O;const z=M.target;(R=d.current)!=null&&R.contains(z)||(O=E.current)!=null&&O.contains(z)||L(!1)},r=((n=d.current)==null?void 0:n.getRootNode())||document;return r.addEventListener("mousedown",o),()=>r.removeEventListener("mousedown",o)},[y]),u.useEffect(()=>{if(!y)return;const o=()=>L(!1);return window.addEventListener("resize",o),window.addEventListener("scroll",o,{capture:!0}),()=>{window.removeEventListener("resize",o),window.removeEventListener("scroll",o,{capture:!0})}},[y]);const S=e.jsx("div",{ref:E,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:l.top,left:l.left,width:l.width,zIndex:2147483647,pointerEvents:"auto"},children:$.map(o=>e.jsxs("div",{className:`liquid-select-option ${o.value===T?"selected":""}`,onClick:()=>j(o.value),role:"option","aria-selected":o.value===T,children:[e.jsx("span",{children:o.label}),o.value===T&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(o.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:d,type:"button",className:`liquid-select-trigger ${y?"open":""} ${U?"opacity-50 cursor-not-allowed":""}`,onClick:c,disabled:U,"aria-haspopup":"listbox","aria-expanded":y,children:[e.jsx("span",{children:t?t.label:s}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),y&&oe.createPortal(S,I())]})}const ae=({targetImage:T})=>{const[k,$]=u.useState(85),[s,U]=u.useState("medium"),[y,L]=u.useState(!1),[d,E]=u.useState(!1),[l,h]=u.useState(100),I=u.useRef(null),t=u.useRef(null),j=u.useRef(null),c=u.useRef(null),S=s==="low"?10:s==="medium"?20:40,o=u.useCallback(async()=>{L(!0),E(!1);try{const n=new Image;n.crossOrigin="anonymous",await new Promise((A,f)=>{n.onload=()=>A(),n.onerror=()=>f(new Error("Failed to load image")),n.src=T});const M=n.naturalWidth,z=n.naturalHeight,R=document.createElement("canvas");R.width=M,R.height=z;const O=R.getContext("2d");O.drawImage(n,0,0);const N=O.getImageData(0,0,M,z),v=document.createElement("canvas");v.width=M,v.height=z;const C=v.getContext("2d");C.drawImage(n,0,0);const i=v.toDataURL("image/jpeg",k/100),w=new Image;await new Promise(A=>{w.onload=()=>A(),w.src=i}),C.drawImage(w,0,0);const m=C.getImageData(0,0,M,z),a=document.createElement("canvas");a.width=M,a.height=z;const g=a.getContext("2d"),b=g.createImageData(M,z);for(let A=0;A<N.data.length;A+=4){const f=Math.abs(N.data[A]-m.data[A]),F=Math.abs(N.data[A+1]-m.data[A+1]),P=Math.abs(N.data[A+2]-m.data[A+2]),W=Math.min(255,f*S),B=Math.min(255,F*S),q=Math.min(255,P*S),D=(W+B+q)/3;D<64?(b.data[A]=0,b.data[A+1]=0,b.data[A+2]=Math.min(255,D*4)):D<128?(b.data[A]=0,b.data[A+1]=Math.min(255,(D-64)*4),b.data[A+2]=255-(D-64)*4):D<192?(b.data[A]=Math.min(255,(D-128)*4),b.data[A+1]=255,b.data[A+2]=0):(b.data[A]=255,b.data[A+1]=255-(D-192)*4,b.data[A+2]=0),b.data[A+3]=255}g.putImageData(b,0,0),j.current=a,c.current=R,E(!0)}catch(n){console.error("[ELA] Analysis failed:",n)}finally{L(!1)}},[T,k,S]);V.useEffect(()=>{if(d&&j.current&&c.current){if(I.current){const n=I.current.getContext("2d");n&&(I.current.width=j.current.width,I.current.height=j.current.height,n.drawImage(j.current,0,0))}if(t.current){const n=t.current.getContext("2d");n&&(t.current.width=c.current.width,t.current.height=c.current.height,n.drawImage(c.current,0,0))}}},[d]);const r=()=>{const n=I.current;if(!n)return;const M=document.createElement("a");M.download="ela-analysis.png",M.href=n.toDataURL("image/png"),M.click()};return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",k,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:k,onChange:n=>$(Number(n.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(K,{value:s,onChange:n=>U(n),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${y?"tool-loading":""}`,onClick:o,disabled:y,children:y?"Analysing...":"🔬 Analyse"}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx("canvas",{ref:t,className:"tool-output-canvas",style:{opacity:1-l/100}}),e.jsx("canvas",{ref:I,className:"tool-output-canvas",style:{position:"absolute",top:0,left:0,opacity:l/100}})]}),e.jsxs("div",{className:"tool-control-group",style:{marginTop:10},children:[e.jsxs("label",{className:"tool-control-label",children:["ELA Overlay Opacity: ",l,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:l,onChange:n=>h(Number(n.target.value))})]}),e.jsx("button",{className:"tool-export-btn",onClick:r,children:"📥 Export PNG"})]}),!d&&e.jsx("canvas",{ref:I,style:{display:"none"}}),!d&&e.jsx("canvas",{ref:t,style:{display:"none"}})]})},ne=({targetImage:T})=>{const[k,$]=u.useState("luminance"),[s,U]=u.useState(32),[y,L]=u.useState(!1),[d,E]=u.useState(null),l=u.useRef(null),h=u.useRef(null),I=u.useCallback(async()=>{L(!0),E(null);try{const t=new Image;t.crossOrigin="anonymous",await new Promise((a,g)=>{t.onload=()=>a(),t.onerror=()=>g(new Error("Failed to load")),t.src=T});const j=t.naturalWidth,c=t.naturalHeight,S=document.createElement("canvas");S.width=j,S.height=c;const o=S.getContext("2d");o.drawImage(t,0,0);const n=o.getImageData(0,0,j,c).data,M=a=>k==="chromatic"?(n[a]-n[a+1])*.5+128:.299*n[a]+.587*n[a+1]+.114*n[a+2],z=Math.floor(j/s),R=Math.floor(c/s),O=[];for(let a=0;a<R;a++)for(let g=0;g<z;g++){const b=[];for(let F=0;F<s;F++)for(let P=0;P<s;P++){const W=g*s+P,B=a*s+F,q=(B*j+W)*4,D=M(q);let p=0,x=0;for(const[Y,H]of[[-1,0],[1,0],[0,-1],[0,1]]){const _=W+Y,X=B+H;_>=0&&_<j&&X>=0&&X<c&&(p+=M((X*j+_)*4),x++)}const G=D-p/x;b.push(G)}const A=b.reduce((F,P)=>F+P,0)/b.length,f=b.reduce((F,P)=>F+(P-A)**2,0)/b.length;O.push(f)}const N=O.reduce((a,g)=>a+g,0)/O.length,v=Math.sqrt(O.reduce((a,g)=>a+(g-N)**2,0)/O.length),C=Math.max(0,100-v/N*100);E({mean:N,std:v,uniformity:C});const i=document.createElement("canvas");i.width=j,i.height=c;const w=i.getContext("2d");w.globalAlpha=.3,w.drawImage(t,0,0),w.globalAlpha=1;const m=Math.max(...O);for(let a=0;a<R;a++)for(let g=0;g<z;g++){const b=O[a*z+g],A=m>0?b/m:0,f=Math.floor(255*(1-A)),F=Math.floor(255*A);w.fillStyle=`rgba(${f}, ${F}, 60, 0.5)`,w.fillRect(g*s,a*s,s,s),w.strokeStyle="rgba(255,255,255,0.1)",w.strokeRect(g*s,a*s,s,s)}h.current=i,E({mean:N,std:v,uniformity:C})}catch(t){console.error("[Noise] Analysis failed:",t)}finally{L(!1)}},[T,k,s]);return V.useEffect(()=>{if(d&&h.current&&l.current){const t=l.current.getContext("2d");t&&(l.current.width=h.current.width,l.current.height=h.current.height,t.drawImage(h.current,0,0))}},[d]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(K,{value:k,onChange:t=>$(t),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",s,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:s,onChange:t=>U(Number(t.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${y?"tool-loading":""}`,onClick:I,disabled:y,children:y?"Analysing...":"📡 Analyse Noise"}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:l,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("p",{className:"tool-stat-value",children:d.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("p",{className:"tool-stat-value",children:d.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${d.uniformity>70?"tool-verdict-danger":d.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[d.uniformity>70?"⚠️":d.uniformity>40?"🤔":"✅"," ","Uniformity: ",d.uniformity.toFixed(1),"% — ",d.uniformity>70?"Uniform noise (AI suspect)":d.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]}),!d&&e.jsx("canvas",{ref:l,style:{display:"none"}})]})},re=({targetImage:T})=>{const[k,$]=u.useState(5),[s,U]=u.useState(32),[y,L]=u.useState(!1),[d,E]=u.useState(null),l=u.useRef(null),h=u.useRef(null),I=(c,S,o,r,n)=>{let M=0;const z=Math.max(1,Math.floor(n/8));for(let R=0;R<n;R+=z)for(let O=0;O<n;O+=z){const N=((r+R)*S+(o+O))*4,v=c[N]*.299+c[N+1]*.587+c[N+2]*.114;M=(M<<5)-M+Math.floor(v/(12-k))|0}return M},t=(c,S,o,r,n,M,z)=>{let R=0,O=0;const N=Math.max(1,Math.floor(z/16));for(let v=0;v<z;v+=N)for(let C=0;C<z;C+=N){const i=((r+v)*S+(o+C))*4,w=((M+v)*S+(n+C))*4;R+=Math.abs(c[i]-c[w]),R+=Math.abs(c[i+1]-c[w+1]),R+=Math.abs(c[i+2]-c[w+2]),O++}return 1-R/(O*3*255)},j=u.useCallback(async()=>{L(!0),E(null);try{const c=new Image;c.crossOrigin="anonymous",await new Promise((a,g)=>{c.onload=()=>a(),c.onerror=()=>g(new Error("Failed to load")),c.src=T});const S=c.naturalWidth,o=c.naturalHeight,r=document.createElement("canvas");r.width=S,r.height=o;const n=r.getContext("2d");n.drawImage(c,0,0);const M=n.getImageData(0,0,S,o),z=Math.max(s/2,8),R=new Map;for(let a=0;a+s<=o;a+=z)for(let g=0;g+s<=S;g+=z){const b=I(M.data,S,g,a,s);R.has(b)||R.set(b,[]),R.get(b).push({x:g,y:a})}const O=[],N=s*2,v=.85+(k-5)*.01;for(const[,a]of R)if(!(a.length<2||a.length>50))for(let g=0;g<a.length&&g<10;g++)for(let b=g+1;b<a.length&&b<10;b++){if(Math.sqrt((a[g].x-a[b].x)**2+(a[g].y-a[b].y)**2)<N)continue;const f=t(M.data,S,a[g].x,a[g].y,a[b].x,a[b].y,s);f>=v&&O.push({ax:a[g].x,ay:a[g].y,bx:a[b].x,by:a[b].y,sim:f})}const C=document.createElement("canvas");C.width=S,C.height=o;const i=C.getContext("2d");i.drawImage(c,0,0);const w=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],m=O.slice(0,30);m.forEach((a,g)=>{const b=w[g%w.length];i.strokeStyle=b,i.lineWidth=2,i.globalAlpha=.7,i.strokeRect(a.ax,a.ay,s,s),i.strokeRect(a.bx,a.by,s,s),i.fillStyle=b,i.globalAlpha=.15,i.fillRect(a.ax,a.ay,s,s),i.fillRect(a.bx,a.by,s,s),i.globalAlpha=.4,i.setLineDash([4,4]),i.beginPath(),i.moveTo(a.ax+s/2,a.ay+s/2),i.lineTo(a.bx+s/2,a.by+s/2),i.stroke(),i.setLineDash([]),i.globalAlpha=1}),h.current=C,E(m.length)}catch(c){console.error("[Clone] Detection failed:",c)}finally{L(!1)}},[T,k,s]);return V.useEffect(()=>{if(d!==null&&h.current&&l.current){const c=l.current.getContext("2d");c&&(l.current.width=h.current.width,l.current.height=h.current.height,c.drawImage(h.current,0,0))}},[d]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",k]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:k,onChange:c=>$(Number(c.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",s,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:s,onChange:c=>U(Number(c.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${y?"tool-loading":""}`,onClick:j,disabled:y,children:y?"Detecting...":"🎯 Detect Clones"}),d!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:l,className:"tool-output-canvas"}),e.jsxs("div",{className:`tool-verdict ${d>5?"tool-verdict-danger":d>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[d>0?"🎯":"✅"," Found ",d," clone ",d===1?"pair":"pairs"]})]}),d===null&&e.jsx("canvas",{ref:l,style:{display:"none"}})]})},se=({targetImage:T})=>{const[k,$]=u.useState("log"),[s,U]=u.useState(!1),[y,L]=u.useState(null),d=u.useRef(null),E=u.useRef(null),l=(I,t)=>{const j=I.length;if(j<=1)return[I,t];const c=new Float64Array(I),S=new Float64Array(t);for(let o=1,r=0;o<j;o++){let n=j>>1;for(;r&n;)r^=n,n>>=1;r^=n,o<r&&([c[o],c[r]]=[c[r],c[o]],[S[o],S[r]]=[S[r],S[o]])}for(let o=2;o<=j;o*=2){const r=o/2,n=-2*Math.PI/o,M=Math.cos(n),z=Math.sin(n);for(let R=0;R<j;R+=o){let O=1,N=0;for(let v=0;v<r;v++){const C=O*c[R+v+r]-N*S[R+v+r],i=O*S[R+v+r]+N*c[R+v+r];c[R+v+r]=c[R+v]-C,S[R+v+r]=S[R+v]-i,c[R+v]+=C,S[R+v]+=i;const w=O*M-N*z;N=O*z+N*M,O=w}}}return[c,S]},h=u.useCallback(async()=>{U(!0),L(null);try{const I=new Image;I.crossOrigin="anonymous",await new Promise((f,F)=>{I.onload=()=>f(),I.onerror=()=>F(new Error("Failed to load")),I.src=T});const t=256,j=document.createElement("canvas");j.width=t,j.height=t;const c=j.getContext("2d");c.drawImage(I,0,0,t,t);const S=c.getImageData(0,0,t,t),o=new Float64Array(t*t);for(let f=0;f<t*t;f++){const F=f*4;o[f]=.299*S.data[F]+.587*S.data[F+1]+.114*S.data[F+2]}const r=new Float64Array(t*t),n=new Float64Array(t*t);for(let f=0;f<t;f++){const F=o.slice(f*t,(f+1)*t),P=new Float64Array(t),[W,B]=l(F,P);r.set(W,f*t),n.set(B,f*t)}const M=new Float64Array(t*t),z=new Float64Array(t*t);for(let f=0;f<t;f++){const F=new Float64Array(t),P=new Float64Array(t);for(let q=0;q<t;q++)F[q]=r[q*t+f],P[q]=n[q*t+f];const[W,B]=l(F,P);for(let q=0;q<t;q++)M[q*t+f]=W[q],z[q*t+f]=B[q]}const R=new Float64Array(t*t);let O=0,N=0,v=0;const C=t/2;for(let f=0;f<t;f++)for(let F=0;F<t;F++){const P=f*t+F,W=Math.sqrt(M[P]**2+z[P]**2),B=(f+C)%t,q=(F+C)%t,D=B*t+q;R[D]=k==="log"?Math.log(1+W):W,R[D]>O&&(O=R[D]),Math.sqrt((q-C)**2+(B-C)**2)<C*.3?v+=W:N+=W}const i=N+v,w=i>0?N/i*100:0,m=i>0?v/i*100:0;let a=0;for(let f=0;f<t;f+=8)for(let F=0;F<t;F+=8){if(F===C&&f===C)continue;const P=f*t+F;R[P]>O*.5&&a++}L({highFreq:w,lowFreq:m,gridArtifacts:a>3});const g=document.createElement("canvas");g.width=t,g.height=t;const b=g.getContext("2d"),A=b.createImageData(t,t);for(let f=0;f<t*t;f++){const F=O>0?R[f]/O*255:0,P=f*4;A.data[P]=Math.min(255,F*.8),A.data[P+1]=Math.min(255,F*.9),A.data[P+2]=Math.min(255,F),A.data[P+3]=255}b.putImageData(A,0,0),b.strokeStyle="rgba(56, 189, 248, 0.2)",b.lineWidth=1;for(let f=30;f<C;f+=30)b.beginPath(),b.arc(C,C,f,0,Math.PI*2),b.stroke();E.current=g,L({highFreq:w,lowFreq:m,gridArtifacts:a>3})}catch(I){console.error("[FFT] Analysis failed:",I)}finally{U(!1)}},[T,k]);return V.useEffect(()=>{if(y&&E.current&&d.current){const I=d.current.getContext("2d");I&&(d.current.width=E.current.width,d.current.height=E.current.height,I.drawImage(E.current,0,0))}},[y]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Magnitude Scale"}),e.jsxs("div",{className:"tool-toggle-group",children:[e.jsx("button",{className:`tool-toggle-btn ${k==="log"?"tool-toggle-btn-active":""}`,onClick:()=>$("log"),children:"Log"}),e.jsx("button",{className:`tool-toggle-btn ${k==="linear"?"tool-toggle-btn-active":""}`,onClick:()=>$("linear"),children:"Linear"})]})]}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:h,disabled:s,children:s?"Computing FFT...":"🌊 Compute FFT"}),y&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:d,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"High Freq Energy"}),e.jsxs("p",{className:"tool-stat-value",children:[y.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Low Freq Energy"}),e.jsxs("p",{className:"tool-stat-value",children:[y.lowFreq.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${y.gridArtifacts?"tool-verdict-danger":"tool-verdict-safe"}`,children:y.gridArtifacts?"⚠️ Grid artifacts detected (GAN signature)":"✅ No repeating patterns detected"})]}),!y&&e.jsx("canvas",{ref:d,style:{display:"none"}})]})},ie=({targetImage:T})=>{const[k,$]=u.useState("sobel"),[s,U]=u.useState(100),[y,L]=u.useState(!1),[d,E]=u.useState(null),[l,h]=u.useState(0),I=u.useRef(null),t=u.useRef(null),j=u.useRef(null),c=u.useRef(null),S=u.useCallback(async()=>{L(!0),E(null);try{const o=new Image;o.crossOrigin="anonymous",await new Promise((p,x)=>{o.onload=()=>p(),o.onerror=()=>x(new Error("Failed to load")),o.src=T});const r=o.naturalWidth,n=o.naturalHeight,M=document.createElement("canvas");M.width=r,M.height=n;const z=M.getContext("2d");z.drawImage(o,0,0);const O=z.getImageData(0,0,r,n).data,N=new Float64Array(r*n);for(let p=0;p<r*n;p++){const x=p*4;N[p]=.299*O[x]+.587*O[x+1]+.114*O[x+2]}const v=new Float64Array(r*n),C=new Uint8Array(r*n);if(k==="sobel"||k==="canny")for(let p=1;p<n-1;p++)for(let x=1;x<r-1;x++){const G=-N[(p-1)*r+(x-1)]+N[(p-1)*r+(x+1)]-2*N[p*r+(x-1)]+2*N[p*r+(x+1)]-N[(p+1)*r+(x-1)]+N[(p+1)*r+(x+1)],Y=-N[(p-1)*r+(x-1)]-2*N[(p-1)*r+x]-N[(p-1)*r+(x+1)]+N[(p+1)*r+(x-1)]+2*N[(p+1)*r+x]+N[(p+1)*r+(x+1)],H=Math.sqrt(G*G+Y*Y);v[p*r+x]=H,C[p*r+x]=H>s?255:0}else for(let p=1;p<n-1;p++)for(let x=1;x<r-1;x++){const G=-4*N[p*r+x]+N[(p-1)*r+x]+N[(p+1)*r+x]+N[p*r+(x-1)]+N[p*r+(x+1)],Y=Math.abs(G);v[p*r+x]=Y,C[p*r+x]=Y>s/2?255:0}let i=0,w=0;const m=32,a=[];for(let p=0;p<r*n;p++)C[p]>0&&i++,w+=v[p];for(let p=0;p<Math.floor(n/m);p++)for(let x=0;x<Math.floor(r/m);x++){let G=0;for(let Y=0;Y<m;Y++)for(let H=0;H<m;H++)G+=v[(p*m+Y)*r+(x*m+H)];a.push(G/(m*m))}const g=a.reduce((p,x)=>p+x,0)/a.length,b=Math.sqrt(a.reduce((p,x)=>p+(x-g)**2,0)/a.length),A=g>0?Math.max(0,100-b/g*50):0;E({edgeDensity:i/(r*n)*1e4,avgStrength:w/(r*n),uniformity:A});const f=document.createElement("canvas");f.width=r,f.height=n;const F=f.getContext("2d"),P=F.createImageData(r,n);for(let p=0;p<r*n;p++){const x=p*4;P.data[x]=P.data[x+1]=P.data[x+2]=C[p],P.data[x+3]=255}F.putImageData(P,0,0);const W=document.createElement("canvas");W.width=r,W.height=n;const B=W.getContext("2d"),q=B.createImageData(r,n),D=Math.max(...v);for(let p=0;p<r*n;p++){const x=p*4,G=D>0?v[p]/D:0;G<.25?(q.data[x]=0,q.data[x+1]=Math.floor(G*4*255),q.data[x+2]=255):G<.5?(q.data[x]=0,q.data[x+1]=255,q.data[x+2]=Math.floor((1-(G-.25)*4)*255)):G<.75?(q.data[x]=Math.floor((G-.5)*4*255),q.data[x+1]=255,q.data[x+2]=0):(q.data[x]=255,q.data[x+1]=Math.floor((1-(G-.75)*4)*255),q.data[x+2]=0),q.data[x+3]=255}B.putImageData(q,0,0),j.current=f,c.current=W,E({edgeDensity:i/(r*n)*1e4,avgStrength:w/(r*n),uniformity:A})}catch(o){console.error("[Gradient] Analysis failed:",o)}finally{L(!1)}},[T,k,s]);return V.useEffect(()=>{if(d){if(l===0&&j.current&&I.current){const o=I.current.getContext("2d");o&&(I.current.width=j.current.width,I.current.height=j.current.height,o.drawImage(j.current,0,0))}else if(l===1&&c.current&&t.current){const o=t.current.getContext("2d");o&&(t.current.width=c.current.width,t.current.height=c.current.height,o.drawImage(c.current,0,0))}}},[d,l]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(K,{value:k,onChange:o=>$(o),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",s]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:s,onChange:o=>U(Number(o.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${y?"tool-loading":""}`,onClick:S,disabled:y,children:y?"Analysing...":"📐 Analyse Gradients"}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${l===0?"tool-tab-active":""}`,onClick:()=>h(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${l===1?"tool-tab-active":""}`,onClick:()=>h(1),children:"Gradient Magnitude"})]}),e.jsx("canvas",{ref:I,className:"tool-output-canvas",style:{display:l===0?"block":"none"}}),e.jsx("canvas",{ref:t,className:"tool-output-canvas",style:{display:l===1?"block":"none"}}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[d.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:d.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${d.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[d.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",d.uniformity.toFixed(1),"%)"]})]}),!d&&e.jsxs(e.Fragment,{children:[e.jsx("canvas",{ref:I,style:{display:"none"}}),e.jsx("canvas",{ref:t,style:{display:"none"}})]})]})},le=({targetImage:T})=>{const[k,$]=u.useState("medium"),[s,U]=u.useState(!1),[y,L]=u.useState(0),[d,E]=u.useState(null),l=u.useRef(null),h=u.useRef(null),I=u.useCallback(async()=>{U(!0),E(null),L(0);try{const t=new Image;t.crossOrigin="anonymous",await new Promise((D,p)=>{t.onload=()=>D(),t.onerror=()=>p(new Error("Failed to load")),t.src=T}),L(20);const j=t.naturalWidth,c=t.naturalHeight,S=document.createElement("canvas");S.width=j,S.height=c;const o=S.getContext("2d");o.drawImage(t,0,0);const n=o.getImageData(0,0,j,c).data,M=new Float64Array(j*c);for(let D=0;D<j*c;D++)M[D]=.299*n[D*4]+.587*n[D*4+1]+.114*n[D*4+2];L(40);const R=Math.floor((k==="low"?3:k==="medium"?5:7)/2),O=new Float64Array(j*c);for(let D=0;D<c;D++)for(let p=0;p<j;p++){let x=0,G=0;for(let Y=-R;Y<=R;Y++)for(let H=-R;H<=R;H++){const _=D+Y,X=p+H;_>=0&&_<c&&X>=0&&X<j&&(x+=M[_*j+X],G++)}O[D*j+p]=x/G}L(70);const N=new Float64Array(j*c);for(let D=0;D<j*c;D++)N[D]=M[D]-O[D];const v=32,C=Math.floor(j/v),i=Math.floor(c/v),w=[];for(let D=0;D<i;D++)for(let p=0;p<C;p++){const x=[];for(let H=0;H<v;H++)for(let _=0;_<v;_++)x.push(N[(D*v+H)*j+(p*v+_)]);const G=x.reduce((H,_)=>H+_,0)/x.length,Y=x.reduce((H,_)=>H+(_-G)**2,0)/x.length;w.push(Y)}const m=w.reduce((D,p)=>D+p,0)/w.length,a=Math.sqrt(w.reduce((D,p)=>D+(p-m)**2,0)/w.length),g=m>0?Math.min(100,a/m*100):0,b=100-g,A=g>30;E({hasFingerprint:A,consistency:g,uniformity:b}),L(90);const f=document.createElement("canvas");f.width=j,f.height=c;const F=f.getContext("2d"),P=F.createImageData(j,c);let W=1/0,B=-1/0;for(let D=0;D<N.length;D++)N[D]<W&&(W=N[D]),N[D]>B&&(B=N[D]);const q=B-W||1;for(let D=0;D<j*c;D++){const p=(N[D]-W)/q*255,x=D*4,G=Math.min(255,p*3);P.data[x]=G,P.data[x+1]=G,P.data[x+2]=G,P.data[x+3]=255}F.putImageData(P,0,0),h.current=f,L(100),E({hasFingerprint:A,consistency:g,uniformity:b})}catch(t){console.error("[PRNU] Analysis failed:",t)}finally{U(!1)}},[T,k]);return V.useEffect(()=>{if(d&&h.current&&l.current){const t=l.current.getContext("2d");t&&(l.current.width=h.current.width,l.current.height=h.current.height,t.drawImage(h.current,0,0))}},[d]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(K,{value:k,onChange:t=>$(t),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:I,disabled:s,children:s?"Extracting PRNU...":"📷 Extract PRNU"}),s&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${y}%`}})}),d&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:l,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[d.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[d.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${d.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:d.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]}),!d&&!s&&e.jsx("canvas",{ref:l,style:{display:"none"}})]})},ce=({targetImage:T})=>{const[k,$]=u.useState(6),[s,U]=u.useState(!1),[y,L]=u.useState(null),d=u.useRef(null),E=u.useRef(null),l=u.useCallback(async()=>{U(!0),L(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((C,i)=>{h.onload=()=>C(),h.onerror=()=>i(new Error("Failed to load")),h.src=T});const I=h.naturalWidth,t=h.naturalHeight,j=document.createElement("canvas");j.width=I,j.height=t;const c=j.getContext("2d");c.drawImage(h,0,0);const o=c.getImageData(0,0,I,t).data,r=200+(10-k)*5,n=[],M=16;for(let C=0;C<Math.floor(t/M);C++)for(let i=0;i<Math.floor(I/M);i++){let w=0,m=0,a=0;for(let g=0;g<M;g++)for(let b=0;b<M;b++){const A=i*M+b,f=C*M+g,F=(f*I+A)*4,P=Math.max(o[F],o[F+1],o[F+2]);P>w&&(w=P,m=A,a=f)}w>r&&n.push({x:m,y:a,intensity:w})}const z=[];for(const C of n){let i=0,w=0;const m=10;for(let g=-m;g<=m;g++)for(let b=-m;b<=m;b++){const A=C.x+b,f=C.y+g;if(A<0||A>=I||f<0||f>=t)continue;const F=(f*I+A)*4,P=.299*o[F]+.587*o[F+1]+.114*o[F+2];i+=b*P,w+=g*P}const a=Math.atan2(w,i);z.push(a)}let R=0,O=0;if(z.length>1){const C=z.reduce((i,w)=>i+w,0)/z.length;for(const i of z){const w=Math.abs(i-C);w<Math.PI/4||w>Math.PI*7/4?R++:O++}}L({highlights:n.length,consistent:R,inconsistent:O});const N=document.createElement("canvas");N.width=I,N.height=t;const v=N.getContext("2d");v.drawImage(h,0,0),n.forEach((C,i)=>{const w=i<z.length&&(()=>{const m=z.reduce((g,b)=>g+b,0)/z.length,a=Math.abs(z[i]-m);return a<Math.PI/4||a>Math.PI*7/4})();if(v.beginPath(),v.arc(C.x,C.y,12,0,Math.PI*2),v.strokeStyle=w?"#fbbf24":"#ef4444",v.lineWidth=2,v.stroke(),i<z.length){const m=z[i],a=25;v.beginPath(),v.moveTo(C.x,C.y),v.lineTo(C.x+Math.cos(m)*a,C.y+Math.sin(m)*a),v.strokeStyle=w?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",v.lineWidth=2,v.stroke()}}),E.current=N,L({highlights:n.length,consistent:R,inconsistent:O})}catch(h){console.error("[Highlight] Analysis failed:",h)}finally{U(!1)}},[T,k]);return V.useEffect(()=>{if(y&&E.current&&d.current){const h=d.current.getContext("2d");h&&(d.current.width=E.current.width,d.current.height=E.current.height,h.drawImage(E.current,0,0))}},[y]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",k]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:k,onChange:h=>$(Number(h.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:l,disabled:s,children:s?"Detecting...":"✨ Detect Highlights"}),y&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:d,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:y.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[y.consistent," / ",y.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${y.inconsistent>y.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:y.inconsistent>y.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]}),!y&&e.jsx("canvas",{ref:d,style:{display:"none"}})]})},de=({targetImage:T})=>{const[k,$]=u.useState(!1),[s,U]=u.useState(null),y=u.useRef(null),L=u.useRef(null),d=u.useCallback(async()=>{$(!0),U(null);try{const E=new Image;E.crossOrigin="anonymous",await new Promise((i,w)=>{E.onload=()=>i(),E.onerror=()=>w(new Error("Failed to load")),E.src=T});const l=E.naturalWidth,h=E.naturalHeight,I=document.createElement("canvas");I.width=l,I.height=h;const t=I.getContext("2d");t.drawImage(E,0,0);const c=t.getImageData(0,0,l,h).data,S=new Float64Array(l*h),o=new Float64Array(l*h),r=new Float64Array(l*h);for(let i=0;i<l*h;i++)S[i]=c[i*4],o[i]=c[i*4+1],r[i]=c[i*4+2];const n=[];for(let i=2;i<h-2;i+=4)for(let w=2;w<l-2;w+=4){const m=f=>.299*S[f]+.587*o[f]+.114*r[f],a=i*l+w,g=-m(a-l-1)+m(a-l+1)-2*m(a-1)+2*m(a+1)-m(a+l-1)+m(a+l+1),b=-m(a-l-1)-2*m(a-l)-m(a-l+1)+m(a+l-1)+2*m(a+l)+m(a+l+1),A=Math.sqrt(g*g+b*b);A>100&&n.push({x:w,y:i,strength:A})}let M=0;const z=[];for(const i of n.slice(0,200)){const w=B=>{const q=i.y*l+i.x,D=-B[q-l-1]+B[q-l+1]-2*B[q-1]+2*B[q+1]-B[q+l-1]+B[q+l+1],p=-B[q-l-1]-2*B[q-l]-B[q-l+1]+B[q+l-1]+2*B[q+l]+B[q+l+1];return{gx:D,gy:p,mag:Math.sqrt(D*D+p*p)}},m=w(S),a=w(o),g=w(r),b=Math.atan2(m.gy,m.gx),A=Math.atan2(a.gy,a.gx),f=Math.atan2(g.gy,g.gx),F=Math.abs(b-A),P=Math.abs(f-A),W=(F+P)/2;M+=W,z.push({x:i.x,y:i.y,sep:W})}const R=n.length>0?M/Math.min(n.length,200):0,O=R>.05,N=document.createElement("canvas");N.width=l,N.height=h;const v=N.getContext("2d"),C=v.createImageData(l,h);for(let i=0;i<l*h;i++){const w=i*4;C.data[w]=Math.min(255,Math.abs(S[i]-o[i])*5),C.data[w+1]=Math.min(255,Math.abs(o[i]-r[i])*5),C.data[w+2]=Math.min(255,Math.abs(r[i]-S[i])*5),C.data[w+3]=255}v.putImageData(C,0,0);for(const i of z)v.beginPath(),v.arc(i.x,i.y,3,0,Math.PI*2),v.fillStyle=i.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",v.fill();L.current=N,U({avgSeparation:R*100,detected:O,edgesAnalysed:Math.min(n.length,200)})}catch(E){console.error("[Aberration] Analysis failed:",E)}finally{$(!1)}},[T]);return V.useEffect(()=>{if(s&&L.current&&y.current){const E=y.current.getContext("2d");E&&(y.current.width=L.current.width,y.current.height=L.current.height,E.drawImage(L.current,0,0))}},[s]),e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${k?"tool-loading":""}`,onClick:d,disabled:k,children:k?"Checking...":"🌈 Check for Aberration"}),s&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:y,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[s.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:s.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${s.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:s.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]}),!s&&e.jsx("canvas",{ref:y,style:{display:"none"}})]})},ge=({targetImage:T})=>{const[k,$]=u.useState(!0),[s,U]=u.useState(!1),[y,L]=u.useState(null),d=u.useRef(null),E=u.useRef(null),l=u.useCallback(async()=>{U(!0),L(null);try{const h=new Image;h.crossOrigin="anonymous",await new Promise((m,a)=>{h.onload=()=>m(),h.onerror=()=>a(),h.src=T});const I=h.naturalWidth,t=h.naturalHeight,j=document.createElement("canvas");j.width=I,j.height=t;const c=j.getContext("2d");c.drawImage(h,0,0);const S=c.getImageData(0,0,I,t).data,o=8,r=Math.floor(I/o),n=Math.floor(t/o),M=[];for(let m=0;m<n;m++)for(let a=0;a<r;a++){let g=0,b=0;if(a<r-1)for(let A=0;A<o;A++){const f=m*o+A,F=(f*I+(a+1)*o-1)*4,P=F+4;g+=Math.abs(S[F]-S[P])+Math.abs(S[F+1]-S[P+1])+Math.abs(S[F+2]-S[P+2]),b++}if(m<n-1)for(let A=0;A<o;A++){const f=a*o+A,F=(m+1)*o-1,P=F+1,W=(F*I+f)*4,B=(P*I+f)*4;g+=Math.abs(S[W]-S[B])+Math.abs(S[W+1]-S[B+1])+Math.abs(S[W+2]-S[B+2]),b++}M.push(b>0?g/(b*3):0)}const z=M.reduce((m,a)=>m+a,0)/M.length,R=Math.sqrt(M.reduce((m,a)=>m+(a-z)**2,0)/M.length);let O=0;for(const m of M)Math.abs(m-z)>R*2&&O++;const N=Math.max(10,Math.min(100,100-z*2)),v=O>r*n*.1?2:1,C=document.createElement("canvas");C.width=I,C.height=t;const i=C.getContext("2d");i.drawImage(h,0,0);const w=Math.max(...M);for(let m=0;m<n;m++)for(let a=0;a<r;a++){const g=w>0?M[m*r+a]/w:0,b=g<.33?0:g<.66?200:220,A=g<.33||g<.66?180:50;i.fillStyle=`rgba(${b},${A},0,0.3)`,i.fillRect(a*o,m*o,o,o),k&&(i.strokeStyle="rgba(255,255,255,0.08)",i.lineWidth=.5,i.strokeRect(a*o,m*o,o,o))}E.current=C,L({quality:N,layers:v,inconsistent:O})}catch(h){console.error("[Compression]",h)}finally{U(!1)}},[T,k]);return V.useEffect(()=>{if(y&&E.current&&d.current){const h=d.current.getContext("2d");h&&(d.current.width=E.current.width,d.current.height=E.current.height,h.drawImage(E.current,0,0))}},[y]),e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:k,onChange:h=>$(h.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${s?"tool-loading":""}`,onClick:l,disabled:s,children:s?"Analysing...":"🔳 Analyse Compression"}),y&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("canvas",{ref:d,className:"tool-output-canvas"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[y.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:y.layers})]})]}),e.jsx("div",{className:`tool-verdict ${y.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:y.layers>1?`⚠️ Multiple re-compressions (${y.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]}),!y&&e.jsx("canvas",{ref:d,style:{display:"none"}})]})},ue=({targetImage:T})=>{const[k,$]=u.useState(!1),[s,U]=u.useState(null),y=u.useCallback(async()=>{var E;$(!0),U(null);try{const l=new Image;l.crossOrigin="anonymous",await new Promise((g,b)=>{l.onload=()=>g(),l.onerror=()=>b(),l.src=T});const h=T,I=h.startsWith("data:"),t=h.startsWith("blob:"),j=!I&&!t?new URL(h):null,c=j?j.pathname.split("/").pop()||"unknown":"embedded",S=((E=c.split(".").pop())==null?void 0:E.toLowerCase())||"unknown";let o="",r="",n="";try{const g=await fetch(T,{method:"HEAD",mode:"cors"});o=g.headers.get("content-type")||"",r=g.headers.get("content-length")||"",n=g.headers.get("last-modified")||""}catch{}const M=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],z=h.toLowerCase(),R=M.some(g=>z.includes(g)),N=j?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(g=>j.hostname.includes(g)):!1,v={Source:I?"Data URL (embedded)":t?"Blob URL (local)":(j==null?void 0:j.hostname)||"Unknown",Filename:c,Format:o||S.toUpperCase(),Dimensions:`${l.naturalWidth} × ${l.naturalHeight}`},C={"Aspect Ratio":(l.naturalWidth/l.naturalHeight).toFixed(2),"Total Pixels":`${(l.naturalWidth*l.naturalHeight/1e6).toFixed(1)} MP`};r&&(C["File Size"]=`${(parseInt(r)/1024).toFixed(1)} KB`);const i={};n&&(i["Last Modified"]=n);const w={};R&&(w["AI Indicator"]="⚠️ AI-related keywords found in URL"),N&&(w.Hosting="⚠️ Known AI image hosting platform");let m="authentic",a="✅ No suspicious metadata detected";R||N?(m="ai",a="❌ AI generation indicators detected in metadata"):(I||t)&&(m="suspicious",a="⚠️ Embedded/local image — limited metadata available"),U({camera:v,settings:C,dates:i,software:w,verdict:m,verdictText:a})}catch(l){console.error("[Metadata]",l)}finally{$(!1)}},[T]),L=()=>{if(!s)return;const E=JSON.stringify({...s.camera,...s.settings,...s.dates,...s.software},null,2);navigator.clipboard.writeText(E)},d=(E,l,h)=>Object.keys(h).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:l}),e.jsx("h4",{children:E})]}),Object.entries(h).map(([I,t])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:I}),e.jsx("span",{className:`metadata-value ${t.includes("Not found")?"metadata-missing":""}`,children:t})]},I))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${k?"tool-loading":""}`,onClick:y,disabled:k,children:k?"Extracting...":"📋 Extract Metadata"}),s&&e.jsxs("div",{className:"tool-output-area",children:[d("Image Information","📷",s.camera),d("Properties","⚙️",s.settings),d("Dates","📅",s.dates),d("Software & AI Detection","🖥️",s.software),e.jsx("div",{className:`tool-verdict ${s.verdict==="authentic"?"tool-verdict-safe":s.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:s.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:L,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},he=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ae},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ne},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:re},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:se},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:ie},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:le},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:ce},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:de},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ge},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:ue}],pe=({targetImage:T,onBack:k,onClose:$})=>e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:k,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:$,"aria-label":"Close",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsx("div",{className:"forensic-image-preview",children:e.jsx("img",{src:T,alt:"Image under analysis"})}),e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Analysis Tools"})]}),e.jsx("div",{className:"forensic-tools-grid",children:he.map((s,U)=>e.jsx(te,{icon:s.icon,title:s.title,description:s.desc,tier:s.tier,index:U,children:e.jsx(s.Component,{targetImage:T})},s.title))})]}),me=()=>{const[T,k]=u.useState("idle"),[$,s]=u.useState(null),[U,y]=u.useState(null),[L,d]=u.useState(null),[E,l]=u.useState(null),[h,I]=u.useState(!1),t=u.useRef({x:0,y:0}),j=u.useRef(null);u.useEffect(()=>{const o=r=>{switch(r.type){case"SCANNING":k("scanning"),d(r.imageUrl||null),s(null),y(null);break;case"SHOW_RESULT":k("result"),s({isAI:r.isAI||!1,confidence:r.confidence||0,heatmapData:r.heatmapData,filterData:r.filterData});break;case"ERROR":k("error"),y(r.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(o),()=>chrome.runtime.onMessage.removeListener(o)},[]),u.useEffect(()=>{const o=n=>{h&&l({x:n.clientX-t.current.x,y:n.clientY-t.current.y})},r=()=>{I(!1)};return h&&(window.addEventListener("mousemove",o),window.addEventListener("mouseup",r)),()=>{window.removeEventListener("mousemove",o),window.removeEventListener("mouseup",r)}},[h]);const c=o=>{if(!j.current)return;o.preventDefault();const r=j.current.getBoundingClientRect(),n=E?E.x:r.left,M=E?E.y:r.top;t.current={x:o.clientX-n,y:o.clientY-M},E||l({x:n,y:M}),I(!0)},S=()=>{k("idle"),s(null),y(null),d(null)};return T==="idle"?null:e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",children:e.jsx("div",{ref:j,className:"pointer-events-auto absolute transition-shadow duration-300",style:E?{left:E.x,top:E.y,boxShadow:h?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:e.jsxs(J,{className:`relative overflow-hidden p-6 pt-6 transition-all duration-300 ${T==="tools"?"min-w-[700px] max-w-[800px]":"min-w-[320px] max-w-[400px]"}`,children:[e.jsx("div",{onMouseDown:c,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${h?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:S,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),T==="scanning"&&e.jsxs("div",{className:"relative",children:[L&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:L,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),T==="result"&&$&&L&&e.jsx(Z,{result:$,targetImage:L,onToolsClick:()=>k("tools")}),T==="tools"&&L&&e.jsx(pe,{targetImage:L,onBack:()=>k("result"),onClose:S}),T==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:U})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})})},fe=`
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
`;function be(T){const k=document.createElement("style");k.textContent=fe,T.appendChild(k)}const xe=`

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
`;function ye(T){const k=document.createElement("style");k.textContent=xe,T.appendChild(k)}if(!document.getElementById("undiffused-root")){const T=document.createElement("div");T.id="undiffused-root",document.body.appendChild(T);const k=T.attachShadow({mode:"open"});be(k),ye(k);const $=document.createElement("div");$.id="undiffused-app",k.appendChild($);const s=document.createElement("div");s.id="undiffused-portal-root",Object.assign(s.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),k.appendChild(s),ee.createRoot($).render(e.jsx(me,{})),console.log("[UnDiffused] Content script injected")}
