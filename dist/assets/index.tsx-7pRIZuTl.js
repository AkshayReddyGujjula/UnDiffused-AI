import{r as k,j as e,a as J,R as Q,G as Z,c as ee}from"./GlassCard-BMBPpFOK.js";const te=({result:n,targetImage:i,onToolsClick:h})=>{const[M,v]=k.useState({x:50,y:50}),[P,z]=k.useState({x:50,y:50}),D=d=>{const y=d.currentTarget.getBoundingClientRect(),o=(d.clientX-y.left)/y.width*100,g=(d.clientY-y.top)/y.height*100;v({x:o,y:g})},u=d=>{const y=d.currentTarget.getBoundingClientRect(),o=(d.clientX-y.left)/y.width*100,g=(d.clientY-y.top)/y.height*100;z({x:o,y:g})};return e.jsxs("div",{className:"animate-fade-in",children:[e.jsxs("div",{className:`
                inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4
                ${n.isAI?"bg-red-500/20 border border-red-500/30":"bg-green-500/20 border border-green-500/30"}
            `,children:[e.jsx("div",{className:`w-2 h-2 rounded-full ${n.isAI?"bg-red-400":"bg-green-400"}`}),e.jsx("span",{className:`text-sm font-medium ${n.isAI?"text-red-400":"text-green-400"}`,children:n.isAI?"AI-GENERATED":"REAL IMAGE"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-white opacity-100 font-medium",children:"Confidence"}),e.jsxs("span",{className:"text-white/50",children:[n.confidence,"%"]})]}),e.jsx("div",{className:"h-1.5 bg-white/10 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full transition-all duration-500 ${n.isAI?"bg-red-500":"bg-green-500"}`,style:{width:`${n.confidence}%`}})})]}),i&&e.jsx("div",{className:"mt-4 mb-2 relative rounded-xl overflow-hidden border border-white/10 bg-black/20",children:e.jsx("img",{src:i,alt:"Analyzed",className:"w-full h-auto max-h-[400px] object-contain block"})}),e.jsxs("div",{className:"mt-4 flex flex-col gap-3",children:[e.jsxs("button",{onClick:async()=>{try{if(i.startsWith("data:")){const o=await(await fetch(i)).blob();await navigator.clipboard.write([new ClipboardItem({[o.type]:o})]),window.open("https://lens.google.com/uploadbyurl","_blank");const g=document.createElement("div");g.textContent="📋 Image copied! Press Ctrl+V to paste in Google Lens",g.style.cssText=`
                                position: fixed;
                                top: 20px;
                                right: 20px;
                                background: rgba(0, 0, 0, 0.9);
                                color: white;
                                padding: 12px 20px;
                                border-radius: 8px;
                                z-index: 999999;
                                font-size: 14px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                                backdrop-filter: blur(10px);
                            `,document.body.appendChild(g),setTimeout(()=>{g.style.transition="opacity 0.3s",g.style.opacity="0",setTimeout(()=>document.body.removeChild(g),300)},3e3)}else{const y=`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(i)}`;window.open(y,"_blank")}}catch(d){console.error("Reverse search failed:",d);const y=`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(i)}`;window.open(y,"_blank")}},onMouseMove:D,className:"w-full py-2.5 px-4 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.05] hover:z-20 transition-all duration-300 relative overflow-hidden",style:{background:`radial-gradient(circle 150px at ${M.x}% ${M.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.1) 100%)`,transition:"background 0.2s ease-out, transform 0.3s ease-out"},children:[e.jsxs("svg",{className:"w-5 h-5 relative z-10",viewBox:"0 0 24 24",children:[e.jsx("path",{fill:"currentColor",d:"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",className:"text-[#4285F4]"}),e.jsx("path",{fill:"currentColor",d:"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",className:"text-[#34A853]"}),e.jsx("path",{fill:"currentColor",d:"M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z",className:"text-[#FBBC05]"}),e.jsx("path",{fill:"currentColor",d:"M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z",className:"text-[#EA4335]"})]}),e.jsx("span",{className:"text-base font-semibold text-white/90 group-hover:text-white transition-colors relative z-10",children:"Search with Google"})]}),e.jsxs("button",{onClick:()=>{h&&h()},onMouseMove:u,className:"w-full py-2.5 px-4 rounded-xl border border-white/20 backdrop-blur-xl flex items-center justify-center gap-3 group shadow-lg hover:scale-[1.05] hover:z-20 transition-all duration-300 relative overflow-hidden",style:{background:`radial-gradient(circle 150px at ${P.x}% ${P.y}%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.1) 100%)`,transition:"background 0.2s ease-out, transform 0.3s ease-out"},children:[e.jsxs("svg",{className:"w-5 h-5 text-white/80 relative z-10",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"})]}),e.jsx("span",{className:"text-base font-semibold text-white/90 group-hover:text-white transition-colors relative z-10",children:"Tools"})]})]}),e.jsx("p",{className:"mt-6 mb-2 text-[10px] text-white/30 tracking-wide",children:"🔒 All processing done locally on your device"})]})},oe=({icon:n,title:i,description:h,tier:M,index:v,children:P})=>{const[z,D]=k.useState(!1);return e.jsxs("div",{className:`tool-card ${z?"tool-card-expanded":""}`,style:{animationDelay:`${v*80}ms`},children:[e.jsxs("button",{className:"tool-card-header",onClick:()=>D(!z),"aria-expanded":z,"aria-label":`${i} - ${h}`,children:[e.jsx("div",{className:"tool-card-icon",children:n}),e.jsxs("div",{className:"tool-card-info",children:[e.jsx("h3",{className:"tool-card-title",children:i}),e.jsx("p",{className:"tool-card-desc",children:h})]}),e.jsx("div",{className:`tool-card-chevron ${z?"tool-card-chevron-open":""}`,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})})]}),M===2&&e.jsx("div",{className:"tool-card-tier-badge",children:"Advanced"}),e.jsx("div",{className:`tool-card-content ${z?"tool-card-content-open":""}`,children:e.jsx("div",{className:"tool-card-content-inner",children:P||e.jsx("div",{className:"tool-card-placeholder",children:e.jsx("p",{children:"Tool controls will appear here"})})})})]})};var ae=J();function K({value:n,onChange:i,options:h,placeholder:M="Select...",disabled:v=!1}){const[P,z]=k.useState(!1),D=k.useRef(null),u=k.useRef(null),[d,y]=k.useState({top:0,left:0,width:0}),o=k.useCallback(()=>{var c;const r=(c=D.current)==null?void 0:c.getRootNode();if(r&&r instanceof ShadowRoot){let N=r.querySelector("#undiffused-portal-root");return N||(N=document.createElement("div"),N.id="undiffused-portal-root",Object.assign(N.style,{position:"fixed",top:"0",left:"0",width:"0",height:"0",overflow:"visible",zIndex:"2147483647",pointerEvents:"none"}),r.appendChild(N)),N}return document.body},[]),g=h.find(r=>r.value===n),x=r=>{i(r),z(!1)},I=()=>{if(!v)if(!P&&D.current){const r=D.current.getBoundingClientRect();y({top:r.bottom+6,left:r.left,width:r.width}),z(!0)}else z(!1)};k.useEffect(()=>{var N;if(!P)return;const r=S=>{var L,w;const p=S.target;(L=D.current)!=null&&L.contains(p)||(w=u.current)!=null&&w.contains(p)||z(!1)},c=((N=D.current)==null?void 0:N.getRootNode())||document;return c.addEventListener("mousedown",r),()=>c.removeEventListener("mousedown",r)},[P]),k.useEffect(()=>{if(!P)return;const r=()=>z(!1);return window.addEventListener("resize",r),window.addEventListener("scroll",r,{capture:!0}),()=>{window.removeEventListener("resize",r),window.removeEventListener("scroll",r,{capture:!0})}},[P]);const j=e.jsx("div",{ref:u,className:"liquid-select-menu",role:"listbox",style:{position:"fixed",top:d.top,left:d.left,width:d.width,zIndex:2147483647,pointerEvents:"auto"},children:h.map(r=>e.jsxs("div",{className:`liquid-select-option ${r.value===n?"selected":""}`,onClick:()=>x(r.value),role:"option","aria-selected":r.value===n,children:[e.jsx("span",{children:r.label}),r.value===n&&e.jsx("svg",{className:"liquid-select-icon",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})]},String(r.value)))});return e.jsxs("div",{className:"liquid-select-container",children:[e.jsxs("button",{ref:D,type:"button",className:`liquid-select-trigger ${P?"open":""} ${v?"opacity-50 cursor-not-allowed":""}`,onClick:I,disabled:v,"aria-haspopup":"listbox","aria-expanded":P,children:[e.jsx("span",{children:g?g.label:M}),e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"6 9 12 15 18 9"})})]}),P&&ae.createPortal(j,o())]})}const G=({label:n,onClick:i,isAnalysing:h=!1,disabled:M=!1,onHelpClick:v})=>e.jsxs("div",{className:"tool-action-row",children:[e.jsx("button",{className:`tool-analyse-btn ${h?"tool-loading":""}`,onClick:i,disabled:M||h,children:h?"Analysing...":n}),e.jsx("button",{className:"tool-help-btn",onClick:v,title:"How does this tool work?",children:e.jsx("span",{className:"tool-help-icon",children:"?"})})]}),V=({value:n,min:i,max:h,style:M,...v})=>{const P=(n-i)/(h-i)*100;return e.jsx("input",{type:"range",className:"tool-slider",min:i,max:h,value:n,style:{...M,background:`linear-gradient(to right, #ffffff 0%, #ffffff ${P}%, rgba(255, 255, 255, 0.2) ${P}%, rgba(255, 255, 255, 0.2) 100%)`},...v})},ne=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(85),[v,P]=k.useState("medium"),[z,D]=k.useState(!1),[u,d]=k.useState(null),y=v==="low"?10:v==="medium"?20:40,o=k.useCallback(async()=>{D(!0),d(null);try{const g=new Image;await new Promise((s,t)=>{g.onload=()=>s(),g.onerror=()=>t(new Error("Failed to load image")),g.src=n});const x=g.naturalWidth,I=g.naturalHeight,j=document.createElement("canvas");j.width=x,j.height=I;const r=j.getContext("2d");r.drawImage(g,0,0);const c=r.getImageData(0,0,x,I),N=document.createElement("canvas");N.width=x,N.height=I;const S=N.getContext("2d");S.drawImage(g,0,0);const p=N.toDataURL("image/jpeg",h/100),L=new Image;await new Promise(s=>{L.onload=()=>s(),L.src=p}),S.drawImage(L,0,0);const w=S.getImageData(0,0,x,I),A=document.createElement("canvas");A.width=x,A.height=I;const b=A.getContext("2d"),a=b.createImageData(x,I);let m=0;for(let s=0;s<c.data.length;s+=4){const t=Math.abs(c.data[s]-w.data[s]),f=Math.abs(c.data[s+1]-w.data[s+1]),l=Math.abs(c.data[s+2]-w.data[s+2]);m+=t+f+l;const T=Math.min(255,t*y),R=Math.min(255,f*y),W=Math.min(255,l*y),O=(T+R+W)/3;O<64?(a.data[s]=0,a.data[s+1]=0,a.data[s+2]=Math.min(255,O*4)):O<128?(a.data[s]=0,a.data[s+1]=Math.min(255,(O-64)*4),a.data[s+2]=255-(O-64)*4):O<192?(a.data[s]=Math.min(255,(O-128)*4),a.data[s+1]=255,a.data[s+2]=0):(a.data[s]=255,a.data[s+1]=255-(O-192)*4,a.data[s+2]=0),a.data[s+3]=255}b.putImageData(a,0,0),i&&i(A),d({diffScore:m/(x*I)})}catch(g){console.error("[ELA] Analysis failed:",g)}finally{D(!1)}},[n,h,y,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["JPEG Quality: ",h,"%"]}),e.jsx(V,{min:50,max:100,value:h,onChange:g=>M(Number(g.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Sensitivity"}),e.jsx(K,{value:v,onChange:g=>P(g),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx(G,{label:"Analyse Error Levels",onClick:o,isAnalysing:z}),u&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsx("div",{className:"tool-stats",children:e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Difference Score"}),e.jsx("div",{className:"tool-stat-value",children:u.diffScore.toFixed(2)})]})})]})]})},se=({targetImage:n,onResult:i})=>{const[h,M]=k.useState("luminance"),[v,P]=k.useState(32),[z,D]=k.useState(!1),[u,d]=k.useState(null),y=k.useCallback(async()=>{D(!0),d(null);try{const o=new Image;await new Promise((t,f)=>{o.onload=()=>t(),o.onerror=()=>f(new Error("Failed to load image")),o.src=n});const g=o.naturalWidth,x=o.naturalHeight,I=document.createElement("canvas");I.width=g,I.height=x;const j=I.getContext("2d");j.drawImage(o,0,0);const c=j.getImageData(0,0,g,x).data,N=t=>h==="chromatic"?(c[t]-c[t+1])*.5+128:.299*c[t]+.587*c[t+1]+.114*c[t+2],S=Math.floor(g/v),p=Math.floor(x/v),L=[];for(let t=0;t<p;t++)for(let f=0;f<S;f++){const l=[];for(let W=0;W<v;W++)for(let O=0;O<v;O++){const F=f*v+O,Y=t*v+W,q=(Y*g+F)*4,B=N(q);let C=0,E=0;for(const[H,$]of[[-1,0],[1,0],[0,-1],[0,1]]){const X=F+H,_=Y+$;X>=0&&X<g&&_>=0&&_<x&&(C+=N((_*g+X)*4),E++)}const U=B-C/E;l.push(U)}const T=l.reduce((W,O)=>W+O,0)/l.length,R=l.reduce((W,O)=>W+(O-T)**2,0)/l.length;L.push(R)}const w=L.reduce((t,f)=>t+f,0)/L.length,A=Math.sqrt(L.reduce((t,f)=>t+(f-w)**2,0)/L.length),b=Math.max(0,100-A/w*100),a=document.createElement("canvas");a.width=g,a.height=x;const m=a.getContext("2d");m.globalAlpha=.3,m.drawImage(o,0,0),m.globalAlpha=1;const s=Math.max(...L);for(let t=0;t<p;t++)for(let f=0;f<S;f++){const l=L[t*S+f],T=s>0?l/s:0,R=Math.floor(255*(1-T)),W=Math.floor(255*T);m.fillStyle=`rgba(${R}, ${W}, 60, 0.5)`,m.fillRect(f*v,t*v,v,v),m.strokeStyle="rgba(255,255,255,0.1)",m.strokeRect(f*v,t*v,v,v)}i&&i(a),d({mean:w,std:A,uniformity:b})}catch(o){console.error("[Noise] Analysis failed:",o)}finally{D(!1)}},[n,h,v,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Noise Type"}),e.jsx(K,{value:h,onChange:o=>M(o),options:[{label:"Luminance",value:"luminance"},{label:"Chromatic",value:"chromatic"},{label:"Both",value:"both"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Block Size: ",v,"px"]}),e.jsx(V,{min:8,max:64,step:8,value:v,onChange:o=>P(Number(o.target.value))})]}),e.jsx(G,{label:"Analyse Noise",onClick:y,isAnalysing:z}),u&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Mean Variance"}),e.jsx("div",{className:"tool-stat-value",children:u.mean.toFixed(2)})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Std Deviation"}),e.jsx("div",{className:"tool-stat-value",children:u.std.toFixed(2)})]})]}),e.jsxs("div",{className:`tool-verdict ${u.uniformity>70?"tool-verdict-danger":u.uniformity>40?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[u.uniformity>70?"⚠️":u.uniformity>40?"🤔":"✅"," ","Uniformity: ",u.uniformity.toFixed(1),"% — ",u.uniformity>70?"Uniform noise (AI suspect)":u.uniformity>40?"Moderate uniformity":"Natural variance (Real)"]})]})]})},re=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(5),[v,P]=k.useState(32),[z,D]=k.useState(!1),[u,d]=k.useState(null),y=(x,I,j,r,c)=>{let N=0;const S=Math.max(1,Math.floor(c/8));for(let p=0;p<c;p+=S)for(let L=0;L<c;L+=S){const w=((r+p)*I+(j+L))*4,A=x[w]*.299+x[w+1]*.587+x[w+2]*.114;N=(N<<5)-N+Math.floor(A/(12-h))|0}return N},o=(x,I,j,r,c,N,S)=>{let p=0,L=0;const w=Math.max(1,Math.floor(S/16));for(let A=0;A<S;A+=w)for(let b=0;b<S;b+=w){const a=((r+A)*I+(j+b))*4,m=((N+A)*I+(c+b))*4;p+=Math.abs(x[a]-x[m]),p+=Math.abs(x[a+1]-x[m+1]),p+=Math.abs(x[a+2]-x[m+2]),L++}return 1-p/(L*3*255)},g=k.useCallback(async()=>{D(!0),d(null);try{const x=new Image;await new Promise((t,f)=>{x.onload=()=>t(),x.onerror=()=>f(new Error("Failed to load")),x.src=n});const I=x.naturalWidth,j=x.naturalHeight,r=document.createElement("canvas");r.width=I,r.height=j;const c=r.getContext("2d");c.drawImage(x,0,0);const N=c.getImageData(0,0,I,j),S=Math.max(v/2,8),p=new Map;for(let t=0;t+v<=j;t+=S)for(let f=0;f+v<=I;f+=S){const l=y(N.data,I,f,t,v);p.has(l)||p.set(l,[]),p.get(l).push({x:f,y:t})}const L=[],w=v*2,A=.85+(h-5)*.01;for(const[,t]of p)if(!(t.length<2||t.length>50))for(let f=0;f<t.length&&f<10;f++)for(let l=f+1;l<t.length&&l<10;l++){if(Math.sqrt((t[f].x-t[l].x)**2+(t[f].y-t[l].y)**2)<w)continue;const R=o(N.data,I,t[f].x,t[f].y,t[l].x,t[l].y,v);R>=A&&L.push({ax:t[f].x,ay:t[f].y,bx:t[l].x,by:t[l].y,sim:R})}const b=document.createElement("canvas");b.width=I,b.height=j;const a=b.getContext("2d");a.drawImage(x,0,0);const m=["#f43f5e","#8b5cf6","#06b6d4","#f59e0b","#10b981","#ec4899","#3b82f6"],s=L.slice(0,30);s.forEach((t,f)=>{const l=m[f%m.length];a.strokeStyle=l,a.lineWidth=2,a.globalAlpha=.7,a.strokeRect(t.ax,t.ay,v,v),a.strokeRect(t.bx,t.by,v,v),a.fillStyle=l,a.globalAlpha=.15,a.fillRect(t.ax,t.ay,v,v),a.fillRect(t.bx,t.by,v,v),a.globalAlpha=.4,a.setLineDash([4,4]),a.beginPath(),a.moveTo(t.ax+v/2,t.ay+v/2),a.lineTo(t.bx+v/2,t.by+v/2),a.stroke(),a.setLineDash([]),a.globalAlpha=1}),i&&i(b),d(s.length)}catch(x){console.error("[Clone] Detection failed:",x)}finally{D(!1)}},[n,h,v,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",h]}),e.jsx(V,{min:1,max:10,value:h,onChange:x=>M(Number(x.target.value))})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Min Region Size: ",v,"px"]}),e.jsx(V,{min:8,max:128,step:8,value:v,onChange:x=>P(Number(x.target.value))})]}),e.jsx(G,{label:"Detect Clones",onClick:g,isAnalysing:z}),u!==null&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:`tool-verdict ${u>5?"tool-verdict-danger":u>0?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:[u>0?"🎯":"✅"," Found ",u," clone ",u===1?"pair":"pairs"]})]})]})},ie=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(1),[v,P]=k.useState(!1),[z,D]=k.useState(null),u=(y,o)=>{const g=y.length;if(g<=1)return[y,o];const x=g/2,I=new Float64Array(x),j=new Float64Array(x),r=new Float64Array(x),c=new Float64Array(x);for(let b=0;b<x;b++)I[b]=y[2*b],j[b]=o[2*b],r[b]=y[2*b+1],c[b]=o[2*b+1];const[N,S]=u(I,j),[p,L]=u(r,c),w=new Float64Array(g),A=new Float64Array(g);for(let b=0;b<x;b++){const a=-2*Math.PI*b/g,m=Math.cos(a),s=Math.sin(a),t=m*p[b]-s*L[b],f=m*L[b]+s*p[b];w[b]=N[b]+t,A[b]=S[b]+f,w[b+x]=N[b]-t,A[b+x]=S[b]-f}return[w,A]},d=k.useCallback(async()=>{P(!0),D(null);try{const y=new Image;await new Promise((l,T)=>{y.onload=()=>l(),y.onerror=()=>T(new Error("Failed to load image")),y.src=n});const o=512,g=document.createElement("canvas");g.width=o,g.height=o;const x=g.getContext("2d");x.drawImage(y,0,0,o,o);const j=x.getImageData(0,0,o,o).data,r=new Float64Array(o*o);for(let l=0;l<o*o;l++)r[l]=(j[l*4]*.299+j[l*4+1]*.587+j[l*4+2]*.114)/255;const c=new Float64Array(r),N=new Float64Array(o*o);for(let l=0;l<o;l++){const T=new Float64Array(o),R=new Float64Array(o);for(let F=0;F<o;F++)T[F]=c[l*o+F],R[F]=N[l*o+F];const[W,O]=u(T,R);for(let F=0;F<o;F++)c[l*o+F]=W[F],N[l*o+F]=O[F]}for(let l=0;l<o;l++){const T=new Float64Array(o),R=new Float64Array(o);for(let F=0;F<o;F++)T[F]=c[F*o+l],R[F]=N[F*o+l];const[W,O]=u(T,R);for(let F=0;F<o;F++)c[F*o+l]=W[F],N[F*o+l]=O[F]}const S=new Float64Array(o*o),p=o/2;let L=0;for(let l=0;l<o;l++)for(let T=0;T<o;T++){const R=c[l*o+T],W=N[l*o+T];let O=Math.sqrt(R*R+W*W);O=Math.log(1+O)*h;const F=(l+p)%o,Y=(T+p)%o,q=F*o+Y;S[q]=O,O>L&&(L=O)}const w=S[p*o+p],b=S[0]/L*100,a=w/L*100;let m=0;for(let l=1;l<4;l++){const T=p+l*(o/8);T<o&&S[p*o+T]>S[p*o+T-1]*1.5&&m++}const s=document.createElement("canvas");s.width=o,s.height=o;const t=s.getContext("2d"),f=t.createImageData(o,o);for(let l=0;l<o*o;l++){const T=L>0?S[l]/L*255:0,R=l*4;f.data[R]=Math.min(255,T*.8),f.data[R+1]=Math.min(255,T*.9),f.data[R+2]=Math.min(255,T),f.data[R+3]=255}t.putImageData(f,0,0),t.strokeStyle="rgba(56, 189, 248, 0.2)",t.lineWidth=1;for(let l=30;l<p;l+=30)t.beginPath(),t.arc(p,p,l,0,Math.PI*2),t.stroke();i&&i(s),D({highFreq:b,lowFreq:a,gridArtifacts:m>3})}catch(y){console.error("[FFT] Analysis failed:",y)}finally{P(!1)}},[n,h,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Log Scale Factor: ",h]}),e.jsx(V,{min:1,max:10,step:.1,value:h,onChange:y=>M(Number(y.target.value))})]}),e.jsx(G,{label:"Generate Spectrum",onClick:d,isAnalysing:v}),z&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"High Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[z.highFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Low Freq Content"}),e.jsxs("div",{className:"tool-stat-value",children:[z.lowFreq.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("div",{className:"tool-stat-label",children:"Grid Artifacts"}),e.jsx("div",{className:"tool-stat-value",style:{color:z.gridArtifacts?"#ef4444":"#10b981"},children:z.gridArtifacts?"Detected":"None"})]})]})]})]})},le=({targetImage:n,onResult:i})=>{const[h,M]=k.useState("sobel"),[v,P]=k.useState(100),[z,D]=k.useState(!1),[u,d]=k.useState(null),[y,o]=k.useState(0),g=k.useRef(null),x=k.useRef(null),I=k.useCallback(async()=>{D(!0),d(null);try{const j=new Image;await new Promise((C,E)=>{j.onload=()=>C(),j.onerror=()=>E(new Error("Failed to load")),j.src=n});const r=j.naturalWidth,c=j.naturalHeight,N=document.createElement("canvas");N.width=r,N.height=c;const S=N.getContext("2d");S.drawImage(j,0,0);const L=S.getImageData(0,0,r,c).data,w=new Float64Array(r*c);for(let C=0;C<r*c;C++){const E=C*4;w[C]=.299*L[E]+.587*L[E+1]+.114*L[E+2]}const A=new Float64Array(r*c),b=new Uint8Array(r*c);if(h==="sobel"||h==="canny")for(let C=1;C<c-1;C++)for(let E=1;E<r-1;E++){const U=-w[(C-1)*r+(E-1)]+w[(C-1)*r+(E+1)]-2*w[C*r+(E-1)]+2*w[C*r+(E+1)]-w[(C+1)*r+(E-1)]+w[(C+1)*r+(E+1)],H=-w[(C-1)*r+(E-1)]-2*w[(C-1)*r+E]-w[(C-1)*r+(E+1)]+w[(C+1)*r+(E-1)]+2*w[(C+1)*r+E]+w[(C+1)*r+(E+1)],$=Math.sqrt(U*U+H*H);A[C*r+E]=$,b[C*r+E]=$>v?255:0}else for(let C=1;C<c-1;C++)for(let E=1;E<r-1;E++){const U=-4*w[C*r+E]+w[(C-1)*r+E]+w[(C+1)*r+E]+w[C*r+(E-1)]+w[C*r+(E+1)],H=Math.abs(U);A[C*r+E]=H,b[C*r+E]=H>v/2?255:0}let a=0,m=0;const s=32,t=[];for(let C=0;C<r*c;C++)b[C]>0&&a++,m+=A[C];for(let C=0;C<Math.floor(c/s);C++)for(let E=0;E<Math.floor(r/s);E++){let U=0;for(let H=0;H<s;H++)for(let $=0;$<s;$++)U+=A[(C*s+H)*r+(E*s+$)];t.push(U/(s*s))}const f=t.reduce((C,E)=>C+E,0)/t.length,l=Math.sqrt(t.reduce((C,E)=>C+(E-f)**2,0)/t.length),T=f>0?Math.max(0,100-l/f*50):0;d({edgeDensity:a/(r*c)*1e4,avgStrength:m/(r*c),uniformity:T});const R=document.createElement("canvas");R.width=r,R.height=c;const W=R.getContext("2d"),O=W.createImageData(r,c);for(let C=0;C<r*c;C++){const E=C*4;O.data[E]=O.data[E+1]=O.data[E+2]=b[C],O.data[E+3]=255}W.putImageData(O,0,0);const F=document.createElement("canvas");F.width=r,F.height=c;const Y=F.getContext("2d"),q=Y.createImageData(r,c),B=Math.max(...A);for(let C=0;C<r*c;C++){const E=C*4,U=B>0?A[C]/B:0;U<.25?(q.data[E]=0,q.data[E+1]=Math.floor(U*4*255),q.data[E+2]=255):U<.5?(q.data[E]=0,q.data[E+1]=255,q.data[E+2]=Math.floor((1-(U-.25)*4)*255)):U<.75?(q.data[E]=Math.floor((U-.5)*4*255),q.data[E+1]=255,q.data[E+2]=0):(q.data[E]=255,q.data[E+1]=Math.floor((1-(U-.75)*4)*255),q.data[E+2]=0),q.data[E+3]=255}Y.putImageData(q,0,0),g.current=R,x.current=F,d({edgeDensity:a/(r*c)*1e4,avgStrength:m/(r*c),uniformity:T})}catch(j){console.error("[Gradient] Analysis failed:",j)}finally{D(!1)}},[n,h,v]);return Q.useEffect(()=>{u&&i&&(y===0&&g.current?i(g.current):y===1&&x.current&&i(x.current))},[u,y,i]),e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Edge Detector"}),e.jsx(K,{value:h,onChange:j=>M(j),options:[{label:"Sobel",value:"sobel"},{label:"Canny",value:"canny"},{label:"Laplacian",value:"laplacian"}]})]}),e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Threshold: ",v]}),e.jsx(V,{min:20,max:300,value:v,onChange:j=>P(Number(j.target.value))})]}),e.jsx(G,{label:"Analyse Gradients",onClick:I,isAnalysing:z}),u&&e.jsxs("div",{className:"tool-output-area",children:[e.jsxs("div",{className:"tool-tabs",children:[e.jsx("button",{className:`tool-tab ${y===0?"tool-tab-active":""}`,onClick:()=>o(0),children:"Edge Map"}),e.jsx("button",{className:`tool-tab ${y===1?"tool-tab-active":""}`,onClick:()=>o(1),children:"Gradient Magnitude"})]}),e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edge Density"}),e.jsxs("p",{className:"tool-stat-value",children:[u.edgeDensity.toFixed(0),"/10k px"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Avg Strength"}),e.jsx("p",{className:"tool-stat-value",children:u.avgStrength.toFixed(1)})]})]}),e.jsxs("div",{className:`tool-verdict ${u.uniformity>70?"tool-verdict-danger":"tool-verdict-safe"}`,children:[u.uniformity>70?"⚠️ Unnaturally smooth gradients":"✅ Natural edge variation"," ","(Uniformity: ",u.uniformity.toFixed(1),"%)"]})]})]})},ce=({targetImage:n,onResult:i})=>{const[h,M]=k.useState("medium"),[v,P]=k.useState(!1),[z,D]=k.useState(0),[u,d]=k.useState(null),y=k.useCallback(async()=>{P(!0),d(null),D(0);try{const o=new Image;await new Promise((B,C)=>{o.onload=()=>B(),o.onerror=()=>C(new Error("Failed to load")),o.src=n}),D(20);const g=o.naturalWidth,x=o.naturalHeight,I=document.createElement("canvas");I.width=g,I.height=x;const j=I.getContext("2d");j.drawImage(o,0,0);const c=j.getImageData(0,0,g,x).data,N=new Float64Array(g*x);for(let B=0;B<g*x;B++)N[B]=.299*c[B*4]+.587*c[B*4+1]+.114*c[B*4+2];D(40);const p=Math.floor((h==="low"?3:h==="medium"?5:7)/2),L=new Float64Array(g*x);for(let B=0;B<x;B++)for(let C=0;C<g;C++){let E=0,U=0;for(let H=-p;H<=p;H++)for(let $=-p;$<=p;$++){const X=B+H,_=C+$;X>=0&&X<x&&_>=0&&_<g&&(E+=N[X*g+_],U++)}L[B*g+C]=E/U}D(70);const w=new Float64Array(g*x);for(let B=0;B<g*x;B++)w[B]=N[B]-L[B];const A=32,b=Math.floor(g/A),a=Math.floor(x/A),m=[];for(let B=0;B<a;B++)for(let C=0;C<b;C++){const E=[];for(let $=0;$<A;$++)for(let X=0;X<A;X++)E.push(w[(B*A+$)*g+(C*A+X)]);const U=E.reduce(($,X)=>$+X,0)/E.length,H=E.reduce(($,X)=>$+(X-U)**2,0)/E.length;m.push(H)}const s=m.reduce((B,C)=>B+C,0)/m.length,t=Math.sqrt(m.reduce((B,C)=>B+(C-s)**2,0)/m.length),f=s>0?Math.min(100,t/s*100):0,l=100-f,T=f>30;d({hasFingerprint:T,consistency:f,uniformity:l}),D(90);const R=document.createElement("canvas");R.width=g,R.height=x;const W=R.getContext("2d"),O=W.createImageData(g,x);let F=1/0,Y=-1/0;for(let B=0;B<w.length;B++)w[B]<F&&(F=w[B]),w[B]>Y&&(Y=w[B]);const q=Y-F||1;for(let B=0;B<g*x;B++){const C=(w[B]-F)/q*255,E=B*4,U=Math.min(255,C*3);O.data[E]=U,O.data[E+1]=U,O.data[E+2]=U,O.data[E+3]=255}W.putImageData(O,0,0),i&&i(R),D(100),d({hasFingerprint:T,consistency:f,uniformity:l})}catch(o){console.error("[PRNU] Analysis failed:",o)}finally{P(!1)}},[n,h,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsx("label",{className:"tool-control-label",children:"Filter Level"}),e.jsx(K,{value:h,onChange:o=>M(o),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}]})]}),e.jsx("p",{style:{fontSize:"11px",color:"#94a3b8",margin:"8px 0"},children:"⏱ Analysis may take a few seconds"}),e.jsx(G,{label:"Extract PRNU",onClick:y,isAnalysing:v}),v&&e.jsx("div",{className:"tool-progress-bar",style:{marginTop:8},children:e.jsx("div",{className:"tool-progress-fill",style:{width:`${z}%`}})}),u&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Pattern Consistency"}),e.jsxs("p",{className:"tool-stat-value",children:[u.consistency.toFixed(1),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Noise Uniformity"}),e.jsxs("p",{className:"tool-stat-value",children:[u.uniformity.toFixed(1),"%"]})]})]}),e.jsx("div",{className:`tool-verdict ${u.hasFingerprint?"tool-verdict-safe":"tool-verdict-danger"}`,children:u.hasFingerprint?"✅ Sensor fingerprint detected — Authentic camera photo":"❌ No sensor pattern found — Synthetic/AI-generated"})]})]})},de=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(6),[v,P]=k.useState(!1),[z,D]=k.useState(null),u=k.useCallback(async()=>{P(!0),D(null);try{const d=new Image;await new Promise((b,a)=>{d.onload=()=>b(),d.onerror=()=>a(new Error("Failed to load")),d.src=n});const y=d.naturalWidth,o=d.naturalHeight,g=document.createElement("canvas");g.width=y,g.height=o;const x=g.getContext("2d");x.drawImage(d,0,0);const j=x.getImageData(0,0,y,o).data,r=200+(10-h)*5,c=[],N=16;for(let b=0;b<Math.floor(o/N);b++)for(let a=0;a<Math.floor(y/N);a++){let m=0,s=0,t=0;for(let f=0;f<N;f++)for(let l=0;l<N;l++){const T=a*N+l,R=b*N+f,W=(R*y+T)*4,O=Math.max(j[W],j[W+1],j[W+2]);O>m&&(m=O,s=T,t=R)}m>r&&c.push({x:s,y:t,intensity:m})}const S=[];for(const b of c){let a=0,m=0;const s=10;for(let f=-s;f<=s;f++)for(let l=-s;l<=s;l++){const T=b.x+l,R=b.y+f;if(T<0||T>=y||R<0||R>=o)continue;const W=(R*y+T)*4,O=.299*j[W]+.587*j[W+1]+.114*j[W+2];a+=l*O,m+=f*O}const t=Math.atan2(m,a);S.push(t)}let p=0,L=0;if(S.length>1){const b=S.reduce((a,m)=>a+m,0)/S.length;for(const a of S){const m=Math.abs(a-b);m<Math.PI/4||m>Math.PI*7/4?p++:L++}}D({highlights:c.length,consistent:p,inconsistent:L});const w=document.createElement("canvas");w.width=y,w.height=o;const A=w.getContext("2d");A.drawImage(d,0,0),c.forEach((b,a)=>{const m=a<S.length&&(()=>{const s=S.reduce((f,l)=>f+l,0)/S.length,t=Math.abs(S[a]-s);return t<Math.PI/4||t>Math.PI*7/4})();if(A.beginPath(),A.arc(b.x,b.y,12,0,Math.PI*2),A.strokeStyle=m?"#fbbf24":"#ef4444",A.lineWidth=2,A.stroke(),a<S.length){const s=S[a],t=25;A.beginPath(),A.moveTo(b.x,b.y),A.lineTo(b.x+Math.cos(s)*t,b.y+Math.sin(s)*t),A.strokeStyle=m?"rgba(251, 191, 36, 0.7)":"rgba(239, 68, 68, 0.7)",A.lineWidth=2,A.stroke()}}),i&&i(w),D({highlights:c.length,consistent:p,inconsistent:L})}catch(d){console.error("[Highlight] Analysis failed:",d)}finally{P(!1)}},[n,h,i]);return e.jsxs("div",{children:[e.jsxs("div",{className:"tool-control-group",children:[e.jsxs("label",{className:"tool-control-label",children:["Sensitivity: ",h]}),e.jsx(V,{min:1,max:10,value:h,onChange:d=>M(Number(d.target.value))})]}),e.jsx(G,{label:"Detect Highlights",onClick:u,isAnalysing:v}),z&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Highlights Found"}),e.jsx("p",{className:"tool-stat-value",children:z.highlights})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Consistent / Inconsistent"}),e.jsxs("p",{className:"tool-stat-value",children:[z.consistent," / ",z.inconsistent]})]})]}),e.jsx("div",{className:`tool-verdict ${z.inconsistent>z.consistent?"tool-verdict-danger":"tool-verdict-safe"}`,children:z.inconsistent>z.consistent?"⚠️ Lighting inconsistencies detected":"✅ Physically plausible lighting"})]})]})},he=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(!1),[v,P]=k.useState(null),z=k.useCallback(async()=>{M(!0),P(null);try{const D=new Image;await new Promise((a,m)=>{D.onload=()=>a(),D.onerror=()=>m(new Error("Failed to load")),D.src=n});const u=D.naturalWidth,d=D.naturalHeight,y=document.createElement("canvas");y.width=u,y.height=d;const o=y.getContext("2d");o.drawImage(D,0,0);const x=o.getImageData(0,0,u,d).data,I=new Float64Array(u*d),j=new Float64Array(u*d),r=new Float64Array(u*d);for(let a=0;a<u*d;a++)I[a]=x[a*4],j[a]=x[a*4+1],r[a]=x[a*4+2];const c=[];for(let a=2;a<d-2;a+=4)for(let m=2;m<u-2;m+=4){const s=R=>.299*I[R]+.587*j[R]+.114*r[R],t=a*u+m,f=-s(t-u-1)+s(t-u+1)-2*s(t-1)+2*s(t+1)-s(t+u-1)+s(t+u+1),l=-s(t-u-1)-2*s(t-u)-s(t-u+1)+s(t+u-1)+2*s(t+u)+s(t+u+1),T=Math.sqrt(f*f+l*l);T>100&&c.push({x:m,y:a,strength:T})}let N=0;const S=[];for(const a of c.slice(0,200)){const m=Y=>{const q=a.y*u+a.x,B=-Y[q-u-1]+Y[q-u+1]-2*Y[q-1]+2*Y[q+1]-Y[q+u-1]+Y[q+u+1],C=-Y[q-u-1]-2*Y[q-u]-Y[q-u+1]+Y[q+u-1]+2*Y[q+u]+Y[q+u+1];return{gx:B,gy:C,mag:Math.sqrt(B*B+C*C)}},s=m(I),t=m(j),f=m(r),l=Math.atan2(s.gy,s.gx),T=Math.atan2(t.gy,t.gx),R=Math.atan2(f.gy,f.gx),W=Math.abs(l-T),O=Math.abs(R-T),F=(W+O)/2;N+=F,S.push({x:a.x,y:a.y,sep:F})}const p=c.length>0?N/Math.min(c.length,200):0,L=p>.05,w=document.createElement("canvas");w.width=u,w.height=d;const A=w.getContext("2d"),b=A.createImageData(u,d);for(let a=0;a<u*d;a++){const m=a*4;b.data[m]=Math.min(255,Math.abs(I[a]-j[a])*5),b.data[m+1]=Math.min(255,Math.abs(j[a]-r[a])*5),b.data[m+2]=Math.min(255,Math.abs(r[a]-I[a])*5),b.data[m+3]=255}A.putImageData(b,0,0);for(const a of S)A.beginPath(),A.arc(a.x,a.y,3,0,Math.PI*2),A.fillStyle=a.sep>.05?"rgba(16, 185, 129, 0.8)":"rgba(239, 68, 68, 0.5)",A.fill();i&&i(w),P({avgSeparation:p*100,detected:L,edgesAnalysed:Math.min(c.length,200)})}catch(D){console.error("[Aberration] Analysis failed:",D)}finally{M(!1)}},[n,i]);return e.jsxs("div",{children:[e.jsx(G,{label:"Check for Aberration",onClick:z,isAnalysing:h}),v&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Channel Separation"}),e.jsxs("p",{className:"tool-stat-value",children:[v.avgSeparation.toFixed(2),"°"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Edges Analysed"}),e.jsx("p",{className:"tool-stat-value",children:v.edgesAnalysed})]})]}),e.jsx("div",{className:`tool-verdict ${v.detected?"tool-verdict-safe":"tool-verdict-suspicious"}`,children:v.detected?"✅ Natural lens fringing detected — likely real photo":"⚠️ No chromatic aberration — possibly synthetic"})]})]})},ge=({targetImage:n,onResult:i})=>{const[h,M]=k.useState(!0),[v,P]=k.useState(!1),[z,D]=k.useState(null),u=k.useCallback(async()=>{P(!0),D(null);try{const d=new Image;await new Promise((s,t)=>{d.onload=()=>s(),d.onerror=()=>t(new Error("Failed to load")),d.src=n});const y=d.naturalWidth,o=d.naturalHeight,g=document.createElement("canvas");g.width=y,g.height=o;const x=g.getContext("2d");x.drawImage(d,0,0);const I=x.getImageData(0,0,y,o).data,j=8,r=Math.floor(y/j),c=Math.floor(o/j),N=[];for(let s=0;s<c;s++)for(let t=0;t<r;t++){let f=0,l=0;if(t<r-1)for(let T=0;T<j;T++){const W=((s*j+T)*y+(t+1)*j-1)*4,O=W+4;f+=Math.abs(I[W]-I[O])+Math.abs(I[W+1]-I[O+1])+Math.abs(I[W+2]-I[O+2]),l++}if(s<c-1)for(let T=0;T<j;T++){const R=t*j+T,W=(s+1)*j-1,O=W+1,F=(W*y+R)*4,Y=(O*y+R)*4;f+=Math.abs(I[F]-I[Y])+Math.abs(I[F+1]-I[Y+1])+Math.abs(I[F+2]-I[Y+2]),l++}N.push(l>0?f/(l*3):0)}const S=N.reduce((s,t)=>s+t,0)/N.length,p=Math.sqrt(N.reduce((s,t)=>s+(t-S)**2,0)/N.length);let L=0;for(const s of N)Math.abs(s-S)>p*2&&L++;const w=Math.max(10,Math.min(100,100-S*2)),A=L>r*c*.1?2:1,b=document.createElement("canvas");b.width=y,b.height=o;const a=b.getContext("2d");a.drawImage(d,0,0);const m=Math.max(...N);for(let s=0;s<c;s++)for(let t=0;t<r;t++){const f=m>0?N[s*r+t]/m:0,l=f<.33?0:f<.66?200:220,T=f<.33||f<.66?180:50;a.fillStyle=`rgba(${l},${T},0,0.3)`,a.fillRect(t*j,s*j,j,j),h&&(a.strokeStyle="rgba(255,255,255,0.08)",a.lineWidth=.5,a.strokeRect(t*j,s*j,j,j))}i&&i(b),D({quality:w,layers:A,inconsistent:L})}catch(d){console.error("[Compression]",d)}finally{P(!1)}},[n,h,i]);return e.jsxs("div",{children:[e.jsx("div",{className:"tool-control-group",children:e.jsxs("label",{style:{display:"flex",alignItems:"center",gap:"8px",cursor:"pointer",fontSize:"12px",color:"#cbd5e1"},children:[e.jsx("input",{type:"checkbox",checked:h,onChange:d=>M(d.target.checked)})," Show 8×8 DCT block grid"]})}),e.jsx(G,{label:"Analyse Compression",onClick:u,isAnalysing:v}),z&&e.jsxs("div",{className:"tool-output-area",children:[e.jsx("div",{className:"tool-stat-label",style:{textAlign:"center",marginBottom:0},children:"Result shown in main view"}),e.jsxs("div",{className:"tool-stats",children:[e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Est. Quality"}),e.jsxs("p",{className:"tool-stat-value",children:[z.quality.toFixed(0),"%"]})]}),e.jsxs("div",{className:"tool-stat",children:[e.jsx("p",{className:"tool-stat-label",children:"Layers"}),e.jsx("p",{className:"tool-stat-value",children:z.layers})]})]}),e.jsx("div",{className:`tool-verdict ${z.layers>1?"tool-verdict-suspicious":"tool-verdict-safe"}`,children:z.layers>1?`⚠️ Multiple re-compressions (${z.inconsistent} inconsistent blocks)`:"✅ Single compression — consistent"})]})]})},xe=({targetImage:n})=>{const[i,h]=k.useState(!1),[M,v]=k.useState(null),P=k.useCallback(async()=>{var u;h(!0),v(null);try{const d=new Image;await new Promise((l,T)=>{d.onload=()=>l(),d.onerror=()=>T(),d.src=n});const y=n,o=y.startsWith("data:"),g=y.startsWith("blob:"),x=!o&&!g?new URL(y):null,I=x?x.pathname.split("/").pop()||"unknown":"embedded",j=((u=I.split(".").pop())==null?void 0:u.toLowerCase())||"unknown";let r="",c="",N="";try{const l=await fetch(n,{method:"HEAD",mode:"cors"});r=l.headers.get("content-type")||"",c=l.headers.get("content-length")||"",N=l.headers.get("last-modified")||""}catch{}const S=["dall-e","midjourney","stable-diffusion","ai-generated","generated","openai","stability","replicate","huggingface","diffusion","comfyui","automatic1111"],p=y.toLowerCase(),L=S.some(l=>p.includes(l)),A=x?["oaidalleapiprodscus.blob.core.windows.net","replicate.delivery","cdn.midjourney.com","images.unsplash.com"].some(l=>x.hostname.includes(l)):!1,b={Source:o?"Data URL (embedded)":g?"Blob URL (local)":(x==null?void 0:x.hostname)||"Unknown",Filename:I,Format:r||j.toUpperCase(),Dimensions:`${d.naturalWidth} × ${d.naturalHeight}`},a={"Aspect Ratio":(d.naturalWidth/d.naturalHeight).toFixed(2),"Total Pixels":`${(d.naturalWidth*d.naturalHeight/1e6).toFixed(1)} MP`};c&&(a["File Size"]=`${(parseInt(c)/1024).toFixed(1)} KB`);const m={};N&&(m["Last Modified"]=N);const s={};L&&(s["AI Indicator"]="⚠️ AI-related keywords found in URL"),A&&(s.Hosting="⚠️ Known AI image hosting platform");let t="authentic",f="✅ No suspicious metadata detected";L||A?(t="ai",f="❌ AI generation indicators detected in metadata"):(o||g)&&(t="suspicious",f="⚠️ Embedded/local image — limited metadata available"),v({camera:b,settings:a,dates:m,software:s,verdict:t,verdictText:f})}catch(d){console.error("[Metadata]",d)}finally{h(!1)}},[n]),z=()=>{if(!M)return;const u=JSON.stringify({...M.camera,...M.settings,...M.dates,...M.software},null,2);navigator.clipboard.writeText(u)},D=(u,d,y)=>Object.keys(y).length===0?null:e.jsxs("div",{className:"metadata-section",children:[e.jsxs("div",{className:"metadata-section-header",children:[e.jsx("span",{children:d}),e.jsx("h4",{children:u})]}),Object.entries(y).map(([o,g])=>e.jsxs("div",{className:"metadata-row",children:[e.jsx("span",{className:"metadata-key",children:o}),e.jsx("span",{className:`metadata-value ${g.includes("Not found")?"metadata-missing":""}`,children:g})]},o))]});return e.jsxs("div",{children:[e.jsx(G,{label:"Extract Metadata",onClick:P,isAnalysing:i}),M&&e.jsxs("div",{className:"tool-output-area",children:[D("Image Information","📷",M.camera),D("Properties","⚙️",M.settings),D("Dates","📅",M.dates),D("Software & AI Detection","🖥️",M.software),e.jsx("div",{className:`tool-verdict ${M.verdict==="authentic"?"tool-verdict-safe":M.verdict==="suspicious"?"tool-verdict-suspicious":"tool-verdict-danger"}`,children:M.verdictText}),e.jsx("button",{className:"tool-export-btn",onClick:z,style:{marginTop:8},children:"📋 Copy to Clipboard"})]})]})};async function pe(n){return n.startsWith("data:")||n.startsWith("blob:")?n:new Promise((i,h)=>{chrome.runtime.sendMessage({type:"FETCH_IMAGE_AS_DATA_URL",url:n},M=>{if(chrome.runtime.lastError){h(new Error(chrome.runtime.lastError.message));return}M!=null&&M.success&&M.dataUrl?i(M.dataUrl):h(new Error((M==null?void 0:M.error)||"Failed to fetch image via background"))})})}const ue=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M12 2L2 7l10 5 10-5-10-5z"}),e.jsx("path",{d:"M2 17l10 5 10-5"}),e.jsx("path",{d:"M2 12l10 5 10-5"})]}),me=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M2 12h2l2-6 4 12 4-12 2 6h4"}),e.jsx("circle",{cx:"12",cy:"12",r:"1",fill:i,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"4",r:"1",fill:i,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"20",r:"1",fill:i,stroke:"none"}),e.jsx("circle",{cx:"20",cy:"4",r:"1",fill:i,stroke:"none"}),e.jsx("circle",{cx:"4",cy:"20",r:"1",fill:i,stroke:"none"})]}),be=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v8"}),e.jsx("path",{d:"M8 12h8"})]}),fe=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M2 10s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4"}),e.jsx("path",{d:"M2 14s2-4 5-4 5 4 5 4 2-4 5-4 5 4 5 4",style:{opacity:.5}}),e.jsx("rect",{x:"2",y:"6",width:"20",height:"12",rx:"2",strokeOpacity:"0.5"})]}),we=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M3 21L21 3"}),e.jsx("path",{d:"M3 15L9 21"}),e.jsx("path",{d:"M15 3L21 9"})]}),ve=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v18"}),e.jsx("path",{d:"M15 3v18"}),e.jsx("path",{d:"M3 9h18"}),e.jsx("path",{d:"M3 15h18"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",fill:i,stroke:"none"})]}),ye=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5 12 2z"}),e.jsx("circle",{cx:"12",cy:"12",r:"2",opacity:"0.5"})]}),je=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("circle",{cx:"9",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("circle",{cx:"15",cy:"12",r:"6",strokeOpacity:"0.8"}),e.jsx("path",{d:"M12 9a3 3 0 010 6 3 3 0 010-6z",fill:i,fillOpacity:"0.2",stroke:"none"})]}),ke=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2"}),e.jsx("path",{d:"M9 3v6h6v6h6"}),e.jsx("path",{d:"M3 15h6v6"}),e.jsx("rect",{x:"9",y:"9",width:"6",height:"6",strokeOpacity:"0.5"})]}),Ne=({size:n=20,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"}),e.jsx("polyline",{points:"14 2 14 8 20 8"}),e.jsx("line",{x1:"16",y1:"13",x2:"8",y2:"13"}),e.jsx("line",{x1:"16",y1:"17",x2:"8",y2:"17"}),e.jsx("line",{x1:"10",y1:"9",x2:"8",y2:"9"})]}),Ce=({size:n=24,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M4 8V6a2 2 0 0 1 2-2h2"}),e.jsx("path",{d:"M4 16v2a2 2 0 0 0 2 2h2"}),e.jsx("path",{d:"M16 4h2a2 2 0 0 1 2 2v2"}),e.jsx("path",{d:"M16 20h2a2 2 0 0 0 2-2v-2"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 8v-1",opacity:"0.5"}),e.jsx("path",{d:"M12 17v-1",opacity:"0.5"}),e.jsx("path",{d:"M8 12h1",opacity:"0.5"}),e.jsx("path",{d:"M15 12h1",opacity:"0.5"})]}),Me=({size:n=24,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1",strokeOpacity:"0.4"}),e.jsx("path",{d:"M7 17l1.5 1.5 2.5-2.5"})]}),Se=({size:n=24,color:i="currentColor",...h})=>e.jsxs("svg",{width:n,height:n,viewBox:"0 0 24 24",fill:"none",stroke:i,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...h,children:[e.jsx("path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}),e.jsx("polyline",{points:"7 10 12 15 17 10"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"3"})]}),Ae=[{icon:e.jsx(ue,{size:20}),title:"Error Level Analysis",desc:"Reveals compression inconsistencies",tier:1,Component:ne},{icon:e.jsx(me,{size:20}),title:"Noise Pattern Analysis",desc:"Examines sensor noise distribution",tier:1,Component:se},{icon:e.jsx(be,{size:20}),title:"Clone Detection",desc:"Identifies duplicated regions",tier:1,Component:re},{icon:e.jsx(fe,{size:20}),title:"Frequency Domain (FFT)",desc:"Reveals hidden patterns in frequency space",tier:1,Component:ie},{icon:e.jsx(we,{size:20}),title:"Luminance Gradient",desc:"Examines edge patterns and textures",tier:1,Component:le},{icon:e.jsx(ve,{size:20}),title:"PRNU Analysis",desc:"Detects camera sensor fingerprint",tier:1,Component:ce},{icon:e.jsx(ye,{size:20}),title:"Specular Highlights",desc:"Analyses reflections for consistency",tier:2,Component:de},{icon:e.jsx(je,{size:20}),title:"Chromatic Aberration",desc:"Detects lens color fringing",tier:2,Component:he},{icon:e.jsx(ke,{size:20}),title:"Compression Artifacts",desc:"Examines JPEG compression layers",tier:2,Component:ge},{icon:e.jsx(Ne,{size:20}),title:"Metadata & EXIF",desc:"Extracts hidden image data",tier:2,Component:xe}],Ee=({targetImage:n,onBack:i,onMaximize:h})=>{var r;const[M,v]=k.useState(null),[P,z]=k.useState(null),[D,u]=k.useState(50),[d,y]=k.useState("ltr"),o=k.useRef(null),[g,x]=k.useState(null);k.useEffect(()=>{let c=!1;return x(null),pe(n).then(N=>{c||x(N)}).catch(N=>{console.error("[ForensicToolsPanel] Failed to fetch image:",N),c||x(n)}),()=>{c=!0}},[n]);const I=k.useCallback((c,N)=>{v(c.toDataURL()),z(N)},[]),j=()=>{const c=M||g||n,N=document.createElement("a");N.href=c;let S="image";try{if(!n.startsWith("data:")&&!n.startsWith("blob:")){const A=new URL(n).pathname,b=A.substring(A.lastIndexOf("/")+1);b&&(S=b)}}catch(w){console.warn("Could not extract filename",w)}const p=S.lastIndexOf(".");p>0&&(S=S.substring(0,p)),S=S.replace(/[^a-zA-Z0-9-_]/g,"_");const L=P?P.replace(/\s+/g,"_").toLowerCase():"original";N.download=`undiffused_${S}_${L}.png`,document.body.appendChild(N),N.click(),document.body.removeChild(N)};return e.jsxs("div",{className:"forensic-panel animate-fade-in",children:[e.jsxs("div",{className:"forensic-header",children:[e.jsxs("button",{className:"forensic-back-btn",onClick:i,"aria-label":"Back to results",children:[e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15 18 9 12 15 6"})}),e.jsx("span",{children:"Back"})]}),e.jsxs("div",{className:"forensic-title",children:[e.jsx(Ce,{size:24,color:"#f1f5f9"}),e.jsx("h2",{children:"Image Analysis"})]}),e.jsxs("div",{style:{display:"flex",gap:"8px"},children:[e.jsx("button",{className:"forensic-close-btn",onClick:j,"aria-label":"Download Image",title:"Download Analysis Result",children:e.jsx(Se,{size:16,color:"currentColor"})}),e.jsx("button",{className:"forensic-close-btn",onClick:()=>h(M||n,P||"Image Fullscreen"),"aria-label":"Maximize",title:"Open in Fullscreen Viewer",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"15 3 21 3 21 9"}),e.jsx("polyline",{points:"9 21 3 21 3 15"}),e.jsx("line",{x1:"21",y1:"3",x2:"14",y2:"10"}),e.jsx("line",{x1:"3",y1:"21",x2:"10",y2:"14"})]})})]})]}),e.jsxs("div",{className:"comparison-container",ref:o,children:[e.jsx("img",{src:g||n,alt:"Original",className:"comparison-image"}),M&&e.jsx("div",{className:"comparison-overlay",style:{width:`${d==="ltr"?D:100-D}%`,left:d==="ltr"?0:"auto",right:d==="rtl"?0:"auto",borderRight:d==="ltr"?"2px solid #fff":"none",borderLeft:d==="rtl"?"2px solid #fff":"none"},children:e.jsx("img",{src:M,alt:"Analyzed",className:"comparison-image",style:{position:"absolute",top:0,left:d==="ltr"?0:"auto",right:d==="rtl"?0:"auto",width:((r=o.current)==null?void 0:r.offsetWidth)||"100%",height:"100%",maxWidth:"none",maxHeight:"none",objectFit:"contain"}})}),M&&e.jsx("div",{className:"comparison-slider-handle",style:{left:`${D}%`}})]}),M&&e.jsxs("div",{className:"comparison-actions",children:[e.jsx("button",{className:"undo-btn",onClick:()=>{v(null),z(null)},title:"Undo Analysis",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M3 12a9 9 0 1 0 9-9 9.75 3.88 0 0 0-7.74 2.74L3 12"}),e.jsx("path",{d:"M3 3v9h9"})]})}),e.jsx("input",{type:"range",className:"tool-slider",min:"0",max:"100",value:D,onChange:c=>u(Number(c.target.value)),style:{flex:1,margin:"0 12px"}}),e.jsx("button",{className:"flip-btn",onClick:()=>y(c=>c==="ltr"?"rtl":"ltr"),title:"Flip Direction",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M4 21v-7a4 4 0 0 1 4-4h12"}),e.jsx("path",{d:"M16 6l4 4-4 4"})]})})]}),!M&&e.jsxs("div",{className:"forensic-section-title",children:[e.jsx(Me,{size:20,color:"#94a3b8"}),e.jsx("h3",{children:"Select a tool to analyse"})]}),!g&&e.jsx("div",{style:{textAlign:"center",padding:"20px",color:"rgba(255,255,255,0.7)"},children:e.jsx("div",{className:"tool-loading",style:{display:"inline-block",padding:"8px 20px",borderRadius:"8px",background:"rgba(255,255,255,0.1)"},children:"Preparing image for analysis..."})}),g&&e.jsx("div",{className:"forensic-tools-grid",children:Ae.map((c,N)=>e.jsx(oe,{icon:c.icon,title:c.title,description:c.desc,tier:c.tier,index:N,children:e.jsx(c.Component,{targetImage:g,onResult:S=>I(S,c.title)})},c.title))})]})},Ie=({image:n,title:i,onClose:h})=>{const[M,v]=k.useState({x:(window.innerWidth-800)/2,y:(window.innerHeight-600)/2,width:800,height:600}),[P,z]=k.useState(!1),[D,u]=k.useState(!1),[d,y]=k.useState({scale:1,x:0,y:0}),[o,g]=k.useState(!1),x=k.useRef({x:0,y:0}),I=k.useRef({x:0,y:0,width:0,height:0}),j=k.useRef({x:0,y:0,imgX:0,imgY:0}),r=k.useRef(null),c=p=>{p.target===p.currentTarget&&(z(!0),x.current={x:p.clientX-M.x,y:p.clientY-M.y})},N=p=>{p.stopPropagation(),u(!0),I.current={x:p.clientX,y:p.clientY,width:M.width,height:M.height}},S=p=>{p.preventDefault(),g(!0),j.current={x:p.clientX,y:p.clientY,imgX:d.x,imgY:d.y}};return k.useEffect(()=>{const p=w=>{if(P&&v(A=>({...A,x:w.clientX-x.current.x,y:w.clientY-x.current.y})),D){const A=w.clientX-I.current.x,b=w.clientY-I.current.y;v(a=>({...a,width:Math.max(400,I.current.width+A),height:Math.max(300,I.current.height+b)}))}if(o){const A=w.clientX-j.current.x,b=w.clientY-j.current.y;y(a=>({...a,x:j.current.imgX+A,y:j.current.imgY+b}))}},L=()=>{z(!1),u(!1),g(!1)};return(P||D||o)&&(window.addEventListener("mousemove",p),window.addEventListener("mouseup",L)),()=>{window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",L)}},[P,D,o]),k.useEffect(()=>{const p=r.current;if(!p)return;const L=m=>{m.preventDefault(),m.stopPropagation();const s=p.getBoundingClientRect(),t=m.clientX-s.left-s.width/2,f=m.clientY-s.top-s.height/2,T=-m.deltaY*.001;y(R=>{const W=Math.min(Math.max(.1,R.scale+T*R.scale*5),10);if(W===R.scale)return R;const O=W/R.scale,F=t-(t-R.x)*O,Y=f-(f-R.y)*O;return{scale:W,x:F,y:Y}})};let w=0;const A=m=>{m.touches.length===2&&(w=Math.hypot(m.touches[0].clientX-m.touches[1].clientX,m.touches[0].clientY-m.touches[1].clientY))},b=m=>{if(m.touches.length===2){m.preventDefault();const s=Math.hypot(m.touches[0].clientX-m.touches[1].clientX,m.touches[0].clientY-m.touches[1].clientY),t=(m.touches[0].clientX+m.touches[1].clientX)/2,f=(m.touches[0].clientY+m.touches[1].clientY)/2,l=p.getBoundingClientRect(),T=t-l.left-l.width/2,R=f-l.top-l.height/2;if(w>0){const O=(s-w)*.01;y(F=>{const Y=Math.min(Math.max(.1,F.scale+O*F.scale),10);if(Y===F.scale)return F;const q=Y/F.scale;return{scale:Y,x:T-(T-F.x)*q,y:R-(R-F.y)*q}})}w=s}},a=()=>{w=0};return p.addEventListener("wheel",L,{passive:!1}),p.addEventListener("touchstart",A,{passive:!1}),p.addEventListener("touchmove",b,{passive:!1}),p.addEventListener("touchend",a),()=>{p.removeEventListener("wheel",L),p.removeEventListener("touchstart",A),p.removeEventListener("touchmove",b),p.removeEventListener("touchend",a)}},[]),e.jsx("div",{className:"fixed pointer-events-auto",style:{left:M.x,top:M.y,width:M.width,height:M.height,zIndex:2147483647},children:e.jsxs(Z,{className:"w-full h-full flex flex-col overflow-hidden relative shadow-2xl",children:[e.jsxs("div",{className:"h-12 border-b border-white/10 flex items-center justify-between px-4 cursor-move shrink-0 bg-white/5",onMouseDown:c,children:[e.jsxs("div",{className:"flex items-center gap-2 pointer-events-none",children:[e.jsx("span",{className:"text-lg",children:"🔍"}),e.jsxs("h3",{className:"font-medium text-white/90",children:[i," Result"]})]}),e.jsx("button",{onClick:h,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors",children:e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),e.jsx("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})})]}),e.jsxs("div",{ref:r,className:"flex-1 relative overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing",onMouseDown:S,children:[e.jsx("div",{className:"absolute inset-0 flex items-center justify-center",style:{transform:`translate(${d.x}px, ${d.y}px) scale(${d.scale})`,transition:o?"none":"transform 0.1s ease-out"},children:e.jsx("img",{src:n,alt:"Analyzed Result",className:"max-w-none pointer-events-none select-none shadow-lg",style:{maxWidth:"none",maxHeight:"none"},draggable:!1})}),e.jsxs("div",{className:"absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/60 text-xs font-mono text-white/70 border border-white/10 pointer-events-none",children:[Math.round(d.scale*100),"%"]})]}),e.jsx("div",{className:"absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 hover:bg-white/10 rounded-tl-lg",onMouseDown:N,children:e.jsx("svg",{className:"absolute bottom-1 right-1 w-3 h-3 text-white/40",viewBox:"0 0 10 10",fill:"currentColor",children:e.jsx("path",{d:"M10 10 L10 0 L0 10 Z"})})})]})})},Le=()=>{const[n,i]=k.useState("idle"),[h,M]=k.useState(null),[v,P]=k.useState(null),[z,D]=k.useState(null),[u,d]=k.useState(null),[y,o]=k.useState(null),[g,x]=k.useState(!1),I=k.useRef({x:0,y:0}),j=k.useRef(null);k.useEffect(()=>{const S=p=>{switch(p.type){case"SCANNING":i("scanning"),D(p.imageUrl||null),M(null),P(null);break;case"SHOW_RESULT":i("result"),M({isAI:p.isAI||!1,confidence:p.confidence||0,heatmapData:p.heatmapData,filterData:p.filterData});break;case"ERROR":i("error"),P(p.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(S),()=>chrome.runtime.onMessage.removeListener(S)},[]),k.useEffect(()=>{const S=L=>{if(!g||!j.current)return;let w=L.clientX-I.current.x,A=L.clientY-I.current.y;const b=j.current.getBoundingClientRect(),a=window.innerWidth,m=window.innerHeight,s=Math.max(0,a-b.width),t=Math.max(0,m-b.height);w=Math.max(0,Math.min(w,s)),A=Math.max(0,Math.min(A,t)),o({x:w,y:A})},p=()=>{x(!1)};return g&&(window.addEventListener("mousemove",S),window.addEventListener("mouseup",p)),()=>{window.removeEventListener("mousemove",S),window.removeEventListener("mouseup",p)}},[g]);const r=S=>{if(!j.current)return;const p=j.current.getBoundingClientRect(),L=p.left,w=p.top;I.current={x:S.clientX-L,y:S.clientY-w},y||o({x:L,y:w}),x(!0)},c=()=>{i("idle"),M(null),P(null),D(null),o(null),d(null)};if(n==="idle")return null;const N=n==="tools"?800:400;return e.jsxs(Q.Fragment,{children:[e.jsx("style",{children:`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}),e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",style:{display:"flex",alignItems:"center",justifyContent:"center",padding:y?0:20},children:e.jsx("div",{ref:j,className:"pointer-events-auto transition-shadow duration-300",style:y?{position:"absolute",left:y.x,top:y.y,boxShadow:g?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{position:"relative"},children:e.jsxs(Z,{className:"relative overflow-hidden transition-all duration-300",children:[e.jsxs("div",{style:{display:"flex",flexDirection:"column",maxHeight:"calc(100vh - 80px)",maxWidth:"calc(100vw - 40px)",width:N},children:[e.jsx("div",{onMouseDown:r,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${g?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0 shrink-0",style:{padding:"24px 24px 0 24px"},children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:c,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),e.jsxs("div",{className:"hide-scrollbar",style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"0 24px 24px 24px"},children:[n==="scanning"&&e.jsxs("div",{className:"relative",children:[z&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:z,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),n==="result"&&h&&z&&e.jsx(te,{result:h,targetImage:z,onToolsClick:()=>i("tools")}),n==="tools"&&z&&e.jsx(Ee,{targetImage:z,onBack:()=>i("result"),onClose:c,onMaximize:(S,p)=>d({url:S,title:p})}),n==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:v})]})]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})}),u&&e.jsx(Ie,{image:u.url,title:u.title,onClose:()=>d(null)})]})},De=`
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
`;function Te(n){const i=document.createElement("style");i.textContent=De,n.appendChild(i)}const ze=`

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
`;function Re(n){const i=document.createElement("style");i.textContent=ze,n.appendChild(i)}if(!document.getElementById("undiffused-root")){const n=document.createElement("div");n.id="undiffused-root",document.body.appendChild(n);const i=n.attachShadow({mode:"open"});Te(i),Re(i);const h=document.createElement("div");h.id="undiffused-app",i.appendChild(h);const M=document.createElement("div");M.id="undiffused-portal-root",Object.assign(M.style,{position:"fixed",top:"0",left:"0",width:"100%",height:"0",zIndex:"2147483647",pointerEvents:"none",overflow:"visible"}),i.appendChild(M),ee.createRoot(h).render(e.jsx(Le,{})),console.log("[UnDiffused] Content script injected")}
