import{r as a,j as e,G as y,R as j,c as S}from"./ResultView-Bfe86EWh.js";const N=()=>{const[t,o]=a.useState("idle"),[s,c]=a.useState(null),[w,b]=a.useState(null),[p,h]=a.useState(null),[i,u]=a.useState(null),[d,f]=a.useState(!1),g=a.useRef({x:0,y:0}),m=a.useRef(null);a.useEffect(()=>{const n=r=>{switch(r.type){case"SCANNING":o("scanning"),h(r.imageUrl||null),c(null),b(null);break;case"SHOW_RESULT":o("result"),c({isAI:r.isAI||!1,confidence:r.confidence||0,heatmapData:r.heatmapData,filterData:r.filterData});break;case"ERROR":o("error"),b(r.error||"Unknown error");break}};return chrome.runtime.onMessage.addListener(n),()=>chrome.runtime.onMessage.removeListener(n)},[]),a.useEffect(()=>{const n=l=>{d&&u({x:l.clientX-g.current.x,y:l.clientY-g.current.y})},r=()=>{f(!1)};return d&&(window.addEventListener("mousemove",n),window.addEventListener("mouseup",r)),()=>{window.removeEventListener("mousemove",n),window.removeEventListener("mouseup",r)}},[d]);const v=n=>{if(!m.current)return;n.preventDefault();const r=m.current.getBoundingClientRect(),l=i?i.x:r.left,x=i?i.y:r.top;g.current={x:n.clientX-l,y:n.clientY-x},i||u({x:l,y:x}),f(!0)},k=()=>{o("idle"),c(null),b(null),h(null)};return t==="idle"?null:e.jsx("div",{className:"fixed inset-0 z-[999999] pointer-events-none",children:e.jsx("div",{ref:m,className:"pointer-events-auto absolute transition-shadow duration-300",style:i?{left:i.x,top:i.y,boxShadow:d?"0 20px 40px rgba(0,0,0,0.5)":void 0}:{left:"50%",top:"50%",transform:"translate(-50%, -50%)"},children:e.jsxs(y,{className:"relative overflow-hidden min-w-[320px] max-w-[400px] p-6 pt-6",children:[e.jsx("div",{onMouseDown:v,className:"absolute top-0 inset-x-0 h-8 cursor-move z-50 flex justify-center items-start pt-3 group",title:"Drag to move",children:e.jsx("div",{className:`w-12 h-1.5 bg-white/40 rounded-full transition-all duration-200 shadow-sm ${d?"bg-white/80 w-16":"group-hover:bg-white/60"}`})}),e.jsxs("div",{className:"flex items-center justify-between mb-4 mt-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 shrink-0",children:e.jsxs("svg",{className:"w-5 h-5 text-white",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})}),e.jsx("div",{className:"flex flex-col justify-center",children:e.jsx("h2",{className:"text-lg font-semibold leading-tight m-0",children:"UnDiffused"})})]}),e.jsx("button",{onClick:k,className:"w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/10","aria-label":"Close",children:e.jsx("svg",{className:"w-4 h-4 text-white/70",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]}),t==="scanning"&&e.jsxs("div",{className:"relative",children:[p&&e.jsxs("div",{className:"relative mb-4 rounded-xl overflow-hidden border border-white/10",children:[e.jsx("img",{src:p,alt:"Scanning",className:"w-full h-32 object-cover opacity-50"}),e.jsx("div",{className:"absolute inset-0",children:e.jsx("div",{className:"absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scanner shadow-[0_0_20px_rgba(59,130,246,0.8)]"})})]}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-3 h-3 rounded-full bg-blue-500 animate-pulse-glow"}),e.jsx("span",{className:"text-sm text-white/70",children:"Analyzing image..."})]})]}),t==="result"&&s&&p&&e.jsx(j,{result:s,targetImage:p}),t==="error"&&e.jsxs("div",{className:"animate-fade-in",children:[e.jsx("div",{className:"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 mb-4",children:e.jsx("span",{className:"text-sm font-medium text-red-400",children:"Analysis Failed"})}),e.jsx("p",{className:"text-xs text-white/50",children:w})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"})]})})})},E=`
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
`;function I(t){const o=document.createElement("style");o.textContent=E,t.appendChild(o)}if(!document.getElementById("undiffused-root")){const t=document.createElement("div");t.id="undiffused-root",document.body.appendChild(t);const o=t.attachShadow({mode:"open"});I(o);const s=document.createElement("div");s.id="undiffused-app",o.appendChild(s),S.createRoot(s).render(e.jsx(N,{})),console.log("[UnDiffused] Content script injected")}
