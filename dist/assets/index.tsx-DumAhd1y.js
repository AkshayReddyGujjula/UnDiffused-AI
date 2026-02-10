import{r as k,j as e,a as K,R as X,G as Q,b as J,c as Z}from"./ResultView-BXWFaSCq.js";const ee=({icon:L,title:j,description:A,tier:O,index:g,children:q})=>{const[N,C]=k.useState(!1);return e.jsxs("div",{className:"tool-card",style:{animationDelay:`${g*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>C(!N),"aria-expanded":N,"aria-label":`${j} - ${A}`,children:[e.jsx("div",{className:"tool-card-icon",children:e.jsx("span",{children:L})}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:j}),e.jsx("p",{className:"tool-card-desc",children:A})]}),e.jsx("div",{className:`tool-card-chevron ${N?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),O===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${N?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:q||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var te=K();function V({value:L,onChange:j,options:A,placeholder:O="Select...",disabled:g=!1}){const[q,N]=k.useState(!1),C=k.useRef(null),l=k.useRef(null),[p,v]=k.useState({top:0,left:0,width:0}),o=k.useCallback(()=>{var d;const n=(d=C.current)==null?void 0:d.getRootNode();if(n&&n instanceof ShadowRoot){let u=n.querySelector("#undiffused-portal-root");return u||(u=document.createElement("div"),u.id="undiffused-portal-root",Object.assign(u.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),n.appendChild(u)),u}return document.body},[]),c=A.find(n=>n.value===L),i=n=>{j(n),N(!1)},M=()=>{if(!g)if(!q&&C.current){const n=C.current.getBoundingClientRect();v({top:n.bottom+6,left:n.left,width:n.width}),N(!0)}else N(!1)};k.useEffect(()=>{var u;if(!q)return;const n=E=>{var F,w;const D=E.target;(F=C.current)!=null&&F.contains(D)||(w=l.current)!=null&&w.contains(D)||N(!1)},d=((u=C.current)==null?void 0:u.getRootNode())||document;return d.addEventListener("mousedown",n),()=>d.removeEventListener("mousedown",n)},[q]),k.useEffect(()=>{if(!q)return;const n=()=>N(!1);return window.addEventListener("resize",n),window.addEventListener("scroll",n,{capture:!0}),()=>{window.removeEventListener("resize",n),window.removeEventListener("scroll",n,{capture:!0})}},[q]);const x=e.jsx("div",{ref:l,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:p.top,left:p.left,width:p.width,zIndex:2147483647,pointerEvents:"auto"},children:A.map(n=>e.jsxs("div",{className:`liquid-select-option ${n.value===L?"selected":""}`,onClick:()=>i(n.value),role:"option","aria-selected":n.value===L,children:[e.jsx("span",{children:n.label}),n.value===L&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(n.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:C,type:"button",className:`liquid-select-trigger ${q?"open":""} ${g?"opacity-50 cursor-not-allowed":""}`,onClick:M,disabled:g,"aria-haspopup":"listbox","aria-expanded":q,children:[e.jsx("span",{children:c?c.label:O}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),q&&te.createPortal(x,o())]})}const oe=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(85),[g,q]=k.useState("medium"),[N,C]=k.useState(!1),[l,p]=k.useState(null),v=g==="low"?10:g==="medium"?20:40,o=k.useCallback(async()=>{C(!0),p(null);try{const c=new Image;c.crossOrigin="anonymous",await new Promise((r,t)=>{c.onload=()=>r(),c.onerror=()=>t(new Error("Failed to load image")),c.src=L});const i=c.naturalWidth,M=c.naturalHeight,x=document.createElement("canvas");x.width=i,x.height=M;const n=x.getContext("2d");n.drawImage(c,0,0);const d=n.getImageData(0,0,i,M),u=document.createElement("canvas");u.width=i,u.height=M;const E=u.getContext("2d");E.drawImage(c,0,0);const D=u.toDataURL("image/jpeg",A/100),F=new Image;await new Promise(r=>{F.onload=()=>r(),F.src=D}),E.drawImage(F,0,0);const w=E.getImageData(0,0,i,M),S=document.createElement("canvas");S.width=i,S.height=M;const m=S.getContext("2d"),a=m.createImageData(i,M);let y=0;for(let r=0;r<d.data.length;r+=4){const t=Math.abs(d.data[r]-w.data[r]),h=Math.abs(d.data[r+1]-w.data[r+1]),s=Math.abs(d.data[r+2]-w.data[r+2]);y+=t+h+s;const I=Math.min(255,t*v),z=Math.min(255,h*v),B=Math.min(255,s*v),T=(I+z+B)/3;T<64?(a.data[r]=0,a.data[r+1]=0,a.data[r+2]=Math.min(255,T*4)):T<128?(a.data[r]=0,a.data[r+1]=Math.min(255,(T-64)*4),a.data[r+2]=255-(T-64)*4):T<192?(a.data[r]=Math.min(255,(T-128)*4),a.data[r+1]=255,a.data[r+2]=0):(a.data[r]=255,a.data[r+1]=255-(T-192)*4,a.data[r+2]=0),a.data[r+3]=255}m.putImageData(a,0,0),j&&j(S),p({diffScore:y/(i*M)})}catch(c){console.error("[ELA] Analysis failed:",c)}finally{C(!1)}},[L,A,v,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",A,"%"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"50",max:"100",value:A,onChange:c=>O(Number(c.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(V,{value:g,onChange:c=>q(c),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("button",{className:`tool-analyse-btn ${N?"tool-loading":""} `,onClick:o,disabled:N,children:N?"Analysing...":"🔬 Analyse Error Levels"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:l.diffScore.toFixed(2)})]})})]})]})},ae=({targetImage:L,onResult:j})=>{const[A,O]=k.useState("luminance"),[g,q]=k.useState(32),[N,C]=k.useState(!1),[l,p]=k.useState(null),v=k.useCallback(async()=>{C(!0),p(null);try{const o=new Image;o.crossOrigin="anonymous",await new Promise((t,h)=>{o.onload=()=>t(),o.onerror=()=>h(new Error("Failed to load image")),o.src=L});const c=o.naturalWidth,i=o.naturalHeight,M=document.createElement("canvas");M.width=c,M.height=i;const x=M.getContext("2d");x.drawImage(o,0,0);const d=x.getImageData(0,0,c,i).data,u=t=>A==="chromatic"?(d[t]-d[t+1])*.5+128:.299*d[t]+.587*d[t+1]+.114*d[t+2],E=Math.floor(c/g),D=Math.floor(i/g),F=[];for(let t=0;t<D;t++)for(let h=0;h<E;h++){const s=[];for(let B=0;B<g;B++)for(let T=0;T<g;T++){const R=h*g+T,U=t*g+B,W=(U*c+R)*4,P=u(W);let b=0,f=0;for(const[G,H]of[[-1,0],[1,0],[0,-1],[0,1]]){const Y=R+G,_=U+H;Y>=0&&Y<c&&_>=0&&_<i&&(b+=u((_*c+Y)*4),f++)}const $=P-b/f;s.push($)}const I=s.reduce((B,T)=>B+T,0)/s.length,z=s.reduce((B,T)=>B+(T-I)**2,0)/s.length;F.push(z)}const w=F.reduce((t,h)=>t+h,0)/F.length,S=Math.sqrt(F.reduce((t,h)=>t+(h-w)**2,0)/F.length),m=Math.max(0,100-S/w*100),a=document.createElement("canvas");a.width=c,a.height=i;const y=a.getContext("2d");y.globalAlpha=.3,y.drawImage(o,0,0),y.globalAlpha=1;const r=Math.max(...F);for(let t=0;t<D;t++)for(let h=0;h<E;h++){const s=F[t*E+h],I=r>0?s/r:0,z=Math.floor(255*(1-I)),B=Math.floor(255*I);y.fillStyle=`rgba(${z}, ${B}, 60, 0.5)`,y.fillRect(h*g,t*g,g,g),y.strokeStyle="rgba(255,255,255,0.1)",y.strokeRect(h*g,t*g,g,g)}j&&j(a),p({mean:w,std:S,uniformity:m})}catch(o){console.error("[Noise] Analysis failed:",o)}finally{C(!1)}},[L,A,g,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(V,{value:A,onChange:o=>O(o),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",g,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"64",step:"8",value:g,onChange:o=>q(Number(o.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${N?"tool-loading":""}`,onClick:v,disabled:N,children:N?"Analysing...":"📡 Analyse Noise"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:l.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:l.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":l.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️":l.uniformity>40?"🤔":"✅"," ","Uniformity: ",l.uniformity.toFixed(1),"% — ",l.uniformity>70?"Uniform noise (AI suspect)":l.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},ne=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(5),[g,q]=k.useState(32),[N,C]=k.useState(!1),[l,p]=k.useState(null),v=(i,M,x,n,d)=>{let u=0;const E=Math.max(1,Math.floor(d/8));for(let D=0;D<d;D+=E)for(let F=0;F<d;F+=E){const w=((n+D)*M+(x+F))*4,S=i[w]*.299+i[w+1]*.587+i[w+2]*.114;u=(u<<5)-u+Math.floor(S/(12-A))|0}return u},o=(i,M,x,n,d,u,E)=>{let D=0,F=0;const w=Math.max(1,Math.floor(E/16));for(let S=0;S<E;S+=w)for(let m=0;m<E;m+=w){const a=((n+S)*M+(x+m))*4,y=((u+S)*M+(d+m))*4;D+=Math.abs(i[a]-i[y]),D+=Math.abs(i[a+1]-i[y+1]),D+=Math.abs(i[a+2]-i[y+2]),F++}return 1-D/(F*3*255)},c=k.useCallback(async()=>{C(!0),p(null);try{const i=new Image;i.crossOrigin="anonymous",await new Promise((t,h)=>{i.onload=()=>t(),i.onerror=()=>h(new Error("Failed to load")),i.src=L});const M=i.naturalWidth,x=i.naturalHeight,n=document.createElement("canvas");n.width=M,n.height=x;const d=n.getContext("2d");d.drawImage(i,0,0);const u=d.getImageData(0,0,M,x),E=Math.max(g/2,8),D=new Map;for(let t=0;t+g<=x;t+=E)for(let h=0;h+g<=M;h+=E){const s=v(u.data,M,h,t,g);D.has(s)||D.set(s,[]),D.get(s).push({x:h,y:t})}const F=[],w=g*2,S=.85+(A-5)*.01;for(const[,t]of D)if(!(t.length<2||t.length>50))for(let h=0;h<t.length&&h<10;h++)for(let s=h+1;s<t.length&&s<10;s++){if(Math.sqrt((t[h].x-t[s].x)**2+(t[h].y-t[s].y)**2)<w)continue;const z=o(u.data,M,t[h].x,t[h].y,t[s].x,t[s].y,g);z>=S&&F.push({ax:t[h].x,ay:t[h].y,bx:t[s].x,by:t[s].y,sim:z})}const m=document.createElement("canvas");m.width=M,m.height=x;const a=m.getContext("2d");a.drawImage(i,0,0);const y=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],r=F.slice(0,30);r.forEach((t,h)=>{const s=y[h%y.length];a.strokeStyle=s,a.lineWidth=2,a.globalAlpha=.7,a.strokeRect(t.ax,t.ay,g,g),a.strokeRect(t.bx,t.by,g,g),a.fillStyle=s,a.globalAlpha=.15,a.fillRect(t.ax,t.ay,g,g),a.fillRect(t.bx,t.by,g,g),a.globalAlpha=.4,a.setLineDash([4,4]),a.beginPath(),a.moveTo(t.ax+g/2,t.ay+g/2),a.lineTo(t.bx+g/2,t.by+g/2),a.stroke(),a.setLineDash([]),a.globalAlpha=1}),j&&j(m),p(r.length)}catch(i){console.error("[Clone] Detection failed:",i)}finally{C(!1)}},[L,A,g,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:A,onChange:i=>O(Number(i.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",g,"px"]}),e.jsx("input",{type:"range",className:"tool-slider",min:"8",max:"128",step:"8",value:g,onChange:i=>q(Number(i.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${N?"tool-loading":""}`,onClick:c,disabled:N,children:N?"Detecting...":"🎯 Detect Clones"}),l!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${l>5?"tool-verdict-danger":l>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[l>0?"🎯":"✅"," Found ",l," clone ",l===1?"pair":"pairs"]})]})]})},se=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(1),[g,q]=k.useState(!1),[N,C]=k.useState(null),l=(v,o)=>{const c=v.length;if(c<=1)return[v,o];const i=c/2,M=new Float64Array(i),x=new Float64Array(i),n=new Float64Array(i),d=new Float64Array(i);for(let m=0;m<i;m++)M[m]=v[2*m],x[m]=o[2*m],n[m]=v[2*m+1],d[m]=o[2*m+1];const[u,E]=l(M,x),[D,F]=l(n,d),w=new Float64Array(c),S=new Float64Array(c);for(let m=0;m<i;m++){const a=-2*Math.PI*m/c,y=Math.cos(a),r=Math.sin(a),t=y*D[m]-r*F[m],h=y*F[m]+r*D[m];w[m]=u[m]+t,S[m]=E[m]+h,w[m+i]=u[m]-t,S[m+i]=E[m]-h}return[w,S]},p=k.useCallback(async()=>{q(!0),C(null);try{const v=new Image;v.crossOrigin="anonymous",await new Promise((s,I)=>{v.onload=()=>s(),v.onerror=()=>I(new Error("Failed to load image")),v.src=L});const o=512,c=document.createElement("canvas");c.width=o,c.height=o;const i=c.getContext("2d");i.drawImage(v,0,0,o,o);const x=i.getImageData(0,0,o,o).data,n=new Float64Array(o*o);for(let s=0;s<o*o;s++)n[s]=(x[s*4]*.299+x[s*4+1]*.587+x[s*4+2]*.114)/255;const d=new Float64Array(n),u=new Float64Array(o*o);for(let s=0;s<o;s++){const I=new Float64Array(o),z=new Float64Array(o);for(let R=0;R<o;R++)I[R]=d[s*o+R],z[R]=u[s*o+R];const[B,T]=l(I,z);for(let R=0;R<o;R++)d[s*o+R]=B[R],u[s*o+R]=T[R]}for(let s=0;s<o;s++){const I=new Float64Array(o),z=new Float64Array(o);for(let R=0;R<o;R++)I[R]=d[R*o+s],z[R]=u[R*o+s];const[B,T]=l(I,z);for(let R=0;R<o;R++)d[R*o+s]=B[R],u[R*o+s]=T[R]}const E=new Float64Array(o*o),D=o/2;let F=0;for(let s=0;s<o;s++)for(let I=0;I<o;I++){const z=d[s*o+I],B=u[s*o+I];let T=Math.sqrt(z*z+B*B);T=Math.log(1+T)*A;const R=(s+D)%o,U=(I+D)%o,W=R*o+U;E[W]=T,T>F&&(F=T)}const w=E[D*o+D],m=E[0]/F*100,a=w/F*100;let y=0;for(let s=1;s<4;s++){const I=D+s*(o/8);I<o&&E[D*o+I]>E[D*o+I-1]*1.5&&y++}const r=document.createElement("canvas");r.width=o,r.height=o;const t=r.getContext("2d"),h=t.createImageData(o,o);for(let s=0;s<o*o;s++){const I=F>0?E[s]/F*255:0,z=s*4;h.data[z]=Math.min(255,I*.8),h.data[z+1]=Math.min(255,I*.9),h.data[z+2]=Math.min(255,I),h.data[z+3]=255}t.putImageData(h,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let s=30;s<D;s+=30)t.beginPath(),t.arc(D,D,s,0,Math.PI*2),t.stroke();j&&j(r),C({highFreq:m,lowFreq:a,gridArtifacts:y>3})}catch(v){console.error("[FFT] Analysis failed:",v)}finally{q(!1)}},[L,A,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",step:"0.1",value:A,onChange:v=>O(Number(v.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${g?"tool-loading":""} `,onClick:p,disabled:g,children:g?"Analysing...":"🌊 Generate Spectrum"}),N&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[N.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[N.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:N.gridArtifacts?"#ef4444":"#10b981"},children:N.gridArtifacts?"Detected":"None"})]})]})]})]})},re=({targetImage:L,onResult:j})=>{const[A,O]=k.useState("sobel"),[g,q]=k.useState(100),[N,C]=k.useState(!1),[l,p]=k.useState(null),[v,o]=k.useState(0),c=k.useRef(null),i=k.useRef(null),M=k.useCallback(async()=>{C(!0),p(null);try{const x=new Image;x.crossOrigin="anonymous",await new Promise((b,f)=>{x.onload=()=>b(),x.onerror=()=>f(new Error("Failed to load")),x.src=L});const n=x.naturalWidth,d=x.naturalHeight,u=document.createElement("canvas");u.width=n,u.height=d;const E=u.getContext("2d");E.drawImage(x,0,0);const F=E.getImageData(0,0,n,d).data,w=new Float64Array(n*d);for(let b=0;b<n*d;b++){const f=b*4;w[b]=.299*F[f]+.587*F[f+1]+.114*F[f+2]}const S=new Float64Array(n*d),m=new Uint8Array(n*d);if(A==="sobel"||A==="canny")for(let b=1;b<d-1;b++)for(let f=1;f<n-1;f++){const $=-w[(b-1)*n+(f-1)]+w[(b-1)*n+(f+1)]-2*w[b*n+(f-1)]+2*w[b*n+(f+1)]-w[(b+1)*n+(f-1)]+w[(b+1)*n+(f+1)],G=-w[(b-1)*n+(f-1)]-2*w[(b-1)*n+f]-w[(b-1)*n+(f+1)]+w[(b+1)*n+(f-1)]+2*w[(b+1)*n+f]+w[(b+1)*n+(f+1)],H=Math.sqrt($*$+G*G);S[b*n+f]=H,m[b*n+f]=H>g?255:0}else for(let b=1;b<d-1;b++)for(let f=1;f<n-1;f++){const $=-4*w[b*n+f]+w[(b-1)*n+f]+w[(b+1)*n+f]+w[b*n+(f-1)]+w[b*n+(f+1)],G=Math.abs($);S[b*n+f]=G,m[b*n+f]=G>g/2?255:0}let a=0,y=0;const r=32,t=[];for(let b=0;b<n*d;b++)m[b]>0&&a++,y+=S[b];for(let b=0;b<Math.floor(d/r);b++)for(let f=0;f<Math.floor(n/r);f++){let $=0;for(let G=0;G<r;G++)for(let H=0;H<r;H++)$+=S[(b*r+G)*n+(f*r+H)];t.push($/(r*r))}const h=t.reduce((b,f)=>b+f,0)/t.length,s=Math.sqrt(t.reduce((b,f)=>b+(f-h)**2,0)/t.length),I=h>0?Math.max(0,100-s/h*50):0;p({edgeDensity:a/(n*d)*1e4,avgStrength:y/(n*d),uniformity:I});const z=document.createElement("canvas");z.width=n,z.height=d;const B=z.getContext("2d"),T=B.createImageData(n,d);for(let b=0;b<n*d;b++){const f=b*4;T.data[f]=T.data[f+1]=T.data[f+2]=m[b],T.data[f+3]=255}B.putImageData(T,0,0);const R=document.createElement("canvas");R.width=n,R.height=d;const U=R.getContext("2d"),W=U.createImageData(n,d),P=Math.max(...S);for(let b=0;b<n*d;b++){const f=b*4,$=P>0?S[b]/P:0;$<.25?(W.data[f]=0,W.data[f+1]=Math.floor($*4*255),W.data[f+2]=255):$<.5?(W.data[f]=0,W.data[f+1]=255,W.data[f+2]=Math.floor((1-($-.25)*4)*255)):$<.75?(W.data[f]=Math.floor(($-.5)*4*255),W.data[f+1]=255,W.data[f+2]=0):(W.data[f]=255,W.data[f+1]=Math.floor((1-($-.75)*4)*255),W.data[f+2]=0),W.data[f+3]=255}U.putImageData(W,0,0),c.current=z,i.current=R,p({edgeDensity:a/(n*d)*1e4,avgStrength:y/(n*d),uniformity:I})}catch(x){console.error("[Gradient] Analysis failed:",x)}finally{C(!1)}},[L,A,g]);return X.useEffect(()=>{l&&j&&(v===0&&c.current?j(c.current):v===1&&i.current&&j(i.current))},[l,v,j]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(V,{value:A,onChange:x=>O(x),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",g]}),e.jsx("input",{type:"range",className:"tool-slider",min:"20",max:"300",value:g,onChange:x=>q(Number(x.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${N?"tool-loading":""}`,onClick:M,disabled:N,children:N?"Analysing...":"📐 Analyse Gradients"}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${v===0?"tool-tab-active":""}`,onClick:()=>o(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${v===1?"tool-tab-active":""}`,onClick:()=>o(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[l.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:l.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${l.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[l.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",l.uniformity.toFixed(1),"%)"]})]})]})},ie=({targetImage:L,onResult:j})=>{const[A,O]=k.useState("medium"),[g,q]=k.useState(!1),[N,C]=k.useState(0),[l,p]=k.useState(null),v=k.useCallback(async()=>{q(!0),p(null),C(0);try{const o=new Image;o.crossOrigin="anonymous",await new Promise((P,b)=>{o.onload=()=>P(),o.onerror=()=>b(new Error("Failed to load")),o.src=L}),C(20);const c=o.naturalWidth,i=o.naturalHeight,M=document.createElement("canvas");M.width=c,M.height=i;const x=M.getContext("2d");x.drawImage(o,0,0);const d=x.getImageData(0,0,c,i).data,u=new Float64Array(c*i);for(let P=0;P<c*i;P++)u[P]=.299*d[P*4]+.587*d[P*4+1]+.114*d[P*4+2];C(40);const D=Math.floor((A==="low"?3:A==="medium"?5:7)/2),F=new Float64Array(c*i);for(let P=0;P<i;P++)for(let b=0;b<c;b++){let f=0,$=0;for(let G=-D;G<=D;G++)for(let H=-D;H<=D;H++){const Y=P+G,_=b+H;Y>=0&&Y<i&&_>=0&&_<c&&(f+=u[Y*c+_],$++)}F[P*c+b]=f/$}C(70);const w=new Float64Array(c*i);for(let P=0;P<c*i;P++)w[P]=u[P]-F[P];const S=32,m=Math.floor(c/S),a=Math.floor(i/S),y=[];for(let P=0;P<a;P++)for(let b=0;b<m;b++){const f=[];for(let H=0;H<S;H++)for(let Y=0;Y<S;Y++)f.push(w[(P*S+H)*c+(b*S+Y)]);const $=f.reduce((H,Y)=>H+Y,0)/f.length,G=f.reduce((H,Y)=>H+(Y-$)**2,0)/f.length;y.push(G)}const r=y.reduce((P,b)=>P+b,0)/y.length,t=Math.sqrt(y.reduce((P,b)=>P+(b-r)**2,0)/y.length),h=r>0?Math.min(100,t/r*100):0,s=100-h,I=h>30;p({hasFingerprint:I,consistency:h,uniformity:s}),C(90);const z=document.createElement("canvas");z.width=c,z.height=i;const B=z.getContext("2d"),T=B.createImageData(c,i);let R=1/0,U=-1/0;for(let P=0;P<w.length;P++)w[P]<R&&(R=w[P]),w[P]>U&&(U=w[P]);const W=U-R||1;for(let P=0;P<c*i;P++){const b=(w[P]-R)/W*255,f=P*4,$=Math.min(255,b*3);T.data[f]=$,T.data[f+1]=$,T.data[f+2]=$,T.data[f+3]=255}B.putImageData(T,0,0),j&&j(z),C(100),p({hasFingerprint:I,consistency:h,uniformity:s})}catch(o){console.error("[PRNU] Analysis failed:",o)}finally{q(!1)}},[L,A,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(V,{value:A,onChange:o=>O(o),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx("button",{className:`tool-analyse-btn ${g?"tool-loading":""}`,onClick:v,disabled:g,children:g?"Extracting PRNU...":"📷 Extract PRNU"}),g&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${N}%`}})}),l&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[l.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[l.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${l.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:l.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},le=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(6),[g,q]=k.useState(!1),[N,C]=k.useState(null),l=k.useCallback(async()=>{q(!0),C(null);try{const p=new Image;p.crossOrigin="anonymous",await new Promise((m,a)=>{p.onload=()=>m(),p.onerror=()=>a(new Error("Failed to load")),p.src=L});const v=p.naturalWidth,o=p.naturalHeight,c=document.createElement("canvas");c.width=v,c.height=o;const i=c.getContext("2d");i.drawImage(p,0,0);const x=i.getImageData(0,0,v,o).data,n=200+(10-A)*5,d=[],u=16;for(let m=0;m<Math.floor(o/u);m++)for(let a=0;a<Math.floor(v/u);a++){let y=0,r=0,t=0;for(let h=0;h<u;h++)for(let s=0;s<u;s++){const I=a*u+s,z=m*u+h,B=(z*v+I)*4,T=Math.max(x[B],x[B+1],x[B+2]);T>y&&(y=T,r=I,t=z)}y>n&&d.push({x:r,y:t,intensity:y})}const E=[];for(const m of d){let a=0,y=0;const r=10;for(let h=-r;h<=r;h++)for(let s=-r;s<=r;s++){const I=m.x+s,z=m.y+h;if(I<0||I>=v||z<0||z>=o)continue;const B=(z*v+I)*4,T=.299*x[B]+.587*x[B+1]+.114*x[B+2];a+=s*T,y+=h*T}const t=Math.atan2(y,a);E.push(t)}let D=0,F=0;if(E.length>1){const m=E.reduce((a,y)=>a+y,0)/E.length;for(const a of E){const y=Math.abs(a-m);y<Math.PI/4||y>Math.PI*7/4?D++:F++}}C({highlights:d.length,consistent:D,inconsistent:F});const w=document.createElement("canvas");w.width=v,w.height=o;const S=w.getContext("2d");S.drawImage(p,0,0),d.forEach((m,a)=>{const y=a<E.length&&(()=>{const r=E.reduce((h,s)=>h+s,0)/E.length,t=Math.abs(E[a]-r);return t<Math.PI/4||t>Math.PI*7/4})();if(S.beginPath(),S.arc(m.x,m.y,12,0,Math.PI*2),S.strokeStyle=y?"#fbbf24":"#ef4444",S.lineWidth=2,S.stroke(),a<E.length){const r=E[a],t=25;S.beginPath(),S.moveTo(m.x,m.y),S.lineTo(m.x+Math.cos(r)*t,m.y+Math.sin(r)*t),S.strokeStyle=y?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",S.lineWidth=2,S.stroke()}}),j&&j(w),C({highlights:d.length,consistent:D,inconsistent:F})}catch(p){console.error("[Highlight] Analysis failed:",p)}finally{q(!1)}},[L,A,j]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",A]}),e.jsx("input",{type:"range",className:"tool-slider",min:"1",max:"10",value:A,onChange:p=>O(Number(p.target.value))})]}),e.jsx("button",{className:`tool-analyse-btn ${g?"tool-loading":""}`,onClick:l,disabled:g,children:g?"Detecting...":"✨ Detect Highlights"}),N&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:N.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[N.consistent," / ",N.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${N.inconsistent>N.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:N.inconsistent>N.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},ce=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(!1),[g,q]=k.useState(null),N=k.useCallback(async()=>{O(!0),q(null);try{const C=new Image;C.crossOrigin="anonymous",await new Promise((a,y)=>{C.onload=()=>a(),C.onerror=()=>y(new Error("Failed to load")),C.src=L});const l=C.naturalWidth,p=C.naturalHeight,v=document.createElement("canvas");v.width=l,v.height=p;const o=v.getContext("2d");o.drawImage(C,0,0);const i=o.getImageData(0,0,l,p).data,M=new Float64Array(l*p),x=new Float64Array(l*p),n=new Float64Array(l*p);for(let a=0;a<l*p;a++)M[a]=i[a*4],x[a]=i[a*4+1],n[a]=i[a*4+2];const d=[];for(let a=2;a<p-2;a+=4)for(let y=2;y<l-2;y+=4){const r=z=>.299*M[z]+.587*x[z]+.114*n[z],t=a*l+y,h=-r(t-l-1)+r(t-l+1)-2*r(t-1)+2*r(t+1)-r(t+l-1)+r(t+l+1),s=-r(t-l-1)-2*r(t-l)-r(t-l+1)+r(t+l-1)+2*r(t+l)+r(t+l+1),I=Math.sqrt(h*h+s*s);I>100&&d.push({x:y,y:a,strength:I})}let u=0;const E=[];for(const a of d.slice(0,200)){const y=U=>{const W=a.y*l+a.x,P=-U[W-l-1]+U[W-l+1]-2*U[W-1]+2*U[W+1]-U[W+l-1]+U[W+l+1],b=-U[W-l-1]-2*U[W-l]-U[W-l+1]+U[W+l-1]+2*U[W+l]+U[W+l+1];return{gx:P,gy:b,mag:Math.sqrt(P*P+b*b)}},r=y(M),t=y(x),h=y(n),s=Math.atan2(r.gy,r.gx),I=Math.atan2(t.gy,t.gx),z=Math.atan2(h.gy,h.gx),B=Math.abs(s-I),T=Math.abs(z-I),R=(B+T)/2;u+=R,E.push({x:a.x,y:a.y,sep:R})}const D=d.length>0?u/Math.min(d.length,200):0,F=D>.05,w=document.createElement("canvas");w.width=l,w.height=p;const S=w.getContext("2d"),m=S.createImageData(l,p);for(let a=0;a<l*p;a++){const y=a*4;m.data[y]=Math.min(255,Math.abs(M[a]-x[a])*5),m.data[y+1]=Math.min(255,Math.abs(x[a]-n[a])*5),m.data[y+2]=Math.min(255,Math.abs(n[a]-M[a])*5),m.data[y+3]=255}S.putImageData(m,0,0);for(const a of E)S.beginPath(),S.arc(a.x,a.y,3,0,Math.PI*2),S.fillStyle=a.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",S.fill();j&&j(w),q({avgSeparation:D*100,detected:F,edgesAnalysed:Math.min(d.length,200)})}catch(C){console.error("[Aberration] Analysis failed:",C)}finally{O(!1)}},[L,j]);return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${A?"tool-loading":""}`,onClick:N,disabled:A,children:A?"Checking...":"🌈 Check for Aberration"}),g&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[g.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:g.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${g.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:g.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},de=({targetImage:L,onResult:j})=>{const[A,O]=k.useState(!0),[g,q]=k.useState(!1),[N,C]=k.useState(null),l=k.useCallback(async()=>{q(!0),C(null);try{const p=new Image;p.crossOrigin="anonymous",await new Promise((r,t)=>{p.onload=()=>r(),p.onerror=()=>t(new Error("Failed to load")),p.src=L});const v=p.naturalWidth,o=p.naturalHeight,c=document.createElement("canvas");c.width=v,c.height=o;const i=c.getContext("2d");i.drawImage(p,0,0);const M=i.getImageData(0,0,v,o).data,x=8,n=Math.floor(v/x),d=Math.floor(o/x),u=[];for(let r=0;r<d;r++)for(let t=0;t<n;t++){let h=0,s=0;if(t<n-1)for(let I=0;I<x;I++){const B=((r*x+I)*v+(t+1)*x-1)*4,T=B+4;h+=Math.abs(M[B]-M[T])+Math.abs(M[B+1]-M[T+1])+Math.abs(M[B+2]-M[T+2]),s++}if(r<d-1)for(let I=0;I<x;I++){const z=t*x+I,B=(r+1)*x-1,T=B+1,R=(B*v+z)*4,U=(T*v+z)*4;h+=Math.abs(M[R]-M[U])+Math.abs(M[R+1]-M[U+1])+Math.abs(M[R+2]-M[U+2]),s++}u.push(s>0?h/(s*3):0)}const E=u.reduce((r,t)=>r+t,0)/u.length,D=Math.sqrt(u.reduce((r,t)=>r+(t-E)**2,0)/u.length);let F=0;for(const r of u)Math.abs(r-E)>D*2&&F++;const w=Math.max(10,Math.min(100,100-E*2)),S=F>n*d*.1?2:1,m=document.createElement("canvas");m.width=v,m.height=o;const a=m.getContext("2d");a.drawImage(p,0,0);const y=Math.max(...u);for(let r=0;r<d;r++)for(let t=0;t<n;t++){const h=y>0?u[r*n+t]/y:0,s=h<.33?0:h<.66?200:220,I=h<.33||h<.66?180:50;a.fillStyle=`rgba(${s},${I},0,0.3)`,a.fillRect(t*x,r*x,x,x),A&&(a.strokeStyle="rgba(255,255,255,0.08)",a.lineWidth=.5,a.strokeRect(t*x,r*x,x,x))}j&&j(m),C({quality:w,layers:S,inconsistent:F})}catch(p){console.error("[Compression]",p)}finally{q(!1)}},[L,A,j]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:A,onChange:p=>O(p.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx("button",{className:`tool-analyse-btn ${g?"tool-loading":""}`,onClick:l,disabled:g,children:g?"Analysing...":"🔳 Analyse Compression"}),N&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[N.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:N.layers})]})]}),e.jsx("div",{className:`tool-verdict ${N.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:N.layers>1?`⚠️ Multiple re-compressions (${N.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},ge=({targetImage:L})=>{const[j,A]=k.useState(!1),[O,g]=k.useState(null),q=k.useCallback(async()=>{var l;A(!0),g(null);try{const p=new Image;p.crossOrigin="anonymous",await new Promise((s,I)=>{p.onload=()=>s(),p.onerror=()=>I(),p.src=L});const v=L,o=v.startsWith("data:"),c=v.startsWith("blob:"),i=!o&&!c?new URL(v):null,M=i?i.pathname.split("/").pop()||"unknown":"embedded",x=((l=M.split(".").pop())==null?void 0:l.toLowerCase())||"unknown";let n="",d="",u="";try{const s=await fetch(L,{method:"HEAD",mode:"cors"});n=s.headers.get("content-type")||"",d=s.headers.get("content-length")||"",u=s.headers.get("last-modified")||""}catch{}const E=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],D=v.toLowerCase(),F=E.some(s=>D.includes(s)),S=i?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(s=>i.hostname.includes(s)):!1,m={Source:o?"Data URL (embedded)":c?"Blob URL (local)":(i==null?void 0:i.hostname)||"Unknown",Filename:M,Format:n||x.toUpperCase(),Dimensions:`${p.naturalWidth} × ${p.naturalHeight}`},a={"Aspect Ratio":(p.naturalWidth/p.naturalHeight).toFixed(2),"Total Pixels":`${(p.naturalWidth*p.naturalHeight/1e6).toFixed(1)} MP`};d&&(a["File Size"]=`${(parseInt(d)/1024).toFixed(1)} KB`);const y={};u&&(y["Last Modified"]=u);const r={};F&&(r["AI Indicator"]="⚠️ AI-related keywords found in URL"),S&&(r.Hosting="⚠️ Known AI image hosting platform");let t="authentic",h="✅ No suspicious metadata detected";F||S?(t="ai",h="❌ AI generation indicators detected in metadata"):(o||c)&&(t="suspicious",h="⚠️ Embedded/local image — limited metadata available"),g({camera:m,settings:a,dates:y,software:r,verdict:t,verdictText:h})}catch(p){console.error("[Metadata]",p)}finally{A(!1)}},[L]),N=()=>{if(!O)return;const l=JSON.stringify({...O.camera,...O.settings,...O.dates,...O.software},null,2);navigator.clipboard.writeText(l)},C=(l,p,v)=>Object.keys(v).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:p}),e.jsx("h4",{children:l})]}),Object.entries(v).map(([o,c])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:o}),e.jsx("span",{className:`metadata-value ${c.includes("Not found")?"metadata-missing":""}`,children:c})]},o))]});return e.jsxs("div",{children:[e.jsx("button",{className:`tool-analyse-btn ${j?"tool-loading":""}`,onClick:q,disabled:j,children:j?"Extracting...":"📋 Extract Metadata"}),O&&e.jsxs("div",{className:"tool-output-area",children:[C("Image Information","📷",O.camera),C("Properties","⚙️",O.settings),C("Dates","📅",O.dates),C("Software & AI Detection","🖥️",O.software),e.jsx("div",{className:`tool-verdict ${O.verdict==="authentic"?"tool-verdict-safe":O.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:O.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:N,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})},he=[{icon:"🔬",title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:oe},{icon:"📡",title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:ae},{icon:"🎯",title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:ne},{icon:"🌊",title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:se},{icon:"📐",title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:re},{icon:"📷",title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ie},{icon:"✨",title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:le},{icon:"🌈",title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:ce},{icon:"🔳",title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:de},{icon:"📋",title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:ge}],me=({targetImage:L,onBack:j,onClose:A})=>{var o;const[O,g]=k.useState(null),[q,N]=k.useState(50),[C,l]=k.useState("ltr"),p=k.useRef(null),v=k.useCallback(c=>{g(c.toDataURL())},[]);return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:j,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx("span",{children:"🔍"}),e.jsx("h2",{children:"Forensic Analysis"})]}),e.jsx("button",{className:"forensic-close-btn",onClick:A,"aria-label":"Close",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{className:"comparison-container",ref:p,children:[e.jsx("img",{src:L,alt:"Original",className:"comparison-image"}),O&&e.jsx("div",{className:"comparison-overlay",style:{width:`${C==="ltr"?q:100-q}%`,left:C==="ltr"?0:"auto",right:C==="rtl"?0:"auto",borderRight:C==="ltr"?"2px solid #fff":"none",borderLeft:C==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:O,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:C==="ltr"?0:"auto",right:C==="rtl"?0:"auto",width:((o=p.current)==null?void 0:o.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),O&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${q}%`}})]}),O&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>g(null),title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:q,onChange:c=>N(Number(c.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>l(c=>c==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!O&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx("span",{children:"📊"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),e.jsx("div",{className:"forensic-tools-grid",children:he.map((c,i)=>e.jsx(ee,{icon:c.icon,title:c.title,description:c.desc,tier:c.tier,index:i,children:e.jsx(c.Component,{targetImage:L,onResult:v})},c.title))})]})},pe=()=>{const[L,j]=k.useState("idle"),[A,O]=k.useState(null),[g,q]=k.useState(null),[N,C]=k.useState(null),[l,p]=k.useState(null),[v,o]=k.useState(!1),c=k.useRef({x:0,y:0}),i=k.useRef(null);k.useEffect(()=>{const d=u=>{switch(u.type){case"SCANNING":j("scanning"),C(u.imageUrl||null),O(null),q(null);break;case"SHOW_RESULT":j("result"),O({isAI:u.isAI||!1,confidence:u.confidence||0,heatmapData:u.heatmapData,filterData:u.filterData});break;case"ERROR":j("error"),q(u.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(d),()=>chrome.runtime.onMessage.removeListener(d)},[]),k.useEffect(()=>{const d=E=>{if(!v||!i.current)return;let D=E.clientX-c.current.x,F=E.clientY-c.current.y;const w=i.current.getBoundingClientRect(),S=window.innerWidth,m=window.innerHeight,a=Math.max(0,S-w.width),y=Math.max(0,m-w.height);D=Math.max(0,Math.min(D,a)),F=Math.max(0,Math.min(F,y)),p({x:D,y:F})},u=()=>{o(!1)};return v&&(window.addEventListener("mousemove",d),window.addEventListener("mouseup",u)),()=>{window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",u)}},[v]);const M=d=>{if(!i.current)return;const u=i.current.getBoundingClientRect(),E=u.left,D=u.top;c.current={x:d.clientX-E,y:d.clientY-D},l||p({x:E,y:D}),o(!0)},x=()=>{j("idle"),O(null),q(null),C(null),p(null)};if(L==="idle")return null;const n=L==="tools"?800:400;return e.jsxs(X.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:l?0:20},children:e.jsx("div",{ref:i,className:"pointer-events-auto transition-shadow duration-300",style:l?{position:"absolute",left:l.x,top:l.y,boxShadow:v?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(Q,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:n},children:[e.jsx("div",{onMouseDown:M,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${v?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:x,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[L==="scanning"&&e.jsxs("div",{className:"relative",children:[N&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:N,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),L==="result"&&A&&N&&e.jsx(J,{result:A,targetImage:N,onToolsClick:()=>j("tools")}),L==="tools"&&N&&e.jsx(me,{targetImage:N,onBack:()=>j("result"),onClose:x}),L==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:g})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})})]})},ue=`
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
`;function be(L){const j=document.createElement("style");j.textContent=ue,L.appendChild(j)}const xe=`

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
`;function fe(L){const j=document.createElement("style");j.textContent=xe,L.appendChild(j)}if(!document.getElementById("undiffused-root")){const L=document.createElement("div");L.id="undiffused-root",document.body.appendChild(L);const j=L.attachShadow({mode:"open"});be(j),fe(j);const A=document.createElement("div");A.id="undiffused-app",j.appendChild(A);const O=document.createElement("div");O.id="undiffused-portal-root",Object.assign(O.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),j.appendChild(O),Z.createRoot(A).render(e.jsx(pe,{})),console.log("[UnDiffused] Content script injected")}
