import{a as Ya,r as s,u as Pe,j as e,N as Va,O as Ga,m as X,d as r,F as mr,b as Wo,c as Yo,e as Ka,l as he,f as Vo,R as Ae,g as Sr,h as Go,i as Ko,k as qr,n as Ur,o as Xa,p as Xo,q as Qo,s as Jo,t as Zo,v as en,w as tn,x as rn,y as an,z as on,A as Qa,B as nn,C as sn,D as ln,E as dn,G as Hr,H as cn,I as pn,L as pe,J as un,K as Ja,M as Za,P as xn,Q as gn,S as mn,T as _r,U as eo,V as Cr,W as to,X as ro,Y as hn,Z as Wr,_ as Yr,$ as bn,a0 as fn,a1 as $r,a2 as vn,a3 as yn,a4 as jn,a5 as wn,a6 as kn,a7 as Sn,a8 as _n,a9 as Cn,aa as ao,ab as oo,ac as no,ad as so,ae as $n,af as An,ag as En,ah as zn,ai as Pn,aj as Ln,ak as Tn,al as io,am as Dn,an as Fn,ao as In,ap as Rn,aq as Nn,ar as Mn,as as Bn,at as On,au as hr,av as Xe,aw as qn,ax as Un,ay as de,az as Hn,aA as Wn,aB as Yn}from"./vendor.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function o(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerPolicy&&(l.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?l.credentials="include":i.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(i){if(i.ep)return;i.ep=!0;const l=o(i);fetch(i.href,l)}})();const Vn={BASE_URL:"/",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_API_URL:"https://suporteatostech.com/api",VITE_STORAGE_BASE_URL:"https://suporteatostech.com/storage"};var Gn={};function lo(){try{if(typeof import.meta<"u"&&Vn){const t="https://suporteatostech.com/api";if(t&&t.trim())return t.trim()}}catch{}try{const t=typeof process<"u"?Gn:void 0,a=t?.NEXT_PUBLIC_API_BASE_URL,o=t?.REACT_APP_API_BASE_URL;if(a)return a;if(o)return o}catch{}try{const t=typeof window<"u"?window.__API_BASE_URL__:void 0;if(t&&String(t).trim())return String(t).trim()}catch{}return"/api"}function Kn(){if(typeof document>"u")return null;const t=document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);return t?decodeURIComponent(t[1]):null}const J=Ya.create({baseURL:lo(),timeout:3e4,withCredentials:!0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"});function Xn(){let t=lo();try{t=t.replace(/\/+$/,""),t=t.replace(/\/api$/,"")}catch{}return t?`${t}/sanctum/csrf-cookie`:"/sanctum/csrf-cookie"}let ct=null;async function Qn(t=!1){if(!(typeof document>"u")&&!(!t&&document.cookie.includes("XSRF-TOKEN="))){if(!ct){const a=Xn(),o=a.startsWith("http")?a:a.startsWith("/")?`${window.location.origin}${a}`:a;ct=Ya.get(o,{withCredentials:!0,headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"}}).then(()=>{ct=null}).catch(n=>{throw ct=null,n})}return ct}}function Vr(){try{typeof window<"u"&&localStorage.removeItem("authToken")}catch{}}J.interceptors.request.use(t=>{const a=typeof window<"u"?localStorage.getItem("authToken"):null;a&&(t.headers=t.headers??{},t.headers.Authorization=`Bearer ${a}`),t.headers=t.headers??{},t.headers.Accept||(t.headers.Accept="application/json");const o=J.defaults.xsrfHeaderName??"X-XSRF-TOKEN";if(t.headers[o]==null){const i=Kn();i&&(t.headers[o]=i)}t.headers["X-Requested-With"]||(t.headers["X-Requested-With"]="XMLHttpRequest");const n=(t.method||"get").toLowerCase();return(n==="post"||n==="put"||n==="patch")&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/json"),t});J.interceptors.response.use(t=>t,t=>{const a=t?.response?.status,o=t?.response?.data?.message||t?.response?.data,n=()=>{if(typeof window>"u")return!1;const{pathname:i}=window.location;return i!=="/login"&&i!=="/logout"};if(a===401){Vr();try{window.__AUTH_EXPIRED=!0}catch{}n()&&(window.location.href="/login")}if(a===419){Vr();try{window.__AUTH_EXPIRED=!0}catch{}n()&&(window.location.href="/login")}if(a===500&&typeof o=="string"&&o.toLowerCase().includes("route [login] not defined")){try{window.__AUTH_EXPIRED=!0}catch{}n()&&(window.location.href="/login")}return a===403&&typeof window<"u"&&(window.location.href="/forbidden"),Promise.reject(t)});function Ar(){const t=s.useContext(co);if(!t)throw new Error("useAuth must be used within an AuthProvider");return t}const co=s.createContext(null),Jn=({children:t})=>{const[a,o]=s.useState(null),[n,i]=s.useState(!0),l=Pe();s.useEffect(()=>{if(!(typeof window<"u"?localStorage.getItem("authToken"):null)){i(!1);return}(async()=>{try{const u=(await J.get("/user"))?.data?.data??null;o(u)}catch{o(null);try{localStorage.removeItem("authToken")}catch{}}finally{i(!1)}})()},[]);const c=(d,x)=>{try{localStorage.setItem("authToken",x)}catch{}o(d),l("/dashboard",{replace:!0})},p=async()=>{try{(typeof window<"u"?localStorage.getItem("authToken"):null)&&await J.post("/admin/logout",{})}catch(d){console.error("Erro ao fazer logout na API:",d)}finally{try{localStorage.removeItem("authToken")}catch{}o(null),l("/login",{replace:!0})}};return e.jsx(co.Provider,{value:{user:a,login:c,logout:p,loading:n},children:!n&&t})},Zn=()=>{const{user:t,loading:a}=Ar();return a?e.jsx("div",{children:"Verificando autenticação..."}):t?e.jsx(Ga,{}):e.jsx(Va,{to:"/login",replace:!0})},po="/assets/logo.png",es=X`
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
`,ts=r.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at top, #395b6a 0%, #1b3037 45%, #102027 100%);
    background-size: 160% 160%;
    animation: ${es} 24s ease alternate infinite;
`,rs=X`
    0% {
        opacity: 0;
        transform: translateY(18px) scale(0.96);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
`,as=X`
    0% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.28;
    }
    50% {
        transform: translate3d(38px, -42px, 0) scale(1.08);
        opacity: 0.42;
    }
    100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.28;
    }
`,os=X`
    0% {
        transform: translateY(0) scale(1);
        filter: drop-shadow(0 6px 18px rgba(157, 217, 210, 0.22));
    }
    50% {
        transform: translateY(-6px) scale(1.03);
        filter: drop-shadow(0 10px 26px rgba(157, 217, 210, 0.32));
    }
    100% {
        transform: translateY(0) scale(1);
        filter: drop-shadow(0 6px 18px rgba(157, 217, 210, 0.22));
    }
`,ns=X`
    0% {
        opacity: 0;
        transform: translateY(14px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`,Er=X`
    0% {
        opacity: 0;
        transform: translateY(18px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`,ss=X`
    0% {
        transform: translateX(-140%) rotate(16deg);
        opacity: 0;
    }
    48% {
        opacity: 0.35;
    }
    100% {
        transform: translateX(160%) rotate(16deg);
        opacity: 0;
    }
`,is=X`
    0%, 100% {
        box-shadow: 0 14px 28px rgba(39, 77, 86, 0.48), 0 0 0 0 rgba(157, 217, 210, 0.36);
    }
    50% {
        box-shadow: 0 16px 38px rgba(39, 77, 86, 0.62), 0 0 22px 6px rgba(157, 217, 210, 0.45);
    }
`,ls=X`
    0% {
        transform: translate3d(-140%, 0, 0) rotate(18deg);
        opacity: 0;
    }
    46% {
        opacity: 0;
    }
    58% {
        opacity: 0.5;
    }
    100% {
        transform: translate3d(220%, 0, 0) rotate(18deg);
        opacity: 0;
    }
`,ds=r.div`
    width: 480px;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(54,73,78,0.82) 0%, rgba(26,49,55,0.82) 100%);
    border-radius: 20px;
    padding: 40px 50px;
    box-shadow: 0 18px 40px rgba(0,0,0,0.55);
    backdrop-filter: blur(12px);
    text-align: center;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(157, 217, 210, 0.12);
    z-index: 1;
    opacity: 0;
    animation: ${rs} 0.7s ease forwards;
    &::before {
        content: '';
        position: absolute;
        top: -35%;
        left: -60%;
        width: 80%;
        height: 170%;
        background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(180,231,226,0.18) 45%, rgba(255,255,255,0) 90%);
        opacity: 0;
        animation: ${ss} 5.6s ease-in-out infinite 1.4s;
    }
`,cs=r.img`
    width: 300px;
    max-width: 80%;
    margin-bottom: 20px;
    animation: ${os} 6.8s ease-in-out infinite;
`,ps=r.p`
    margin: 12px 0 24px 0;
    font-size: 18px;
    color: rgba(224,224,224,0.94);
    font-weight: 500;
    letter-spacing: 0.25px;
`,us=r.form`
    display: flex;
    flex-direction: column;
    gap: 25px;
    opacity: 0;
    animation: ${ns} 0.75s ease forwards 0.2s;
`,Gr=r.div`
    display: flex;
    flex-direction: column;
    opacity: 0;
    animation: ${Er} 0.6s ease forwards;
    &:nth-of-type(1) {
        animation-delay: 0.28s;
    }
    &:nth-of-type(2) {
        animation-delay: 0.38s;
    }
`,Kr=r.label`
    font-size: 16px;
    color: rgba(230,230,230,0.8);
    margin-bottom: 12px;
    text-align: left;
    font-weight: 600;
`,Xr=r.input`
    width: 100%;
    height: 50px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255,255,255,0.06);
    color: #fff;
    font-size: 16px;
    outline: none;
    box-sizing: border-box;
    transition: background 0.2s ease, box-shadow 0.2s ease;
    &::placeholder {
        color: rgba(200,200,200,0.5);
    }
    &:focus {
        background: rgba(255,255,255,0.10);
        box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.5);
        border: 1px solid rgba(157, 217, 210, 0.5);
    }
`,xs=r.button`
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 12px;
    background: #9dd9d2;
    color: #000;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    opacity: 0;
    animation: ${Er} 0.6s ease forwards 0.48s, ${is} 4.2s ease-in-out infinite 1.4s;
    &:hover {
        background: #86c7bf;
        transform: translateY(-2px);
    }
    &:disabled {
        background: #555;
        cursor: not-allowed;
        box-shadow: none;
        animation: none;
    }
    &::after {
        content: '';
        position: absolute;
        top: -120%;
        left: -60%;
        width: 65%;
        height: 260%;
        background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%);
        opacity: 0;
        transform: translate3d(-140%, 0, 0) rotate(18deg);
        animation: ${ls} 5s ease-in-out infinite 1.6s;
        pointer-events: none;
    }
`,gs=r.p`
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
    color: ${t=>t.type==="error"?"#ff8a80":"#b9f6ca"};
    letter-spacing: 0.2px;
    opacity: 0;
    animation: ${Er} 0.6s ease forwards 0.62s;
`,ms=r.div`
    position: absolute;
    inset: -18%;
    pointer-events: none;
    z-index: 0;
    filter: saturate(120%);
`,Gt=r.span`
    position: absolute;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(157, 217, 210, 0.38) 0%, rgba(54, 73, 78, 0) 70%);
    mix-blend-mode: screen;
    animation: ${as} 22s ease-in-out infinite;
    filter: blur(10px);
    &:nth-of-type(1) {
        top: -6%;
        left: -4%;
        animation-delay: 0s;
    }
    &:nth-of-type(2) {
        bottom: -14%;
        right: -8%;
        width: 280px;
        height: 280px;
        animation-delay: 2s;
        background: radial-gradient(circle, rgba(157, 217, 210, 0.32) 0%, rgba(26, 49, 55, 0) 68%);
    }
    &:nth-of-type(3) {
        top: 38%;
        left: 66%;
        width: 220px;
        height: 220px;
        animation-delay: 4s;
        background: radial-gradient(circle, rgba(150, 209, 255, 0.28) 0%, rgba(26, 49, 55, 0) 70%);
    }
`,hs=X`
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
`,bs=X`
    to {
        transform: rotate(360deg);
    }
`,fs=X`
    0% {
        transform: scale(0.6);
        opacity: 0;
    }
    60% {
        transform: scale(1.08);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
`,vs=r.div`
    position: absolute;
    inset: 0;
    background: rgba(7, 19, 25, 0.78);
    backdrop-filter: blur(6px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 2;
    animation: ${hs} 0.25s ease forwards;
    pointer-events: all;
`,ys=r.div`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid rgba(157, 217, 210, 0.24);
    border-top-color: #9dd9d2;
    animation: ${bs} 0.8s linear infinite;
`,js=r.span`
    font-size: 15px;
    color: #e8fffb;
    letter-spacing: 0.3px;
    font-weight: 500;
`,ws=r.div`
    display: flex;
    align-items: center;
    gap: 12px;
    color: #9dd9d2;
    font-weight: 600;
    font-size: 20px;
    animation: ${fs} 0.45s ease forwards;
    svg {
        font-size: 44px;
    }
`,ks=()=>{const[t,a]=s.useState(""),[o,n]=s.useState(""),[i,l]=s.useState(!1),[c,p]=s.useState(!1),[d,x]=s.useState(""),[g,u]=s.useState(!1),{login:b,user:R}=Ar();s.useEffect(()=>{R&&window.location.replace("/dashboard")},[R]);const y=async m=>{m.preventDefault(),p(!0),x(""),u(!1);try{await Qn();const A=await J.post("/login",{email:t,password:o}),I=A?.data?.data,D=A?.data?.token;I&&D?(u(!0),setTimeout(()=>{b(I,D)},900)):(x("Erro: Resposta da API inválida."),p(!1))}catch(A){p(!1),A.response&&A.response.data?x(A.response.data.message||"Credenciais inválidas."):x("Erro de conexão. Tente novamente mais tarde.")}};return e.jsxs(ts,{children:[e.jsxs(ms,{children:[e.jsx(Gt,{}),e.jsx(Gt,{}),e.jsx(Gt,{})]}),e.jsxs(ds,{children:[c&&e.jsx(vs,{children:g?e.jsxs(ws,{children:[e.jsx(mr,{}),e.jsx("span",{children:"Bem-vindo(a)!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(ys,{}),e.jsx(js,{children:"Validando credenciais..."})]})}),e.jsx(cs,{src:po,alt:"Logo da Empresa"}),e.jsx(ps,{children:"Acesse seu painel com segurança. Por favor, insira seu e-mail e senha."}),e.jsxs(us,{onSubmit:y,children:[e.jsxs(Gr,{children:[e.jsx(Kr,{htmlFor:"email",children:"Email"}),e.jsx(Xr,{id:"email",type:"email",autoComplete:"email",placeholder:"seu@exemplo.com",value:t,onChange:m=>a(m.target.value),required:!0})]}),e.jsxs(Gr,{children:[e.jsx(Kr,{htmlFor:"password",children:"Senha"}),e.jsxs("div",{style:{position:"relative"},children:[e.jsx(Xr,{id:"password",type:i?"text":"password",autoComplete:"current-password",placeholder:"********",value:o,onChange:m=>n(m.target.value),required:!0,style:{paddingRight:"44px"}}),e.jsx("button",{type:"button",onClick:()=>l(m=>!m),style:{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:22,padding:0,display:"flex",alignItems:"center",justifyContent:"center"},tabIndex:-1,"aria-label":i?"Ocultar senha":"Mostrar senha",children:i?e.jsx(Wo,{}):e.jsx(Yo,{})})]})]}),e.jsx(xs,{type:"submit",disabled:c,children:c?"Entrando...":"Entrar"})]}),d&&e.jsx(gs,{type:d.toLowerCase().includes("inválid")||d.toLowerCase().includes("erro")?"error":"success",children:d})]})]})};function uo(){const[t,a]=s.useState(null),o=s.useRef(null),n=s.useRef(null),i=()=>{o.current&&(clearTimeout(o.current),o.current=null),n.current&&(clearTimeout(n.current),n.current=null)},l=s.useCallback((p,d,x={})=>{i();let g=8e3;x&&typeof x.duration=="number"?g=x.duration:d&&typeof d=="object"&&typeof d.duration=="number"&&(g=d.duration);const u=typeof d=="object"&&d!==null?{...d,exiting:!1}:{title:"",body:d,exiting:!1};a({type:p,message:u}),o.current=setTimeout(()=>{a(b=>b&&{...b,message:{...b.message||{},exiting:!0}})},g),n.current=setTimeout(()=>{a(null)},g+500)},[]),c=s.useCallback(()=>{i(),a(p=>p&&{...p,message:{...p.message||{},exiting:!0}}),n.current=setTimeout(()=>a(null),500)},[]);return{showToast:l,toast:t,exit:c}}const Ss=X`
  from { opacity: 0; transform: translateY(-18px) translateX(8px) scale(0.985); }
  60% { opacity: 1; transform: translateY(-6px) translateX(2px) scale(1.01); }
  to { opacity: 1; transform: translateY(0) translateX(0) scale(1); }
`,_s=X`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-12px) scale(0.985); }
`,Cs=X`
  0% { transform: translateX(-12px); opacity: 0; }
  60% { transform: translateX(6px); opacity: 1; }
  100% { transform: translateX(0); opacity: 1; }
`,$s=r.div`
  position: fixed;
  top: 32px;
  right: 32px;
  /* Elevado para garantir que toasts fiquem à frente de outros elementos */
  z-index: 2147483647;
  min-width: 260px;
  max-width: 420px;
  background: linear-gradient(180deg, rgba(25,35,46,0.96), rgba(17,24,39,0.94));
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 44px rgba(3,7,18,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
  padding: 18px 22px 18px 70px; /* espaço para stripe e ícone */
  font-size: 1.04rem;
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  overflow: visible;
  animation: ${Ss} 0.68s cubic-bezier(.22,.61,.36,1) both;
  transition: opacity 0.45s ease, transform 0.45s ease;
  &.toast-exit {
    animation: ${_s} 0.5s cubic-bezier(.22,.61,.36,1) both;
  }

  /* faixa colorida curva à esquerda */
  &::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 8px;
    bottom: 8px;
    width: 12px;
    border-radius: 12px 0 0 12px;
    background: linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,0.9));
    box-shadow: 0 6px 20px rgba(34,197,94,0.18);
    animation: ${Cs} 0.6s cubic-bezier(.22,.61,.36,1) both;
  }
`,As=r.div`
  font-size: 1.6rem;
  margin-top: 0;
  margin-left: -44px;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  background: rgba(0,0,0,0.12);
  box-shadow: 0 6px 18px rgba(2,6,10,0.55);
  color: #fff;
`,Es=r.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,zs=r.div`
  font-weight: 700;
  font-size: 1.04rem;
  margin-bottom: 2px;
  color: ${({type:t})=>t==="success"?"#d1fae5":t==="error"?"#fee2e2":"#d1fae5"};
  text-shadow: 0 2px 6px rgba(0,0,0,0.45);
`,Ps=r.div`
  font-size: 0.98rem;
  color: #e5e7eb;
  word-break: break-word;
`,Ls=r.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: 0;
  color: #cbd5e1;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  border-radius: 6px;
  &:hover { color: #fff; background: rgba(255,255,255,0.08); }
`,Qr={success:e.jsx("span",{"aria-label":"Sucesso",role:"img",children:"✓"}),error:e.jsx("span",{"aria-label":"Erro",role:"img",children:"⚠"}),info:e.jsx("span",{"aria-label":"Info",role:"img",children:"ℹ"}),warning:e.jsx("span",{"aria-label":"Atenção",role:"img",children:"!"})};function Ts(t){if(typeof t=="object"&&t!==null)return t;if(typeof t=="string"&&t.includes(":")){const[a,...o]=t.split(":");return{title:a.trim(),body:o.join(":").trim()}}return{title:"",body:t}}const zr=({message:t,type:a="info",exit:o=!1})=>{const n=Ts(t),{title:i,body:l}=n,c=o===!0||typeof t=="object"&&t&&t.exiting===!0,p=typeof o=="function"?o:()=>{},d=s.useMemo(()=>{if(typeof document>"u")return null;const x=document.getElementById("toast-root");if(x)return x;const g=document.createElement("div");return g.id="toast-root",document.body.appendChild(g),g},[]);return s.useEffect(()=>{if(typeof o!="function")return;const x=g=>{if(g.key==="Escape")try{p()}catch{}};return document.addEventListener("keydown",x),()=>document.removeEventListener("keydown",x)},[o,p]),d?Ka.createPortal(e.jsxs($s,{type:a,className:c?"toast-exit":"",role:"status","aria-live":"polite",children:[e.jsx(As,{children:Qr[a]||Qr.info}),e.jsxs(Es,{children:[i&&e.jsx(zs,{type:a,children:i}),e.jsx(Ps,{children:l})]}),e.jsx(Ls,{onClick:p,"aria-label":"Fechar alerta",title:"Fechar",children:"×"})]}),d):null},Ds=r.div`
  position: relative;
`,Fs=r.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-light);
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
  position: relative;
  z-index: 2100;
  &:hover { background: rgba(255,255,255,0.1); }
  &:active { transform: translateY(1px); }
`,Is=r.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.25);
`,Rs=r.section`
  position: fixed;
  top: ${({$top:t})=>`${Math.max(t,0)}px`};
  right: ${({$right:t})=>`${Math.max(t,12)}px`};
  width: clamp(320px, 24vw, 380px);
  background: linear-gradient(135deg, rgba(17,24,39,0.98), rgba(30,41,59,0.95));
  color: var(--color-text-light);
  border-radius: 16px;
  border: 1px solid rgba(148,163,184,0.22);
  box-shadow: 0 18px 45px rgba(15,23,42,0.45), 0 4px 18px rgba(14,21,33,0.35);
  overflow: hidden;
  /* Elevado para garantir que o painel apareça acima de overlays e toasts */
  z-index: 2147483647;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`,Ns=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid rgba(148,163,184,0.18);
  font-weight: 700;
  font-size: 15px;
  background: rgba(15,23,42,0.65);
`,Jr=r.button`
  background: rgba(148,163,184,0.12);
  border: 1px solid rgba(148,163,184,0.2);
  color: var(--color-text-light);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background .15s ease, transform .15s ease;
  &:hover { background: rgba(148,163,184,0.16); }
  &:active { transform: translateY(1px); }
`,Ms=r.div`
  max-height: 360px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`,Bs=X`
  0% { transform: scale(0.6) rotate(-10deg); opacity: 0; }
  60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`,Os=X`
  from { stroke-dashoffset: 22; }
  to { stroke-dashoffset: 0; }
`,qs=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: linear-gradient(180deg, rgba(34,197,94,1), rgba(16,185,129,0.95));
  box-shadow: 0 6px 18px rgba(34,197,94,0.18);
  color: #052e14;
  margin-left: 8px;
  padding: 3px;
  animation: ${Bs} 420ms cubic-bezier(.22,.61,.36,1) both;
`,Us=r.svg`
  width: 14px;
  height: 14px;
  display: block;
  & path {
    stroke: #052e14;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    stroke-dasharray: 22;
    stroke-dashoffset: 22;
    animation: ${Os} 420ms ease forwards;
  }
`;function Hs(){return e.jsx(qs,{"aria-hidden":!0,children:e.jsx(Us,{viewBox:"0 0 24 24","aria-hidden":!0,children:e.jsx("path",{d:"M5 13l4 4L19 7"})})})}const Ws=X`
  0% { transform: translateX(-8px) scale(0.98); opacity: 0; }
  60% { transform: translateX(4px) scale(1.01); opacity: 1; }
  100% { transform: translateX(0) scale(1); opacity: 1; }
`,Ys=X`
  0% { box-shadow: 0 6px 18px rgba(34,197,94,0.04); }
  50% { box-shadow: 0 14px 34px rgba(34,197,94,0.08); }
  100% { box-shadow: 0 6px 18px rgba(34,197,94,0.04); }
`,Vs=r.button`
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  color: inherit;
  cursor: pointer;
  padding: 12px 18px 12px 28px;
  display: grid;
  gap: 6px;
  border-bottom: 1px solid rgba(148,163,184,0.12);
  transition: background .15s ease, box-shadow .2s ease, transform .18s ease;
  position: relative;
  will-change: transform, box-shadow;
  &:hover { background: rgba(148,163,184,0.12); transform: translateY(-2px); }
  &:focus-visible {
    outline: 2px solid rgba(96,165,250,0.6);
    outline-offset: 2px;
  }
  /* borda / destaque para notificações de assinante novo */
  ${({$isNewSubscriber:t})=>t?he`
    border: 1px solid rgba(34,197,94,0.18);
    box-shadow: 0 12px 30px rgba(34,197,94,0.06);
    background: linear-gradient(180deg, rgba(34,197,94,0.03), rgba(34,197,94,0.01));
    border-bottom: 1px solid rgba(34,197,94,0.08);
    animation: ${Ws} 0.6s cubic-bezier(.22,.61,.36,1);
    &::after { content: ''; position: absolute; left: 10px; top: 10px; bottom: 10px; width: 6px; border-radius: 999px; background: linear-gradient(180deg, rgba(34,197,94,0.95), rgba(16,185,129,0.6)); box-shadow: 0 6px 18px rgba(34,197,94,0.12); }
    & { animation: ${Ys} 3.6s ease-in-out infinite; }
  `:""}
`,Gs=r.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 74%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(59,130,246,0.9), rgba(96,165,250,0.4));
  box-shadow: 0 6px 18px rgba(59,130,246,0.12);
`,Ks=r.div`
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`,Xs=r.div`
  font-size: 13px;
  opacity: 0.85;
`,Qs=r.div`
  font-size: 12px;
  opacity: 0.65;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Js=r.span`
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(59,130,246,0.18);
  color: rgba(191,219,254,0.95);
  padding: 3px 8px;
  border-radius: 999px;
`,Zs=r.div`
  padding: 24px 18px;
  text-align: center;
  font-size: 14px;
  opacity: 0.75;
`,ei=r.div`
  padding: 10px 18px 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.6;
  background: rgba(15,23,42,0.35);
  &:not(:first-of-type) {
    margin-top: 6px;
  }
`,ti=r.div`
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background: rgba(15,23,42,0.5);
`;function ri(){const[t,a]=s.useState(0),[o,n]=s.useState([]),[i,l]=s.useState(!1),c=s.useRef(0),p=s.useRef(null),d=s.useRef(!1),x=s.useRef(0),g=s.useRef(12e3),u=s.useRef(0),b=Pe(),{showToast:R,toast:y,exit:m}=uo(),A=s.useRef(null),I=s.useRef(null),[D,$]=s.useState({top:0,right:16}),[E,L]=s.useState([]),H=s.useCallback(()=>{const w=A.current;if(!w||typeof window>"u")return;const v=w.getBoundingClientRect();$({top:v.bottom+12,right:Math.max(12,window.innerWidth-v.right)})},[]),f=w=>{p.current&&clearTimeout(p.current);const v=Math.max(g.current,u.current||0);p.current=setTimeout(()=>{B()},v)},B=async()=>{const w=Date.now();if(!d.current&&!(w-x.current<4e3)){d.current=!0,x.current=w;try{const F=(await J.get("/admin/notifications/count")).data?.unread??0,V=c.current;if(a(F),c.current=F,F>V){const ie=await J.get("/admin/notifications",{params:{limit:1,unread:1}}),ce=Array.isArray(ie.data?.data)?ie.data.data[0]:null;if(ce){const be=typeof ce.type=="string"&&ce.type.includes("subscriber");R(be?"success":"info",{title:ce.title||"Nova notificação",body:ce.body||ce.type,duration:8e3})}}u.current=0,f()}catch(v){v?.response?.status===429&&(u.current=Math.min(u.current?u.current*2:2e3,3e4)),f()}finally{d.current=!1}}},Z=async()=>{try{const w=await J.get("/admin/notifications",{params:{limit:20}});n(Array.isArray(w.data?.data)?w.data.data:[])}catch{}};s.useEffect(()=>{B(),f();const w=()=>B(),v=()=>{document.visibilityState==="visible"&&B()};return window.addEventListener("focus",w),document.addEventListener("visibilitychange",v),()=>{p.current&&clearTimeout(p.current),window.removeEventListener("focus",w),document.removeEventListener("visibilitychange",v)}},[]),s.useEffect(()=>{if(!i)return;const w=v=>{const F=A.current,V=I.current;F&&F.contains(v.target)||V&&V.contains(v.target)||l(!1)};return document.addEventListener("mousedown",w),document.addEventListener("touchstart",w),()=>{document.removeEventListener("mousedown",w),document.removeEventListener("touchstart",w)}},[i]),s.useLayoutEffect(()=>{if(i&&!(typeof window>"u"))return H(),window.addEventListener("resize",H),window.addEventListener("scroll",H,!0),()=>{window.removeEventListener("resize",H),window.removeEventListener("scroll",H,!0)}},[i,H]);const T=w=>({subscriber_pending:"Pendente",subscriber_approved:"Aprovada",subscriber_canceled:"Cancelada",subscriber_reactivated:"Reativada",demo_subscriber_pending:"Demo pendente",demo_subscriber_approved:"Demo aprovada",separation_status_changed:"Separação",separation_due_soon:"Separação - prazo",separation_overdue:"Separação - atrasado"})[w]||w,q=w=>{if(!w)return"";const v=new Date(w);return Number.isNaN(v.getTime())?"":v.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})},O=w=>{const v={key:"unknown",label:"Outros",sortValue:-1/0};if(!w)return v;const F=new Date(w);if(Number.isNaN(F.getTime()))return v;const V=F.getFullYear(),ie=F.getMonth(),ce=F.getDate(),be=`${V}-${String(ie+1).padStart(2,"0")}-${String(ce).padStart(2,"0")}`,je=new Date(V,ie,ce),ne=new Date,ke=new Date(ne.getFullYear(),ne.getMonth(),ne.getDate()),Ee=Math.floor((ke-je)/864e5);let Le=je.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});return Ee===0?Le="Hoje":Ee===1&&(Le="Ontem"),{key:be,label:Le,sortValue:je.getTime()}},P=s.useMemo(()=>{if(!Array.isArray(o)||o.length===0)return[];const w=new Map;o.forEach(F=>{const V=F.created_at||F.updated_at||F.read_at,ie=O(V);w.has(ie.key)||w.set(ie.key,{key:ie.key,label:ie.label,sortValue:ie.sortValue,items:[]}),w.get(ie.key).items.push(F)});const v=Array.from(w.values());return v.forEach(F=>{F.items.sort((V,ie)=>{const ce=new Date(V.created_at||V.updated_at||0).getTime();return new Date(ie.created_at||ie.updated_at||0).getTime()-ce})}),v.sort((F,V)=>V.sortValue-F.sortValue),v},[o]),C=async()=>{const w=!i;l(w),w&&(H(),await Z())},j=async w=>{try{await J.post(`/admin/notifications/${w}/read`),n(v=>v.map(F=>F.id===w?{...F,read_at:new Date().toISOString()}:F)),a(v=>Math.max(0,v-1)),L(v=>[...v,w]),setTimeout(()=>L(v=>v.filter(F=>F!==w)),1400)}catch{}},_=async()=>{try{await J.post("/admin/notifications/read-all");const w=new Date().toISOString();n(v=>v.map(F=>({...F,read_at:w}))),L(v=>{const F=Array.from(new Set([...v||[],...o.map(V=>V.id)]));return setTimeout(()=>L(V=>V.filter(()=>!1)),1400),F}),a(0)}catch{}},N=w=>{const v=w?.type||"",F=w?.data||{};return v==="demo_subscriber_pending"?F&&F.user_id?`/assinantes/${F.user_id}?origin=demo&status=solicitacoes`:"/assinantes?status=solicitacoes&origin=demo":v==="subscriber_pending"?"/assinantes?status=pending":v==="subscriber_approved"?F.user_id?`/assinantes/${F.user_id}`:"/assinantes":v==="demo_subscriber_approved"?F.user_id?`/assinantes/${F.user_id}?origin=demo`:"/assinantes?origin=demo":v==="subscriber_canceled"?F.user_id?`/assinantes/${F.user_id}`:"/assinantes":v==="subscriber_reactivated"?F.user_id?`/assinantes/${F.user_id}`:"/assinantes":v==="separation_status_changed"||v==="separation_due_soon"||v==="separation_overdue"?F&&F.order_id?`/separacao?order_id=${F.order_id}`:"/separacao":"/dashboard"},W=async w=>{try{await j(w.id)}catch{}const v=N(w);b(v),l(!1)};return e.jsxs(Ds,{ref:A,children:[e.jsx(Fs,{"aria-haspopup":"menu","aria-expanded":i,onClick:C,title:"Notificações",children:e.jsx(Vo,{})}),t>0&&e.jsx(Is,{children:t>9?"9+":t}),i&&typeof document<"u"&&Ka.createPortal(e.jsxs(Rs,{ref:I,role:"menu","aria-label":"Notificações",$top:D.top,$right:D.right,children:[e.jsxs(Ns,{children:[e.jsx("span",{children:"Notificações"}),e.jsx(Jr,{onClick:_,children:"Marcar tudo"})]}),e.jsx(Ms,{children:P.length===0?e.jsx(Zs,{children:"Sem notificações"}):P.map(w=>e.jsxs(Ae.Fragment,{children:[e.jsx(ei,{children:w.label}),w.items.map(v=>{const F=!v.read_at,V=v.created_at||v.updated_at;return e.jsxs(Vs,{onClick:()=>W(v),"aria-pressed":!F,$isNewSubscriber:F&&v.type&&v.type.includes("subscriber"),children:[F&&e.jsx(Gs,{"aria-hidden":!0}),e.jsxs(Ks,{children:[e.jsx("span",{children:v.title||"Notificação"}),v.type&&e.jsx(Js,{children:T(v.type)})]}),v.body&&e.jsx(Xs,{children:v.body}),e.jsxs(Qs,{children:[e.jsx("span",{children:q(V)}),F?e.jsx("strong",{style:{fontSize:11},children:"Novo"}):E.includes(v.id)?e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:8},children:[e.jsx(Hs,{}),e.jsx("span",{style:{fontSize:12,opacity:.85},children:"Lida"})]}):e.jsx("span",{children:"Lida"})]})]},v.id)})]},w.key))}),e.jsx(ti,{children:e.jsx(Jr,{onClick:_,children:"Marcar todas como lidas"})})]}),document.body),y&&e.jsx(zr,{message:y.message,type:y.type,exit:m})]})}const ai=X`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`,oi=X`
  0% { transform: translateY(6px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`,ni=r.div`
  display: inline-flex;
  align-items: center;
  color: #e2e8f0;
  gap: 0.9rem;
  font-family: 'Inter', sans-serif;
`,si=r.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
`,ii=r.div`
  display: inline-flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`,Zr=r.span`
  display: inline-block;
  width: 1.2ch;
  text-align: center;
`,li=r.span`
  display: inline-block;
  margin: 0 0.35rem;
  animation: ${ai} 1.5s steps(2, start) infinite;
`,ea=r.span`
  display: inline-block;
  width: 1.2ch;
  text-align: center;
  animation: ${oi} 0.28s ease;
`,di=r.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(226, 232, 240, 0.78);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  letter-spacing: normal;
`,ci=()=>{const[t,a]=s.useState(()=>new Date);s.useEffect(()=>{const l=setInterval(()=>{a(new Date)},1e3);return()=>clearInterval(l)},[]);const{hourDigits:o,minuteDigits:n,dateLabel:i}=s.useMemo(()=>{const l=t.getHours().toString().padStart(2,"0"),c=t.getMinutes().toString().padStart(2,"0"),d=new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"}).format(t);return{hourDigits:l.split(""),minuteDigits:c.split(""),dateLabel:d}},[t]);return e.jsxs(ni,{children:[e.jsx(si,{children:e.jsxs(ii,{children:[e.jsx(Zr,{children:o[0]}),e.jsx(Zr,{children:o[1]}),e.jsx(li,{children:":"}),e.jsx(ea,{children:n[0]},`m0-${n[0]}`),e.jsx(ea,{children:n[1]},`m1-${n[1]}`)]})}),e.jsxs(di,{children:[e.jsx("span",{children:"•"}),e.jsx("span",{children:i})]})]})},pi=X`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`,ui=r.div`
  height: 100vh;
  min-height: 0;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 18px;
  padding: 18px;
  background:
    radial-gradient(1100px 600px at 10% -20%, rgba(56,178,172,0.06), transparent 50%),
    radial-gradient(900px 500px at 110% 120%, rgba(56,178,172,0.05), transparent 50%),
    var(--color-bg-dark);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    height: auto;
    padding: 12px;
    gap: 12px;
  }
`,xi=r.aside`
  background: var(--color-sidebar-bg);
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  border: 1px solid rgba(0,0,0,.25);
  position: sticky;
  top: 18px;
  height: calc(100vh - 36px);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    position: static;
    height: auto;
  }
`,gi=r.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 26px 20px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  img {
    width: 170px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 14px rgba(56,178,172,0.35));
  }
`,mi=r.nav`
  padding: 18px 12px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  overflow: auto;
`,Kt=r(tn)`
  --padX: 14px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 10px var(--padX);
  border-radius: 14px;
  color: var(--color-text-light);
  opacity: .9;
  transition: background .15s ease, opacity .15s ease, color .15s ease;
  margin-bottom: 0;
  &:hover { background: rgba(255,255,255,0.06); opacity: 1; }
  &.active {
    background: rgba(56,178,172,0.16);
    color: var(--color-text-light);
    box-shadow: inset 0 0 0 1px rgba(56,178,172,0.28);
  }
  .label { font-weight: 600; }
`,hi=r.div`
  padding: 18px 20px 20px 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: grid;
  gap: 10px;
`,bi=r.div`
  font-weight: 800;
  text-align: center;
`,fi=r.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: var(--color-text-light);
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
  &:hover { background: rgba(255,255,255,0.12); }
  &:active { transform: translateY(1px); }
`,vi=r.div`
  min-width: 0;
  min-height: 0;
  height: calc(100vh - 36px);
  display: grid;
`,yi=r.div`
  background: #1d2c2f;
  border: 1px solid rgba(0,0,0,.28);
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  overflow: hidden;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);

  @media (max-width: 1024px) {
    height: auto;
  }
`,ji=r.div`
  height: 68px;
  background: linear-gradient(180deg, rgba(2,6,23,.82), rgba(2,6,23,.42));
  border-bottom: 1px solid rgba(255,255,255,0.07);
  backdrop-filter: blur(6px);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 0 16px;
`,wi=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  color: var(--color-text-light);
`,ki=r.div`
  display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  color: var(--color-text-light);
  font-weight: 600;
`,Si=r.div`
  min-height: 0;
  overflow: auto;
  padding: 28px 28px 34px;
  animation: ${pi} .25s ease;

  &::-webkit-scrollbar { width: 10px; height: 10px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.25);
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`,_i=()=>{const{logout:t,user:a}=Ar(),o=Sr(),n=s.useMemo(()=>[{to:"/dashboard",label:"Dashboard",icon:e.jsx(Go,{})},{to:"/assinantes",label:"Assinantes",icon:e.jsx(Ko,{})},{label:"Separação",icon:e.jsx(qr,{}),children:[{to:"/separacao",label:"Pedidos para Separar",icon:e.jsx(qr,{})},{to:"/shipping/labels",label:"Histórico de Etiquetas",icon:e.jsx(Ur,{})}]},{to:"/produtos",label:"Produtos",icon:e.jsx(Xa,{})},{to:"/historico",label:"Histórico",icon:e.jsx(Xo,{})},{label:"Contatos",icon:e.jsx(Jo,{}),children:[{to:"/email-composer",label:"E-mail",icon:e.jsx(Qo,{})}]},{to:"/demo-subscribers",label:"Demo",icon:e.jsx(Ur,{})}],[]),i=async()=>{await t()};return e.jsxs(ui,{children:[e.jsxs(xi,{"aria-label":"Menu lateral",children:[e.jsx(gi,{children:e.jsx("img",{src:po,alt:"Logo Evolua"})}),e.jsx(mi,{children:n.map(l=>{if(l.children){const[c,p]=s.useState(!1);return e.jsxs("div",{style:{marginBottom:0},children:[e.jsxs(Kt,{as:"div",style:{cursor:"pointer",opacity:.95,userSelect:"none",position:"relative",display:"flex",alignItems:"center",paddingRight:0},onClick:()=>p(d=>!d),"aria-expanded":c,children:[e.jsx("span",{"aria-hidden":!0,children:l.icon}),e.jsx("span",{className:"label",children:l.label}),e.jsx("span",{style:{position:"absolute",right:18,top:"50%",transform:`translateY(-50%) ${c?"rotate(90deg)":"rotate(0deg)"}`,transition:"transform 0.28s cubic-bezier(.4,1.4,.6,1)",opacity:.7,fontSize:18,pointerEvents:"none",display:"flex",alignItems:"center",height:18},children:e.jsx("svg",{width:"18",height:"18",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M7 8l3 3 3-3",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]}),e.jsx("div",{style:{marginLeft:24,marginTop:0,marginBottom:0,maxHeight:c?80:0,overflow:"hidden",opacity:c?1:0,transition:"max-height 0.38s cubic-bezier(.4,1.4,.6,1), opacity 0.28s",background:"none",display:"flex",flexDirection:"column",gap:4},children:l.children.map(d=>e.jsxs(Kt,{to:d.to,style:{fontSize:15,padding:"8px 10px",marginBottom:0},children:[e.jsx("span",{"aria-hidden":!0,children:d.icon}),e.jsx("span",{className:"label",children:d.label})]},d.to))})]},l.label)}return e.jsxs(Kt,{to:l.to,children:[e.jsx("span",{"aria-hidden":!0,children:l.icon}),e.jsx("span",{className:"label",children:l.label})]},l.to)})}),e.jsxs(hi,{children:[e.jsx(bi,{children:a?.name||"Antonio Augusto"}),e.jsxs(fi,{onClick:i,children:[e.jsx(Zo,{}),e.jsx("span",{style:{marginLeft:8},children:"Sair"})]})]})]}),e.jsx(vi,{children:e.jsxs(yi,{children:[e.jsxs(ji,{children:[e.jsx(wi,{children:e.jsx(ci,{})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx(ri,{}),e.jsxs(ki,{children:[e.jsx(en,{})," ",a?.name||"Conectado"]})]})]}),e.jsx(Si,{children:e.jsx(Ga,{})},`${o.pathname}${o.search}${o.hash}`)]})})]})},Ci=X`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,$i=r.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 0;
`,Ai=r.div`
  border: 4px solid rgba(59,130,246,0.15);
  border-top: 4px solid var(--color-primary, #06b6d4);
  border-radius: 50%;
  width: 38px;
  height: 38px;
  animation: ${Ci} 0.8s linear infinite;
`,xo=()=>e.jsx($i,{children:e.jsx(Ai,{})}),Ei={getSummary(t={}){return J.get("/admin/dashboard/summary",{params:t}).then(a=>a.data)}},Ge=X`
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.98);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`,zi=X`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`,we=t=>t==null?"—":Number(t).toLocaleString("pt-BR"),Xt=t=>t==null?"—":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:2}).format(Number(t)),$t=t=>t==null?"—":`${Number(t).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})}%`,pt=(t,a=we)=>{if(t==null)return"—";const o=a(Math.abs(t));return`${t>=0?"+":"-"}${o}`},ta=t=>t?t.charAt(0).toUpperCase()+t.slice(1):"",Pi=X`
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.99);
  }
  70% {
    opacity: 1;
    transform: translateY(-4px) scale(1.005);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`,Li=r.div`
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 4vw, 32px);
  opacity: 0;
  animation: ${Pi} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  width: 100%;
  max-width: 1260px;
  margin: 0 auto;
  padding: 0 clamp(18px, 3vw, 28px);
`,Ti=r.header`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 28px;
  padding: clamp(22px, 3vw, 28px) clamp(24px, 3.4vw, 32px);
  border-radius: 26px;
  background:
    radial-gradient(160% 140% at 110% -30%, rgba(56, 189, 248, 0.22), transparent 60%),
    radial-gradient(140% 140% at -20% 120%, rgba(129, 140, 248, 0.18), transparent 58%),
    rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(148, 163, 184, 0.24);
  box-shadow: 0 26px 52px -36px rgba(15, 23, 42, 1);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(56, 189, 248, 0.12), transparent 45%);
    opacity: 0.4;
    pointer-events: none;
  }
`,Di=r.h1`
  font-size: clamp(1.65rem, 1.9vw, 2.15rem);
  color: var(--text);
  margin: 0;
  position: relative;
  z-index: 1;
`,Fi=r.p`
  color: var(--muted);
  font-size: clamp(0.9rem, 1vw, 0.98rem);
  max-width: 620px;
  position: relative;
  z-index: 1;
`,Ii=r.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 1;

  > * {
    opacity: 0;
    animation: ${Ge} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  > *:nth-child(1) { animation-delay: 0.05s; }
  > *:nth-child(2) { animation-delay: 0.12s; }
`,Ri=r.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 999px;
  background: linear-gradient(125deg, rgba(56, 189, 248, 0.18), rgba(129, 140, 248, 0.14));
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: rgba(226, 232, 240, 0.86);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: 0 12px 34px -20px rgba(14, 116, 144, 0.65);
  backdrop-filter: blur(6px);
`,Ni=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background: rgba(22, 163, 74, 0.18);
  border: 1px solid rgba(34, 197, 94, 0.45);
  box-shadow: 0 0 12px rgba(34, 197, 94, 0.35);
  position: relative;
`,Mi=X`
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(34, 197, 94, 0.55);
  }
  50% {
    transform: scale(1.35);
    opacity: 1;
    box-shadow: 0 0 16px rgba(34, 197, 94, 0.8);
  }
`,Pr=X`
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  60% {
    opacity: 1;
    transform: translateY(-4px) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`,Bi=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(120deg, #22c55e, #4ade80);
  color: #0f172a;
  animation: ${Mi} 2s ease-in-out infinite;
`,Oi=r.span`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  gap: 2px;
  font-size: 0.78rem;

  strong {
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(241, 245, 249, 0.92);
  }
`,qi=r.span`
  color: rgba(148, 163, 184, 0.85);
  font-size: 0.74rem;
`,ra=r.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: stretch;

  @media (min-width: 768px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
`,Qe=r.section`
  background: rgba(15, 23, 42, 0.58);
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  padding: clamp(18px, 3vw, 26px);
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 1);
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.2vw, 22px);
  grid-column: span 1;
  min-height: 100%;

  @media (min-width: 768px) {
    grid-column: span ${({$spanMd:t=6})=>Math.min(t,6)};
  }

  @media (min-width: 1200px) {
    grid-column: span ${({$spanLg:t=12})=>Math.min(t,12)};
  }
`,ut=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  > * {
    opacity: 0;
    animation: ${Ge} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  > *:nth-child(1) { animation-delay: 0.06s; }
  > *:nth-child(2) { animation-delay: 0.12s; }
`,xt=r.h2`
  font-size: clamp(0.96rem, 1.05vw, 1.02rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  margin: 0;
`,gt=r.span`
  color: rgba(226, 232, 240, 0.65);
  font-size: clamp(0.78rem, 0.92vw, 0.84rem);
`,Ui=r.div`
  display: grid;
  gap: clamp(14px, 2vw, 18px);
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`,Hi=r.article`
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: clamp(18px, 2.6vw, 22px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 16px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.65);
  opacity: 0;
  transform: translateY(18px) scale(0.98);
  animation: ${Pr} 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: border-color 0.26s ease, box-shadow 0.26s ease;
  will-change: transform, box-shadow;

  min-width: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(140deg, rgba(56, 189, 248, 0) 25%, rgba(14, 165, 233, 0.18) 75%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(56, 189, 248, 0.35);
  }

  &:hover::after {
    opacity: 1;
  }
  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.12s; }
  &:nth-child(3) { animation-delay: 0.19s; }
  &:nth-child(4) { animation-delay: 0.26s; }
`,Wi=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(226, 232, 240, 0.62);
  font-size: clamp(0.76rem, 0.92vw, 0.84rem);
`,Yi=r.strong`
  font-size: clamp(1.35rem, 2.05vw, 1.85rem);
  font-weight: 700;
`,Vi=r.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: clamp(0.76rem, 0.95vw, 0.82rem);
  font-weight: 600;
  color: ${({$direction:t})=>t==="up"?"#34d399":"#f87171"};
`,Gi=r.span`
  background: rgba(148,163,184,0.08);
  border-radius: 999px;
  padding: 6px 10px;
  color: rgba(226, 232, 240, 0.72);
  font-size: clamp(0.72rem, 0.9vw, 0.8rem);
`,Ki=r.ul`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin: 0;
  padding: 0;
`,Xi=r.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: clamp(320px, 55vh, 480px);
  overflow-y: auto;
  padding-right: 6px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.35);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.35);
    border-radius: 999px;
  }
`,Qi=r.li`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`,Ji=r.span`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: ${({$tone:t})=>t};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex-shrink: 0;
`,Zi=r.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`,el=r.strong`
  font-size: clamp(0.88rem, 1vw, 0.95rem);
`,aa=r.span`
  color: rgba(226, 232, 240, 0.6);
  font-size: clamp(0.74rem, 0.92vw, 0.82rem);
`,tl=r.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`,rl=r.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
`,al=r.div`
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.18);
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.12);
`,ol=r.div`
  position: absolute;
  inset: 0;
  width: ${({$progress:t})=>`${t}%`};
  background: ${({$gradient:t})=>t};
  transition: width 0.35s ease;
`,nl=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`,sl=r.div`
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.55);
  opacity: 0;
  transform: translateY(18px);
  animation: ${Pr} 0.72s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  transition: transform 0.26s ease, box-shadow 0.26s ease;
  will-change: transform, box-shadow;

  &:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 50px -28px rgba(15, 23, 42, 0.8);
  }

  &:nth-child(1) { animation-delay: 0.08s; }
  &:nth-child(2) { animation-delay: 0.16s; }
  &:nth-child(3) { animation-delay: 0.24s; }
`,il=r.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`,ll=r.span`
  color: ${({$variant:t})=>t==="ok"?"#34d399":t==="warn"?"#f59e0b":"#f87171"};
  font-weight: 600;
  font-size: clamp(0.78rem, 0.94vw, 0.84rem);
`,dl=r.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`,cl=r.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(0.8rem, 0.98vw, 0.86rem);
  color: rgba(226,232,240,0.78);
`,pl=r.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.72rem;
  color: ${({$variant:t})=>t==="warn"?"#f97316":"#10b981"};
  background: ${({$variant:t})=>t==="warn"?"rgba(251, 191, 36, 0.16)":"rgba(16, 185, 129, 0.16)"};
`,ul=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fecaca;
  border-radius: 14px;
  padding: 14px 18px;
`,xl=r.button`
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  background: rgba(248, 113, 113, 0.45);
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease;
  &:hover {
    transform: translateY(-1px);
  }
`,oa=r.div`
  color: rgba(226, 232, 240, 0.62);
  font-size: 0.9rem;
  padding: 12px 0;
`;r.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;r.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(148,163,184,0.12);
  border-radius: 16px;
  padding: 14px 16px;
`;r.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: clamp(0.78rem, 0.95vw, 0.86rem);
`;r.strong`
  font-size: clamp(0.86rem, 1vw, 0.95rem);
  display: block;
`;r.span`
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 999px;
  align-self: flex-start;
  background: rgba(34, 197, 94, 0.18);
  color: #34d399;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;const gl=r.div`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`,ml=r.button`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(160deg, rgba(45, 55, 72, 0.88), rgba(26, 32, 44, 0.92));
  color: rgba(226,232,240,0.9);
  font-weight: 600;
  font-size: clamp(0.86rem, 1vw, 0.94rem);
  cursor: pointer;
  transition: border 0.22s ease, transform 0.26s ease, background 0.26s ease, box-shadow 0.26s ease;
  box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.55);
  opacity: 0;
  transform: translateY(18px);
  animation: ${Pr} 0.74s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  will-change: transform, box-shadow;

  &:hover {
    border-color: rgba(56, 189, 248, 0.55);
    background: linear-gradient(160deg, rgba(45, 55, 72, 0.92), rgba(26, 32, 44, 0.98));
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 50px -28px rgba(15, 23, 42, 0.82);
  }

  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.12s; }
  &:nth-child(3) { animation-delay: 0.19s; }

  svg {
    font-size: 1.2rem;
    color: rgba(56, 189, 248, 0.85);
  }
`,hl=r.span`
  font-size: clamp(0.72rem, 0.9vw, 0.8rem);
  color: rgba(226, 232, 240, 0.7);
  font-weight: 400;
`,bl=()=>{const[t,a]=s.useState(null),[o,n]=s.useState(!1),[i,l]=s.useState(null),c=Pe(),p=s.useCallback(async()=>{n(!0),l(null);try{const m=await Ei.getSummary();a(m)}catch(m){console.error("Falha ao carregar dashboard:",m),l("Não foi possível carregar os dados do dashboard.")}finally{n(!1)}},[]);s.useEffect(()=>{p()},[p]);const d=s.useMemo(()=>{if(!t?.metrics)return[];const{metrics:m}=t;return[{key:"activeSubscribers",label:"Assinantes Ativos",value:we(m.activeSubscribers?.value??0),caption:"Variação líquida nos últimos 30 dias",deltaLabel:pt(m.activeSubscribers?.netChange??0,we),direction:(m.activeSubscribers?.netChange??0)>=0?"up":"down"},{key:"newSubscribers30d",label:"Novos Cadastros (30d)",value:we(m.newSubscribers30d?.value??0),caption:m.newSubscribers30d?.previous!==void 0?`Período anterior: ${we(m.newSubscribers30d.previous)}`:"Comparativo com janela anterior",deltaLabel:pt(m.newSubscribers30d?.deltaPercent??0,$t),direction:(m.newSubscribers30d?.deltaPercent??0)>=0?"up":"down"},{key:"churnRate30d",label:"Churn (30d)",value:$t(m.churnRate30d?.value??0),caption:`${we(m.churnRate30d?.cancellations??0)} cancelamentos no período`,deltaLabel:pt(m.churnRate30d?.deltaPercent??0,$t),direction:(m.churnRate30d?.deltaPercent??0)<=0?"up":"down"},{key:"monthlyRecurringRevenue",label:"MRR",value:Xt(m.monthlyRecurringRevenue?.value??0),caption:`Variação líquida: ${pt(m.monthlyRecurringRevenue?.deltaValue??0,Xt)}`,deltaLabel:pt(m.monthlyRecurringRevenue?.deltaPercent??0,$t),direction:(m.monthlyRecurringRevenue?.deltaPercent??0)>=0?"up":"down"}]},[t]),x=t?.activities??[],g=t?.planPerformance?.plans??[],u=t?.planPerformance?.totalActive??0;s.useMemo(()=>x.filter(m=>["aprovado","ativo","criado","reativado"].includes(m.action??"")).slice(0,5),[x]);const b=s.useMemo(()=>{if(!t?.generated_at)return null;const m=new Date(t.generated_at),A=ta(m.toLocaleDateString("pt-BR",{weekday:"long"})),I=ta(m.toLocaleDateString("pt-BR",{month:"long"})),D=`${m.getDate().toString().padStart(2,"0")} de ${I} de ${m.getFullYear()}`,$=m.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});return`${A}, ${D} às ${$}`},[t?.generated_at]),R=s.useMemo(()=>[{key:"add-subscriber",label:"Cadastrar Assinante",description:"Abra o fluxo completo de cadastro.",icon:e.jsx(rn,{}),to:"/assinantes/novo"},{key:"analisar-planos",label:"Gerenciar Planos",description:"Revise valores e benefícios atuais.",icon:e.jsx(an,{}),to:"/produtos"},{key:"relatorio-diario",label:"Relatório Diário",description:"Exportar métricas de hoje em CSV.",icon:e.jsx(on,{}),to:"/historico"}],[c]),y=s.useMemo(()=>{const m=t?.health?.demoPending?.count??0,A=t?.health?.separationBacklog?.pending??0,I=t?.health?.separationBacklog?.in_progress??0,D=t?.health?.unreadNotifications?.count??0,$=A+I;return[{title:"Onboarding & Demo",status:m===0?"Operacional":"Atenção moderada",variant:m===0?"ok":"warn",icon:e.jsx(mr,{color:m===0?"#34d399":"#f59e0b"}),items:[{label:`${we(m)} solicitações aguardando ativação completa`,variant:m===0?"ok":"warn"}]},{title:"Fila de Separação",status:$===0?"Sem fila":$>10?"Atenção alta":"Dentro do esperado",variant:$===0?"ok":$>10?"critical":"warn",icon:e.jsx(Qa,{color:$===0?"#34d399":"#f59e0b"}),items:[{label:`${we(A)} aguardando início`,variant:A>5?"warn":"ok"},{label:`${we(I)} em separação neste momento`,variant:I>5?"warn":"ok"}]},{title:"Alertas & Comunicação",status:D===0?"Nenhum alerta crítico":"Há alertas pendentes",variant:D===0?"ok":"warn",icon:e.jsx(nn,{color:D===0?"#38bdf8":"#f59e0b"}),items:[{label:`${we(D)} notificações administrativas não lidas`,variant:D===0?"ok":"warn"}]}]},[t]);return e.jsxs(Li,{children:[e.jsxs(Ti,{children:[e.jsxs(Ii,{children:[e.jsx(Di,{children:"Central Operacional Evolua"}),e.jsx(Fi,{children:"Acompanhe desempenho, receita recorrente e alertas críticos em um único lugar."})]}),b&&e.jsxs(Ri,{children:[e.jsx(Ni,{children:e.jsx(Bi,{children:e.jsx(sn,{})})}),e.jsxs(Oi,{children:[e.jsx("strong",{children:"Online"}),e.jsx(qi,{children:b})]})]})]}),i&&e.jsxs(ul,{children:[e.jsx("span",{children:i}),e.jsx(xl,{type:"button",onClick:p,children:"Tentar novamente"})]}),o&&!t?e.jsx(ra,{children:e.jsx(Qe,{$spanMd:6,$spanLg:12,children:e.jsx(xo,{})})}):e.jsxs(ra,{children:[e.jsxs(Qe,{$spanMd:6,$spanLg:12,children:[e.jsxs(ut,{children:[e.jsx(xt,{children:"Visão Geral Executiva"}),e.jsx(gt,{children:"Indicadores-chave com comparação ao período anterior"})]}),e.jsx(Ui,{children:d.map(m=>e.jsxs(Hi,{children:[e.jsxs(Wi,{children:[e.jsx("span",{children:m.label}),e.jsxs(Vi,{$direction:m.direction,children:[m.direction==="up"?e.jsx(ln,{}):e.jsx(dn,{}),m.deltaLabel]})]}),e.jsx(Yi,{children:m.value}),e.jsx(Gi,{children:m.caption})]},m.key))})]}),e.jsxs(Qe,{$spanMd:6,$spanLg:8,children:[e.jsxs(ut,{children:[e.jsx(xt,{children:"Performance de Produtos & Planos"}),e.jsxs(gt,{children:["Participação na base ativa (",we(u)," assinantes) e receita estimada"]})]}),g.length===0?e.jsx(oa,{children:"Nenhum plano ativo para exibir."}):e.jsx(tl,{children:g.map(m=>e.jsxs("div",{children:[e.jsxs(rl,{children:[e.jsxs("span",{children:[e.jsx("strong",{children:m.product_name})," · ",Xt(m.revenue)]}),e.jsxs("span",{children:[m.share?.toLocaleString("pt-BR",{maximumFractionDigits:1})??"0","%"]})]}),e.jsx(al,{children:e.jsx(ol,{$progress:m.share??0,$gradient:"linear-gradient(90deg, #38B2AC, #0EA5E9)"})})]},`${m.product_id??"sem-id"}`))})]}),e.jsxs(Qe,{$spanMd:6,$spanLg:6,children:[e.jsxs(ut,{children:[e.jsx(xt,{children:"Saúde Operacional"}),e.jsx(gt,{children:"Alertas e pendências que podem afetar a continuidade do serviço"})]}),e.jsx(nl,{children:y.map(m=>e.jsxs(sl,{children:[e.jsxs(il,{children:[m.icon,e.jsxs("div",{children:[e.jsx("span",{children:m.title}),e.jsx("br",{}),e.jsx(ll,{$variant:m.variant,children:m.status})]})]}),e.jsx(dl,{children:m.items.map(A=>e.jsxs(cl,{children:[A.variant==="warn"?e.jsx(Hr,{color:"#f97316"}):e.jsx(mr,{color:"#22c55e"}),e.jsx("span",{children:A.label}),e.jsx(pl,{$variant:A.variant,children:A.variant==="warn"?"atenção":"ok"})]},A.label))})]},m.title))})]}),e.jsxs(Qe,{$spanMd:6,$spanLg:6,children:[e.jsxs(ut,{children:[e.jsx(xt,{children:"Atalhos Rápidos"}),e.jsx(gt,{children:"Acesse as rotinas mais usadas em poucos cliques"})]}),e.jsx(gl,{children:R.map(m=>e.jsxs(ml,{type:"button",onClick:()=>c(m.to),children:[m.icon,e.jsx("span",{children:m.label}),e.jsx(hl,{children:m.description})]},m.key))})]}),e.jsxs(Qe,{$spanMd:6,$spanLg:12,children:[e.jsxs(ut,{children:[e.jsx(xt,{children:"Atividades Recentes"}),e.jsx(gt,{children:"Últimas movimentações registradas no sistema"})]}),x.length===0?e.jsx(oa,{children:"Nenhum log recente disponível."}):e.jsx(Xi,{children:e.jsx(Ki,{children:x.map(m=>{const A=m.action==="cancelado"?"rgba(248,113,113,0.35)":m.action==="suspenso"?"rgba(250,204,21,0.35)":"rgba(52,211,153,0.35)",I=m.action==="cancelado"?e.jsx(cn,{}):m.action==="suspenso"?e.jsx(Hr,{}):e.jsx(pn,{});return e.jsxs(Qi,{children:[e.jsx(Ji,{$tone:A,children:I}),e.jsxs(Zi,{children:[e.jsx(el,{children:m.title}),e.jsx(aa,{children:m.description}),m.relative_time&&e.jsx(aa,{children:m.relative_time})]})]},`${m.id}-${m.occurred_at}`)})})})]})]})]})},fl=()=>J.get("/admin/subscribers/counts").then(t=>t.data),vl=t=>J.post("/admin/subscribers",t),yl=(t,a,o)=>J.put(`/admin/subscribers/${t}/status`,{status:a,action:a,reason:o}),jl=(t,a,o,n)=>{const i={};if(a!=null&&`${a}`!=""){const l=Number(a);Number.isFinite(l)&&(i.products_id=l)}if(o!=null&&`${o}`!=""){const l=Number(o);Number.isFinite(l)&&(i.amount=l)}if(n!=null&&`${n}`!=""){const l=Number(n);Number.isFinite(l)&&(i.order_id=l)}return J.post(`/admin/subscribers/${t}/orders`,i)},go=t=>J.get(`/admin/subscribers/${t}`),wl=t=>J.delete(`/admin/subscribers/${t}`),Re={getAll:(t={})=>{const{page:a=1,limit:o=15,...n}=t||{},i={page:a,limit:o,unique:1,...n};return J.get("/admin/subscribers",{params:i})},updateStatusAssinatura:yl,createOrderForUser:jl,getAssinanteById:go,deleteAssinante:wl,getCounts:fl},Mt=async t=>{if(!t)return null;const a=new FormData;return a.append("file",t),(await J.post("/admin/upload",a,{headers:{"Content-Type":"multipart/form-data"}})).data.filePath},mo=(t=1,a={key:"id",direction:"desc"})=>{const o=new URLSearchParams({page:t,sort:a.key,order:a.direction});return J.get(`/admin/products?${o.toString()}`)},kl=t=>J.get(`/admin/products/${t}`),Sl=async(t,a,o)=>{const n=await Mt(a),i=await Mt(o),l={...t,image:n,video:i};return J.post("/admin/products",l)},_l=async(t,a,o,n)=>{const i={...a};return o&&(i.image=await Mt(o)),n&&(i.video=await Mt(n)),J.put(`/admin/products/${t}`,i)},Cl=t=>J.delete(`/admin/products/${t}`),ho=()=>J.get("/admin/products/plans"),$l=r(pe)`
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--color-primary);
  color: var(--color-bg-dark);
  font-weight: 600;
  cursor: pointer;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--accent-d);
  }
`,Al=r.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`,Lr=r.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;

  > * {
    opacity: 0;
    animation: ${Ge} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }

  ${Array.from({length:12}).map((t,a)=>`
    > *:nth-child(${a+1}) {
      animation-delay: ${.05*(a+1)}s;
    }
  `).join("")}

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`,El=r.span`
  background-color: var(--badge-bg, var(--border));
  color: ${({$isActive:t})=>t?"var(--color-bg-dark)":"var(--color-primary)"};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  margin-left: 0.8rem;
  transition: all 0.3s ease-in-out;
`,zl=r.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #f87171, #ef4444);
  color: #fff8f8;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.45);
  pointer-events: none;
`,Pl=r.button.withConfig({shouldForwardProp:t=>!["active","isActive","$active","$isActive","highlightCount","$highlightCount"].includes(t)})`
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  background-color: ${({$isActive:t})=>t?"var(--color-primary)":"transparent"};
  color: ${({$isActive:t})=>t?"var(--color-bg-dark)":"var(--color-text-muted)"};
  border: 2px solid ${({$isActive:t})=>t?"var(--color-primary)":"var(--border)"};
  border-radius: 10px;
  padding: 0.6rem 1.2rem;
  min-height: 40px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  position: relative;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-text-light);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--accent-d);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.9rem;
    min-height: 38px;
  }
`,Ne=({onClick:t,active:a,isActive:o,$active:n,count:i,highlightCount:l=0,children:c,...p})=>{const d=o??a??n??!1,{type:x="button",...g}=p;return e.jsxs(Pl,{onClick:t,$isActive:d,type:x,...g,children:[l>0&&e.jsx(zl,{children:l}),c,typeof i=="number"&&e.jsx(El,{$isActive:d,children:i})]})};function Ll({filters:t,counts:a,activeFilter:o,onFilterClick:n}){return e.jsx(Lr,{children:t.map(({key:i,label:l})=>e.jsx(Ne,{isActive:o===i,onClick:()=>n(i),count:a[i]??0,highlightCount:i==="solicitacoes"?a[i]??0:0,children:l},i))})}const Tl=r.div`
  position: relative;
  width: 100%;
  max-width: 320px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`,Dl=r.button`
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: color 0.2s ease;
  z-index: 2; /* garantir que fica acima do input */
  &:hover { color: var(--accent); }
  &:focus { outline: 2px solid rgba(157,217,210,0.35); border-radius: 8px; }
`,bo=r.input`
  width: 100%;
  background-color: var(--sidebar);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px 12px 48px;
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  &::placeholder { color: var(--muted); }
  &:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-d); }
`,Fl=r.button`
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--sidebar);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 3; /* Adicionado para garantir que fique sobre outros elementos */

  &:hover { background: var(--accent-d); border-color: var(--accent-d); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`,Il=r(bo)`
  padding-right: 110px; /* Abre espaço para o botão */
`,Tr=({value:t,onChange:a,onSearch:o,onKeyDown:n,placeholder:i,inputRef:l,disabled:c=!1,id:p=null,name:d=null,showSearchButton:x=!1})=>{const g=s.useId(),u=p||`search-${g}`,b=d||"q",R=x?Il:bo;return e.jsxs(Tl,{children:[e.jsx(Dl,{type:"button","aria-label":"Pesquisar",onClick:o,children:e.jsx(un,{})}),e.jsx(R,{id:u,name:b,type:"text",placeholder:i||"Pesquisar...",value:t??"",onChange:a,onKeyDown:n,ref:l,disabled:c}),x&&e.jsx(Fl,{onClick:o,disabled:c,children:"Buscar"})]})},Rl=r.div`
  width: 100%;
  overflow-x: auto;
`,Nl=r.table`
  width: 100%;
  min-width: 780px;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--text);
  font-size: 0.95rem;
  border: 1px solid var(--border);
  border-radius: calc(var(--radius) - 4px);
  background-color: rgba(15, 23, 42, 0.45);
  overflow: hidden;

  thead tr {
    background: rgba(148, 163, 184, 0.08);
  }

  thead th:first-child {
    border-top-left-radius: calc(var(--radius) - 6px);
  }

  thead th:last-child {
    border-top-right-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: calc(var(--radius) - 6px);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`,De=r.th`
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--muted);
  user-select: none;

  &.acoes {
    text-align: center;
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 0.82rem;
  }
`;r.th`
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid var(--border);
`;r.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-weight: 600;
`;const Ml=r.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--success, #10b981);
  color: var(--on-success, #0b1220);
`;function Bl({children:t}){return e.jsx(Ml,{children:t})}const Ol=r.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--warning, #f59e0b);
  color: var(--on-warning, #0b1220);
`;function ql({children:t}){return e.jsx(Ol,{children:t})}const Ul=r.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--danger, #ef4444);
  color: var(--on-danger, #0b1220);
`;function Hl({children:t}){return e.jsx(Ul,{children:t})}const Wl=r.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1;
  letter-spacing: 0.02em;
  background: var(--info, #60a5fa);
  color: var(--on-info, #0b1220);
`;function Yl({children:t}){return e.jsx(Wl,{children:t})}const Vl=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding-bottom: 1rem;
`,mt=r.button`
  background-color: ${t=>t.$active?"var(--color-primary-ciano)":"#2d3748"};
  color: ${t=>t.$active?"var(--color-card-bg)":"var(--color-text-light)"};
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: var(--color-primary-ciano);
    color: var(--color-text-light);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,na=r.span`
  margin: 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
`,qt=({currentPage:t,totalPages:a,onPageChange:o})=>{if(a<=1)return null;const n=[],i=5;let l,c;a<=i?(l=1,c=a):t<=Math.ceil(i/2)?(l=1,c=i):t+Math.floor(i/2)>=a?(l=a-i+1,c=a):(l=t-Math.floor(i/2),c=t+Math.floor(i/2));for(let p=l;p<=c;p++)n.push(p);return e.jsxs(Vl,{children:[e.jsx(mt,{onClick:()=>o(t-1),disabled:t===1,children:"Anterior"}),l>1&&e.jsx(mt,{onClick:()=>o(1),children:"1"}),l>2&&e.jsx(na,{children:"..."}),n.map(p=>e.jsx(mt,{$active:p===t,onClick:()=>o(p),children:p},`page-${p}`)),c<a-1&&e.jsx(na,{children:"..."}),c<a&&e.jsx(mt,{onClick:()=>o(a),children:a}),e.jsx(mt,{onClick:()=>o(t+1),disabled:t===a,children:"Próxima"})]})},Gl=X`from { opacity: 0; } to { opacity: 1; }`,Kl=X`from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; }`,Xl=r.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.7); display: flex;
  justify-content: center; align-items: center; z-index: 1000;
  animation: ${Gl} 0.3s ease;
`,Ql=r.div`
  background-color: #2d3748; padding: 2rem; border-radius: 15px;
  width: 450px; max-width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${Kl} 0.4s ease-out; text-align: center;
`,Jl=r.div`
  display: flex; flex-direction: column; align-items: center; margin-bottom: 1rem;
`,Zl=r.div`color: #f6ad55; font-size: 3rem; margin-bottom: 1rem;`,ed=r.h2`margin: 0; color: #fff; font-size: 1.5rem;`,td=r.p`color: #a0aec0; font-size: 1rem; line-height: 1.5; margin: 0;`,sa=r.div`
  margin-top: 1.25rem;
  text-align: left;
`,ia=r.label`
  display: block;
  color: #cbd5e0;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`,rd=r.select`
  width: 100%;
  background-color: #1a202c;
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus { border-color: #9dd9d2; box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3); outline: none; }
`,ad=r.input`
  width: 100%;
  background-color: #1a202c;
  border: 1px solid ${t=>t.$invalid?"#f56565":"#4a5568"};
  border-radius: 8px;
  padding: 0.65rem 0.8rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  box-sizing: border-box;
  &:focus { border-color: ${t=>t.$invalid?"#f56565":"#9dd9d2"}; box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3); outline: none; }
`,od=r.div`
  color: #f56565;
  font-size: 0.85rem;
  margin-top: 0.4rem;
`,nd=r.div`display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;`,fo=r.button`
  border: none; border-radius: 8px; padding: 0.8rem 1.5rem;
  font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); }
`,sd=r(fo)`
  background-color: #4a5568; color: #fff; &:hover { background-color: #718096; }
`,id=r(fo)`
  background-color: ${t=>t.$confirmButtonColor||"#e53e3e"};
  color: #fff;
  &:hover { 
    background-color: ${t=>t.$confirmButtonHoverColor||"#c53030"};
  }
`,ld=[{value:"pagamento_atrasado",label:"Pagamento atrasado"},{value:"pedido_do_cliente",label:"Pedido do cliente"},{value:"problema_no_cartao",label:"Problema no cartão"},{value:"ajuste_administrativo",label:"Ajuste administrativo"},{value:"uso_irregular",label:"Uso irregular"},{value:"outros",label:"Outros"}],dd=({isOpen:t,onClose:a,onConfirm:o,title:n,message:i,confirmButtonText:l="Confirmar",confirmButtonColor:c,confirmButtonHoverColor:p,reasons:d,showOtherInputLabel:x="Descreva o motivo",requireOtherText:g=!1})=>{const u=s.useMemo(()=>Array.isArray(d)&&d.length?d:ld,[d]),[b,R]=s.useState(u[0]?.value||""),[y,m]=s.useState("");s.useEffect(()=>{t||setTimeout(()=>{R(u[0]?.value||""),m("")},200)},[t,u]);const A=b==="outros"?y?.trim()?`outros: ${y.trim()}`:"outros":b,I=()=>{o(A)},D=E=>{E.target===E.currentTarget&&a()},$=s.useMemo(()=>b!=="outros"||!g?!1:!(y&&y.trim().length>0),[b,y,g]);return t?e.jsx(Xl,{onClick:D,children:e.jsxs(Ql,{children:[e.jsxs(Jl,{children:[e.jsx(Zl,{children:e.jsx(Ja,{})}),e.jsx(ed,{children:n})]}),e.jsx(td,{children:i}),e.jsxs(sa,{children:[e.jsx(ia,{htmlFor:"reason-select",children:"Motivo"}),e.jsx(rd,{id:"reason-select",value:b,onChange:E=>R(E.target.value),children:u.map(E=>e.jsx("option",{value:E.value,children:E.label},E.value))})]}),b==="outros"&&e.jsxs(sa,{children:[e.jsxs(ia,{htmlFor:"reason-other",children:[x,g?" (obrigatório)":""]}),e.jsx(ad,{id:"reason-other",placeholder:g?"Escreva o motivo para confirmar":"Especifique o motivo",value:y,onChange:E=>m(E.target.value),$invalid:g&&(!y||!y.trim()),"aria-invalid":g&&(!y||!y.trim()),"aria-describedby":g?"reason-other-error":void 0}),g&&(!y||!y.trim())&&e.jsx(od,{id:"reason-other-error",children:"Por favor, descreva o motivo para continuar."})]}),e.jsxs(nd,{children:[e.jsx(sd,{onClick:a,children:"Cancelar"}),e.jsx(id,{onClick:I,$confirmButtonColor:c,$confirmButtonHoverColor:p,disabled:$,title:$?"Descreva o motivo para confirmar":void 0,children:l})]})]})}):null},cd=X`
  from { opacity: 0; }
  to { opacity: 1; }
`,pd=X`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`,ud=r.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${cd} 0.3s ease;
`,xd=r.div`
  background-color: #2d3748;
  padding: 2rem;
  border-radius: 15px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${pd} 0.4s ease-out;
  text-align: center;
`,gd=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`,md=r.div`
  color: #f6ad55; /* Laranja de alerta */
  font-size: 3rem;
  margin-bottom: 1rem;
`,hd=r.h2`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`,bd=r.p`
  color: #a0aec0;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
`,fd=r.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`,vo=r.button`
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`,vd=r(vo)`
  background-color: #4a5568;
  color: #fff;
  &:hover { background-color: #718096; }
`,yd=r(vo)`
  background-color: #e53e3e; /* Vermelho de perigo */
  color: #fff;
  &:hover { background-color: #c53030; }
`,yo=({isOpen:t,onClose:a,onConfirm:o,title:n,message:i})=>t?e.jsx(ud,{onClick:a,children:e.jsxs(xd,{onClick:l=>l.stopPropagation(),children:[e.jsxs(gd,{children:[e.jsx(md,{children:e.jsx(Ja,{})}),e.jsx(hd,{children:n})]}),e.jsx(bd,{children:i}),e.jsxs(fd,{children:[e.jsx(vd,{onClick:a,children:"Cancelar"}),e.jsx(yd,{onClick:o,children:"Confirmar"})]})]})}):null,la=r.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
  width: 100%;
  min-width: 0;
`;he`
  height: 32px;
  padding: 0.13rem 0.7rem 0.13rem 0.5rem;
  font-size: 0.87rem;
  border-radius: 12px;
  min-width: 0;
  font-weight: 600;
  svg { margin-right: 0.5em; font-size: 1.1em; }
  @media (max-width: 768px) {
    font-size: 0.81rem;
    padding: 0.13rem 0.5rem 0.13rem 0.4rem;
    border-radius: 10px;
  }
`;const Ut=he`
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.11rem 0.36rem;
  min-width: 62px;
  font-size: 0.68rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  white-space: nowrap;
  border: 2px solid var(--border);
  color: var(--color-bg-dark);
  background-color: var(--color-primary);
  &:hover { border-color: var(--color-primary); transform: translateY(-2px); }
  &:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  @media (max-width: 1200px) {
    font-size: 0.62rem;
    padding: 0.09rem 0.22rem;
    min-width: 48px;
    height: 20px;
  }
  @media (max-width: 768px) {
    font-size: 0.59rem;
    padding: 0.07rem 0.16rem;
    min-width: 38px;
    height: 18px;
  }
`;r.button`
  ${Ut}
  background: transparent;
  color: #34d399;
  border-color: #34d399;
  &:hover { background: rgba(52, 211, 153, .12); }
`;r.button`
  ${Ut}
  background: transparent;
  color: #34d399;
  border-color: #34d399;
  &:hover {
    background: rgba(52, 211, 153, .12);
    color: #fff;
  }
`;r.button`
  ${Ut}
  background: transparent;
  color: #f59e0b;
  border-color: #f59e0b;
  &:hover {
    background: rgba(245, 158, 11, .12);
    color: #fff;
  }
`;r.button`
  ${Ut}
  background: transparent;
  color: #ef4444;
  border-color: #ef4444;
  &:hover {
    background: rgba(239, 68, 68, .12);
    color: #fff;
  }
`;const Se=r.td`
  position: relative;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
  font-size: 0.95rem;
  line-height: 1.45;
  vertical-align: middle;
  transition: background 0.18s ease, border-color 0.18s ease;

  &.acoes {
    text-align: center;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`,jd=r.div.withConfig({shouldForwardProp:t=>!["align","compactOnNarrow"].includes(t)})`
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: ${({align:t})=>t==="end"?"flex-end":t==="center"?"center":"flex-start"};
  flex-wrap: ${({compactOnNarrow:t})=>t?"wrap":"nowrap"};
  @media (max-width: 1200px) {
    flex-wrap: wrap;
  }
`,Bt={primary:{bg:"var(--color-primary, #06b6d4)",hover:"#0891b2",textOn:"#fff"},warning:{bg:"#fbbf24",hover:"#f59e42",textOn:"#1e293b"},danger:{bg:"#ef4444",hover:"#dc2626",textOn:"#fff"},success:{bg:"#22c55e",hover:"#16a34a",textOn:"#fff"}},wd=t=>{const a=Bt[t]||Bt.primary;return he`
    background: ${a.bg};
    color: ${a.textOn};
    &:hover, &:focus-visible { background: ${a.hover}; }
  `},kd=t=>{const a=Bt[t]||Bt.primary;return he`
    background: color-mix(in srgb, ${a.bg} 12%, transparent);
    color: color-mix(in srgb, ${a.bg} 80%, #0f172a);
    border: 1px solid color-mix(in srgb, ${a.bg} 35%, transparent);
    &:hover, &:focus-visible {
      background: color-mix(in srgb, ${a.bg} 18%, transparent);
      border-color: color-mix(in srgb, ${a.bg} 50%, transparent);
    }
  `},At=r.button.withConfig({shouldForwardProp:t=>!["size","variant","tone","pill"].includes(t)})`
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  height: ${({size:t})=>t==="xs"?"24px":t==="sm"?"28px":"36px"};
  padding: ${({size:t})=>t==="xs"?"0 8px":"0 10px"};
  border-radius: ${({pill:t})=>t?"9999px":"10px"};
  font-weight: 600;
  font-size: ${({size:t})=>t==="xs"?"0.78rem":t==="sm"?"0.86rem":"0.95rem"};
  border: ${({tone:t})=>t==="soft"?"1px solid transparent":"none"};
  outline: none;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s, transform 0.18s;
  ${({tone:t,variant:a})=>t==="soft"?kd(a):wd(a)}
  &:hover {
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 10px rgba(15, 23, 42, 0.12);
  }
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(6,182,212,0.25), 0 4px 10px rgba(15, 23, 42, 0.12);
    z-index: 2;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.2);
  }
  @media (max-width: 768px) {
    height: ${({size:t})=>t==="xs"?"22px":"26px"};
    font-size: ${({size:t})=>t==="xs"?"0.74rem":"0.82rem"};
    padding: ${({size:t})=>t==="xs"?"0 7px":"0 8px"};
  }
`,Et=r.span.withConfig({shouldForwardProp:t=>!["hideBelow"].includes(t)})`
  @media (max-width: ${({hideBelow:t})=>t||"0px"}) {
    display: none;
  }
`,zt=r.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.9em;
`;function da({onView:t,onSuspend:a,onCancel:o,onReactivate:n,size:i="sm",align:l="end",compactOnNarrow:c=!0,labels:p={},ariaContext:d="",disabled:x={},loading:g={},hideLabelsBelow:u,tone:b="solid",pill:R=!1,tones:y={}}){return e.jsxs(jd,{align:l,compactOnNarrow:c,children:[t&&e.jsxs(At,{size:i,variant:"primary",tone:y.view||b,pill:R,"aria-label":`Ver detalhes de ${d}`,title:p.view||"Ver Detalhes",onClick:t,tabIndex:0,type:"button",disabled:x.view||g.view,children:[e.jsx(zt,{children:e.jsx(Za,{"aria-hidden":"true"})}),e.jsx(Et,{hideBelow:u,children:p.view||"Ver Detalhes"})]}),a&&e.jsxs(At,{size:i,variant:"warning",tone:y.suspend||b,pill:R,"aria-label":`Suspender assinatura de ${d}`,title:p.suspend||"Suspender",onClick:a,tabIndex:0,type:"button",disabled:x.suspend||g.suspend,children:[e.jsx(zt,{children:e.jsx(xn,{"aria-hidden":"true"})}),e.jsx(Et,{hideBelow:u,children:p.suspend||"Suspender"})]}),o&&e.jsxs(At,{size:i,variant:"danger",tone:y.cancel||b,pill:R,"aria-label":`Cancelar assinatura de ${d}`,title:p.cancel||"Cancelar",onClick:o,tabIndex:0,type:"button",disabled:x.cancel||g.cancel,children:[e.jsx(zt,{children:e.jsx(gn,{"aria-hidden":"true"})}),e.jsx(Et,{hideBelow:u,children:p.cancel||"Cancelar"})]}),n&&e.jsxs(At,{size:i,variant:"success",tone:y.reactivate||b,pill:R,"aria-label":`Reativar assinatura de ${d}`,title:p.reactivate||"Reativar",onClick:n,tabIndex:0,type:"button",disabled:x.reactivate||g.reactivate,children:[e.jsx(zt,{children:e.jsx(mn,{"aria-hidden":"true"})}),e.jsx(Et,{hideBelow:u,children:p.reactivate||"Reativar"})]})]})}const jo="demo-subscribers:v1";let ze=[];const br=new Set;function ot(){return new Date().toISOString()}function wo(){return typeof window<"u"?window:void 0}function ko(){const t=wo();return t?t.localStorage:void 0}function it(){if(ze.length>0)return ze;try{const t=ko();if(!t)return ze;const a=t.getItem(jo);if(!a)return ze;const o=JSON.parse(a);if(Array.isArray(o)){const{list:n,changed:i}=Sd(o);ze=n,i&&Ht(n)}}catch(t){console.warn("[demoSubscribersStore] readStore failed",t)}return ze}function Sd(t){if(!Array.isArray(t)||t.length===0)return{list:Array.isArray(t)?t:[],changed:!1};let a=!1;return{list:t.map(n=>{if(!n||typeof n!="object")return n;const i=Array.isArray(n.history)?n.history:[],l=i.filter(u=>u?.type!=="status:reset");l.length!==i.length&&(a=!0);const c=jt(n.email);c&&n.emailKey!==c&&(a=!0);const p=new Set(["pending","active","suspended","cancelled"]),d=[...l].reverse().find(u=>{if(!u||typeof u.type!="string"||!u.type.startsWith("status:"))return!1;const b=u.type.slice(7);return p.has(b)}),x=d?d.type.slice(7):null,g={...n,history:l,emailKey:c};return x&&p.has(x)&&x!==n.status&&(g.status=x),(g.status!==n.status||g.emailKey!==n.emailKey||g.history!==n.history)&&(a=!0),g}),changed:a}}function jt(t){return(t||"").trim().toLowerCase()}function Ht(t){ze=Array.isArray(t)?t:[];try{const o=ko();o&&o.setItem(jo,JSON.stringify(ze))}catch(o){console.warn("[demoSubscribersStore] writeStore failed",o)}br.forEach(o=>{try{o(ze)}catch(n){console.error(n)}});const a=wo();a&&typeof a.dispatchEvent=="function"&&a.dispatchEvent(new CustomEvent("demo-subscribers:changed"))}function _d(){return typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID():`demo-${Date.now()}-${Math.floor(Math.random()*1e6)}`}const So={pending:"Aguardando aprovação",active:"Ativo",suspended:"Suspenso",cancelled:"Cancelado"},ca={"evolua-petit":{toys:["Kit Motor Fino","Blocos Magnéticos","Painel Sensorial"],videos:["Introdução ao Kit Petit","Como organizar o espaço do bebê"]},"evolua-bebe":{toys:["Cubos de Textura","Mesa Musical","Livro de Tecido Interativo"],videos:["Tour pelo Kit Bebê","Atividades guiadas pelo terapeuta"]},default:{toys:["Kit Sensório-Motor","Brinquedo Interativo de Luzes"],videos:["Boas vindas ao Evolua","Dicas para pais e cuidadores"]}};function _o(t){return So[t]||t}function Cd(){return[...it()]}function Co(t){return typeof t!="function"?()=>{}:(br.add(t),()=>br.delete(t))}function $d(t){const a=it(),o=_d(),n=t?.plan,i=ca[n]||ca.default,l=jt(t?.email),c={id:o,status:"pending",createdAt:ot(),updatedAt:ot(),name:t?.name?.trim()||"Assinante Demo",email:t?.email?.trim()||"",emailKey:l,phone:t?.phone?.trim()||"",plan:n,planLabel:t?.planLabel||n,childName:t?.childName?.trim()||"",childAgeLabel:t?.childAgeLabel||"",address:t?.address||{},notes:t?.notes,toys:i.toys,videos:i.videos,history:[{at:ot(),type:"created",description:"Cadastro enviado e aguardando aprovação."}]};return Ht([...a,c]),c}function Ad(t,a,o={}){if(!["pending","active","suspended","cancelled"].includes(a))return console.warn("[demoSubscribersStore] Status inválido recebido:",a),null;const i=it();let l=null,c=!1;const p=i.map(d=>{if(d.id!==t)return d;const x=Array.isArray(d.history)?d.history:[];return d.status===a&&!o.forceHistory?(l=d,d):(c=!0,l={...d,status:a,updatedAt:ot(),history:[...x,{at:ot(),type:`status:${a}`,description:o.description||So[a]||a}]},l)});return l?(c&&Ht(p),l):null}function Ed(t){if(!t)return null;const a=jt(t);return it().find(o=>(o.emailKey||jt(o.email))===a)||null}function zd(t,a,o={}){if(!t)return null;const n=Ed(t);return n?Ad(n.id,a,o):null}function Pd(t,a){const o=it();let n=null;const i=o.map(l=>{if(l.id!==t)return l;const c=typeof a?.email=="string"?a.email:l.email;return n={...l,...a,email:c,emailKey:jt(c),updatedAt:ot()},n});return n?(Ht(i),n):null}function $o(t,a){if(!t||!a||typeof a!="object")return null;const o=fr(t);if(!o)return null;const n={...o.metadata||{},...a};return Pd(t,{metadata:n})}function fr(t){return it().find(a=>a.id===t)||null}const Ld=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`,Td=r.p`
  color: var(--muted);
  margin: 4px 0 0;
`,Dd=r.div`
  display: inline-flex;
  gap: 8px;
  align-items: center;

  /* Igualar larguras em desktop */
  > div, > button {
    width: 220px;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;

    > div, > button { width: 100%; }
  }
`,Je=r.tr`
  transition: background 0.18s ease;

  &:nth-child(even) td {
    background-color: rgba(148, 163, 184, 0.03);
  }

  @media (hover: hover) {
    &:hover td {
      background-color: rgba(56, 178, 172, 0.1);
      border-color: rgba(56, 178, 172, 0.28);
    }
  }
`;function Fd(){const t=Pe(),[a,o]=s.useState([]),[n,i]=s.useState(1),[l,c]=s.useState("todos"),[p,d]=s.useState(""),[x,g]=s.useState(""),[u,b]=s.useState(!1),[R,y]=s.useState(null),[m,A]=s.useState(null),[I,D]=s.useState(!1),[$,E]=s.useState(null),[L,H]=s.useState(!1),[f,B]=s.useState(null),[Z,T]=s.useState({}),{showToast:q,toast:O,exit:P}=uo(),C=s.useCallback(h=>{if(!h)return"";const U=[h.user_email,h.email,h.customer_email,h.billing_email,h.login].find(ee=>typeof ee=="string"&&ee.trim().length>0);return U?U.trim():""},[]),j=s.useCallback((h,Y,U)=>{if(!Y)return;const ee=typeof h=="string"?h:C(h);if(ee)try{const te=zd(ee,Y,{description:U});if(te&&typeof h=="object"&&h){const se={};h.user_id&&(se.backendUserId=String(h.user_id)),h.order_id&&(se.backendOrderId=String(h.order_id)),h.id&&(se.backendLegacyId=String(h.id)),Object.keys(se).length>0&&$o(te.id,se)}}catch(te){console.warn("[AssinantesPage] Falha ao sincronizar status demo",te)}},[C]);s.useEffect(()=>{const h=setTimeout(()=>g(p),450);return()=>clearTimeout(h)},[p]);const _=s.useMemo(()=>{const h=Array.isArray(a)?a:[],Y=Q=>String(Q?.status_code||Q?.status||"").toLowerCase(),U=Q=>String(Q?.gateway_status||"").toLowerCase(),ee=Q=>Y(Q)==="pending"||!Y(Q)&&U(Q)==="pendente",te=Q=>Y(Q)==="active",se=Q=>Y(Q)==="suspended",ae=Q=>Y(Q)==="canceled";switch(l){case"solicitacoes":return h.filter(ee);case"aprovados":return h.filter(te);case"suspensos":return h.filter(se);case"cancelados":return h.filter(ae);case"todos":default:return h}},[a,l]),[N,W]=s.useState({todos:0,aprovados:0,suspensos:0,cancelados:0,solicitacoes:0}),w=async()=>{try{const h=await Re.getCounts();h&&W({todos:h.todos??0,aprovados:h.aprovados??0,suspensos:h.suspensos??0,cancelados:h.cancelados??0,solicitacoes:h.pendentes??0})}catch{}};s.useEffect(()=>{w()},[]);const v=s.useMemo(()=>{const h=U=>{if(!U)return 0;const ee=Date.parse(U);return Number.isFinite(ee)?ee:0};return(Array.isArray(_)?[..._]:[]).sort((U,ee)=>{const te=h(U.last_action_at)||h(U.subscription_date)||h(U.updated_at)||0;return(h(ee.last_action_at)||h(ee.subscription_date)||h(ee.updated_at)||0)-te})},[_]),F=async(h=null)=>{b(!0),y(null);try{const Y=h!==null?h:n,U={page:Y};x&&(U.search=x),l==="solicitacoes"?U.only_pending=!0:l&&l!=="todos"?U.status=l:x||(U.status="todos",U.unique_by="identity");const te=(await Re.getAll(U))?.data;console.log("[DEBUG assinantes] payload recebido da API:",te);const se=Array.isArray(te)?te:Array.isArray(te?.data)?te.data:te?.results||[];o(se);const ae=S=>{const z=String(S||"").trim().toLowerCase();return z?["canceled","cancelled","cancelado","cancelada"].includes(z)?"cancelled":["pending","pendente"].includes(z)?"pending":["active","ativo","aprovado","aprovada"].includes(z)?"active":["suspended","suspenso","suspensa"].includes(z)?"suspended":null:null};Array.isArray(se)&&se.length>0&&se.forEach(S=>{const z=ae(S?.status_code||S?.status);z&&j(S,z,`Sincronizado com painel principal (${z}).`)});const Q=te?.pagination||(typeof te?.last_page<"u"||typeof te?.total_pages<"u"?{currentPage:te?.current_page??te?.page??Y,totalPages:te?.last_page??te?.total_pages??1}:null);A(Q)}catch{y("Erro ao buscar assinantes.")}finally{b(!1)}};s.useEffect(()=>{F(n)},[n,l,x]);const V=()=>{i(1)},ie=h=>i(h),ce=(h,Y)=>{const U=(Y||"").toUpperCase();switch(h){case"active":return e.jsx(Bl,{children:U||"ATIVO"});case"suspended":return e.jsx(ql,{children:U||"SUSPENSO"});case"canceled":return e.jsx(Hl,{children:U||"CANCELADO"});case"pending":default:return e.jsx(Yl,{children:U||"PENDENTE"})}},be=h=>{c(h),i(1)},je=h=>{h.key==="Enter"&&(h.preventDefault(),V())},ne=(h,Y,U)=>{const ee=(te="")=>{const ae=(Q=>{const S=String(Q||"").toLowerCase();return S==="suspenso"?"suspend":S==="cancelado"?"cancel":S==="reativado"||S==="ativo"?"reactivate":"action"})(Y);T(Q=>({...Q,[h]:{...Q[h]||{},[ae]:!0}})),Re.updateStatusAssinatura(h,Y,te).then(()=>{const Q=a.find(M=>M.order_id===h||M.id===h||M.user_id===h),S=Q?.user_name||"Assinante",z=Q?.user_id||Q?.id||h;let k="";if(Y==="suspenso"?k=`Assinante ${S} (ID: ${z}) foi suspenso.`:Y==="cancelado"?k=`Assinante ${S} (ID: ${z}) foi cancelado.`:Y==="reativado"?k=`Assinante ${S} (ID: ${z}) foi reativado.`:k=`Status atualizado para ${Y} para ${S} (ID: ${z}).`,o(M=>{if(!Array.isArray(M))return M;const G=re=>String(re?.status_code||re?.status||"").toLowerCase(),K=M.map(re=>re.order_id!==h&&re.id!==h&&re.user_id!==h?re:Y==="reativado"?{...re,status:"active",status_code:"active",last_action:"reativado",last_action_at:new Date().toISOString()}:Y==="suspenso"?{...re,status:"suspended",status_code:"suspended",last_action:"suspenso",last_action_at:new Date().toISOString()}:Y==="cancelado"?{...re,status:"canceled",status_code:"canceled",last_action:"cancelado",last_action_at:new Date().toISOString()}:re),le=re=>{const oe=G(re);return l==="aprovados"?oe==="active":l==="suspensos"?oe==="suspended":l==="cancelados"?oe==="canceled":l==="solicitacoes"?oe==="pending":!0};return K.filter(le)}),q("success",k,{duration:7e3}),Q){const G={suspenso:{status:"suspended",description:"Suspenso pelo painel principal."},cancelado:{status:"cancelled",description:"Cancelado pelo painel principal."},reativado:{status:"active",description:"Reativado pelo painel principal."},ativo:{status:"active",description:"Aprovado pelo painel principal."}}[Y];G&&j(Q,G.status,G.description)}F(),w()}).catch(()=>q("error","Erro ao atualizar status.",{duration:7e3})).finally(()=>{T(Q=>({...Q,[h]:{...Q[h]||{},[ae]:!1}})),E(null),D(!1)})};U?(E({action:ee,...U}),D(!0)):ee()},ke=async(h,Y)=>{try{if(!h){q("error","Usuário da solicitação não encontrado.");return}const U=a.find(ae=>(ae.user_id??ae.id)===h),ee=U?.amount||0,te=`req_${h}`;T(ae=>({...ae,[te]:{...ae[te]||{},approve:!0}}));const se=U?.suggested_order_id;await Re.createOrderForUser(h,Y,ee,se),l==="solicitacoes"&&o(ae=>Array.isArray(ae)?ae.filter(Q=>(Q.user_id??Q.id)!==h):ae),await F(),await w(),q("success","Assinatura criada com sucesso.",{duration:7e3}),U&&j(U,"active","Assinatura criada pelo painel principal.")}catch(U){console.error(U);const ee=U?.response?.data?.message||"Falha ao criar assinatura.";q("error",ee,{duration:7e3})}finally{const U=`req_${h}`;T(ee=>({...ee,[U]:{...ee[U]||{},approve:!1}}))}},Ee=h=>{if(!h)return"N/A";const Y=new Date(h);return isNaN(Y.getTime())?"Data Inválida":Y.toLocaleDateString("pt-BR")},Le=async()=>{if(f)try{const h=Array.isArray(a)?a.find(U=>(U.user_id??U.id)===f):null,Y=`req_${f}`;T(U=>({...U,[Y]:{...U[Y]||{},delete:!0}})),await Re.deleteAssinante(f),H(!1),B(null),F(),w(),q("success","Solicitação excluída com sucesso.",{duration:7e3}),h&&j(h,"cancelled","Solicitação excluída no painel principal.")}catch{q("error","Erro ao excluir solicitação.",{duration:7e3})}finally{const h=`req_${f}`;T(Y=>({...Y,[h]:{...Y[h]||{},delete:!1}}))}};return e.jsxs(e.Fragment,{children:[e.jsxs(Ld,{children:[e.jsxs("div",{children:[e.jsx("h1",{children:"Gerenciamento de Assinantes"}),e.jsx(Td,{children:"Pesquise, filtre e gerencie seus assinantes."})]}),e.jsxs(Dd,{children:[e.jsx(Tr,{value:p,onChange:h=>d(h.target.value),onSearch:V,onKeyDown:je}),e.jsxs($l,{to:"/assinantes/novo",children:[e.jsx(_r,{})," Adicionar Assinante"]})]})]}),e.jsx(Al,{children:e.jsx(Ll,{filters:[{key:"todos",label:"Todos"},{key:"aprovados",label:"Aprovados (30d)"},{key:"suspensos",label:"Suspensos"},{key:"cancelados",label:"Cancelados"},{key:"solicitacoes",label:"Solicitações (sem assinatura)"}],counts:N,activeFilter:l,onFilterClick:be})}),u?e.jsx(xo,{}):R?e.jsx("p",{style:{color:"red"},children:R}):e.jsxs(Rl,{children:[e.jsx(Nl,{children:l==="solicitacoes"?e.jsxs(e.Fragment,{children:[e.jsx("thead",{children:e.jsxs(Je,{children:[e.jsx(De,{className:"assinante",children:"Assinante"}),e.jsx(De,{className:"data",children:"Data da Solicitação"}),e.jsx(De,{className:"acoes",children:"Ações"})]})}),e.jsx("tbody",{children:v.length>0?v.map(h=>{(h.status_code||"").toLowerCase(),(h.gateway_status||"").toLowerCase();const Y=`pend_${h.user_id??h.id??h.order_id??Math.random()}`,U=`req_${h.user_id??h.id}`;return e.jsxs(Je,{children:[e.jsxs(Se,{className:"assinante",children:[e.jsx(pe,{to:`/assinantes/${h.order_id??h.user_id??h.id}`,style:{color:"var(--color-text, #f8fafc)",fontWeight:600,textDecoration:"none"},children:e.jsx("span",{title:h.user_name||"—",children:(()=>{const ee=(h.user_name||"—").split(" ").slice(0,2).join(" ");return ee.length>22?ee.slice(0,22)+"…":ee})()})}),h.user_email&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),e.jsx("small",{style:{color:"var(--muted)"},children:h.user_email})]})]}),e.jsx(Se,{className:"data",children:h.subscription_date?Ee(h.subscription_date):"-"}),e.jsx(Se,{className:"acoes",children:e.jsx(la,{children:e.jsx(da,{onView:()=>t(`/assinantes/${h.order_id??h.user_id??h.id}`),onCancel:()=>{B(h.user_id??h.id),H(!0)},onReactivate:()=>ke(h.user_id??h.id,h.products_id),labels:{view:"Ver Detalhes",cancel:"Excluir de vez",reactivate:"Criar Assinatura"},ariaContext:h.user_name,size:"xs",pill:!0,tone:"soft",loading:{cancel:!!Z[U]?.delete,reactivate:!!Z[U]?.approve}})})})]},Y)}):e.jsx(Je,{children:e.jsx(Se,{colSpan:"3",style:{textAlign:"center"},children:"Nenhum resultado encontrado."})})})]}):e.jsxs(e.Fragment,{children:[e.jsx("thead",{children:e.jsxs(Je,{children:[e.jsx(De,{className:"assinante",children:"Assinante"}),e.jsx(De,{className:"plano",children:"Plano"}),e.jsx(De,{className:"data",children:"Data da Assinatura"}),e.jsx(De,{children:"Status"}),e.jsx(De,{className:"acoes",children:"Ações"})]})}),e.jsx("tbody",{children:v.length>0?v.map((h,Y)=>{const U=(h.status_code||"").toLowerCase(),ee=(h.gateway_status||"").toLowerCase(),te=U==="active",se=U==="suspended",ae=U==="canceled",Q=U==="pending"||!U&&ee==="pendente",S=`assin_${h.order_id??h.user_id??h.id??Math.random()}_${Y}`;let z=!1,k=!1,M=!1,G=!1;return l==="suspensos"?(k=!0,M=!0):l==="cancelados"?k=!0:l==="aprovados"?(z=te,M=te):(G=Q,z=te,k=se||ae,M=!ae),e.jsxs(Je,{children:[e.jsxs(Se,{className:"assinante",children:[e.jsx(pe,{to:`/assinantes/${h.order_id??h.user_id??h.id}`,style:{color:"var(--color-text, #f8fafc)",fontWeight:600,textDecoration:"none"},children:e.jsx("span",{title:h.user_name||"—",children:(()=>{const K=(h.user_name||"—").split(" ").slice(0,2).join(" ");return K.length>22?K.slice(0,22)+"…":K})()})}),h.user_email&&e.jsxs(e.Fragment,{children:[e.jsx("br",{}),e.jsx("small",{style:{color:"var(--muted)"},children:h.user_email})]})]}),e.jsx(Se,{children:h.plan_name||""}),e.jsx(Se,{className:"data",children:h.subscription_date?Ee(h.subscription_date):"N/A"}),e.jsx(Se,{children:ce(U,h.status_label)}),e.jsx(Se,{className:"acoes",children:e.jsx(la,{children:e.jsx(da,{onView:()=>t(`/assinantes/${h.order_id??h.user_id??h.id}`),onSuspend:z?()=>ne(h.order_id,"suspenso",{title:"Suspender Assinatura",message:`Tem certeza que deseja suspender a assinatura de ${h.user_name}?`,confirmButtonText:"Sim, Suspender",reasons:[{value:"pagamento_atrasado",label:"Pagamento em atraso"},{value:"pedido_do_cliente",label:"Pedido do cliente"},{value:"analise_de_fraude",label:"Análise de fraude"},{value:"uso_indevido",label:"Uso indevido"},{value:"ajuste_administrativo",label:"Ajuste administrativo"},{value:"outros",label:"Outros"}],requireOtherText:!0}):void 0,onCancel:M?()=>ne(h.order_id,"cancelado",{title:"Cancelar Assinatura",message:`Tem certeza que deseja CANCELAR a assinatura de ${h.user_name}?`,confirmButtonText:"Sim, Cancelar",reasons:[{value:"pedido_do_cliente_encerramento",label:"Pedido do cliente (encerramento)"},{value:"inadimplencia",label:"Inadimplência"},{value:"chargeback_ou_recusa",label:"Chargeback/Recusa persistente"},{value:"violacao_termos",label:"Violação de termos"},{value:"troca_de_plano_provedor",label:"Troca de plano/provedor"},{value:"outros",label:"Outros"}],requireOtherText:!0}):void 0,onReactivate:k||G?()=>G?ne(h.order_id,"ativo"):ne(h.order_id,"reativado",{title:"Reativar Assinatura",message:`Tem certeza que deseja reativar a assinatura de ${h.user_name}?`,confirmButtonText:"Sim, Reativar",reasons:[{value:"regularizacao_pagamento",label:"Regularização de pagamento"},{value:"solicitacao_cliente",label:"Solicitação do cliente"},{value:"erro_operacional_corrigido",label:"Erro operacional corrigido"},{value:"migracao_concluida",label:"Migração concluída"},{value:"outros",label:"Outros"}],requireOtherText:!0}):void 0,labels:{view:"Ver Detalhes",suspend:"Suspender",cancel:"Cancelar",reactivate:G?"Aprovar":"Reativar"},loading:Z[h.order_id]||{},ariaContext:h.user_name,size:"xs",pill:!0,tone:"soft",tones:{cancel:"solid",view:"soft",suspend:"soft",reactivate:"soft"}})})})]},S)}):e.jsx(Je,{children:e.jsx(Se,{colSpan:"5",style:{textAlign:"center"},children:"Nenhum resultado encontrado."})})})]})}),m&&m.totalPages>1&&e.jsx(qt,{currentPage:m.currentPage,totalPages:m.totalPages,onPageChange:ie})]}),e.jsx(dd,{isOpen:I,onClose:()=>D(!1),onConfirm:h=>{$?.action&&$.action(h)},reasons:[{value:"pagamento_atrasado",label:"Pagamento atrasado"},{value:"pedido_do_cliente",label:"Pedido do cliente"},{value:"problema_no_cartao",label:"Problema no cartão"},{value:"ajuste_administrativo",label:"Ajuste administrativo"},{value:"uso_irregular",label:"Uso irregular"},{value:"outros",label:"Outros"}],...$,tones:{cancel:"solid",view:"soft",reactivate:"soft"}}),e.jsx(yo,{isOpen:L,onClose:()=>H(!1),onConfirm:Le,title:"Excluir solicitação",message:"Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita."}),O&&e.jsx(zr,{message:O.message,type:O.type,exit:P})]})}const Id=X`
  from { opacity: 0; }
  to { opacity: 1; }
`,Rd=X`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`,Nd=r.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${Id} 0.3s ease;
`,Md=r.div`
  background-color: #2d3748;
  padding: 2rem;
  border-radius: 15px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  animation: ${Rd} 0.4s ease-out;
  text-align: center;
`,Bd=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`,Od=r.div`
  color: #9dd9d2; /* Cor de sucesso do projeto */
  font-size: 3rem;
  margin-bottom: 1rem;
`,qd=r.h2`
  margin: 0;
  color: #fff;
  font-size: 1.5rem;
`,Ud=r.p`
  color: #a0aec0;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 2rem 0;
`,Hd=r.div`
  display: flex;
  justify-content: center;
`,Wd=r.button`
  border: none;
  border-radius: 8px;
  padding: 0.8rem 2.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #9dd9d2;
  color: #1a202c;
  
  &:hover {
    transform: translateY(-2px);
    background-color: #86c7bf;
  }
`,Dr=({isOpen:t,onClose:a,title:o,message:n})=>t?e.jsx(Nd,{onClick:a,children:e.jsxs(Md,{onClick:i=>i.stopPropagation(),children:[e.jsxs(Bd,{children:[e.jsx(Od,{children:e.jsx(eo,{})}),e.jsx(qd,{children:o})]}),e.jsx(Ud,{children:n}),e.jsx(Hd,{children:e.jsx(Wd,{onClick:a,children:"OK"})})]})}):null;async function Ao(){return(await J.get("/admin/orders/max-id")).data?.maxId||0}const Yd=r.form`
  display: flex; flex-direction: column; gap: 1.2rem; max-width: 700px;
  background-color: var(--color-card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
`,ht=r.input`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--color-border);
  background-color: var(--color-background); color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus { border-color: var(--color-primary-ciano); box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.2); outline: none; }
`,Vd=r.select`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid var(--color-border);
  background-color: var(--color-background); color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: all 0.2s ease;
  &:focus { border-color: var(--color-primary-ciano); box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.2); outline: none; }
`,Gd=r.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`,Kd=r.button`
  background-color: var(--color-primary-ciano); color: var(--color-card-bg); border: none; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
  &:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-2px); }
`,Xd=r(pe)`
  background-color: var(--color-border); color: #fff; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; text-decoration: none;
  &:hover { background-color: #718096; }
`,Ze=r.label`
  font-weight: 600; margin-bottom: -0.5rem;
`,Qd=()=>{const t=Pe(),[a,o]=s.useState({id:"",name:"",email:"",phone:"",document:"",plan_id:""}),[n,i]=s.useState(""),[l,c]=s.useState(!1),[p,d]=s.useState([]),[x,g]=s.useState(!0),[u,b]=s.useState(""),[R,y]=s.useState(!1);s.useEffect(()=>{ho().then(I=>{d(I.data),I.data.length>0&&o(D=>({...D,plan_id:I.data[0].id}))}).catch(I=>console.error("Erro ao buscar planos:",I)).finally(()=>g(!1)),(async()=>{try{const I=await Ao();o(D=>({...D,id:String(I+1)})),i("ID sugerido automaticamente."),c(!0)}catch{i("Não foi possível sugerir ID automaticamente."),c(!1)}})()},[]);const m=async I=>{const{name:D,value:$}=I.target;if(o(E=>({...E,[D]:$})),D==="id"){if(i("Verificando..."),c(!1),!$||isNaN(Number($))){i("ID deve ser um número."),c(!1);return}try{const E=await go($);E&&E.data&&E.data.id?(i("ID já existe. Escolha outro."),c(!1)):(i("ID disponível!"),c(!0))}catch{i("ID disponível!"),c(!0)}}},A=async I=>{if(I.preventDefault(),!l){b("Escolha um ID válido e disponível.");return}b("Salvando...");try{await vl(a),y(!0)}catch(D){b(D.response?.data?.message||"Erro ao salvar o assinante."),console.error(D)}};return e.jsxs("div",{children:[e.jsxs("div",{style:{marginBottom:"2rem"},children:[e.jsx("h1",{children:"Adicionar Novo Assinante"}),e.jsx("p",{children:"Preencha os dados abaixo para cadastrar manualmente."})]}),e.jsxs(Yd,{onSubmit:A,children:[e.jsx(Ze,{children:"ID (manual)"}),e.jsx(ht,{type:"number",name:"id",value:a.id,onChange:m,required:!0,min:1,step:1}),a.id&&e.jsx("p",{style:{color:l?"green":"red",marginTop:"-1rem",marginBottom:"0.5rem"},children:n}),e.jsx(Ze,{children:"Nome Completo"}),e.jsx(ht,{type:"text",name:"name",value:a.name,onChange:m,required:!0}),e.jsx(Ze,{children:"E-mail"}),e.jsx(ht,{type:"email",name:"email",value:a.email,onChange:m,required:!0}),e.jsx(Ze,{children:"Telefone (Opcional)"}),e.jsx(ht,{type:"tel",name:"phone",value:a.phone,onChange:m}),e.jsx(Ze,{children:"CPF (Opcional)"}),e.jsx(ht,{type:"text",name:"document",value:a.document,onChange:m}),e.jsx(Ze,{children:"Plano de Assinatura"}),x?e.jsx("p",{children:"Carregando planos..."}):e.jsx(Vd,{name:"plan_id",value:a.plan_id,onChange:m,required:!0,children:p.map(I=>e.jsxs("option",{value:I.id,children:[I.name," (R$ ",I.price,")"]},I.id))}),u&&!u.includes("Salvando")&&e.jsx("p",{style:{color:"red"},children:u}),e.jsxs(Gd,{children:[e.jsx(Xd,{to:"/assinantes",children:"Cancelar"}),e.jsx(Kd,{type:"submit",disabled:u.includes("Salvando"),children:u.includes("Salvando")?"Salvando...":"Salvar Assinante"})]})]}),e.jsx(Dr,{isOpen:R,onClose:()=>{y(!1),t("/assinantes")},title:"Sucesso!",message:"Novo assinante criado com o status PENDENTE. Você já pode aprová-lo na lista."})]})},Jd=X` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } `,Zd=r.div`
  background-color: ${({$zebra:t})=>t==="odd"?"rgba(148,163,184,.04)":"#2d3748"};
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  transition: background 0.2s, box-shadow 0.3s, transform 0.2s;
  animation: ${Jd} 0.5s ease-out;
  &:hover {
    background-color: rgba(78,144,136,.18);
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 12px 30px rgba(78,144,136,.18);
  }
`,ec=r.div`
  position: relative;
  aspect-ratio: 4 / 3;
  background-color: #1a202c;
  border-bottom: 1px solid #4a5568;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a5568;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`,tc=r.div` padding: 0.8rem 1rem; flex-grow: 1; display: flex; flex-direction: column; `,rc=r.h3` margin: 0 0 0.5rem 0; color: #fff; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; `,ac=r.div` display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.8rem; border-top: 1px solid #4a5568; `,oc=r.span` font-size: 15px; font-weight: 300; color: #9dd9d2; `,nc=r.span` font-size: 0.8rem; font-weight: 500; background-color: #4a5568; color: #e2e8f0; padding: 0.2rem 0.5rem; border-radius: 6px; `,sc=r.div` display: flex; gap: 0.5rem; padding: 0 1rem 0.8rem 1rem; `,Qt=r.button` background: rgba(255,255,255,0.1); border: none; color: #a0aec0; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; text-decoration: none; &:hover { background: #9dd9d2; color: #1a202c; } `,ic=t=>t==null?"N/A":new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(t),Pt="https://suporteatostech.com/storage",Jt="/images",Me=(t,a)=>{const o=String(t||"").replace(/\/$/,""),n=String(a||"").replace(/^\/+/,"");return`${o}/${n}`};function pa(t,a){if(!t||typeof t!="string")return null;let o=t.trim();o=o.replace(/\\+/g,"/");const n=o.toLowerCase();if(/^https?:\/\//i.test(o)||o.startsWith("/"))return o;if(n.startsWith("images/")){const c=o.replace(/^images\//i,"");return Me(Jt,c)}const i=n.indexOf("/images/");if(i>=0){const c=o.slice(i+8);return Me(Jt,c)}if(n.startsWith("/images/"))return o;if(n.startsWith("/storage/"))return Me(Pt,o.replace(/^\/storage\//i,""));if(n.startsWith("storage/"))return Me(Pt,o.replace(/^storage\//i,""));const l=n.indexOf("/storage/");if(l>=0){const c=o.slice(l+9);return Me(Pt,c)}return!o.includes("/")&&a?Me(Jt,`${String(a).trim()}/${o}`):Me(Pt,o)}const lc=({product:t,onDelete:a,idx:o})=>{const n=pa(t.image_url||t.image||t.photo_url||t.thumbnail_url,t.id),i=pa(t.video_url||t.video,t.id),l=(t.id??o)%2===0?"even":"odd";return e.jsxs(Zd,{$zebra:l,children:[e.jsx(ec,{children:n?e.jsx("img",{src:n,alt:t.name||"Produto",loading:"lazy"}):e.jsx(Cr,{size:40})}),e.jsxs(tc,{children:[e.jsx(rc,{title:t.name,children:t.name}),e.jsxs(ac,{children:[e.jsx(oc,{children:ic(t.price)}),e.jsxs(nc,{children:["Estoque: ",t.stock||0]})]})]}),e.jsxs(sc,{children:[e.jsx(Qt,{as:pe,to:`/produtos/${t.id}/editar`,title:"Editar Produto",children:e.jsx(to,{})}),e.jsx(Qt,{title:"Deletar Produto",onClick:()=>a(t.id),children:e.jsx(ro,{})}),i&&e.jsx(Qt,{as:"a",href:i,target:"_blank",rel:"noopener noreferrer",title:"Ver Vídeo",children:e.jsx(hn,{})})]})]})},dc=r.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #4a5568;
  background: ${({$zebra:t})=>t==="odd"?"rgba(148,163,184,.04)":"rgba(148,163,184,.08)"};
  transition: background 0.2s, transform 0.15s;
  &:hover {
    background: rgba(78,144,136,.18);
    transform: translateY(-1px) scale(1.01);
    box-shadow: 0 4px 10px rgba(78,144,136,.12);
  }
  &:last-child { border-bottom: none; }
`,cc=r.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  background-color: #1a202c;
  border-radius: 8px;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a5568;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`,pc=r.div` flex-grow: 1; display: grid; grid-template-columns: 2fr 1fr 1fr; align-items: center; gap: 1rem; `,uc=r.span` font-size: 15px; font-weight: 500; color: #fff; `,ua=r.span` color: #a0aec0; `,xc=r.div` display: flex; gap: 0.5rem; justify-content: flex-end; `,xa=r.button` background: transparent; border: none; color: #a0aec0; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; text-decoration: none; &:hover { background: #4a5568; color: #fff; } `,Lt="https://suporteatostech.com/storage",Zt="/images",Be=(t,a)=>{const o=String(t||"").replace(/\/$/,""),n=String(a||"").replace(/^\/+/,"");return`${o}/${n}`};function gc(t,a){if(!t||typeof t!="string")return null;let o=t.trim();o=o.replace(/\\+/g,"/");const n=o.toLowerCase();if(/^https?:\/\//i.test(o)||o.startsWith("/"))return o;if(n.startsWith("images/")){const c=o.replace(/^images\//i,"");return Be(Zt,c)}const i=n.indexOf("/images/");if(i>=0){const c=o.slice(i+8);return Be(Zt,c)}if(n.startsWith("/images/"))return o;if(n.startsWith("/storage/"))return Be(Lt,o.replace(/^\/storage\//i,""));if(n.startsWith("storage/"))return Be(Lt,o.replace(/^storage\//i,""));const l=n.indexOf("/storage/");if(l>=0){const c=o.slice(l+9);return Be(Lt,c)}return!o.includes("/")&&a?Be(Zt,`${String(a).trim()}/${o}`):Be(Lt,o)}const mc=({product:t,onDelete:a,idx:o})=>{const n=gc(t.image_url||t.image||t.photo_url||t.thumbnail_url,t.id),i=(t.id??o)%2===0?"even":"odd";return e.jsxs(dc,{$zebra:i,children:[e.jsx(cc,{children:n?e.jsx("img",{src:n,alt:t.name||"Produto",loading:"lazy"}):e.jsx(Cr,{size:24})}),e.jsxs(pc,{children:[e.jsx(uc,{children:t.name}),e.jsxs(ua,{children:["ID: ",t.id]}),e.jsxs(ua,{children:["Estoque: ",t.stock||0]})]}),e.jsxs(xc,{children:[e.jsx(xa,{as:pe,to:`/produtos/${t.id}/editar`,title:"Editar Produto",children:e.jsx(to,{})}),e.jsx(xa,{title:"Deletar Produto",onClick:()=>a(t.id),children:e.jsx(ro,{})})]})]})};function hc(t){const a=new Set;return t.filter(o=>!o||!o.id||a.has(o.id)?!1:(a.add(o.id),!0))}const bc=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,fc=r(pe)`
  background-color: #9dd9d2;
  color: #1a202c;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  &:hover {
    background-color: #86c7bf;
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
`,vc=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`,yc=r.div`
  display: flex;
  gap: 1rem;
`,ga=r.button.withConfig({shouldForwardProp:t=>t!=="$active"})`
  background-color: ${({$active:t})=>t?"#9dd9d2":"#2d3748"};
  color: ${({$active:t})=>t?"#1a202c":"#a0aec0"};
  border: 1px solid #4a5568;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }
`,jc=r.div`
  display: flex;
  gap: 0.5rem;
`,ma=r.button.withConfig({shouldForwardProp:t=>t!=="$active"})`
  background-color: ${({$active:t})=>t?"#9dd9d2":"#2d3748"};
  color: ${({$active:t})=>t?"#1a202c":"#a0aec0"};
  border: 1px solid #4a5568;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    border-color: #9dd9d2;
    color: #fff;
  }
`,wc=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
`,kc=r.div`
  background-color: #2d3748;
  border-radius: 15px;
  overflow: hidden;
`,Sc=()=>{const[t,a]=s.useState([]),[o,n]=s.useState(!0),[i,l]=s.useState(""),[c,p]=s.useState({key:"id",direction:"desc"}),[d,x]=s.useState("grid"),[g,u]=s.useState(!1),[b,R]=s.useState(null),[y,m]=s.useState(null),[A,I]=s.useState(1),D=s.useCallback(async()=>{n(!0);try{const T=await mo(A,c);a(T.data.data),m({currentPage:T.data.current_page,totalPages:T.data.last_page})}catch(T){l("Não foi possível carregar os produtos."),console.error(T)}finally{n(!1)}},[A,c]);s.useEffect(()=>{D()},[D]);const $=T=>{R(T),u(!0)},E=async()=>{if(b){a(T=>T.filter(q=>q.id!==b)),u(!1),R(null);try{await Cl(b),t.length===1&&A>1&&I(A-1)}catch(T){console.error("Erro ao excluir o produto:",T),l("Erro ao excluir o produto.")}}},L=T=>{let q="asc";c.key===T&&c.direction==="asc"&&(q="desc"),p({key:T,direction:q})},H=T=>{I(T)},f=s.useMemo(()=>Array.isArray(t)?hc(t):[],[t]),B=s.useMemo(()=>f.map((T,q)=>d==="grid"?e.jsx(lc,{product:T,onDelete:$,idx:q},`prod-${T.id??q}`):e.jsx(mc,{product:T,onDelete:$,idx:q},`prod-${T.id??q}`)),[f,d]),Z=()=>o?e.jsx("p",{children:"Carregando produtos..."}):i?e.jsx("p",{style:{color:"red"},children:i}):f.length===0?e.jsx("p",{children:"Nenhum produto encontrado."}):d==="grid"?e.jsx(wc,{children:B}):e.jsx(kc,{children:B});return e.jsxs("div",{children:[e.jsxs(bc,{children:[e.jsxs("div",{children:[e.jsx("h1",{children:"Catálogo de Produtos"}),e.jsx("p",{children:"Adicione, edite e gerencie seus produtos."})]}),e.jsxs(fc,{to:"/produtos/novo",children:[e.jsx(_r,{})," Adicionar Novo Produto"]})]}),e.jsxs(vc,{children:[e.jsxs(yc,{children:[e.jsxs(ga,{onClick:()=>L("id"),$active:c.key==="id",children:["Ordenar por ID",c.key==="id"&&(c.direction==="asc"?e.jsx(Wr,{}):e.jsx(Yr,{}))]}),e.jsxs(ga,{onClick:()=>L("name"),$active:c.key==="name",children:["Ordenar por Nome",c.key==="name"&&(c.direction==="asc"?e.jsx(Wr,{}):e.jsx(Yr,{}))]})]}),e.jsxs(jc,{children:[e.jsx(ma,{onClick:()=>x("grid"),$active:d==="grid",title:"Visualização em Grade",children:e.jsx(bn,{})}),e.jsx(ma,{onClick:()=>x("list"),$active:d==="list",title:"Visualização em Lista",children:e.jsx(fn,{})})]})]}),Z(),y&&y.totalPages>1&&e.jsx(qt,{currentPage:y.currentPage,totalPages:y.totalPages,onPageChange:H}),e.jsx(yo,{isOpen:g,onClose:()=>{u(!1),R(null)},onConfirm:E,title:"Confirmar Exclusão",message:"Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."})]})},_c=()=>e.jsxs("div",{children:[e.jsx("h1",{children:"Estoque"}),e.jsx("p",{children:"A funcionalidade de gerenciamento de estoque será construída aqui."})]}),Cc=(t=1,a="todos",o=20,n={})=>{const i={page:t,filter:a,limit:o,...n};return J.get("/admin/history",{params:i})},$c=()=>J.get("/admin/history/counts");r.th`
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: var(--color-text-light, #e5e7eb);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(180deg, rgba(148,163,184,.12), rgba(148,163,184,.08));
  border-bottom: 1px solid var(--border, rgba(148,163,184,.22));
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: background 0.18s, color 0.18s;
  &:hover, &:focus-visible {
    background: rgba(139,92,246,0.10);
    color: var(--color-primary, #06b6d4);
    outline: 2px solid var(--color-primary, #06b6d4);
    outline-offset: 2px;
  }
  .sort-icon {
    margin-left: 0.5em;
    font-size: 1.1em;
    vertical-align: middle;
    color: inherit;
    transition: color 0.18s;
  }
`;const Eo=r.div`
  width: 100%;
  background: var(--card, #0f172a);
  border-radius: 16px;
  border: 1px solid var(--border, rgba(148,163,184,.18));
  box-shadow: 0 8px 28px rgba(0,0,0,.25);
  overflow: hidden;
`,zo=r.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  /* Usar layout auto para permitir que a coluna de ações expanda quando necessário */
  table-layout: auto;
`,ye=r.th`
  padding: 0.9rem 1.2rem;
  text-align: left;
  color: var(--color-text-light, #e5e7eb);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: linear-gradient(180deg, rgba(148,163,184,.12), rgba(148,163,184,.08));
  border-bottom: 1px solid var(--border, rgba(148,163,184,.22));
  &.acoes { text-align: center; }
  &.assinante { width: 26%; }
  &.data { text-align: center; width: 140px; }
`,me=r.td`
  padding: 0.9rem 1.2rem;
  color: var(--color-text-light, #e5e7eb);
  font-size: 0.92rem;
  word-break: break-word;
  overflow-wrap: break-word;
  border-bottom: 1px solid var(--border, rgba(148,163,184,.14));
  /* permitir quebra automática para evitar forçar overflow do layout */
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  &.acoes {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: none;
    min-width: 220px;
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
    width: auto;
    padding-right: 0.5rem;
  }
  &.assinante {
    max-width: 320px;
    width: 26%;
    white-space: normal;
    text-overflow: initial;
    overflow: visible;
  }
  &.data { text-align: center; }
`,vt=r.tr`
  thead & {
    background: transparent;
  }
  /* zebra mais suave em dois tons */
  tbody &:nth-child(odd) {
    background-color: rgba(148,163,184,.06);
  }
  tbody &:nth-child(even) {
    background-color: rgba(148,163,184,.12);
  }
  tbody & {
    opacity: 0;
    animation: ${Ge} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  ${Array.from({length:20}).map((t,a)=>`
    tbody &:nth-child(${a+1}) {
      animation-delay: ${.08*(a+1)}s;
    }
  `).join("")}
  /* hover com feedback mais evidente */
  tbody &:hover {
    background-color: rgba(157,217,210,.22); /* mistura do brand mais visível */
    transition: background-color .18s ease, transform .08s ease, color .18s ease;
  }
  tbody &:hover a {
    text-decoration: underline;
    color: var(--color-primary, #9dd9d2);
  }
`,Ac=r.div`
    animation: ${zi} 0.6s ease-out;
`,Ec=r.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
`,zc=r.div`
    display: flex;
    flex-direction: column;
    gap: 0.35rem;

    > * {
        opacity: 0;
        animation: ${Ge} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    > *:nth-child(1) { animation-delay: 0.08s; }
    > *:nth-child(2) { animation-delay: 0.16s; }
`,Pc=r.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: flex-end;

    > * {
        opacity: 0;
        animation: ${Ge} 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    > *:nth-child(1) { animation-delay: 0.2s; }
    > *:nth-child(2) { animation-delay: 0.28s; }
`,Lc=r(pe)` background-color: #9dd9d2; color: #1a202c; border-radius: 8px; padding: 0.8rem 1.5rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 8px; `;r.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;const Fr=({title:t,description:a,addButtonLink:o,addButtonText:n,filters:i,headerRight:l=null,children:c,pagination:p,transparent:d=!1})=>{const x=Sr(),u=[].some(b=>x.pathname.startsWith(b));return e.jsxs(Ac,{children:[e.jsxs(Ec,{children:[e.jsxs(zc,{children:[e.jsx("h1",{children:t}),e.jsx("p",{children:a})]}),e.jsxs(Pc,{children:[!u&&l,o&&e.jsxs(Lc,{to:o,children:[e.jsx(_r,{})," ",n]})]})]}),i,d?e.jsx(e.Fragment,{children:c}):e.jsxs(Eo,{children:[" ",c]}),p]})},St=r.span`
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.7rem;
  color: #fff;
  text-transform: uppercase;
`,Tc=r(St)` background-color: #3182ce; `,Dc=r(St)` background-color: #38A169; `,Fc=r(St)` background-color: #D69E2E; `,Ic=r(St)` background-color: #E53E3E; `,Rc=r(St)` background-color: #718096; `,Nc=()=>{const[t,a]=s.useState([]),[o,n]=s.useState(!0),[i,l]=s.useState(""),[c,p]=s.useState(null),[d,x]=s.useState(1),[g,u]=s.useState("todos"),[b,R]=s.useState(null),y=s.useCallback(async()=>{n(!0),l("");try{const $=await Cc(d,g),E=($?.data?.data||[]).filter(L=>!String(L?.action||"").toLowerCase().startsWith("separation_status"));a(E),p({currentPage:$.data.current_page,totalPages:$.data.last_page})}catch($){l("Não foi possível carregar o histórico."),console.error($)}finally{n(!1)}},[d,g]);s.useEffect(()=>{$c().then($=>{R($.data)}).catch($=>console.error("Erro ao buscar contadores:",$))},[]),s.useEffect(()=>{y()},[y]);const m=$=>{x($)},A=$=>{u($),x(1)},I=$=>{const E=($.status_code||"").toLowerCase(),L=$.status_label||($.action||"").replace(/_/g," ").replace(/\b\w/g,H=>H.toUpperCase());switch(E){case"created":return e.jsx(Tc,{children:L});case"reactivated":return e.jsx(Dc,{children:L});case"suspended":return e.jsx(Fc,{children:L});case"canceled":return e.jsx(Ic,{children:L});default:return e.jsx(Rc,{children:L})}},D=["todos","criado","reativado","suspenso","cancelado","ajuste_estoque"];return e.jsx(Fr,{title:"Histórico",description:"Acompanhe ações administrativas.",filters:e.jsx(Lr,{children:b&&D.map($=>{const E=b[$]||0,L=$.replace(/_/g," ").replace(/\b\w/g,H=>H.toUpperCase());return b[$]!==void 0?e.jsx(Ne,{isActive:g===$,onClick:()=>A($),count:E,children:L},$):null})}),pagination:c&&c.totalPages>1&&e.jsx(qt,{currentPage:c.currentPage,totalPages:c.totalPages,onPageChange:m})||null,children:o?e.jsx("p",{style:{color:"#fff"},children:"Carregando historico..."}):i?e.jsx("p",{style:{color:"red"},children:i}):e.jsxs(zo,{children:[e.jsx("thead",{children:e.jsxs(vt,{children:[e.jsx(ye,{children:"Data"}),e.jsx(ye,{children:"Assinante Afetado"}),e.jsx(ye,{children:"Acao"}),e.jsx(ye,{children:"Motivo/Detalhe"}),e.jsx(ye,{children:"Realizado Por"})]})}),e.jsx("tbody",{children:(()=>{const $=new Set;return t.filter(E=>!E.id||$.has(E.id)?!1:($.add(E.id),!0)).map((E,L)=>e.jsxs(vt,{children:[e.jsx(me,{children:new Date(E.created_at).toLocaleString("pt-BR")}),e.jsx(me,{children:E.subscriber_id?e.jsx(pe,{to:`/assinantes/${E.subscriber_id}`,style:{color:"var(--color-text, #f8fafc)",fontWeight:600,textDecoration:"none"},title:E.subscriber_name||"Assinante",children:E.subscriber_name||"Assinante"}):E.subscriber_name||"N/A"}),e.jsx(me,{children:I(E)}),e.jsx(me,{className:"reason-cell",children:E.reason||"N/A"}),e.jsx(me,{children:E.admin_name||"Sistema"})]},`hist-${E.id??L}`))})()})]})})},Mc=r.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem; /* Aumentando o espaçamento */
  max-width: 700px;
`,er=r.input`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #4a5568;
  background-color: #1a202c; color: #fff; font-size: 1rem; box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3);
    outline: none;
  }
`,Bc=r.textarea`
  width: 100%; padding: 0.8rem; border-radius: 8px; border: 1px solid #4a5568;
  background-color: #1a202c; color: #fff; font-size: 1rem; box-sizing: border-box;
  min-height: 120px; resize: vertical; font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 3px rgba(157, 217, 210, 0.3);
    outline: none;
  }
`,ha=r.div`
  background-color: #1a202c; border: 1px solid #4a5568; border-radius: 8px;
  padding: 0.8rem; display: flex; justify-content: space-between; align-items: center;
  span { color: #a0aec0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 1rem; }
  label {
    background-color: #4a5568; color: #fff; padding: 0.5rem 1rem; border-radius: 6px;
    cursor: pointer; transition: background-color 0.2s ease; flex-shrink: 0;
    &:hover { background-color: #718096; }
  }
  input[type="file"] { display: none; }
`,Oc=r.div`
  display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;
`,qc=r.button`
  background-color: #9dd9d2; color: #1a202c; border: none; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease;
  &:disabled { background-color: #555; cursor: not-allowed; opacity: 0.7; }
  &:hover:not(:disabled) { background-color: #86c7bf; transform: translateY(-2px); }
`,Uc=r(pe)`
  background-color: #4a5568; color: #fff; border-radius: 8px;
  padding: 0.8rem 1.5rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s ease; text-decoration: none;
  &:hover { background-color: #718096; }
`,et=r.label`
  font-weight: 600;
  margin-bottom: -0.5rem; /* Puxa o input para mais perto */
`,Hc=()=>{const t=Pe(),[a,o]=s.useState({name:"",description:"",price:"",stock:""}),[n,i]=s.useState(null),[l,c]=s.useState(null),[p,d]=s.useState(""),[x,g]=s.useState(!1),u=m=>{const{name:A,value:I}=m.target;o(D=>({...D,[A]:I}))},b=m=>{i(m.target.files[0])},R=m=>{c(m.target.files[0])},y=async m=>{m.preventDefault(),d("Salvando produto...");try{await Sl(a,n,l),g(!0)}catch(A){d("Erro ao salvar o produto."),console.error(A)}};return e.jsxs("div",{children:[e.jsx("h1",{children:"Adicionar Novo Produto"}),e.jsx("p",{style:{marginBottom:"2rem"},children:"Preencha os dados abaixo para cadastrar um novo item no catálogo."}),e.jsxs(Mc,{onSubmit:y,children:[e.jsx(et,{children:"Nome do Produto"}),e.jsx(er,{type:"text",name:"name",value:a.name,onChange:u,required:!0}),e.jsx(et,{children:"Descrição"}),e.jsx(Bc,{name:"description",value:a.description,onChange:u}),e.jsx(et,{children:"Preço (ex: 179.90)"}),e.jsx(er,{type:"number",step:"0.01",name:"price",value:a.price,onChange:u,required:!0}),e.jsx(et,{children:"Estoque"}),e.jsx(er,{type:"number",name:"stock",value:a.stock,onChange:u,required:!0}),e.jsx(et,{children:"Imagem"}),e.jsxs(ha,{children:[e.jsx("span",{children:n?n.name:"Nenhum arquivo selecionado"}),e.jsx("label",{htmlFor:"imageFile",children:"Selecionar"}),e.jsx("input",{type:"file",id:"imageFile",accept:"image/*",onChange:b})]}),e.jsx(et,{children:"Vídeo"}),e.jsxs(ha,{children:[e.jsx("span",{children:l?l.name:"Nenhum arquivo selecionado"}),e.jsx("label",{htmlFor:"videoFile",children:"Selecionar"}),e.jsx("input",{type:"file",id:"videoFile",accept:"video/*",onChange:R})]}),p&&e.jsx("p",{children:p}),e.jsxs(Oc,{children:[e.jsx(Uc,{to:"/produtos",children:"Cancelar"}),e.jsx(qc,{type:"submit",disabled:p&&!p.startsWith("Erro"),children:p&&!p.startsWith("Erro")?p:"Salvar Produto"})]})]}),e.jsx(Dr,{isOpen:x,onClose:()=>{g(!1),t("/produtos")},title:"Sucesso!",message:"Produto criado com sucesso!"})]})},tr=r.div`
  width: 96vw;
  max-width: 1400px;
  margin: 32px auto;
  background: #19232e;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  padding: 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`,Wc=r.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
`,Yc=r.div`
  background-color: #2d3748;
  padding: 1.5rem 2rem;
  border-radius: 15px;
`,Vc=r.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #1a202c;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4a5568;
  border: 1px solid #4a5568;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`,Gc=r.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
`,ba=r.div`
  flex: 1 1 400px;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: flex-start;
`,rr=r.input`
  width: 100%;
  min-width: 220px;
  max-width: 420px;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #fff;
  font-size: 0.92rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.2);
    outline: none;
  }
`,Kc=r.textarea`
  width: 100%;
  min-width: 220px;
  max-width: 420px;
  padding: 0.5rem 0.7rem;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1a202c;
  color: #fff;
  font-size: 0.92rem;
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  &:focus {
    border-color: #9dd9d2;
    box-shadow: 0 0 0 2px rgba(157, 217, 210, 0.2);
    outline: none;
  }
`,fa=r.div`
  background-color: #1a202c;
  border: 1px solid #4a5568;
  border-radius: 6px;
  padding: 0.5rem 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    color: #a0aec0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 0.7rem;
    font-size: 0.85rem;
  }
  label {
    background-color: #4a5568;
    color: #fff;
    padding: 0.3rem 0.7rem;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-shrink: 0;
    font-size: 0.85rem;
    &:hover {
      background-color: #718096;
    }
  }
  input[type="file"] {
    display: none;
  }
`,Xc=r.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.7rem;
  margin-top: 1rem;
`,Qc=r.button`
  background-color: #9dd9d2;
  color: #1a202c;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }
  &:hover:not(:disabled) {
    background-color: #86c7bf;
    transform: translateY(-2px);
  }
`,Jc=r(pe)`
  background-color: #4a5568;
  color: #fff;
  border-radius: 6px;
  padding: 0.6rem 1.1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  &:hover {
    background-color: #718096;
  }
`,tt=r.label`
  font-weight: 500;
  margin-bottom: -0.2rem;
  font-size: 0.88rem;
`,Tt="https://suporteatostech.com/storage",ar="/images",Oe=(t,a)=>{const o=String(t||"").replace(/\/$/,""),n=String(a||"").replace(/^\/+/,"");return`${o}/${n}`},Zc=(t,a)=>{if(!t||typeof t!="string")return null;let o=t.trim().replace(/\\+/g,"/");const n=o.toLowerCase();if(/^https?:\/\//i.test(o)||o.startsWith("/"))return o;if(n.startsWith("images/")){const c=o.replace(/^images\//i,"");return Oe(ar,c)}const i=n.indexOf("/images/");if(i>=0){const c=o.slice(i+8);return Oe(ar,c)}if(n.startsWith("/images/"))return o;if(n.startsWith("/storage/"))return Oe(Tt,o.replace(/^\/storage\//i,""));if(n.startsWith("storage/"))return Oe(Tt,o.replace(/^storage\//i,""));const l=n.indexOf("/storage/");if(l>=0){const c=o.slice(l+9);return Oe(Tt,c)}return!o.includes("/")&&a?Oe(ar,`${String(a).trim()}/${o}`):Oe(Tt,o)},ep=()=>{const{productId:t}=$r(),a=Pe(),[o,n]=s.useState(null),[i,l]=s.useState(!0),[c,p]=s.useState(null),[d,x]=s.useState(null),[g,u]=s.useState(""),[b,R]=s.useState(!1);s.useEffect(()=>{(async()=>{l(!0);try{const E=await kl(t);n(E.data)}catch(E){console.error("Não foi possível carregar o produto:",E),alert("Não foi possível carregar o produto.")}finally{l(!1)}})()},[t]);const y=$=>{const{name:E,value:L}=$.target;n(H=>({...H,[E]:L}))},m=$=>{p($.target.files[0])},A=$=>{x($.target.files[0])},I=async $=>{$.preventDefault(),u("Atualizando produto...");try{await _l(t,o,c,d),R(!0)}catch(E){u("Erro ao atualizar o produto."),console.error(E)}};if(i)return e.jsx(tr,{children:e.jsx("h2",{style:{textAlign:"center",margin:"40px 0"},children:"Carregando produto..."})});if(!o)return e.jsx(tr,{children:e.jsx("h2",{style:{textAlign:"center",margin:"40px 0"},children:"Produto não encontrado."})});const D=Zc(o.image_url||o.image||o.photo_url||o.thumbnail_url,o.id);return e.jsxs(tr,{children:[e.jsxs("h1",{style:{textAlign:"center",marginBottom:32},children:["Editar Produto: ",e.jsx("span",{style:{color:"#9dd9d2"},children:o.name})]}),e.jsxs(Wc,{children:[e.jsxs(Yc,{style:{minWidth:220,maxWidth:320},children:[e.jsx("h3",{style:{marginBottom:16},children:"Visualização Atual"}),e.jsx(Vc,{children:D?e.jsx("img",{src:D,alt:o.name||"Produto",loading:"lazy"}):e.jsx(Cr,{size:40})}),e.jsxs("p",{children:[e.jsx("strong",{children:"Preço:"})," ",e.jsx("span",{style:{color:"#9dd9d2"},children:o.price})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Estoque:"})," ",e.jsx("span",{style:{color:"#9dd9d2"},children:o.stock})]}),e.jsxs("p",{children:[e.jsx("strong",{children:"Descrição:"})," ",e.jsx("span",{style:{color:"#e2e8f0"},children:o.description})]})]}),e.jsxs("div",{style:{flex:1},children:[e.jsx("h3",{style:{marginBottom:"2rem",color:"#9dd9d2",textAlign:"left"},children:"Novas Informações"}),e.jsxs(Gc,{onSubmit:I,children:[e.jsxs(ba,{children:[e.jsxs(tt,{children:["Nome do Produto ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(rr,{type:"text",name:"name",value:o.name,onChange:y,required:!0,placeholder:"Nome do produto"}),e.jsxs(tt,{children:["Preço ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(rr,{type:"number",step:"0.01",name:"price",value:o.price,onChange:y,required:!0,placeholder:"R$"}),e.jsxs(tt,{children:["Imagem (atual: ",o.image||"nenhuma",")"]}),e.jsxs(fa,{children:[e.jsx("span",{children:c?c.name:"Escolher nova imagem"}),e.jsx("label",{htmlFor:"imageFile",children:"Selecionar"}),e.jsx("input",{type:"file",id:"imageFile",accept:"image/*",onChange:m})]})]}),e.jsxs(ba,{children:[e.jsx(tt,{children:"Descrição"}),e.jsx(Kc,{name:"description",value:o.description||"",onChange:y,placeholder:"Descrição do produto"}),e.jsxs(tt,{children:["Estoque ",e.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),e.jsx(rr,{type:"number",name:"stock",value:o.stock,onChange:y,required:!0,placeholder:"Quantidade"}),e.jsxs(tt,{children:["Vídeo (atual: ",o.video||"nenhum",")"]}),e.jsxs(fa,{children:[e.jsx("span",{children:d?d.name:"Escolher novo vídeo"}),e.jsx("label",{htmlFor:"videoFile",children:"Selecionar"}),e.jsx("input",{type:"file",id:"videoFile",accept:"video/*",onChange:A})]})]}),g&&e.jsx("p",{style:{color:g.startsWith("Erro")?"#ef4444":"#9dd9d2",marginTop:6,fontSize:"0.85rem"},children:g}),e.jsxs(Xc,{children:[e.jsx(Jc,{to:"/produtos",children:"Cancelar"}),e.jsx(Qc,{type:"submit",disabled:g&&!g.startsWith("Erro"),children:g&&!g.startsWith("Erro")?g:"Salvar Alterações"})]})]})]})]}),e.jsx(Dr,{isOpen:b,onClose:()=>{R(!1),a("/produtos")},title:"Sucesso!",message:"Produto atualizado com sucesso!"})]})};async function tp(t,a,o,n={}){const i=new URLSearchParams;t&&i.set("page",String(t));const l=n.planOverride,c=n.dateOverride,p=l??o,d=c??a;d&&i.set("date",d),p&&p!=="todos"&&i.set("plan",p),n.recentActions&&i.set("recent_actions","1");const x=n.searchValue??n.q??"";x&&i.set("q",String(x));const g=n.statusCode??n.status_code??null;g&&String(g).toLowerCase()!=="all"&&i.set("status_code",String(g));const u={};return n.signal&&(u.signal=n.signal),J.get(`/admin/separation?${i.toString()}`,u)}async function va(t,a){return J.patch(`/admin/separation/${t}`,{status:a})}async function ya(t){return J.post(`/admin/orders/${t}/shipping/label`)}const rp=r.nav`
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`,ja=r.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`,ap=r.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`,op=r.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,np=({filters:t,search:a})=>{const o=["kanban","list","timeline"],i=o.map(c=>t.find(p=>p.id===c)).map(c=>c||{id:"timeline",label:"Linha do Tempo",isActive:!1,onSelect:()=>{}}),l=t.filter(c=>!o.includes(c.id));return e.jsxs(rp,{"aria-label":"Filtros de visualização",children:[e.jsx(ja,{children:i.map(({id:c,label:p,isActive:d=!1,onSelect:x})=>e.jsx(Ne,{isActive:d,onClick:()=>x(c),active:void 0,$active:void 0,count:void 0,children:p},c))}),e.jsx(ja,{children:e.jsxs(ap,{children:[a&&e.jsx("div",{children:a}),e.jsx(op,{children:l.map(({id:c,label:p,isActive:d=!1,onSelect:x})=>e.jsx(Ne,{isActive:d,onClick:()=>x(c),active:void 0,$active:void 0,count:void 0,children:p},c))})]})})]})},Ir=r.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid rgba(34,197,94,.45);
  background: rgba(34,197,94,.12);
  color: #d1fae5;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: .02em;
  cursor: pointer;
  &:hover { background: rgba(34,197,94,.18); border-color: rgba(34,197,94,.55); }
  &:disabled { opacity: .55; cursor: not-allowed; }
`,sp=X`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,ip=r.div`
  all: unset;
  display: block;
  width: 100%;
`,lp=r.article`
  background: #0f172a;
  color: var(--color-text, #e5e7eb);
  border-radius: 14px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1.5px solid rgba(148,163,184,.22);
  box-shadow: 0 6px 18px rgba(0,0,0,.22);
  width: 100%;
  max-width: 100%;
  min-height: 210px;
  overflow: hidden;
  position: relative;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
  & *, & *::before, & *::after { box-sizing: border-box; min-width: 0; }

  /* Hover: elevação sutil + brilho suave */
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(0,0,0,.28), 0 2px 10px rgba(99,102,241,.12);
    border-color: rgba(148,163,184,.32);
  }

  /* Sheen removido */

  /* Estado atualizando: borda pulsante sutil */
  ${({$updating:t})=>t&&he`
    border-color: rgba(99,102,241,.45);
    box-shadow: 0 0 0 2px rgba(99,102,241,.12) inset, 0 6px 18px rgba(0,0,0,.22);
  `}
`,dp=r(pe)`
  all: unset;
  display: block;
  cursor: pointer;
  color: inherit !important;
  text-decoration: none !important;
`,cp=r.h3`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,pp=r.p`
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: var(--color-muted, #94a3b8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,up=r.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 100%;
`,xp=r.span`
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 9px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-red-danger, #ef4444);
  border: 1px solid var(--color-red-danger, #ef4444);
  background: rgba(239,68,68,.08);
`,gp=r.div`
  background: rgba(30,41,59,.6);
  border: 1px solid var(--color-border, #2d3b4f);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  overflow: hidden;
`,or=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-muted, #b6c2cf);
  font-size: 0.82rem;
`,nr=r.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,mp=r.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: .01em;
  color: ${({$tone:t})=>t==="danger"?"#f87171":t==="warn"?"#facc15":"#34d399"};
`,hp=r.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
`,bp=r.hr`
  width: 100%;
  border: none;
  border-top: 1px solid rgba(148,163,184,.15);
  margin: 4px 0 0;
`,fp=r.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding-top: 6px;
`,vp=r.span`
  flex: 1 1 auto;
  color: var(--color-text-muted, #b6c2cf);
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,yp=r.div`
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
  align-items: center;
`,wa=r.button`
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(148,163,184,.25);
  background: rgba(30,41,59,.7);
  color: var(--color-text, #e5e7eb);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  line-height: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,.25) inset;
  &:hover:not(:disabled) {
    background: rgba(139,92,246,.18);
    border-color: rgba(139,92,246,.45);
  }
  &:disabled {
    opacity: .55;
    cursor: not-allowed;
  }
  svg { opacity: .95; }
`,ka=r.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(148,163,184,.4);
  border-top-color: rgba(148,163,184,1);
  border-radius: 50%;
  animation: ${sp} 0.8s linear infinite;
`;r.p`
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-align: center;
  margin: 0;
  font-style: italic;
`;const jp=({orderId:t,linkId:a,title:o,titleComplement:n,deadline_start:i,deadline_end:l,tags:c=[],assignee:p,isUpdating:d=!1,canMoveForward:x=!1,canMoveBackward:g=!1,onMove:u=()=>{},extraActionLabel:b,onExtraAction:R,extraActionDisabled:y})=>{const m=s.useMemo(()=>p?String(p).trim().split(/\s+/).slice(0,2).join(" "):"Não atribuido",[p]),{tone:A,statusText:I}=s.useMemo(()=>{if(!i||!l)return{tone:"warn",statusText:"Sem prazo definido"};const E=new Date(i),L=new Date(l),H=new Date;[E,L,H].forEach(B=>B.setHours(0,0,0,0));const f=Math.ceil((L.getTime()-H.getTime())/864e5);return f<0?{tone:"danger",statusText:"Prazo encerrado"}:f<=3?{tone:"danger",statusText:`Restam ${f} ${f===1?"dia":"dias"}`}:f<=7?{tone:"warn",statusText:`Restam ${f} dias`}:{tone:"ok",statusText:`Restam ${f} dias`}},[i,l]),D=n?`${o} - ${n}`:o,$=E=>d?e.jsx(ka,{"aria-hidden":!0}):E==="next"?e.jsx(wn,{size:"0.85em"}):e.jsx(kn,{size:"0.85em"});return e.jsx(ip,{children:e.jsxs(lp,{"aria-label":D,$updating:d,children:[e.jsxs(dp,{to:a?`/assinantes/${a}`:"#","aria-label":D,children:[e.jsx(cp,{title:o,children:o}),n&&e.jsx(pp,{title:n,children:n})]}),c.length>0?e.jsx(up,{children:c.map(E=>e.jsx(xp,{title:E.label,children:E.label},E.id))}):e.jsx(e.Fragment,{}),e.jsxs(gp,{children:[t&&e.jsxs(or,{children:[e.jsx(vn,{}),e.jsxs(nr,{children:["Pedido: #",String(t)]})]}),i&&e.jsxs(or,{children:[e.jsx(yn,{}),e.jsxs(nr,{children:["Inicio: ",new Date(i).toLocaleDateString("pt-BR",{timeZone:"UTC"})]})]}),l&&e.jsxs(or,{children:[e.jsx(jn,{}),e.jsxs(nr,{children:["Limite: ",new Date(l).toLocaleDateString("pt-BR",{timeZone:"UTC"})]})]}),e.jsxs(mp,{$tone:A,children:[e.jsx(hp,{})," ",I]})]}),e.jsx(bp,{}),e.jsxs(fp,{children:[e.jsx(vp,{title:p||"Nao atribuido",children:m}),e.jsxs(yp,{children:[b&&R&&e.jsx(Ir,{onClick:R,"aria-label":b,disabled:y,children:y?e.jsxs(e.Fragment,{children:[e.jsx(ka,{"aria-hidden":!0,style:{marginRight:8}}),"Gerando..."]}):b}),e.jsx(wa,{onClick:()=>u("prev"),disabled:!g||d,"aria-label":"Mover para etapa anterior",children:$("prev")}),e.jsx(wa,{onClick:()=>u("next"),disabled:!x||d,"aria-label":"Mover para proxima etapa",children:$("next")})]})]})]})})},wp=r.section.attrs({className:"kanban-scope"})`
  background: var(--color-surface, #111827);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-width: 0;
  max-height: calc(100vh - 280px);
  overflow: hidden;
  border: 1px solid var(--color-border, #374151);
  width: 100%;
  max-width: 100%;
`,kp=r.header`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.25rem;
  flex-shrink: 0;
`,Sp=r.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text, #f8fafc);
`,_p=r.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-muted, #94a3b8);
`,Cp=r.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 0.25rem 0.5rem;
  min-width: 0;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: var(--color-surface2, #1f2937);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-border, #374151);
  }
`,$p=r.div`
  border-radius: 8px;
  padding: 2rem 1rem;
  font-size: 0.875rem;
  color: var(--color-muted, #94a3b8);
  text-align: center;
`,Ap=r.span`
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 9px;
  border: 1px solid rgba(148,163,184,.35);
  background: rgba(148,163,184,.12);
  color: #cbd5e1;
  font-weight: 700;
  font-size: 0.7rem;
`,Ep=({title:t,count:a=0,cards:o=[],emptyState:n,recent:i=!1})=>e.jsxs(wp,{"aria-label":t,children:[e.jsxs(kp,{children:[e.jsxs(Sp,{children:[t," ",i&&e.jsx(Ap,{children:"Recentes"})]}),e.jsxs(_p,{children:["(",a,")"]})]}),e.jsx(Cp,{children:o.length>0?o.map(l=>e.jsx(jp,{...l},l.id)):e.jsx($p,{children:n??"Nenhum item nesta coluna."})})]});function sr({children:t,direction:a="up",duration:o=600,distance:n=20,delay:i=0,disabled:l=!1,className:c="",style:p={}}){const d=`animated-entrance animated-entrance--${a} ${l?"animated-entrance--noanim":""} ${c}`.trim(),x={"--anim-duration":`${o}ms`,"--anim-distance":`${n}px`,"--anim-delay":`${i}ms`};return e.jsx("div",{className:d,style:{...x,...p},children:t})}const zp=he`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: .01em;
  white-space: nowrap;
`,Pp={neutral:he`
    background: #334155; /* slate-700 */
    color: #e5e7eb; /* slate-200 */
    border: 1px solid rgba(148,163,184,.25);
  `,info:he`
    background: #0ea5e9; /* sky-500 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `,warn:he`
    background: #f59e0b; /* amber-500 */
    color: #0b1220; /* dark text for contrast */
    border: 1px solid rgba(251,191,36,.25);
  `,danger:he`
    background: #e11d48; /* rose-600 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `,success:he`
    background: #10b981; /* emerald-500 */
    color: #ffffff;
    border: 1px solid rgba(255,255,255,.15);
  `};r.span`
  ${zp}
  ${t=>Pp[t.$intent||"neutral"]}
  ${t=>t.$clickable?he`
    cursor: pointer;
    transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
    &:hover { transform: translateY(-1px); filter: brightness(1.03); box-shadow: 0 4px 12px rgba(0,0,0,.25); }
    &:active { transform: translateY(0); filter: brightness(0.98); }
  `:""}
`;const nt="#334155",Po="#0f172a",Lo="#1e293b",Lp="#facc15",Tp="rgba(234,179,8,0.10)",Dp="#67e8f9",Fp="rgba(6,182,212,0.10)",Ip=r.main`
  background-color: transparent;
  min-height: 100vh;
  width: 100%;
  display: block; /* avoid centering that reduced effective content width */
  padding: 0; /* let inner table control spacing */
`,Rp=r.div`
  width: 100%;
  max-width: none; /* remove limite para permitir ocupar toda a largura do parent */
  margin: 0;
  background-color: transparent;
  border-radius: 8px;
  /* overflow: hidden; */ /* Comentado para evitar que o menu seja cortado */
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1); /* subtle outer border */
  position: relative; /* suporte ao header sticky */
`,bt=r.div`
  padding: 12px 18px;
  font-size: 14px; /* requested */
  font-weight: 700;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: ${({align:t="left"})=>t==="center"?"center":t==="right"?"flex-end":"flex-start"};
  background: transparent; /* header background set on parent .header */
  border-bottom: none;
  white-space: nowrap;
  /* precisa permitir que o dropdown extrapole a célula */
  overflow: visible;
  text-overflow: ellipsis;
  min-width: 0; /* allow ellipsis in grid items */
  /* aceita prop colSpan para usar grid-column sem inline styles */
  grid-column: span ${({colSpan:t=1})=>t};
  line-height: 1.2;
  min-height: 44px;
  position: relative; /* contexto para dropdown do filtro */
  
`,Dt=r.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
  align-items: center;
  transition: background-color 0.2s;

  /* Estilo do cabeçalho */
  &.header {
    /* header uses the same column gap as data rows to keep perfect alignment */
    gap: 1rem;
    background: ${nt};
    border-radius: 8px 8px 0 0;
    padding: 0.25rem 0; /* vertical padding inside header bar */
    align-items: center;
    position: relative; /* cria contexto para dropdown do cabeçalho */
    z-index: 200; /* assegura que o menu do cabeçalho fique acima das linhas */
    /* sticky removido a pedido: header rola junto */
  }

  /* Estilo das linhas de dados */
  &.data-row {
    padding: 10px 12px; /* altura mais uniforme */
    min-height: 52px;
    &:hover {
      background-color: rgba(255,255,255,0.02);
    }
    &.odd {
      background-color: ${Po};
    }
    &.even {
      background-color: ${Lo};
    }
    /* divider between rows implemented as border-top on each row */
    border-top: 1px solid ${nt};
  }
`,qe=r.div`
  grid-column: span ${({colSpan:t=1})=>t};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 18px; /* iguala ao padding horizontal do header (CustomTh) */
  text-align: ${({align:t="left"})=>t};
  align-items: ${({align:t="left"})=>t==="center"?"center":t==="right"?"flex-end":"flex-start"};
  min-width: 0;
  line-height: 1.2;
  

  .main-text {
    font-size: 13px;
    font-weight: 600;
    color: #e2e8f0; /* main text */
    line-height: 1.2;
  }

  .secondary-text {
    font-size: 12px;
    color: #94a3b8; /* muted */
    line-height: 1.15;
  }

  /* Reforço para a coluna de Ação: conteúdo à direita */
  &.cell-actions {
    align-items: flex-end;
    justify-content: center; /* vertical */
  }

  /* utilitário para garantir duas linhas estáveis (título + meta) */
  .two-line {
    display: grid;
    grid-template-rows: 1.25em 1.1em;
    row-gap: 4px;
    align-items: center;
    width: 100%;
    min-width: 0;
  }

`,To=r.div`
  display: flex;
  flex-direction: column;
  align-items: ${({align:t="flex-start"})=>t};
`,vr=r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
`,yr=r.span`
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: ${({intent:t})=>t==="danger"?"#ef4444":t==="warn"?"#f59e0b":"#0ea5e9"};
`,jr=r.span`
  font-size: 11px;
  color: #94a3b8;
`,Np=r.span`
  color: #64748B;
`,Do=r.div`
  position: relative;
  display: inline-flex;
  border-radius: 9999px; /* Pílula contínua */
  background-color: #334155; /* fundo único do grupo */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  /* NÃO usar overflow: hidden; para não cortar o dropdown */
  gap: 0; /* sem espaço entre botões */
`,st=r.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px; /* reduzido */
  padding: 0 12px; /* reduzido */
  border: none;
  background-color: transparent; /* transparente para usar o fundo do container */
  color: #e2e8f0;
  font-size: 13px; /* reduzido */
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  border-radius: 0; /* pílula é do container, não de cada botão */
  position: relative; /* necessário para o separador pseudo-elemento */

  /* Adiciona um separador sutil entre os botões */
  &:not(:first-child)::before {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    width: 1px;
    height: 60%;
    background-color: #475569;
  }
  
  /* SVG dentro do botão */
  svg {
    margin-left: 8px;
    width: 14px; /* reduzido */
    height: 14px; /* reduzido */
  }

  /* Hover que preserva o formato arredondado nas extremidades */
  &:hover {
    background-color: rgba(255, 255, 255, 0.06); /* hover um pouco mais visível */
  }
  &:first-child:hover {
    border-top-left-radius: 9999px;
    border-bottom-left-radius: 9999px;
  }
  &:last-child:hover {
    border-top-right-radius: 9999px;
    border-bottom-right-radius: 9999px;
  }

  /* Focus ring sutil para acessibilidade */
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(148, 163, 184, 0.35) inset;
  }

  /* Botão de ícone sem círculo: apenas o ícone com mesmo fundo do grupo */
  &.icon-only {
    width: auto;
    min-width: 38px; /* reduzido mantendo área clicável */
    padding: 0 8px; /* reduzido */
    background: ${({$intent:t="default"})=>t==="ready"?"rgba(34, 197, 94, 0.18)":t==="available"?"rgba(59, 130, 246, 0.16)":"transparent"};
    border: none;
    color: ${({$intent:t="default"})=>t==="ready"?"#4ade80":t==="available"?"#38bdf8":"#94a3b8"};
    svg { margin-left: 0; color: currentColor; }

    &:not(:disabled):hover {
      background-color: ${({$intent:t="default"})=>t==="ready"?"rgba(34, 197, 94, 0.32)":t==="available"?"rgba(59, 130, 246, 0.28)":"rgba(255,255,255,0.06)"};
      color: ${({$intent:t="default"})=>t==="ready"?"#bef264":t==="available"?"#bfdbfe":"#cbd5e1"};
    }
  }

  /* Estado de Hover herdado acima (cores mais sutis) */

  /* Estado Desabilitado */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Mantemos o botão neutro (sem variante verde) para casar com o screenshot */
`,Fo=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text, #e5e7eb);
  svg { color: inherit; fill: currentColor; }
`,Io=r.button`
  background: transparent;
  border: none;
  color: inherit;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
`,Ot=r.ul`
  position: absolute;
  right: 0;
  /* direção dinâmica: abre acima (up) ou abaixo (down) */
  ${({$direction:t})=>t==="down"?"top: calc(100% + 8px); bottom: auto;":"bottom: calc(100% + 8px); top: auto;"}
  min-width: 180px;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  list-style: none;
  padding: 8px;
  margin: 0;
  z-index: 100; /* acima do header sticky (z-index:20) */
  z-index: 1000; /* elevar acima das linhas da tabela e demais elementos */
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Lógica de visibilidade */
  visibility: ${({$isOpen:t})=>t?"visible":"hidden"};
  opacity: ${({$isOpen:t})=>t?1:0};
  transform: ${({$isOpen:t,$direction:a})=>t?"translateY(0)":a==="down"?"translateY(-8px)":"translateY(8px)"};
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
`,wt=r.li`
  padding: 8px 12px;
  font-size: 14px;
  color: #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;
  display: block;
  white-space: nowrap;

  &:hover {
    background-color: #334155;
    color: #ffffff;
  }
`,Mp=r(pe)`
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  color: #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: #334155;
    color: #ffffff;
  }
`;r.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.7rem; /* reduzido */
  border-radius: 9999px;
  font-size: 0.85rem; /* reduzido */
  font-weight: 700;
  
  &.status-em-separacao {
    background-color: ${Tp};
    color: ${Lp};
  }

  &.status-aguardando-separacao {
    background-color: ${Fp};
    color: ${Dp};
  }
  
  /* Adicione outros status aqui se necessário */
`;const Bp=r.div`
  width: 100%;
  max-width: none; /* permitir que a lista ocupe todo o espaço do parent */
  margin: 0;
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1); /* subtle outer border */
`,Op=r.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0; /* no vertical gap, use dividing lines instead */

  thead th {
    background: transparent;
    padding: 12px 18px;
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
    text-align: left;
    border-bottom: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  thead tr {
    background: ${nt};
    border-radius: 8px 8px 0 0;
  }
  /* divider between thead and tbody */
  thead + tbody {
    border-top: 1px solid ${nt};
  }

  tbody tr:nth-child(odd) {
    background: ${Po};
  }

  tbody tr:nth-child(even) {
    background: ${Lo};
  }
  /* divider between rows implemented as border-top */
  tbody tr {
    border-top: 1px solid ${nt};
  }

  tbody tr:hover {
    background-color: rgba(255,255,255,0.02);
  }

  tbody tr {
    border-radius: 0;
  }
`,qp=X`
  from {
    transform: translateX(-60%);
    opacity: 0;
  }
  to {
    transform: translateX(120%);
    opacity: 0.35;
  }
`,Rt=r.tr`
  transition: background-color 0.2s ease, transform 0.26s ease, box-shadow 0.26s ease;

  thead & {
    opacity: 1;
    transform: none;
    animation: none;
  }

  tbody & {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
    animation: ${Ge} 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: ${({$delay:t=0})=>`${t}s`};
    position: relative;
  }

  tbody &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 22px 48px -30px rgba(15, 23, 42, 0.85);
  }

  tbody &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(120deg, rgba(59,130,246,0.08), rgba(16,185,129,0.04));
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
    transform: translateX(-60%);
  }

  @media (hover: hover) {
    tbody &:hover::after {
      opacity: 1;
      animation: ${qp} 0.75s ease forwards;
    }
  }
`,Ve=r.th`
  padding: 16px 20px; /* adjusted padding to match header */
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  text-align: left;
  background: ${nt};
  border-bottom: 1px solid rgba(255,255,255,0.04);
`,Up=r(Ve)`
  width: 120px;
  text-align: center;
`,Hp=r(Ve)``,Wp=r(Ve)`
  width: 160px;
  text-align: center;
`,Yp=r(Ve)`
  position: relative; /* contexto para dropdown do filtro (modo tabela) */
  overflow: visible;  /* evita que o menu seja cortado pelo th */
`,Vp=r(Ve)`
  width: 140px;
`,wr=r.td`
  padding: 10px 20px; /* adjusted to match header horizontal padding */
  vertical-align: middle;
  color: #e2e8f0;
`,Gp=r.td`
  text-align: center;
  color: #94a3b8;
`,Kp=r(pe)`
  display: block;
  font-weight: 700;
  color: #e2e8f0;
  text-decoration: none;
  &:hover { text-decoration: underline; color: #9dd9d2; }
`,Sa=r.div`
  font-size: 12px;
  color: #94a3b8;
`,Xp=r(pe)`
  display: block;
  font-size: 12px;
  color: #94a3b8;
  text-decoration: none;
`,ir=r.td`
  text-align: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`,Qp=r.td`
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`,Jp=r.span`
  font-weight: 700;
  color: #e2e8f0;
`,Zp=r.span`
  display: block;
  color: #94a3b8;
  font-size: 12px;
`,eu=r.div`
  font-weight: 700;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`,tu=r.div`
  font-size: 12px;
  color: #94a3b8;
`,ru=r.td`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.02);
`;r(pe)`
  display: inline-block;
`;const au=he`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;
`,ou=r.span`
  ${au}
  color: ${t=>t.$color||"#cbd5e1"};
  background: ${t=>t.$bg||"transparent"};
  box-shadow: ${t=>t.$inset||"none"};
  display: inline-flex;
  align-items: center;
  min-width: 56px;
`,nu=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
`,su=r.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`,iu=r.span`
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: rgba(148,163,184,0.95);
  margin-top: 0px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,lu={waiting:{color:"#0ea5e9",bg:"rgba(14,165,233,0.08)",inset:"inset 0 0 0 1px rgba(14,165,233,0.12)",Icon:Qa},in_progress:{color:"#f59e0b",bg:"rgba(245,158,11,0.08)",inset:"inset 0 0 0 1px rgba(245,158,11,0.12)",Icon:Xa},ready:{color:"#fb923c",bg:"rgba(251,146,60,0.08)",inset:"inset 0 0 0 1px rgba(251,146,60,0.12)",Icon:_n},shipped:{color:"#16a34a",bg:"rgba(16,163,74,0.08)",inset:"inset 0 0 0 1px rgba(16,163,74,0.12)",Icon:eo},label:{color:"#8b5cf6",bg:"rgba(139,92,246,0.08)",inset:"inset 0 0 0 1px rgba(139,92,246,0.12)",Icon:Sn}};function Rr({statusCode:t,label:a,subLabel:o,intent:n,className:i,title:l,size:c}){const p=String(t||"").trim(),d=lu[p]||null,x=d?d.color:n==="warn"?"#f59e0b":"#94a3b8",g=d?d.bg:"rgba(148,163,184,0.06)",u=d?d.inset:"inset 0 0 0 1px rgba(255,255,255,0.02)",b=d?d.Icon:Cn,R=a||t||"—",y=String(c||"").toLowerCase()==="compact";return e.jsxs(ou,{className:i,$color:x,$bg:g,$inset:u,style:{padding:y?"4px 10px":void 0,fontSize:y?"12px":void 0,gap:y?"4px":void 0,minWidth:y?"48px":void 0},title:l||R,"aria-label":R,children:[e.jsxs(su,{children:[e.jsx(nu,{"aria-hidden":"true",children:e.jsx(b,{style:{color:x,width:y?14:16,height:y?14:16}})}),e.jsx("span",{children:R})]}),o&&e.jsx(iu,{style:{fontSize:y?10:void 0,marginTop:y?1:void 0},children:o})]})}function _a(t){const a=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),n=String(t.getDate()).padStart(2,"0");return`${a}-${o}-${n}`}function Nr(t){if(!t)return{intent:"neutral",label:"-"};const a=new Date,o=_a(a);if(t<o)return{intent:"danger",label:"Atrasado"};const n=new Date(a);return n.setDate(a.getDate()+1),t<=_a(n)?{intent:"warn",label:"Prazo curto"}:{intent:"info",label:"Em prazo"}}function Ro(t){return String(t||"").replace(/^\s*[0-9]+[\.\-\s]+/,"").trim().toLowerCase().replace(/\b\w/g,i=>i.toUpperCase())}function du(){const[t,a]=s.useState(!1),[o,n]=s.useState(null),i=s.useRef([]),l=s.useRef(null),c=s.useCallback(()=>{a(!1),l.current?.focus()},[]),p=s.useCallback(x=>{const g=!t;if(a(g),g){const u=x.currentTarget,b=u.offsetParent||u.parentElement||document.body,R=u.getBoundingClientRect(),y=b.getBoundingClientRect(),m=R.left-y.left,A=R.bottom-y.top+6;n({top:A,left:m}),l.current=u}},[t]),d=s.useCallback(x=>{const g=i.current.filter(Boolean);if(!g.length)return;const u=g.findIndex(b=>b===document.activeElement);if(x.key==="ArrowDown"){x.preventDefault();const b=(u+1)%g.length;g[b]?.focus()}else if(x.key==="ArrowUp"){x.preventDefault();const b=(u-1+g.length)%g.length;g[b]?.focus()}else x.key==="Home"?(x.preventDefault(),g[0]?.focus()):x.key==="End"?(x.preventDefault(),g[g.length-1]?.focus()):x.key==="Escape"&&(x.preventDefault(),c())},[c]);return{isMenuOpen:t,menuPos:o,menuItemRefs:i,activeButtonRef:l,handleMenuToggle:p,handleKeyDown:d,closeMenu:c}}const cu=({size:t=16,color:a="currentColor",...o})=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:t,height:t,viewBox:"0 0 24 24",fill:"none",stroke:a,strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",...o,children:[e.jsx("polyline",{points:"6 9 6 2 18 2 18 9"}),e.jsx("path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}),e.jsx("rect",{x:"6",y:"14",width:"12",height:"8"})]});function pu({item:t,statusPipeline:a,stageByCode:o,recentActions:n,labelLocked:i,updatingIds:l,onGenerateLabel:c,onSetStatus:p,index:d=0}){const x=Pe(),{isMenuOpen:g,menuItemRefs:u,activeButtonRef:b,handleMenuToggle:R,handleKeyDown:y,closeMenu:m}=du(),[A,I]=Ae.useState("up"),D=t.status_code?o[t.status_code]:void 0,$=Nr(t.next_shipment_date),E=!!l[t.order_id],L=String(t.mother_name||"").split(" ").slice(0,2).join(" "),H=(t.baby_name||"Bebê não informado").split(" ").slice(0,2).join(" "),f=t.product_to_send?.name||t.brinquedo?.name||t.product?.name||t.product_name||"Produto não mapeado",B=Ro(f),Z=i[t.order_id]||t.label_generated,T=String(t.status_code||"").toLowerCase(),O=(D?.statusCode==="shipped"||D?.key==="shipped"||T==="shipped")&&!Z,P=O?"ready":Z?"available":"default",C=()=>{Z?x(`/shipping/labels?order_id=${t.order_id}`):O&&c?.(t.order_id)},j=()=>E?"Processando...":Z?"Ver etiqueta gerada":O?"Gerar etiqueta":'Aguardando status "Enviado"',_=(()=>{const W=new Date;W.setHours(0,0,0,0);try{const w=new Date(String(t.next_shipment_date||"")+"T00:00:00"),v=Math.ceil((w-W)/(1440*60*1e3));return Number.isNaN(v)?"":v<0?"Prazo encerrado":v===0?"Envia hoje":v===1?"Resta 1 dia":`Restam ${v} dias`}catch{return""}})(),N=()=>{try{const W=b?.current;if(W&&typeof window<"u"){const w=W.getBoundingClientRect(),v=window.innerHeight-w.bottom,F=w.top;I(v>=260||v>=F?"down":"up")}}catch{}R()};return e.jsxs(Rt,{$delay:.08*(d+1),children:[e.jsx(wr,{children:e.jsx(Kp,{title:t.mother_name,to:`/assinantes/${t.subscriber_id||t.user_id||t.id}`,children:L})}),e.jsx(wr,{children:e.jsx(Sa,{children:e.jsx(Xp,{title:H,to:`/assinantes/${t.subscriber_id||t.user_id||t.id}`,children:H})})}),e.jsxs(ir,{children:[e.jsxs(Jp,{children:["#",t.order_id]}),e.jsx(Zp,{children:t.plan_name||""})]}),e.jsxs(Qp,{children:[e.jsx(eu,{title:f,children:B}),e.jsx(tu,{children:_})]}),e.jsxs(ru,{children:[e.jsxs(Do,{children:[e.jsx(st,{ref:b,onClick:N,"aria-haspopup":"true","aria-expanded":g,"aria-label":"Definir status",title:E?"Ação em andamento":"Definir status",disabled:E,children:E?"Processando...":"Definir"}),e.jsx(st,{className:"icon-only",$intent:P,onClick:C,disabled:E||!O&&!Z,title:j(),children:e.jsx(cu,{size:16})})]}),g&&e.jsxs(Ot,{$isOpen:g,$direction:A,role:"menu",onKeyDown:y,children:[a.filter(W=>!("isFallback"in W)).map((W,w)=>e.jsx(wt,{as:"button",role:"menuitem",tabIndex:0,ref:v=>{u.current[w]=v},onClick:async()=>{m(),await p?.(t.order_id,W.statusCode)},children:W.statusLabel},W.statusCode)),Z&&e.jsx(wt,{as:Mp,to:`/shipping/labels?order_id=${t.order_id}`,onClick:m,children:"Ver histórico de etiquetas"})]})]}),e.jsxs(ir,{children:[e.jsxs(To,{align:"flex-start",children:[e.jsx(Rr,{size:"compact",statusCode:t.status_code,label:D?D.statusLabel:t.status||"Não definido"}),e.jsxs(vr,{children:[e.jsx(yr,{intent:$.intent}),e.jsx(jr,{children:_||$?.label})]})]}),n&&e.jsx(Sa,{children:"Recente"})]}),e.jsx(ir,{children:e.jsxs(vr,{children:[e.jsx(yr,{intent:$.intent}),e.jsx(jr,{children:_||$.label})]})})]})}function uu({items:t=[],loading:a=!1,onSetStatus:o,onUpdateStatus:n,onGenerateLabel:i,statusPipeline:l=[],stageByCode:c={},updatingIds:p={},labelLocked:d={},statusOptions:x=[],statusFilter:g,setStatusFilter:u,sortBy:b,sortDir:R,toggleSort:y}){const[m,A]=s.useState(null),[I,D]=s.useState({}),$=Ae.useRef({}),E=Ae.useRef({}),[L,H]=s.useState(!1),f=s.useRef(null);s.useEffect(()=>{function P(C){try{f.current&&!f.current.contains(C.target)&&H(!1)}catch{}}return L&&document.addEventListener("mousedown",P),()=>document.removeEventListener("mousedown",P)},[L]);const B=P=>{if(!P&&P!==0)return"";try{const C=String(P).trim().replace(/\s+/g," ");if(!C)return"";const j=C.split(" ");return j.length<=2?C:j.slice(0,2).join(" ")}catch{return String(P)}},Z=P=>{try{const C=$.current[P];if(C&&typeof window<"u"){const j=C.getBoundingClientRect(),_=window.innerHeight-j.bottom,N=j.top,W=_>=260||_>=N?"down":"up";D(w=>({...w,[P]:W}))}}catch{}A(C=>C===P?null:P)};Ae.useEffect(()=>{if(!m)return;const P=_=>{try{const N=E.current[m];N&&!N.contains(_.target)&&A(null)}catch{}},C=_=>{_.key==="Escape"&&A(null)},j=()=>{A(null)};return document.addEventListener("mousedown",P,!0),document.addEventListener("touchstart",P,!0),document.addEventListener("keydown",C,!0),window.addEventListener("scroll",j,!0),()=>{document.removeEventListener("mousedown",P,!0),document.removeEventListener("touchstart",P,!0),document.removeEventListener("keydown",C,!0),window.removeEventListener("scroll",j,!0)}},[m]);const T=async(P,C)=>{if(!(!P||!o))try{await o(P,C),A(null)}catch(j){console.error("onSetStatus error",j)}},q=s.useMemo(()=>t.map(P=>{const C=P.status_code?c[P.status_code]:void 0,j=Ro(P.product_to_send?.name||P.product_name||"—"),_=(()=>{const W=new Date;W.setHours(0,0,0,0);try{const w=new Date(String(P.next_shipment_date||"")+"T00:00:00"),v=Math.ceil((w-W)/(1440*60*1e3));return Number.isNaN(v)?"":v<0?"Prazo encerrado":v===0?"Envia hoje":v===1?"Resta 1 dia":`Restam ${v} dias`}catch{return""}})(),N=Nr(P.next_shipment_date);return{item:P,stage:C,product:j,sla:N,slaText:_}}),[t,c]),O=s.useMemo(()=>!g||g==="all"?"Sem resultados":`Nenhum item encontrado para o status "${c?.[g]?.statusLabel||g}".`,[c,g]);return e.jsx(Ip,{children:e.jsxs(Rp,{children:[e.jsxs(Dt,{className:"header",children:[e.jsx(bt,{colSpan:3,align:"left",children:"Assinante / Bebê"}),e.jsx(bt,{colSpan:2,align:"left",children:"Pedido"}),e.jsx(bt,{colSpan:3,align:"left",children:"Brinquedo / Idade"}),e.jsx(bt,{colSpan:2,align:"left",children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsxs(Io,{onClick:()=>y&&y("status"),"aria-label":"Ordenar por status",children:[e.jsx("span",{children:"Status"}),b==="status"?R==="asc"?e.jsx(ao,{size:14,style:{color:"var(--color-primary, #9dd9d2)"}}):e.jsx(oo,{size:14,style:{color:"var(--color-primary, #9dd9d2)"}}):e.jsx(no,{size:14,style:{color:"var(--color-muted, #94a3b8)"}})]}),e.jsxs("div",{ref:f,style:{position:"relative"},children:[e.jsx(st,{className:"icon-only",onClick:()=>H(P=>!P),"aria-haspopup":"true","aria-expanded":L,title:"Filtrar por status","aria-label":"Filtrar por status",children:e.jsx(Fo,{children:e.jsx(so,{size:14})})}),L&&e.jsx(Ot,{$isOpen:L,$direction:"down",children:x.map(P=>e.jsxs(wt,{onClick:()=>{try{u&&u(P.value==="all"?"all":P.value)}finally{H(!1)}},children:[e.jsx("span",{style:{marginRight:8},children:String(P.value)===String(g)?"✓":""}),e.jsx("span",{children:P.label})]},String(P.value)))})]})]})}),e.jsx(bt,{colSpan:2,align:"right",children:"Ação"})]}),a?[...Array(4)].map((P,C)=>e.jsx(Dt,{className:`data-row ${C%2===0?"odd":"even"}`,children:e.jsx(qe,{colSpan:12,children:e.jsx("div",{style:{height:18,width:"100%",background:"rgba(148,163,184,.18)",borderRadius:8}})})},`sk-${C}`)):q.length>0?q.map(({item:P,stage:C,product:j},_)=>e.jsxs(Dt,{className:`data-row ${_%2===0?"odd":"even"}`,children:[e.jsx(qe,{colSpan:3,children:e.jsxs("div",{className:"two-line",children:[e.jsx("span",{className:"main-text",children:B(P.mother_name)}),e.jsxs("span",{className:"secondary-text",children:["Criança: ",B(P.baby_name)]})]})}),e.jsx(qe,{colSpan:2,children:e.jsxs("div",{className:"two-line",children:[e.jsxs("span",{className:"main-text",children:["#",P.order_id]}),e.jsx(Np,{className:"secondary-text",children:P.plan_name})]})}),e.jsx(qe,{colSpan:3,children:e.jsxs("div",{className:"two-line",children:[e.jsx("span",{className:"main-text",children:j}),e.jsx("span",{className:"secondary-text",children:P.baby_age_label})]})}),e.jsx(qe,{colSpan:2,children:e.jsxs(To,{align:"flex-start",children:[e.jsx(Rr,{size:"compact",statusCode:P.status_code,label:C?.statusLabel||P.status||"—"}),e.jsxs(vr,{children:[e.jsx(yr,{intent:q[_].sla?.intent}),e.jsx(jr,{children:q[_].slaText||q[_].sla?.label})]})]})}),e.jsx(qe,{colSpan:2,align:"right",className:"cell-actions",children:e.jsx(Do,{ref:N=>{N&&(E.current[P.order_id]=N)},children:(()=>{const N=!!p?.[P.order_id],W=!!(d?.[P.order_id]||P.label_generated),w=C?.statusCode==="shipped"||C?.key==="shipped",v=N?"Processando...":W?"Etiqueta já gerada":w?"Gerar etiqueta":'Aguardando status "Enviado"';return e.jsxs(e.Fragment,{children:[e.jsx(st,{ref:F=>{F&&($.current[P.order_id]=F)},onClick:()=>Z(P.order_id),disabled:N,title:N?"Ação em andamento":"Definir status",children:N?"Processando...":"Definir"}),e.jsx(st,{className:"icon-only",onClick:()=>{i&&w&&!W&&!N&&i(P.order_id)},disabled:N||!w&&!W,title:v,children:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"6 9 6 2 18 2 18 9"}),e.jsx("path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"}),e.jsx("rect",{x:"6",y:"14",width:"12",height:"8"})]})}),e.jsx(Ot,{$isOpen:m===P.order_id,$direction:I[P.order_id]||"up",onClick:F=>F.stopPropagation(),children:l.filter(F=>!F.isFallback).map(F=>e.jsx(wt,{href:"#",onClick:V=>{V.preventDefault(),!N&&T(P.order_id,F.statusCode)},"aria-disabled":N,style:N?{opacity:.6,pointerEvents:"none"}:{},children:F.statusLabel},F.statusCode))})]})})()})})]},P.order_id)):e.jsx(Dt,{className:"data-row empty",children:e.jsx(qe,{colSpan:12,align:"center",style:{padding:"18px 0"},children:O})})]})})}function Ca({items:t=[],statusPipeline:a=[],stageByCode:o={},recentActions:n=!1,labelLocked:i={},updatingIds:l={},onGenerateLabel:c,onSetStatus:p,onUpdateStatus:d,loading:x=!1,presentation:g=!1,statusOptions:u=[],statusFilter:b,setStatusFilter:R,sortBy:y,sortDir:m,toggleSort:A}){const I=s.useMemo(()=>Array.from(new Map((t||[]).map(f=>[`${f.order_id||""}_${f.subscriber_id||f.user_id||""}_${f.child_id||f.baby_name||""}`,f])).values()),[t]);try{console.debug("[SeparationList] original ids:",Array.isArray(t)?t.map(f=>f.order_id):[]),console.debug("[SeparationList] deduped ids:",Array.isArray(I)?I.map(f=>f.order_id):[])}catch{}const D=s.useMemo(()=>{const f=new Map;return(a||[]).forEach((B,Z)=>{!B||B.isFallback||B.statusCode&&f.set(B.statusCode,Z)}),f},[a]),$=s.useMemo(()=>{if(!y)return I;const f=[...I],B=m==="desc"?-1:1,Z=q=>{if(!q)return[""];if(y==="status"){const P=String(q.status_code||q.status||q.separation_status||""),C=D.has(P)?D.get(P):D.size+1,j=o&&P&&o[P]?.statusLabel||String(q.status||q.separation_status||"")||"";return[C,j.toLowerCase()]}if(y==="mother_name"){const P=String(q.mother_name||q.user?.name||"").toLowerCase(),C=String(q.baby_name||"").toLowerCase();return[P,C]}if(y==="order_id")return[Number(q.order_id)||0];const O=q[y];return[typeof O=="number"?O:String(O??"").toLowerCase()]},T=(q,O)=>{const P=Math.max(q.length,O.length);for(let C=0;C<P;C+=1){const j=q[C],_=O[C];if(j!==_)return typeof j=="number"&&typeof _=="number"?j-_:String(j??"").localeCompare(String(_??""),"pt",{sensitivity:"base"})}return 0};return f.sort((q,O)=>T(Z(q),Z(O))*B),f},[I,y,m,D,o]),[E,L]=s.useState(!1),H=s.useRef(null);return s.useEffect(()=>{function f(B){try{H.current&&!H.current.contains(B.target)&&L(!1)}catch{}}return E&&document.addEventListener("mousedown",f),()=>document.removeEventListener("mousedown",f)},[E]),g==="custom"?e.jsx(e.Fragment,{children:e.jsx(uu,{items:$,loading:x,updatingIds:l,labelLocked:i,onGenerateLabel:c,onSetStatus:p,onUpdateStatus:d,statusPipeline:a,stageByCode:o,statusOptions:u,statusFilter:b,setStatusFilter:R,sortBy:y,sortDir:m,toggleSort:A})}):e.jsx(Bp,{children:e.jsxs(Op,{children:[e.jsx("thead",{children:e.jsxs(Rt,{children:[e.jsx(Ve,{children:"Assinante"}),e.jsx(Ve,{children:"Bebê"}),e.jsx(Up,{children:"Pedido"}),e.jsx(Hp,{children:"Brinquedo"}),e.jsx(Wp,{children:"Ação"}),e.jsx(Yp,{style:{position:"relative"},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsxs(Io,{onClick:()=>{console.log("CLIQUE: SortButton Status clicado!"),A&&A("status")},"aria-label":"Ordenar por status",children:[e.jsx("span",{children:"Status"}),y==="status"?m==="asc"?e.jsx(ao,{size:14,style:{color:"var(--color-primary, #9dd9d2)"}}):e.jsx(oo,{size:14,style:{color:"var(--color-primary, #9dd9d2)"}}):e.jsx(no,{size:14,style:{color:"var(--color-muted, #94a3b8)"}})]}),e.jsxs("div",{ref:H,style:{position:"relative"},children:[e.jsx(st,{className:"icon-only",onClick:()=>L(f=>!f),"aria-haspopup":"true","aria-expanded":E,title:"Filtrar por status","aria-label":"Filtrar por status",children:e.jsx(Fo,{children:e.jsx(so,{size:14})})}),E&&e.jsx(Ot,{$isOpen:E,$direction:"down",children:u.map(f=>e.jsxs(wt,{onClick:async()=>{try{R&&R(f.value==="all"?"all":f.value)}finally{L(!1)}},children:[e.jsx("span",{style:{marginRight:8},children:String(f.value)===String(b)?"✓":""}),e.jsx("span",{children:f.label})]},String(f.value)))})]})]})}),e.jsx(Vp,{children:"SLA"})]})}),e.jsx("tbody",{children:x?[...Array(5)].map((f,B)=>e.jsx(Rt,{$delay:.08*(B+1),children:e.jsx(wr,{colSpan:"7",children:e.jsx("div",{style:{height:18,width:"100%",background:"rgba(148,163,184,.18)",borderRadius:8}})})},`sk-${B}`)):$.length>0?$.map((f,B)=>e.jsx(pu,{item:f,statusPipeline:a,stageByCode:o,recentActions:n,labelLocked:i,updatingIds:l,onGenerateLabel:c,onSetStatus:p,onUpdateStatus:d,index:B},String(f.order_id))):e.jsx(Rt,{children:e.jsx(Gp,{colSpan:"7",children:"Sem resultados"})})})]})})}const xu=r.div`
  display: grid;
  gap: 12px;
`,gu=r.div`
  border-radius: 12px;
  padding: 16px;
  /* dark card to match screenshot */
  background: ${({theme:t})=>t?.color?.surfaceDark??"#0b1220"};
  border: 1px solid ${({theme:t})=>t?.color?.border??"rgba(255,255,255,0.04)"};
  box-shadow: 0 6px 18px rgba(2,6,23,0.6);
  display:flex;
  flex-direction:column;
  gap:12px;
`,mu=r.div`
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
`,hu=r.div`
  font-weight:700;
  color: ${({theme:t})=>t?.color?.text?.primary??"#e5e7eb"};
`,bu=r.div`
  font-size:12px;
  color: ${({theme:t})=>t?.color?.text?.secondary??"#94a3b8"};
`,fu=r.div`
  display:flex;
  gap:8px;
  font-size:13px;
  color:${({theme:t})=>t?.color?.text?.secondary??"#94a3b8"};
  user-select:none;
  align-items:center;
  width:100%; box-sizing:border-box;
`;X`
  0% { opacity: 1; transform: scaleX(1); }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
`;const vu=r.div`
  height: 12px;
  border-radius: 999px;
  /* dark track */
  background: ${({theme:t})=>t?.color?.trackDark??"#0f172a"};
  position:relative;
  overflow:visible;
  margin-top:8px;

  &>div{
    height:100%;
    background: linear-gradient(90deg,#06b6d4 0%, #3b82f6 100%);
    border-radius:999px;
    box-shadow: 0 6px 18px rgba(59,130,246,0.12);
    /* make absolutely positioned to avoid offset accumulation */
    position: absolute;
    left:0; top:0; bottom:0;
    overflow: visible;
    transition: width 900ms cubic-bezier(.2,.9,.2,1);
  }

  &>div.fill[data-pulse="true"]::after{
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translate(50%, -50%);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #06b6d4; /* bright cyan */
    box-shadow: 0 0 0 0 rgba(6,182,212,0.22);
    animation: pulse 1600ms infinite ease-out;
  }
`;r.span`
  display:inline-flex; align-items:center; padding:6px 10px; border-radius:999px; font-size:12px; font-weight:700;
  background: ${({bg:t})=>t||"#06132a"}; color: ${({fg:t})=>t||"#ffffff"};
`;const yu=r.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  & > div:last-child{ display:flex; gap:8px; align-items:center; }
  button{ position:relative; z-index:3; padding:6px 10px; border-radius:6px; cursor:pointer; }
  button[disabled]{ opacity:0.5; cursor:not-allowed; }
`,ju=r.div`
  font-size:12px;
  color:${({theme:t})=>t?.color?.text?.secondary??"#6b7280"};
`;function Mr(t,a){return t?Math.max(0,a.findIndex(o=>o.statusCode===t||o.key===t)):0}function wu(t,a){const o=Mr(t,a),n=a.length||1;return Math.round((o+.5)/n*100)}function ku(t,a){const o=Mr(t,a),n=a.length||1;return Math.round(o/n*100)}function $a(t,a){const o=Mr(t,a);return`${a[o]?a[o].label:"—"} (${o+1}/${a.length})`}const ve=[{key:"waiting",label:"Alertas de Envio",statusCode:"waiting",statusLabel:"Aguardando Separação",nextStatusLabel:"Em Separação",prevStatusLabel:null,nextCode:"in_progress",prevCode:null},{key:"in_progress",label:"Em Separação",statusCode:"in_progress",statusLabel:"Em Separação",nextStatusLabel:"Pendente de Envio",prevStatusLabel:"Aguardando Separação",nextCode:"ready",prevCode:"waiting"},{key:"ready",label:"Pendente de Envio",statusCode:"ready",statusLabel:"Pendente de Envio",nextStatusLabel:"Enviado/Coletado",prevStatusLabel:"Em Separação",nextCode:"shipped",prevCode:"in_progress"},{key:"shipped",label:"Concluído",statusCode:"shipped",statusLabel:"Enviado/Coletado",nextStatusLabel:null,prevStatusLabel:"Pendente de Envio",nextCode:null,prevCode:"ready"},{key:"unmapped",isFallback:!0}],Ue=Object.fromEntries(ve.filter(t=>t.statusCode).map(t=>[t.statusCode,t]));function Su({item:t,statusPipeline:a,stageByCode:o,classifySLA:n,onUpdateStatus:i,onGenerateLabel:l,updatingIds:c,labelLocked:p}){const d=Array.isArray(ve)&&ve.length>0?ve.filter(L=>!("isFallback"in L)):Array.isArray(a)?a.filter(L=>!("isFallback"in L)):[],x=t.status_code||t.status;let g=x?o[x]:void 0;!g&&x&&(g=d.find(L=>(L.statusCode||L.key)===x||L.key===x||L.statusLabel===x||L.label===x),g||console.debug("[Timeline][timeline] stage not found for code:",x,"available:",d.map(L=>L.statusCode||L.key)));const u=wu(x,d),b=n(t.next_shipment_date?new Date(t.next_shipment_date).toISOString().split("T")[0]:null),R=(()=>{const L=t.next_shipment_date?new Date(t.next_shipment_date).toISOString().split("T")[0]:null;if(!L)return"";const H=new Date;H.setHours(0,0,0,0);try{const f=new Date(String(L)+"T00:00:00"),B=Math.ceil((f-H)/(1440*60*1e3));return Number.isNaN(B)?"":B<0?"Prazo encerrado":B===0?"Envia hoje":B===1?"Resta 1 dia":`Restam ${B} dias`}catch{return""}})(),y=!!(g&&g.nextCode),m=!!(g&&g.prevCode),A=d,[I,D]=s.useState(u);ku(x,d);const $=s.useRef(null),E=s.useRef(null);return s.useEffect(()=>{D(u)},[u]),e.jsxs(gu,{children:[e.jsxs(mu,{children:[e.jsxs("div",{children:[e.jsx(hu,{children:`#${t.order_id} — ${t.mother_name||t.customer||"—"}`}),e.jsxs(bu,{children:[t.product_to_send?.name||t.product_name||t.product?.name||""," · ",t.city||""]})]}),e.jsxs("div",{style:{display:"flex",gap:8,flexDirection:"column",alignItems:"flex-end"},children:[e.jsx(Rr,{statusCode:g?.statusCode||g?.key||t.status_code||t.status,label:g?g.statusLabel:t.status||"Não definido"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginTop:4},children:[e.jsx("span",{style:{width:8,height:8,borderRadius:9999,background:b.intent==="danger"?"#ef4444":b.intent==="warn"?"#f59e0b":"#0ea5e9"}}),e.jsx("span",{style:{fontSize:11,color:b.intent==="danger"?"#ef4444":b.intent==="warn"?"#f59e0b":"#0ea5e9"},children:R||b.label})]})]})]}),e.jsx(fu,{ref:$,children:A.map((L,H)=>{const f=L.statusCode||L.key,B=!!(x&&(f===x||f===(g&&g.key)));return e.jsx("div",{"data-stage-key":L.key,style:{flex:1,textAlign:"center",color:B?"var(--color-text, #e5e7eb)":void 0,fontWeight:B?700:500,opacity:B?1:.85},children:L.label},L.key)})}),e.jsx(vu,{"aria-label":$a(x,a),children:e.jsx("div",{ref:E,className:"fill","data-pulse":!!x,style:{width:`${I}%`}})}),e.jsxs(yu,{children:[e.jsx("div",{style:{flex:1},children:e.jsx(ju,{children:$a(x,a)})}),e.jsxs("div",{children:[e.jsx("button",{title:m?"Voltar para a etapa anterior":"Não há etapa anterior",disabled:!!(!m||c?.[t.order_id]),onClick:async()=>{if(!m||c?.[t.order_id])return;const L=A.findIndex(B=>(B.statusCode||B.key)===(x||g&&g.key)),H=Math.max(0,L-1),f=Math.round((H+.5)/A.length*100);D(f);try{await i(t.order_id,x,"prev")}catch{D(u)}},children:"← Voltar"}),e.jsx("button",{title:y?"Avançar para a próxima etapa":"Não há próxima etapa",disabled:!!(!y||c?.[t.order_id]),onClick:async()=>{if(!y||c?.[t.order_id])return;const L=A.findIndex(B=>(B.statusCode||B.key)===(x||g&&g.key)),H=Math.min(A.length-1,L+1),f=Math.round((H+.5)/A.length*100);D(f);try{await i(t.order_id,x,"next")}catch{D(u)}},children:"Próximo →"}),g&&g.key==="shipped"&&e.jsx("button",{disabled:!!(p?.[t.order_id]||c?.[t.order_id]),onClick:()=>l(t.order_id),style:{marginLeft:8},children:c?.[t.order_id]?e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{width:12,height:12,display:"inline-block",marginRight:8,border:"2px solid rgba(148,163,184,.4)",borderTopColor:"rgba(148,163,184,1)",borderRadius:9999,animation:"spin 0.8s linear infinite"}}),"Gerando..."]}):"Gerar Etiqueta"})]})]})]})}function _u({orders:t=[],statusPipeline:a=[],stageByCode:o={},classifySLA:n=()=>({intent:"info",label:"-"}),onUpdateStatus:i,onGenerateLabel:l,updatingIds:c={},labelLocked:p={}}){const d=s.useMemo(()=>Array.isArray(t)?t:[],[t]);return e.jsxs(xu,{children:[d.map(x=>e.jsx(Su,{item:x,statusPipeline:a,stageByCode:o,classifySLA:n,onUpdateStatus:i,onGenerateLabel:l,updatingIds:c,labelLocked:p},x.order_id||`${x.subscriber_id}_${x.child_id||x.baby_name||""}`)),d.length===0&&e.jsx("div",{style:{color:"#94a3b8"},children:"Nenhum pedido encontrado para esta visualização."})]})}const Cu=r.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 1.5rem;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  min-width: 0;
`;r(pe)`
  display: block;
  font-weight: 700;
  color: var(--color-text, #f8fafc);
  text-decoration: none;
  margin-bottom: 2px;
  &:hover { text-decoration: underline; color: var(--color-primary, #9dd9d2); }
`;r.div`font-size: 0.85rem; color: var(--color-muted, #94a3b8);`;r(pe)`
  display: block;
  font-size: 0.85rem;
  color: var(--color-muted, #94a3b8);
  text-decoration: none;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover { text-decoration: underline; color: var(--color-primary, #9dd9d2); }
`;r.div`
  font-weight: 600;
  color: var(--color-text, #e5e7eb);
  max-width: 36ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;r.div`
  font-size: 0.85rem;
  color: var(--color-muted, #94a3b8);
  max-width: 40ch;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;r(me)`text-align: center; color: var(--color-muted, #94a3b8);`;const $u=r.p`color: var(--color-danger, #ef4444); font-weight: 600;`;r.span`font-size: 0.8rem; color: var(--color-muted, #94a3b8);`;r(me)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border, rgba(148,163,184,.14));
`;r.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(148,163,184,.3);
  background: #1f2937;
  color: var(--color-text, #e5e7eb);
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: .02em;
  cursor: pointer;
  transition: all .15s ease;
  &:hover { background: #243042; border-color: rgba(148,163,184,.45); }
`;r.ul`
  position: absolute;
  top: 42px;
  right: 0;
  z-index: 20;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #0b1220;
  border: 1px solid rgba(148,163,184,.25);
  border-radius: 12px;
  min-width: 220px;
  max-height: 260px;
  overflow: auto;
  box-shadow: 0 12px 28px rgba(0,0,0,.35);
`;r.li`
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text, #e5e7eb);
  &:hover { background: rgba(148,163,184,.12); }
`;r(ye)`
  width: 120px;
  text-align: center;
`;r(ye)`
  width: 160px;
  text-align: center;
`;r(me)`
  text-align: center;
`;r.div`
  display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-top: 8px;
`;r.input`
  height: 32px; background: #0f172a; color: #e5e7eb; border: 1px solid rgba(148,163,184,.28); border-radius: 8px; padding: 0 10px;
`;r.select`
  height: 32px; background: #0f172a; color: #e5e7eb; border: 1px solid rgba(148,163,184,.28); border-radius: 8px; padding: 0 10px;
`;r.button`
  height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid rgba(148,163,184,.28); background: #1f2937; color: #e5e7eb; font-weight: 700; font-size: .8rem;
`;r.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  color: var(--color-text, #e5e7eb);
  font-weight: 700;
  cursor: pointer;
  padding: 4px 6px;
  &:hover { color: var(--color-primary, #9dd9d2); }
`;const ft={petit:"evolua-petit",bebe:"evolua-bebe"},Au=()=>{const[t,a]=s.useState([]),[o,n]=s.useState("all"),[i,l]=s.useState(!0),[c,p]=s.useState(""),[d,x]=s.useState(null),[g,u]=s.useState(1),[b,R]=s.useState("kanban"),[y,m]=s.useState("todos"),[A,I]=s.useState("proximos-15-dias"),[D,$]=s.useState(!1),[E,L]=s.useState({}),[H,f]=s.useState(null),[B,Z]=s.useState(null),[T,q]=s.useState(""),[O,P]=s.useState(null),[C,j]=s.useState("asc"),_=s.useRef(null),[N,W]=s.useState(null),w=s.useMemo(()=>[{label:"Mostrar Todos",value:"all"},...ve.filter(z=>!("isFallback"in z)).map(z=>({label:z.statusLabel,value:z.statusCode}))],[]);s.useEffect(()=>{u(1)},[o]);const v=s.useCallback(async(S,z,k,{showLoading:M=!0,q:G}={})=>{M&&l(!0),p("");try{try{_.current&&_.current.abort()}catch{}_.current=new AbortController;let K={recentActions:D};const le=typeof G<"u"&&G!==null?G:T,re=typeof le=="string"?le.trim():le;re&&(K.q=re);const oe=!!(K.q&&String(K.q).trim().length>0),fe=oe?"todos":z,Yt=oe?"todos":k;console.debug("[SeparacaoPage] fetchList params",{page:S,date:fe,plan:Yt,searchParams:K});const Ho={...K,statusCode:o,signal:_.current.signal,planOverride:Yt,dateOverride:fe},Br=await tp(S,fe,Yt,Ho),Te=Br?.data,Ke=Array.isArray(Te)?Te:Array.isArray(Te?.data)?Te.data:Array.isArray(Te?.results)?Te.results:Array.isArray(Te?.items)?Te.items:[];try{console.debug("[SeparacaoPage] fetchList returned",Array.isArray(Ke)?Ke.length:0,"items; sample ids:",Array.isArray(Ke)?Ke.slice(0,10).map(dt=>dt.order_id):[])}catch{}a(Ke),ae(dt=>{const _t={...dt};return Ke.forEach(Or=>{const Ct=Or.order_id;Ct&&(Or.label_generated?_t[Ct]=!0:_t[Ct]&&delete _t[Ct])}),_t});const Vt=Br.data?.meta;x(Vt?{currentPage:Vt.current_page,totalPages:Vt.last_page}:null),L({})}catch(K){if(K.name==="CanceledError"||K.name==="AbortError"){console.debug("[SeparacaoPage] fetchList aborted");return}if(console.error("fetchList failed",K?.response?.status,K?.response?.data||K?.message),K?.response?.status===429){const le=K?.response?.headers?.["retry-after"];let re=0;if(le){const oe=Number(le);if(!Number.isNaN(oe))re=oe*1e3;else{const fe=Date.parse(le);Number.isNaN(fe)||(re=Math.max(0,fe-Date.now()))}}if(re>0){const oe=new Date(Date.now()+re).toISOString();W(oe),f({type:"error",message:`Muitas requisições. Aguarde ${Math.ceil(re/1e3)}s.`}),p("Muitas requisições. Aguarde e tente novamente.")}else p("Muitas requisições. Aguarde um momento e tente novamente.")}else p("Não foi possível carregar a lista de separação.")}finally{M&&l(!1)}},[D,T,o]);s.useEffect(()=>{try{const S=new URLSearchParams(window.location.search),z=S.get("view");(z==="kanban"||z==="list"||z==="timeline")&&R(z);const k=S.get("plan");k&&(k===ft.petit||k===ft.bebe||k==="todos")&&m(k);const M=S.get("date");M&&I(M);const G=S.get("recent")==="1";$(G);const K=S.get("q");K&&q(K)}catch{}},[]),s.useEffect(()=>{v(g,A,y)},[g,A,y,D,o,v]),s.useEffect(()=>{const S=setTimeout(()=>{let z=(T||"").trim();const k=z.match(/^#(\d+)$/);k&&(z=k[1]);const M=z!==""&&/^\d+$/.test(z);if(z===""||z.length>=3||M){if(N&&new Date<new Date(N))return;if(u(1),M){try{V({q:z||null,plan:null,date:null})}catch{}v(1,"todos","todos",{q:z})}else{try{V({q:z||null})}catch{}v(1,A,y,{q:z})}}},600);return()=>clearTimeout(S)},[T,A,y,N]);const F=S=>u(S),V=S=>{try{const z=new URLSearchParams(window.location.search);Object.entries(S).forEach(([M,G])=>{G==null||G===""?z.delete(M):z.set(M,String(G))});const k=`${window.location.pathname}?${z.toString()}`;window.history.replaceState({},"",k)}catch{}},ie=s.useMemo(()=>{const S=ve.reduce((M,G)=>(M[G.key]=[],M),{}),z=ve.reduce((M,G)=>(M[G.key]=new Set,M),{}),k="unmapped";return t.forEach(M=>{const G=M.status_code?Ue[M.status_code]:void 0,K=G&&S[G.key]?G.key:k,le=M.subscriber_id??M.user_id??"?",re=M.child_id??M.baby_name??"",oe=`${le}_${re}`,fe=z[K];fe.has(oe)||(fe.add(oe),S[K].push(M))}),S},[t]),ce=s.useMemo(()=>{if(!o||o==="all")return console.log('FILTER_STATUS: Sem filtro ou "all" selecionado.'),t;const S=String(o).toLowerCase(),z=(t||[]).filter(k=>String(k?.status_code||k?.status||k?.separation_status||"").toLowerCase()===S);return console.log("FILTER_STATUS: Aplicado filtro",S,"=>",z.length,"itens."),z},[t,o]),be=s.useMemo(()=>{console.log("CALC_SORT: Recalculando lista.",{sortBy:O,sortDir:C});const S=ce;if(!O)return console.log("CALC_SORT: Sem ordenação, retornando lista original."),S;const z=[...S||[]],k=C==="asc"?1:-1;return z.sort((M,G)=>{const K=(oe,fe)=>oe?fe==="mother_name"?String(oe.mother_name||oe.user?.name||"").toLowerCase():fe==="status"?String(oe.status||oe.separation_status||oe.status_code||"").toLowerCase():String(oe[fe]??"").toLowerCase():"",le=K(M,O),re=K(G,O);return le<re?-1*k:le>re?1*k:0}),console.log("CALC_SORT: Lista ordenada",z.map(M=>`${M?.order_id}-${M?.status_code}`)),z},[ce,O,C]);s.useMemo(()=>Array.from(new Map((be||[]).map(S=>[`${S.subscriber_id||S.user_id||""}_${S.child_id||S.baby_name||""}`,S])).values()),[be]);const je=S=>{console.log("TOGGLE_SORT: Chamado",{field:S}),console.log("TOGGLE_SORT: Estado ANTES",{sortBy:O,sortDir:C}),O!==S?(P(S),j("asc"),console.log("TOGGLE_SORT: Estado DEPOIS (novo campo)",{sortBy:S,sortDir:"asc"})):C==="asc"?(j("desc"),console.log("TOGGLE_SORT: Estado DEPOIS (desc)",{sortBy:O,sortDir:"desc"})):(P(null),j("asc"),console.log("TOGGLE_SORT: Estado DEPOIS (reset)",{sortBy:null,sortDir:"asc"})),u(1)},ne=`${b||"vm"}|${y||"plan"}|${A||"date"}|${D?"r":"n"}|${(T||"").slice(0,30)}|p${g}`,ke=async(S,z,k)=>{const M=z?Ue[z]:void 0;if(!M){f({type:"error",message:"Status desconhecido"});return}const G=k==="next"?M.nextStatusLabel:M.prevStatusLabel,K=k==="next"?M.nextCode:M.prevCode;if(!K){f({type:"info",message:"Ação não permitida"});return}L(le=>({...le,[S]:!0}));try{await va(S,K),f({type:"success",message:`Status do pedido #${S} atualizado para ${G}`}),await v(g,A,y,{showLoading:!1})}catch(le){console.error(le),f({type:"error",message:"Falha ao atualizar status"})}finally{L(le=>({...le,[S]:!1})),setTimeout(()=>f(null),8e3)}},Ee=S=>{try{console.debug("[SeparacaoPage] handleViewToggle called, mode=",S)}catch{}R(S),V({view:S})},Le=S=>{const z=ft[S];m(k=>{const M=z?k===z?"todos":z:"todos";try{V({plan:M})}catch{}return M}),u(1)},h=()=>{I(S=>{const z=S==="proximos-15-dias"?"todos":"proximos-15-dias";try{V({date:z})}catch{}return z}),u(1)},Y=()=>{m("todos"),I("todos"),$(!1);try{V({plan:"todos",date:"todos",recent:null})}catch{}u(1)},U=async S=>{try{L(M=>({...M,[S]:!0}));const k=(await ya(S))?.data?.label_url;k&&window.open(k,"_blank","noopener"),ae(M=>({...M,[S]:!0})),await v(g,A,y,{showLoading:!1}),f({type:"success",message:"Etiqueta gerada com sucesso."})}catch(z){console.error(z);const k=z?.response?.data?.message||"Falha ao gerar etiqueta";z?.response?.status===409&&ae(M=>({...M,[S]:!0})),f({type:"error",message:k})}finally{L(z=>({...z,[S]:!1}))}},ee=async(S,z)=>{if(!(!S||!z)){L(k=>({...k,[S]:!0}));try{await va(S,z);const k=Ue[z],M=k?k.statusLabel:z;f({type:"success",message:`Status do pedido #${S} atualizado para ${M}`}),await v(g,A,y,{showLoading:!1})}catch(k){throw console.error("handleSetStatusByCode error",k),f({type:"error",message:"Falha ao atualizar status"}),k}finally{L(k=>({...k,[S]:!1})),setTimeout(()=>f(null),8e3)}}},te=s.useMemo(()=>[{id:"kanban",label:"Kanban",onSelect:()=>Ee("kanban"),isActive:b==="kanban"},{id:"list",label:"Lista",onSelect:()=>Ee("list"),isActive:b==="list"},{id:"timeline",label:"Linha do Tempo",onSelect:()=>Ee("timeline"),isActive:b==="timeline"},{id:"petit",label:"Petit",onSelect:()=>Le("petit"),isActive:y===ft.petit},{id:"bebe",label:"Bebê",onSelect:()=>Le("bebe"),isActive:y===ft.bebe},{id:"proximos",label:"Próximos 15 dias",onSelect:h,isActive:A==="proximos-15-dias"},{id:"todos",label:"Todos",onSelect:Y,isActive:A==="todos"&&y==="todos"}],[b,y,A,D]);s.useMemo(()=>{const S=[{value:"all",label:"Mostrar Todos"}],z=ve.filter(k=>!("isFallback"in k)).map(k=>({value:k.statusCode,label:k.statusLabel}));return[...S,...z]},[]);const[se,ae]=s.useState({}),Q=()=>e.jsx(Cu,{children:ve.filter(S=>!("isFallback"in S&&S.isFallback)).map(S=>{const z=(ie[S.key]||[]).map(k=>{const M=k.status_code?Ue[k.status_code]:void 0,G=!!E[k.order_id];let K=null;if(k.next_shipment_date){const re=new Date(k.next_shipment_date);Number.isNaN(re.getTime())||(K=new Date(re.getTime()-12096e5).toISOString().split("T")[0])}return{id:`${k.subscriber_id??k.user_id??"u"}_${k.child_id??k.baby_name??"c"}`,orderId:k.order_id,linkId:k.subscriber_id||k.user_id||k.id,title:k.baby_name||"Bebê não informado",titleComplement:k.product_to_send?.name||k.product?.name||k.product_name||"Produto não mapeado",deadline_start:K,deadline_end:k.next_shipment_date,tags:k.baby_age_label?[{id:`age-${k.order_id}`,label:k.baby_age_label}]:[],assignee:k.mother_name,canMoveForward:!!M?.nextCode,canMoveBackward:!!M?.prevCode,onMove:re=>ke(k.order_id,k.status_code,re),isUpdating:G}});return e.jsx(Ep,{title:S.label,count:z.length,recent:D,cards:z.map(k=>S.key==="shipped"?{...k,extraActionLabel:"Gerar Etiqueta",extraActionDisabled:!!(se[k.orderId]||k.label_generated),onExtraAction:async()=>{try{L(K=>({...K,[k.orderId]:!0}));const G=(await ya(k.orderId))?.data?.label_url;G&&window.open(G,"_blank","noopener"),ae(K=>({...K,[k.orderId]:!0})),await v(g,A,y,{showLoading:!1}),f({type:"success",message:"Etiqueta gerada com sucesso."})}catch(M){console.error(M);const G=M?.response?.data?.message||"Falha ao gerar etiqueta";M?.response?.status===409&&ae(K=>({...K,[k.orderId]:!0})),f({type:"error",message:G})}finally{L(M=>({...M,[k.orderId]:!1}))}},tags:se[k.orderId]||k.label_generated?[...Array.isArray(k.tags)?k.tags:[],{id:"label-generated",label:"Etiqueta gerada"}]:k.tags}:k),emptyState:`Nenhum pedido em ${S.label}.`},S.key)})});return e.jsxs(e.Fragment,{children:[H&&e.jsx(zr,{message:H.message,type:H.type}),e.jsx(Fr,{title:"Separação de Pedidos",description:"Painel visual para acompanhar e avançar cada etapa da logística de separação.",filters:e.jsx(e.Fragment,{children:e.jsx(np,{filters:te})}),headerRight:e.jsx(Tr,{value:T,onChange:S=>q(S.target.value),onKeyDown:S=>{if(S.key==="Enter"){const z=(T||"").trim(),k=z.match(/^#?(\d+)$/);if(k){const M=k[1];u(1),v(1,"todos","todos",{q:M});try{V({q:M||null,plan:null,date:null})}catch{}}else{u(1),v(1,A,y,{q:z});try{V({q:z||null})}catch{}}}},onSearch:()=>{const S=(T||"").trim(),z=S.match(/^#?(\d+)$/);if(z){const k=z[1];u(1),v(1,"todos","todos",{q:k});try{V({q:k||null,plan:null,date:null})}catch{}}else{u(1),v(1,A,y,{q:S});try{V({q:S||null})}catch{}}},placeholder:"Pesquisar por assinante, bebê, pedido, produto ou status...",disabled:!!(N&&new Date<new Date(N)),showSearchButton:!0}),pagination:d&&d.totalPages>1&&e.jsx(qt,{currentPage:d.currentPage,totalPages:d.totalPages,onPageChange:F}),transparent:!0,children:i?e.jsx(Ca,{loading:!0,items:be,statusPipeline:ve,stageByCode:Ue,recentActions:D,labelLocked:{},updatingIds:{},presentation:"custom",statusOptions:w,statusFilter:o,setStatusFilter:n,sortBy:O,sortDir:C,toggleSort:je}):c?e.jsxs("div",{children:[e.jsx($u,{children:c}),(String(c).toLowerCase().includes("sessão expirada")||typeof window<"u"&&window.__AUTH_EXPIRED)&&e.jsx("div",{style:{marginTop:8},children:e.jsx(Ir,{onClick:()=>{window.location.href="/login"},children:"Ir para Login"})})]}):b==="kanban"?e.jsx(sr,{direction:"up",duration:420,distance:12,children:Q()},ne):b==="list"?e.jsx(sr,{direction:"up",duration:320,distance:10,children:e.jsx(Ca,{items:be,statusPipeline:ve,stageByCode:Ue,recentActions:D,labelLocked:se,updatingIds:E,onGenerateLabel:U,onSetStatus:ee,onUpdateStatus:ke,presentation:"custom",statusOptions:w,statusFilter:o,setStatusFilter:n,sortBy:O,sortDir:C,toggleSort:je})},ne):b==="timeline"?e.jsx(sr,{direction:"up",duration:420,distance:12,children:e.jsx(_u,{orders:t,statusPipeline:ve,stageByCode:Ue,classifySLA:Nr,onUpdateStatus:(S,z,k)=>ke(S,z,k),onSetStatus:ee,onGenerateLabel:S=>U(S),updatingIds:E,labelLocked:se})},ne):e.jsxs("div",{style:{padding:16,color:"#94a3b8"},children:[e.jsx("p",{style:{margin:0,fontWeight:700,color:"#e5e7eb"},children:"Linha do Tempo"}),e.jsx("p",{style:{marginTop:6},children:"Visualização em desenvolvimento. Os filtros e a fonte de dados serão os mesmos da lista."})]})})]})},Eu=r.div`
  width: 380px;
  min-height: 230px;
  background: #fff;
  border: 2px dashed #94a3b8;
  border-radius: 10px;
  box-shadow: 0 6px 28px rgba(2,6,23,0.35);
  padding: 18px;
  color: #0f172a;
  font-family: Inter, 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  overflow: hidden; /* garante que nada extrapole a etiqueta */
`,zu=r.div`
  width: 100%;
  height: 44px;
  background: repeating-linear-gradient(90deg, #111 0 3px, #fff 3px 9px);
  border-radius: 3px;
  margin-top: 8px;
`,Pu=r.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap; /* evita que o badge force overflow */
`,rt=r.div`
  font-size: 12px; color: #475569;
`,Lu=r.div`
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 1.5px;
  margin-top: 6px;
  color: #0b1220;
  line-height: 1.1;
  overflow-wrap: anywhere; /* quebra códigos longos dentro da caixa */
`,Tu=r.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 10px;
  align-items:start;
`,Du=r.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid #e6eef6;
  max-width: 100%;
  box-sizing: border-box;
`,Fu=r.div`
  width: 96px; height: 96px; background: linear-gradient(45deg,#fff,#f3f4f6); border: 1px solid #cbd5e1; display:flex; align-items:center; justify-content:center; color:#64748b; font-size:10px; border-radius:6px;
`,Iu=r.span`
  display:inline-block; padding:4px 8px; border-radius:6px; font-weight:800; font-size:12px; background:#fef3c7; color:#92400e; border:1px solid #fde68a;
`;function Ru({address:t,number:a,complete:o,neighborhood:n,city:i,state:l}){let c=[];t&&c.push(t),a&&c.push(a),o&&c.push(o),n&&c.push(n);let p=c.join(", "),d=[];return i&&d.push(i),l&&d.push(l),[p,d.join(" / ")].filter(Boolean).join(" - ")}const Nu=Ae.forwardRef(({destinatario:t="João da Silva",pedido:a="#123456",cep:o="01000-000",address:n,number:i,complete:l,neighborhood:c,city:p,state:d,userId:x},g)=>{const u=Ru({address:n,number:i,complete:l,neighborhood:c,city:p,state:d}),b=`TRK${String(a).replace(/[^0-9]/g,"").padStart(9,"0")}`;return e.jsxs(Eu,{ref:g,children:[e.jsxs(Pu,{children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:800,fontSize:16,lineHeight:1.2},children:"Etiqueta de Envio (DEMO)"}),e.jsx(rt,{children:"Remetente: Loja Exemplo Ltda • São Paulo - SP"})]}),e.jsx(Iu,{children:"PAC - Simulado"})]}),e.jsxs(Tu,{children:[e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700},children:"Destinatário"}),e.jsx("div",{style:{marginTop:4},children:t}),e.jsxs(rt,{style:{marginTop:6},children:["ID Assinante: ",e.jsx("b",{children:x||"-"})]}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx("b",{children:"Endereço:"})," ",u||"Endereço não informado"]}),e.jsxs("div",{style:{marginTop:6},children:[e.jsx("b",{children:"CEP:"})," ",o]}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx("b",{children:"Pedido:"})," ",a]})]}),e.jsx("div",{children:e.jsxs(Du,{children:[e.jsx(rt,{children:"Rastreamento"}),e.jsx(Lu,{children:b}),e.jsxs(rt,{style:{marginTop:6},children:["Status: ",e.jsx("b",{children:"Pré-visualização"})]})]})})]}),e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center"},children:[e.jsxs("div",{style:{flex:1},children:[e.jsx(zu,{}),e.jsx("div",{style:{marginTop:6,color:"#475569",fontSize:12},children:"Objeto registrado - Simulação"})]}),e.jsx(Fu,{children:"QR"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(rt,{children:"Dimensões: 20 × 15 × 8 cm"}),e.jsx(rt,{children:"Peso: 0,350 kg"})]}),e.jsx("div",{style:{fontSize:12,color:"#64748b",marginTop:6},children:"Esta é uma etiqueta de demonstração. Não imprima para envio real."})]})});async function Mu(t=1,a=20,o={}){const n=new URLSearchParams({page:String(t),per_page:String(a)});return o.start_date&&n.set("start_date",o.start_date),o.end_date&&n.set("end_date",o.end_date),J.get(`/admin/shipping/labels/recent?${n.toString()}`)}const Aa=(t,a)=>new Promise((o,n)=>{if(document.getElementById(t))return o();const i=document.createElement("script");i.id=t,i.src=a,i.async=!0,i.onload=()=>o(),i.onerror=n,document.head.appendChild(i)});async function Bu(){window.html2canvas||await Aa("html2canvas-cdn","https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"),!window.jspdf&&!window.jsPDF&&await Aa("jspdf-cdn","https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js")}async function Ou(t,a="etiqueta.pdf"){if(!t)throw new Error("Elemento não encontrado para exportar");await Bu();const o=window.html2canvas,{jsPDF:n}=window.jspdf||window.jsPDF||{};if(!o||!n)throw new Error("Bibliotecas de PDF não disponíveis");const i=await o(t,{scale:2,backgroundColor:"#ffffff"}),l=i.toDataURL("image/jpeg",.95),c=g=>g*.264583,p=c(i.width),d=c(i.height),x=new n({orientation:p>d?"l":"p",unit:"mm",format:[p,d]});x.addImage(l,"JPEG",0,0,p,d),x.save(a)}const lt={text:"var(--color-text, #e2e8f0)",muted:"var(--color-muted, #a0aec0)",petroleo:"var(--petroleo, #1F4E5F)"},qu=r.div`
  --s-1: 4px; --s0: 8px; --s1: 12px; --s2: 16px; --s3: 20px; --s4: 24px;
  /* Pedido | Assinante | Gerada em | Ações */
  --col-col1: clamp(120px, 16vw, 200px);
  --col-col2: 1fr;
  --col-col3: clamp(160px, 20vw, 240px);
  --col-acoes: 120px;
  /* Glass tokens */
  --glass-bg: rgba(15, 23, 42, 0.55);
  --glass-border: rgba(255,255,255,0.06);
  --row-bg: rgba(30, 41, 59, 0.60);
  --row-bg-alt: rgba(36, 47, 66, 0.60);
  --row-hover: rgba(51, 65, 85, 0.65);
  color: ${lt.text};
`,Uu=r.div`
  border: 1px solid var(--glass-border);
  background: var(--glass-bg);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0,0,0,.24);
`,We=r.div`
  position: sticky; top: 0; z-index: 1;
  display: grid;
  grid-template-columns: var(--col-col1) var(--col-col2) var(--col-col3) var(--col-acoes);
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(8px);
  color: ${lt.muted};
  font-size: 12px;
  letter-spacing: .06em;
  text-transform: uppercase;
  font-weight: 700;
  & > div { text-align: inherit; }
`,Hu=r.div`
  padding: var(--s1);
`,Ye=r.div`
  display: grid;
  grid-template-columns: var(--col-col1) var(--col-col2) var(--col-col3) var(--col-acoes);
  align-items: center;
  gap: 0;
  margin: var(--s1);
  padding: 12px 16px;
  border: 1px solid var(--glass-border);
  background: var(--row-bg);
  border-radius: 18px;
  box-shadow: 0 0 0 transparent;
  transition: background .24s, box-shadow .24s, transform .12s, border-color .24s;

  /* Zebra striping */
  &:nth-child(odd) { background: var(--row-bg); }
  &:nth-child(even) { background: var(--row-bg-alt); }

  /* Hover effect */
  &:hover {
    box-shadow: 0 8px 20px rgba(0,0,0,.18);
    transform: translateY(-2px);
    border-color: #7ec4f7;
    background: var(--row-hover);
  }

  /* Row highlight for canceled labels */
  &.is-canceled {
    border-color: #fecaca;
    background: rgba(58, 43, 43, 0.75);
  }
`,Fe=r.div`
  min-width: 0;
  font-size: 15px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.right { text-align: right; }
  &.muted { color: ${lt.muted}; }
  &.col1 { font-variant-numeric: tabular-nums; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
  &.col3 { font-variant-numeric: tabular-nums; }
`,Wu=r.div`
  display: inline-flex;
  gap: 12px;
  justify-content: flex-end;
`,No=r.span`
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.4;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  color: #e5e7eb;
  background: rgba(148,163,184,.18);
`,Yu=r(No)`
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
`,Vu=r(No)`
  color: #065f46;
  background: #d1fae5;
  border-color: #a7f3d0;
`,Gu=`
  @keyframes shimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }
`,Ku=r.div`
  ${Gu}
  height: 64px;
  margin: var(--s1);
  border-radius: 16px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%);
  background-size: 400px 100%;
  animation: shimmer 1.2s infinite linear;
  border: 1px solid var(--glass-border);
`,Xu=r.div`
  margin: 16px;
  padding: 20px;
  border-radius: 16px;
  background: rgba(2,6,23,0.35);
  border: 1px dashed var(--glass-border);
  color: ${lt.muted};
  text-align: center;
`,Mo=r.button`
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 36px; height: 36px;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.18);
  background: rgba(15,23,42,0.5);
  color: ${lt.text};
  cursor: pointer;
  transition: background .18s ease, border-color .18s ease, transform .1s ease, box-shadow .18s ease;
  &:hover{
    background: rgba(148,163,184,0.18);
    border-color: var(--color-primary, #9dd9d2);
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
    transform: scale(1.05);
  }
  &:active{ transform: translateY(1px); }
`;r(Mo)`
  &:hover{
    background: rgba(31,78,95,.22);
    border-color: ${lt.petroleo};
  }
`;const Qu=r.div`
  @media (max-width: 900px){
    ${We}, ${Ye}{
      grid-template-columns: var(--col-col1) var(--col-col2) var(--col-acoes);
    }
    ${We} > .col3, ${Ye} > .col3 { display: none; }
  }
  @media (max-width: 640px){
    ${We}, ${Ye}{ grid-template-columns: 1fr var(--col-acoes); }
    ${Ye} > .col2, ${Ye} > .col3 { grid-column: 1 / -1; }
    ${Ye} > .acoes { justify-self: end; }
    ${We} > .col2, ${We} > .col3, ${We} > .acoes { display: none; }
  }
`;function Ju({data:t=[],onView:a,onPdf:o,onPrint:n,loading:i=!1}){const l=Array.isArray(t)?t:[],c=p=>a&&a(p);return e.jsx(qu,{children:e.jsx(Qu,{children:e.jsxs(Uu,{role:"table","aria-label":"Historico de Etiquetas",children:[e.jsxs(We,{role:"row",children:[e.jsx(Fe,{className:"muted col1",role:"columnheader",children:"Pedido"}),e.jsx(Fe,{className:"muted col2",role:"columnheader",children:"Assinante"}),e.jsx(Fe,{className:"muted col3",role:"columnheader",children:"Gerada em"}),e.jsx(Fe,{className:"muted right acoes",role:"columnheader",children:"Ações"})]}),e.jsx(Hu,{children:i?Array.from({length:6}).map((p,d)=>e.jsx(Ku,{},`sk-${d}`)):l.length===0?e.jsx(Xu,{children:"Sem etiquetas recentes"}):l.map((p,d)=>{const x=p.label_status==="cancelada",g=!!p.view_allowed&&!x,u=g?"Visualizar etiqueta":"Visualizar (prévia bloqueada)",b=p.id??`${p.order_id||"o"}-${p.created_at||"t"}-${d}`;return e.jsxs(Ye,{role:"row",className:x?"is-canceled":void 0,children:[e.jsxs(Fe,{className:"col1",title:String(p.order_id||"-"),children:["#",p.order_id]}),e.jsxs(Fe,{className:"col2",title:p.subscriber_email||p.subscriber_name||"-",children:[p.subscriber_name||p.subscriber_id||"-",x?e.jsx(Yu,{children:"Cancelada"}):e.jsx(Vu,{children:"Válida"})]}),e.jsx(Fe,{className:"col3",children:p.created_at?new Date(p.created_at).toLocaleString("pt-BR"):"-"}),e.jsx(Fe,{className:"right acoes",children:e.jsx(Wu,{children:e.jsx(Mo,{"aria-label":u,title:u,onClick:()=>{c(p)},"aria-disabled":!g,children:e.jsx(Za,{size:18})})})})]},b)})})]})})})}const Zu=X`
  to { transform: rotate(360deg); }
`,ex=r.span`
  display: inline-block;
  width: ${({$size:t})=>t||16}px;
  height: ${({$size:t})=>t||16}px;
  border-radius: 50%;
  border: ${({$thickness:t})=>t||2}px solid rgba(255,255,255,0.35);
  border-top-color: ${({$color:t})=>t||"var(--color-primary, #9dd9d2)"};
  animation: ${Zu} .8s linear infinite;
`;function Ea({size:t=16,color:a,thickness:o=2,...n}){return e.jsx(ex,{role:"status","aria-label":"Carregando",$size:t,$color:a,$thickness:o,...n})}r.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;r.div`
  /* Tokens locais e semânticos aplicados somente nesta tabela */
  --color-text-light: #111827;
  --color-text-muted: #6b7280;
  --border: #e5e7eb;
  --card: #ffffff;
  --color-primary: #16a34a;

  --table-row-zebra: #fafafa;
  --table-row-hover: #f3f4f6;

  table tbody tr:nth-child(even) {
    background-color: var(--table-row-zebra) !important;
  }
  table tbody tr:hover {
    background-color: var(--table-row-hover) !important;
  }
`;const tx=r.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.38);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`,rx=r.div`
  background: #1e293b;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 32px 24px;
  min-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
`,ax=r.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`,ox=r.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`,nx=r(Lr)`
  margin-bottom: 0;
  flex-wrap: wrap;
  gap: 0.6rem;
`,sx=r.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`,za=r.button`
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  background: #232b38;
  color: #e5e7eb;
  transition: transform 120ms ease, box-shadow 180ms ease, background 160ms ease, filter 160ms ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0,0,0,0.28);
    background: #2b3a4e;
    filter: brightness(1.02);
  }

  &:active:not(:disabled) {
    transform: translateY(0px) scale(0.99);
    box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`,Bo=t=>String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim().toLowerCase(),ix=(t,a)=>a?[t.order_id?`#${t.order_id}`:"",t.order_id,t.subscriber_id,t.subscriber_name,t.subscriber_email,t.label_status,t.created_at,t.label_canceled_at,t.tracking,t.address,t.cep,t.cep_formatted,t.city,t.state].some(n=>Bo(n).includes(a)):!0,lx=(t,a)=>{if(!Array.isArray(t))return[];const o=Bo(a);return o?t.filter(n=>ix(n,o)):t};function dx(t,a){const o=a.current,n=t.order_id||"",i=t.subscriber_name||"assinante",c=`etiqueta_${String(i).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase()}_${n}.pdf`;o&&Ou(o,c)}function cx(t){const a=new En({unit:"mm",format:[90,54]});a.setFontSize(14),a.setFont("helvetica","bold"),a.text("Etiqueta de Envio",8,12),a.setFontSize(10),a.setFont("helvetica","normal"),a.text(`Pedido: #${t.order_id||"-"}`,8,20),a.text(`Assinante: ${t.subscriber_name||"-"}`,8,26),a.text(`ID: ${t.subscriber_id||"-"}`,8,32),a.text(`Endereço: ${t.address||"---"}`,8,38,{maxWidth:74}),a.text(`CEP: ${t.cep||"-"}`,8,44),a.text(`Rastreamento: ${t.tracking||"-"}`,8,50),a.setFontSize(8),a.setTextColor(120),a.text("Etiqueta gerada automaticamente - Não usar para envio real",8,53,{maxWidth:74});const o=t.subscriber_name||"assinante",i=`etiqueta_${String(o).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-+|-+$/g,"").toLowerCase()}_${t.order_id||""}.pdf`;a.save(i)}function px(){const[t,a]=s.useState("all"),o=s.useRef(!0);function n(T){const q=new Date;let O="",P="";if(P=q.toISOString().slice(0,10),T==="today")O=P;else if(T==="7d"){const C=new Date(q);C.setDate(C.getDate()-6),O=C.toISOString().slice(0,10)}else if(T==="30d"){const C=new Date(q);C.setDate(C.getDate()-29),O=C.toISOString().slice(0,10)}else T==="all"&&(O="",P="");return{start:O,end:P}}const i=s.useCallback(()=>{c(!0);const{start:T,end:q}=n(t),O={};t!=="all"&&(T&&(O.start_date=T),q&&(O.end_date=q)),Mu(1,20,O).then(P=>{g(P.data?.data||[]),c(!1)}).catch(()=>{d("Erro ao carregar etiquetas"),c(!1)})},[t]);s.useEffect(()=>{if(o.current){o.current=!1;return}i()},[t,i]);const[l,c]=s.useState(!0),[p,d]=s.useState(null),[x,g]=s.useState([]),[u,b]=s.useState(null),[R,y]=s.useState(!1),[m,A]=s.useState(!1),[I,D]=s.useState(""),[$,E]=s.useState(""),L=s.useRef();s.useEffect(()=>{i()},[]);const H=Array.isArray(x)?x:[],f=s.useMemo(()=>lx(H,$),[H,$]),B=s.useCallback(()=>{E(I.trim())},[I]),Z=s.useCallback(T=>{T&&T.preventDefault(),B()},[B]);return s.useEffect(()=>{I.trim()===""&&$!==""&&E("")},[I,$]),e.jsxs(ax,{children:[e.jsxs(ox,{onSubmit:Z,children:[e.jsxs(nx,{children:[e.jsx(Ne,{$isActive:t==="all",onClick:()=>a("all"),children:"Todos"}),e.jsx(Ne,{$isActive:t==="today",onClick:()=>a("today"),children:"Hoje"}),e.jsx(Ne,{$isActive:t==="7d",onClick:()=>a("7d"),children:"7 dias"}),e.jsx(Ne,{$isActive:t==="30d",onClick:()=>a("30d"),children:"30 dias"})]}),e.jsx(sx,{children:e.jsx(Tr,{value:I,onChange:T=>D(T.target.value),onSearch:B,onKeyDown:T=>{T.key==="Enter"&&(T.preventDefault(),B())},placeholder:"Buscar por pedido, assinante ou data",showSearchButton:!0})})]}),(()=>{const{start:T,end:q}=n(t),O=C=>C?new Date(C).toLocaleDateString("pt-BR"):"",P=t==="all"?"Exibindo todos os registros":`Filtrando de ${O(T)} até ${O(q)}`;return e.jsx("p",{style:{color:"#94a3b8",margin:"4px 2px 8px"},children:P})})(),$&&!l&&f.length===0&&e.jsxs("p",{style:{color:"#f87171",margin:"0 2px 8px"},children:['Nenhuma etiqueta encontrada para "',$,'".']}),l?e.jsx("div",{role:"status","aria-live":"polite",children:"Carregando…"}):p?e.jsx("p",{style:{color:"#ef4444"},children:p}):e.jsx(Ju,{data:f,loading:l,onView:T=>{T?.view_allowed&&(b(T),y(!0))},onPrint:T=>cx(T)}),R&&u&&e.jsx(tx,{onClick:T=>{T.target===T.currentTarget&&(y(!1),b(null))},children:e.jsxs(rx,{children:[e.jsx(Nu,{ref:L,destinatario:u.subscriber_name||"-",pedido:`#${u.order_id||""}`,cep:u.cep_formatted||u.cep||"-",address:u.address,number:u.number,neighborhood:u.neighborhood,complete:u.complete,city:u.city,state:u.state,userId:u.subscriber_id}),u.label_status==="cancelada"&&e.jsxs("div",{style:{background:"#fef2f2",color:"#991b1b",border:"1px solid #fecaca",borderRadius:8,padding:"10px 14px",marginTop:14,fontSize:15,fontWeight:600,textAlign:"center",maxWidth:340},children:["Esta etiqueta foi cancelada automaticamente.",e.jsx("br",{}),"Data do cancelamento: ",u.label_canceled_at?new Date(u.label_canceled_at).toLocaleString("pt-BR"):"-"]}),(!(u.address_line||u.address)||!u.city||!u.state||!(u.cep_formatted||u.cep))&&e.jsx("div",{style:{background:"#fffbe6",color:"#b45309",border:"1px solid #fde68a",borderRadius:8,padding:"10px 14px",marginTop:14,fontSize:15,fontWeight:500,textAlign:"center",maxWidth:340},children:"Atenção: endereço do assinante incompleto ou ausente. Por favor, revise os dados antes de postar."}),e.jsxs("div",{style:{display:"flex",gap:12,marginTop:22,justifyContent:"center"},children:[e.jsxs(za,{onClick:async()=>{if(u.label_status!=="cancelada"){A(!0);try{window.print()}finally{setTimeout(()=>A(!1),300)}}},title:"Imprimir",disabled:u.label_status==="cancelada"||m,children:[m?e.jsx(Ea,{size:16}):e.jsx($n,{style:{marginRight:6}}),m?"Preparando…":"Imprimir"]}),e.jsxs(za,{onClick:async()=>{if(u.label_status!=="cancelada"){A(!0);try{await dx(u,L)}finally{A(!1)}}},title:"Gerar PDF",disabled:u.label_status==="cancelada"||m,children:[m?e.jsx(Ea,{size:16}):e.jsx(An,{style:{marginRight:6}}),m?"Gerando…":"PDF"]})]})]})})]})}const ux=r.div`
  width: 100%;
  padding: 24px 12px 180px; /* espaço extra no fim para não cortar o botão */
  box-sizing: border-box;
  height: 100vh; /* ocupar a viewport inteira e permitir scroll interno */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* rolagem suave em iOS */
  display: flex;
  align-items: flex-start;
  justify-content: center;
`,xx=r.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 680px;
  margin: 16px auto;
  padding: 20px 16px;
  background: #0b1220;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  color: #e5e7eb;

  @media (min-width: 768px) {
    margin: 24px auto;
    padding: 28px 24px 22px;
  }
`,gx=r.h2`
  text-align: center;
  margin-bottom: 24px;
`,mx=r.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ue=r.label`
  font-weight: 600;
  margin-bottom: 4px;
`,xe=r.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e5e7eb;
  width: 100%;
  &:focus { outline: none; border-color: #64748b; box-shadow: 0 0 0 2px rgba(100,116,139,.25); }
  &::placeholder { color: #94a3b8; }
  /* Corrige autofill do Chrome/Safari que deixa o fundo claro */
  &:-webkit-autofill,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:hover {
    -webkit-text-fill-color: #e5e7eb !important;
    box-shadow: 0 0 0px 1000px #1e293b inset !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  /* Outras correções úteis */
  &[type="date"] {
    color: #e5e7eb;
  }
  &::-webkit-calendar-picker-indicator {
    filter: invert(1) hue-rotate(180deg) brightness(0.9);
  }
`,Ft=r.small`
  color: #94a3b8; display: block; margin-top: 4px;
`,hx=r.select`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #334155;
  background: #1e293b;
  color: #e5e7eb;
  width: 100%;
  &:focus { outline: none; border-color: #64748b; box-shadow: 0 0 0 2px rgba(100,116,139,.25); }
`,bx=r.button`
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 12px;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: #4f46e5; }
  &:disabled { opacity: .6; cursor: not-allowed; }
`,ge=r.div`
  color: #ef4444;
  font-weight: 600;
  margin: 6px 0 0;
`,Pa=r.div`
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 8px;
`,fx=r.div`
  color: #fbbf24;
  font-weight: 600;
  margin-bottom: 8px;
`,La=r.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
`,Ta=r.div`
  grid-column: 1 / -1;
`,Da={id:"",name:"",email:"",password:"",document:"",address:"",number:"",complete:"",neighborhood:"",city:"",state:"",cep:"",phone:"",date_birth:"",products_id:"",amount:"",child_name:"",child_birth:""};function vx(){const[t,a]=s.useState(Da),[o,n]=s.useState(!1),[i,l]=s.useState(""),[c,p]=s.useState(""),[d,x]=s.useState({}),[g,u]=s.useState(""),[b,R]=s.useState(!1),y=s.useRef(null),[m,A]=s.useState([]),[I,D]=s.useState(!0),[$,E]=s.useState(""),L=s.useCallback(async()=>{try{const j=await Ao();a(_=>({..._,id:String(j+1)})),u("ID sugerido automaticamente."),R(!0)}catch{u("Não foi possível sugerir ID automaticamente."),R(!1)}},[a,u,R]),H=Ae.useMemo(()=>{const j=new Set;return(m||[]).filter(_=>{const N=String(_?.id??"");return!N||j.has(N)?!1:(j.add(N),!0)})},[m]);s.useEffect(()=>{y.current?.focus()},[]),s.useEffect(()=>{let j=!0;return(async()=>{try{let N=[];try{const W=await ho(),w=W?.data?.data??W?.data;N=(Array.isArray(w)?w:[]).filter(F=>F&&F.id)}catch(W){console.warn("[DemoSignup] Fallback para lista completa de produtos.",W);const w=await mo(1,{key:"name",direction:"asc"}),v=w?.data?.data??w?.data;N=(Array.isArray(v)?v:[]).filter(V=>V&&V.id)}j&&A(N)}catch(N){j&&(console.warn("Falha ao carregar planos",N),A([]))}finally{j&&D(!1)}})(),()=>{j=!1}},[]),s.useEffect(()=>{L()},[L]);const f=j=>j.replace(/\D+/g,""),B=j=>{const _=f(j).slice(0,8);return _.length>5?`${_.slice(0,5)}-${_.slice(5,8)}`:_},Z=j=>{const _=f(j).slice(0,11);return _.length<=10?_.replace(/(\d{2})(\d{4})(\d{0,4})/,"($1) $2-$3").trim():_.replace(/(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3").trim()},T=j=>j.toUpperCase().slice(0,2),q=async j=>{const _=j.target.value;if(a(N=>({...N,id:_})),u("Verificando..."),R(!1),!_||isNaN(Number(_))){u("ID deve ser um número."),R(!1);return}try{const N=await J.get(`/admin/orders/${_}`);N&&N.data&&N.data.id?(u("ID já existe. Escolha outro."),R(!1)):(u("ID disponível!"),R(!0))}catch{u("ID disponível!"),R(!0)}},O=j=>{const{name:_,value:N}=j.target;if(_==="id"){q(j);return}let W=N;if(_==="cep"&&(W=B(N)),_==="phone"&&(W=Z(N)),_==="state"&&(W=T(N)),_==="products_id"){const w=m.find(v=>String(v.id)===String(N));if(w&&w.price){a(v=>({...v,products_id:N,amount:String(w.price)}));return}}a({...t,[_]:W})},P=j=>{const _={};if((!j.id||Number.isNaN(Number(j.id))||Number(j.id)<=0)&&(_.id="Informe um ID numérico válido."),(!j.name||j.name.trim().length<3)&&(_.name="Informe o nome completo (mín. 3)."),(!j.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(j.email))&&(_.email="E-mail inválido."),(!j.password||j.password.length<6)&&(_.password="Senha mínima de 6 caracteres."),(!j.phone||f(j.phone).length<10)&&(_.phone="Telefone com DDD é obrigatório."),(!j.address||j.address.trim().length<5)&&(_.address="Endereço obrigatório."),(!j.number||j.number.trim().length===0)&&(_.number="Informe o número."),(!j.neighborhood||j.neighborhood.trim().length<3)&&(_.neighborhood="Informe o bairro."),(!j.city||j.city.trim().length<2)&&(_.city="Informe a cidade."),(!j.state||j.state.trim().length!==2)&&(_.state="UF com 2 letras."),(!j.cep||f(j.cep).length!==8)&&(_.cep="CEP deve ter 8 dígitos."),(!j.child_name||j.child_name.trim().length<2)&&(_.child_name="Nome da criança é obrigatório."),!j.child_birth)_.child_birth="Data de nascimento é obrigatória.";else{const N=Date.parse(j.child_birth);Number.isNaN(N)?_.child_birth="Data de nascimento inválida.":N>Date.now()&&(_.child_birth="Data de nascimento não pode ser futura.")}return _},C=async j=>{j.preventDefault(),l(""),p(""),E("");const _=t.id&&String(t.id).trim().length>0;if(_&&!b){l("Escolha um ID válido e disponível.");return}const N=P(t);if(x(N),!Object.keys(N).length){n(!0);try{const W=t.amount?Number(String(t.amount).replace(",",".")):void 0,w={name:t.name.trim(),email:t.email.trim(),password:t.password,document:f(t.document),phone:f(t.phone),cep:f(t.cep),address:t.address.trim(),number:t.number.trim(),complete:t.complete?.trim()||void 0,neighborhood:t.neighborhood.trim(),city:t.city.trim(),state:T(t.state),date_birth:t.date_birth||void 0,products_id:t.products_id?Number(t.products_id):void 0,amount:Number.isFinite(W)?W:void 0,child_name:t.child_name.trim(),child_birth:t.child_birth,order_id:_?Number(t.id):void 0},v=await J.post("/demo/signup/full",w),F=H.find(ne=>String(ne.id)===String(t.products_id)),V=$d({name:t.name,email:t.email,phone:f(t.phone),plan:F?.slug||F?.id||"default",planLabel:F?.name,childName:t.child_name,childAgeLabel:t.child_birth,notes:"Criado via fluxo demo público."});if(V&&v?.data){const ne={};v.data.user_id&&(ne.backendUserId=String(v.data.user_id)),v.data.order_id&&(ne.backendOrderId=String(v.data.order_id)),v.data.child_id&&(ne.backendChildId=String(v.data.child_id)),v.data.demo_request_id&&(ne.backendDemoRequestId=String(v.data.demo_request_id));const ke=v.data.suggested_order_id??w.order_id;ke&&(ne.suggestedOrderId=String(ke)),v.data.pending&&(ne.pending=!0),Object.keys(ne).length>0&&$o(V.id,ne)}const ie=typeof window<"u"?window.location.origin:"";E(`${ie}/demo-subscriber/${V.id}`);const ce=v?.data?.order_id,be=!!v?.data?.pending,je=v?.data?.suggested_order_id??w.order_id;p(be?`Solicitação enviada! Aprove no painel para gerar o pedido${je?` #${je}`:""} e iniciar a separação real.`:ce?`Cadastro concluído! Pedido #${ce} já está disponível no painel completo.`:"Cadastro concluído!"),a(Da),x({}),await L(),y.current?.focus()}catch(W){const w=W?.response;w?.status===422&&w?.data?.errors?(x(w.data.errors),l("Corrija os campos destacados.")):l(w?.data?.message||"Erro ao cadastrar.")}finally{n(!1)}}};return e.jsx(ux,{children:e.jsxs(xx,{children:[e.jsx(gx,{children:"Cadastro Demonstrativo de Assinante"}),i&&e.jsx(ge,{children:i}),c&&e.jsx(Pa,{children:c}),$&&e.jsxs(Pa,{style:{color:"#38bdf8"},children:["Link do seu painel: ",e.jsx("a",{href:$,style:{color:"#bae6fd"},children:$})]}),e.jsxs(mx,{onSubmit:C,autoComplete:"off",noValidate:!0,children:[e.jsx(fx,{children:"Campos marcados com * são obrigatórios. A assinatura real só é criada depois que você aprovar a solicitação no painel principal."}),e.jsxs(La,{children:[e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"id",children:"ID (manual) *"}),e.jsx(xe,{id:"id",name:"id",type:"number",value:t.id,onChange:O,required:!0,min:1,step:1}),t.id&&e.jsx(Ft,{style:{color:b?"green":"red"},children:g}),d.id&&e.jsx(ge,{role:"alert",children:d.id})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"name",children:"Nome completo *"}),e.jsx(xe,{id:"name",autoComplete:"name",ref:y,name:"name",value:t.name,onChange:O,placeholder:"Ex.: Maria Silva","aria-invalid":!!d.name}),d.name&&e.jsx(ge,{role:"alert",children:d.name})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"email",children:"Email *"}),e.jsx(xe,{id:"email",autoComplete:"email",name:"email",type:"email",value:t.email,onChange:O,placeholder:"seu@email.com","aria-invalid":!!d.email}),d.email&&e.jsx(ge,{role:"alert",children:d.email})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"password",children:"Senha *"}),e.jsx(xe,{id:"password",autoComplete:"new-password",name:"password",type:"password",value:t.password,onChange:O,placeholder:"Mínimo 6 caracteres","aria-invalid":!!d.password}),d.password&&e.jsx(ge,{role:"alert",children:d.password})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"child_name",children:"Nome do bebê *"}),e.jsx(xe,{id:"child_name",name:"child_name",value:t.child_name,onChange:O,placeholder:"Ex.: Sofia","aria-invalid":!!d.child_name}),d.child_name&&e.jsx(ge,{role:"alert",children:d.child_name})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"child_birth",children:"Nascimento do bebê *"}),e.jsx(xe,{id:"child_birth",name:"child_birth",type:"date",value:t.child_birth,onChange:O,"aria-invalid":!!d.child_birth}),d.child_birth&&e.jsx(ge,{role:"alert",children:d.child_birth})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"document",children:"CPF (opcional)"}),e.jsx(xe,{id:"document",autoComplete:"off",name:"document",value:t.document,onChange:O,placeholder:"Somente números","aria-invalid":!!d.document})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"phone",children:"Telefone *"}),e.jsx(xe,{id:"phone",autoComplete:"tel",name:"phone",value:t.phone,onChange:O,placeholder:"(11) 98888-7777","aria-invalid":!!d.phone}),d.phone&&e.jsx(ge,{role:"alert",children:d.phone})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"date_birth",children:"Data de nascimento"}),e.jsx(xe,{id:"date_birth",autoComplete:"bday",name:"date_birth",type:"date",value:t.date_birth,onChange:O,"aria-invalid":!!d.date_birth}),d.date_birth&&e.jsx(ge,{role:"alert",children:d.date_birth})]}),e.jsxs(Ta,{children:[e.jsx(ue,{children:"Endereço *"}),e.jsx(xe,{id:"address",autoComplete:"address-line1",name:"address",value:t.address,onChange:O,placeholder:"Rua, avenida, etc","aria-invalid":!!d.address}),d.address&&e.jsx(ge,{role:"alert",children:d.address})]}),e.jsxs("div",{children:[e.jsx(ue,{children:"Número *"}),e.jsx(xe,{id:"number",autoComplete:"address-line2",name:"number",value:t.number,onChange:O,placeholder:"123","aria-invalid":!!d.number}),d.number&&e.jsx(ge,{role:"alert",children:d.number})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"complete",children:"Complemento"}),e.jsx(xe,{id:"complete",autoComplete:"address-line2",name:"complete",value:t.complete,onChange:O}),e.jsx(Ft,{children:"Opcional: apto, bloco, referência…"})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"neighborhood",children:"Bairro *"}),e.jsx(xe,{id:"neighborhood",autoComplete:"off",name:"neighborhood",value:t.neighborhood,onChange:O,"aria-invalid":!!d.neighborhood}),d.neighborhood&&e.jsx(ge,{role:"alert",children:d.neighborhood})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"city",children:"Cidade *"}),e.jsx(xe,{id:"city",autoComplete:"address-level2",name:"city",value:t.city,onChange:O,"aria-invalid":!!d.city}),d.city&&e.jsx(ge,{role:"alert",children:d.city})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"state",children:"Estado *"}),e.jsx(xe,{id:"state",autoComplete:"address-level1",name:"state",value:t.state,onChange:O,placeholder:"UF","aria-invalid":!!d.state}),d.state&&e.jsx(ge,{role:"alert",children:d.state})]}),e.jsxs(Ta,{children:[e.jsx(ue,{htmlFor:"cep",children:"CEP *"}),e.jsx(xe,{id:"cep",autoComplete:"postal-code",name:"cep",value:t.cep,onChange:O,placeholder:"00000-000","aria-invalid":!!d.cep}),d.cep&&e.jsx(ge,{role:"alert",children:d.cep})]})]}),e.jsxs(La,{children:[e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"products_id",children:"Plano (opcional)"}),e.jsxs(hx,{id:"products_id",autoComplete:"off",name:"products_id",value:t.products_id,onChange:O,disabled:I,children:[e.jsx("option",{value:"",children:"Selecione um plano…"}),H.map((j,_)=>e.jsx("option",{value:String(j.id),children:j.name||`Plano #${j.id}`},`${j.id}-${_}`))]}),e.jsx(Ft,{children:"Selecione para sugerir um plano quando for aprovar pelo painel."})]}),e.jsxs("div",{children:[e.jsx(ue,{htmlFor:"amount",children:"Valor (opcional)"}),e.jsx(xe,{id:"amount",autoComplete:"off",name:"amount",value:t.amount,onChange:O,placeholder:"0.00"}),e.jsx(Ft,{children:"Deixe vazio para 0.00"})]})]}),e.jsx(bx,{type:"submit",disabled:o||Object.keys(d).length>0,"aria-busy":o,children:o?"Cadastrando...":"Cadastrar"}),e.jsx("div",{style:{height:24}})]})]})})}const yx=X`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,jx=r.div`
  min-height: 100vh;
  padding: 18px;
  background:
    radial-gradient(1100px 600px at 10% -20%, rgba(56,178,172,0.06), transparent 50%),
    radial-gradient(900px 500px at 110% 120%, rgba(56,178,172,0.05), transparent 50%),
    var(--color-bg-dark);
  display: flex;
  align-items: flex-start;
  justify-content: center;
`,wx=r.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  animation: ${yx} 0.4s ease-out;
`,kx=r.div`
  background: #1d2c2f;
  border: 1px solid rgba(0,0,0,.28);
  border-radius: 20px;
  padding: 18px;
`,lr=({children:t})=>e.jsx(jx,{children:e.jsx(wx,{children:e.jsx(kx,{children:t})})}),Sx=r.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({$status:t})=>t==="active"?"rgba(34,197,94,0.18)":t==="pending"?"rgba(56,189,248,0.18)":t==="suspended"?"rgba(249,115,22,0.18)":t==="cancelled"?"rgba(244,63,94,0.18)":"rgba(148,163,184,0.2)"};
  color: ${({$status:t})=>t==="active"?"#bbf7d0":t==="pending"?"#e0f2fe":t==="suspended"?"#fed7aa":t==="cancelled"?"#fecdd3":"#cbd5f5"};
`,_x=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: flex-start;
`,Cx=r.button`
  background: rgba(148,163,184,0.14);
  color: #e2e8f0;
  border: 1px solid rgba(148,163,184,0.25);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover { background: rgba(148,163,184,0.22); }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`,$x=r.div`
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(56,178,172,0.12);
  border: 1px solid rgba(56,178,172,0.25);
  color: #bbf7d0;
  font-weight: 600;
`,Ax=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
`,Fa=["pending","active","suspended","cancelled"];function Ex(){const[t,a]=s.useState(()=>Cd()),[o,n]=s.useState(""),i=Pe();s.useEffect(()=>{const p=Co(a);return()=>p()},[]);const l=s.useMemo(()=>[...t].sort((p,d)=>p.status===d.status?new Date(d.createdAt).getTime()-new Date(p.createdAt).getTime():Fa.indexOf(p.status)-Fa.indexOf(d.status)),[t]),c=s.useCallback(p=>{const x=`${typeof window<"u"?window.location.origin:""}/demo-subscriber/${p}`;navigator?.clipboard?.writeText?navigator.clipboard.writeText(x).then(()=>{n("Link do perfil copiado para a área de transferência."),setTimeout(()=>n(""),4e3)}).catch(()=>{n(x),setTimeout(()=>n(""),6e3)}):(n(x),setTimeout(()=>n(""),6e3))},[]);return e.jsxs(Fr,{title:"Assinantes Demo",description:"Gerencie os assinantes criados pelo fluxo demonstrativo.",transparent:!0,children:[e.jsxs(Ax,{children:[e.jsx("span",{style:{color:"#94a3b8",fontSize:"0.9rem"},children:"Use o botão abaixo para abrir o fluxo público de cadastro demo."}),e.jsx(Ir,{onClick:()=>i("/demo-signup"),children:"Criar novo cadastro demo"})]}),o&&e.jsx($x,{children:o}),e.jsx(Eo,{children:e.jsxs(zo,{children:[e.jsx("thead",{children:e.jsxs(vt,{children:[e.jsx(ye,{children:"Assinante"}),e.jsx(ye,{children:"Plano"}),e.jsx(ye,{children:"Status"}),e.jsx(ye,{children:"Criado em"}),e.jsx(ye,{children:"Ações"})]})}),e.jsx("tbody",{children:l.length===0?e.jsx(vt,{children:e.jsxs(me,{colSpan:"5",style:{textAlign:"center",padding:"24px 0",color:"#94a3b8"},children:["Nenhum assinante demo foi criado ainda. Gere um teste pelo fluxo",e.jsx("a",{href:"/demo-signup",style:{color:"#9dd9d2",marginLeft:4},children:"Cadastro Demonstrativo"}),"."]})}):l.map(p=>{const d=new Date(p.createdAt).toLocaleString("pt-BR");return e.jsxs(vt,{children:[e.jsxs(me,{children:[e.jsx("div",{style:{fontWeight:700},children:p.name||"Assinante sem nome"}),e.jsx("div",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:p.email})]}),e.jsx(me,{children:p.planLabel||p.plan}),e.jsx(me,{children:e.jsx(Sx,{$status:p.status,children:_o(p.status)})}),e.jsx(me,{children:d}),e.jsx(me,{children:e.jsxs(_x,{children:[e.jsx("div",{style:{fontSize:"0.8rem",color:"#94a3b8"},children:"Administre o status pelo painel principal de assinantes."}),e.jsx(Cx,{onClick:()=>c(p.id),children:"Copiar Perfil"})]})})]},p.id)})})]})})]})}const dr={active:{background:"linear-gradient(135deg, rgba(34,197,94,0.32), rgba(22,163,74,0.22))",border:"rgba(74,222,128,0.45)",color:"#bbf7d0"},pending:{background:"linear-gradient(135deg, rgba(56,189,248,0.28), rgba(14,165,233,0.18))",border:"rgba(125,211,252,0.45)",color:"#e0f2fe"},suspended:{background:"linear-gradient(135deg, rgba(249,115,22,0.28), rgba(194,65,12,0.2))",border:"rgba(251,146,60,0.45)",color:"#ffedd5"},cancelled:{background:"linear-gradient(135deg, rgba(244,63,94,0.32), rgba(190,18,60,0.22))",border:"rgba(248,113,113,0.5)",color:"#ffe4e6"}},Ia=r.div`
  min-height: 100vh;
  background: radial-gradient(1000px 600px at 50% 0%, rgba(56,178,172,0.08), rgba(8,15,35,0.95));
  color: #e2e8f0;
  padding: 40px 16px 60px;
  display: flex;
  justify-content: center;
`,Ra=r.div`
  width: 100%;
  max-width: 960px;
  background: rgba(15,23,42,0.82);
  border-radius: 26px;
  padding: 36px;
  border: 1px solid rgba(148,163,184,0.22);
  box-shadow: 0 24px 60px rgba(2,8,23,0.45);
  backdrop-filter: blur(12px);
`,zx=r.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`,Na=r.h1`
  font-size: 1.9rem;
  margin: 0;
`,Px=r.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8rem;
  background: ${({$status:t})=>dr[t]?.background||"rgba(148,163,184,0.25)"};
  border: 1px solid ${({$status:t})=>dr[t]?.border||"rgba(148,163,184,0.3)"};
  color: ${({$status:t})=>dr[t]?.color||"#e2e8f0"};
`,cr=r.section`
  margin-top: 28px;
  background: rgba(15,23,42,0.72);
  border-radius: 18px;
  border: 1px solid rgba(148,163,184,0.16);
  padding: 22px 24px;
`,pr=r.h2`
  margin: 0 0 16px 0;
  font-size: 1.2rem;
`,ur=r.ul`
  margin: 0;
  padding-left: 18px;
  color: rgba(226,232,240,0.9);
`,xr={warning:{background:"linear-gradient(135deg, rgba(251,191,36,0.18), rgba(217,119,6,0.12))",border:"rgba(251,191,36,0.45)",color:"#fef3c7"},danger:{background:"linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.14))",border:"rgba(248,113,113,0.45)",color:"#fee2e2"}},Ma=r.div`
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${({$tone:t})=>xr[t]?.background||"rgba(148,163,184,0.18)"};
  border: 1px solid ${({$tone:t})=>xr[t]?.border||"rgba(148,163,184,0.28)"};
  color: ${({$tone:t})=>xr[t]?.color||"#e2e8f0"};
  font-weight: 600;
`,Lx=r.div`
  margin-top: 20px;
  padding: 18px;
  border-radius: 16px;
  background: rgba(56,189,248,0.12);
  border: 1px solid rgba(56,189,248,0.2);
  color: #e0f2fe;
`,Tx=r.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(148,163,184,0.18);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #cbd5f5;
  font-weight: 700;
`;function Dx(){const{id:t}=$r(),[a,o]=s.useState(()=>fr(t));if(s.useEffect(()=>{const l=Co(()=>{o(fr(t))});return()=>l()},[t]),!a)return e.jsx(Ia,{children:e.jsxs(Ra,{children:[e.jsx(Na,{children:"Assinante demo não encontrado"}),e.jsx("p",{children:"Verifique se o link está correto ou solicite um novo link ao time Evolua."})]})});const n=a.status,i=_o(n);return e.jsx(Ia,{children:e.jsxs(Ra,{children:[e.jsx(Tx,{children:"Ambiente demonstrativo"}),e.jsxs(zx,{children:[e.jsxs(Na,{children:["Olá, ",a.name||"assinante Evolua","!"]}),e.jsx(Px,{$status:n,children:i}),a.planLabel&&e.jsxs("div",{style:{color:"#94a3b8"},children:["Plano contratado: ",e.jsx("strong",{children:a.planLabel})]})]}),n==="pending"&&e.jsx(Lx,{children:"Seu acesso está em revisão. Assim que o time Evolua aprovar, você receberá um e-mail com as próximas orientações."}),n==="suspended"&&e.jsx(Ma,{$tone:"warning",children:"A sua assinatura está temporariamente suspensa. Entre em contato com nosso suporte para regularizar a situação e reativar o acesso."}),n==="cancelled"&&e.jsx(Ma,{$tone:"danger",children:"Esta assinatura foi cancelada. Caso deseje retomar com a Evolua, fale conosco para avaliarmos um novo início."}),(n==="active"||n==="suspended")&&e.jsxs(cr,{children:[e.jsx(pr,{children:"Próximos brinquedos do kit"}),e.jsx(ur,{children:a.toys?.map(l=>e.jsx("li",{children:l},l))||e.jsx("li",{children:"Kit introdutório em preparação."})})]}),n==="active"&&e.jsxs(cr,{children:[e.jsx(pr,{children:"Vídeos exclusivos"}),e.jsx(ur,{children:a.videos?.map(l=>e.jsx("li",{children:l},l))||e.jsx("li",{children:"Conteúdo em produção."})})]}),e.jsxs(cr,{children:[e.jsx(pr,{children:"Histórico desta assinatura"}),e.jsx(ur,{children:a.history?.slice().reverse().map(l=>e.jsxs("li",{children:[e.jsxs("strong",{children:[new Date(l.at).toLocaleString("pt-BR"),":"]})," ",l.description]},l.at))})]})]})})}const Fx=r.div`
  background: var(--color-surface, #111827);
  min-height: 100vh;
  padding: 32px 0;
  color: var(--color-text, #e2e8f0);
`,Ix=r.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 32px;
  padding: 0 32px;
`,Rx=r(pe)`
  color: var(--color-primary, #9dd9d2);
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  &:hover { text-decoration: underline; }
`,Nx=r.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text, #e2e8f0);
`,Ba=r.span`
  background: ${t=>t.$isAdimplente?"#68d391":"#fc8181"};
  color: #111827;
  border-radius: 8px;
  padding: 0.4em 1em;
  font-weight: 700;
  font-size: 1rem;
  margin-left: 1rem;
  display: inline-block;
`,Mx=r.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2.5rem;
  padding: 0 32px;
  align-items: flex-start;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`,Nt=r.div`
  background: var(--color-surface2, #1f2937);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  border: 1px solid var(--color-border, #374151);
  padding: 24px 22px;
  margin-bottom: 2rem;
`,It=r.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`,Bx=r.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`,He=r.li`
  font-size: 1rem;
  color: var(--color-text, #e2e8f0);
  span { color: var(--color-muted, #a0aec0); margin-left: 0.5em; }
`,Ox=r.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`,qx=r.li`
  font-size: 1rem;
  color: var(--color-text, #e2e8f0);
  display: flex;
  align-items: center;
  gap: 0.5em;
  span { color: var(--color-muted, #a0aec0); }
`,Ux=r(Nt)`
  margin-bottom: 0;
`,Oa=r.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`,_e=r.th`
  background: var(--color-surface2, #1f2937);
  color: var(--color-muted, #a0aec0);
  font-weight: 600;
  padding: 10px 8px;
  border-bottom: 1.5px solid var(--color-border, #374151);
  text-align: left;
`,Ce=r.td`
  padding: 10px 8px;
  border-bottom: 1px solid var(--color-border, #374151);
  color: var(--color-text, #e2e8f0);
  font-size: 1rem;
`,Hx=r.span`
  background: ${t=>t.$approved?"#68d391":"#fc8181"};
  color: #111827;
  border-radius: 7px;
  padding: 0.3em 0.8em;
  font-weight: 600;
  font-size: 0.98rem;
  display: inline-block;
`,at=r.div`
  color: var(--color-muted, #a0aec0);
  font-size: 1rem;
  padding: 1.2em 0;
  text-align: center;
`,gr=t=>{if(!t)return"N/A";try{return new Date(t).toLocaleDateString("pt-BR")}catch{return"N/A"}},Wx=t=>{if(!t)return"N/A";try{return Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(t))}catch{return t}},Yx=()=>{const{id:t}=$r(),[a,o]=s.useState(null),[n,i]=s.useState([]),l=Sr(),[c,p]=s.useState(!0),[d,x]=s.useState("");s.useEffect(()=>{(async()=>{p(!0),x("");try{const b=await Re.getAssinanteById(t),R=b?.data?.data??b?.data??null;o(R);try{const y=await Re.getHistorico?await Re.getHistorico(t):null;i(y&&Array.isArray(y.data?.data)?y.data.data:y?.data||[])}catch{i([])}}catch{x("Não foi possível carregar os dados do assinante.")}finally{p(!1)}})()},[t]);const g=()=>l?.state?.fromSolicitacoes?"pending-approval":a?.orders?.length?[...a.orders].sort((b,R)=>new Date(R.created_at)-new Date(b.created_at))[0].gateway_status==="approved":!1;return e.jsxs(Fx,{children:[e.jsxs(Ix,{children:[e.jsxs(Rx,{to:"/assinantes",children:[e.jsx(zn,{})," Voltar"]}),a&&e.jsxs(e.Fragment,{children:[e.jsx(Nx,{children:a.name}),g()==="pending-approval"?e.jsx(Ba,{$isAdimplente:!1,style:{background:"#fbbf24",color:"#111827"},children:"Pendente de aprovação de assinatura"}):e.jsx(Ba,{$isAdimplente:g(),children:g()?"Adimplente":"Inadimplente"})]})]}),c?e.jsx(at,{children:"Carregando…"}):d?e.jsx(at,{children:d}):a?e.jsxs(Mx,{children:[e.jsxs("div",{children:[e.jsxs(Nt,{children:[e.jsxs(It,{children:[e.jsx(Pn,{})," Dados Pessoais"]}),e.jsxs(Bx,{children:[e.jsxs(He,{children:["Email: ",e.jsx("span",{children:a.email||"N/A"})]}),e.jsxs(He,{children:["Telefone: ",e.jsx("span",{children:a.phone||"N/A"})]}),e.jsxs(He,{children:["Documento: ",e.jsx("span",{children:a.document||"N/A"})]}),e.jsxs(He,{children:["Endereço: ",e.jsx("span",{children:a.address||"N/A"})]}),e.jsxs(He,{children:["Número: ",e.jsx("span",{children:a.number||"N/A"})]}),e.jsxs(He,{children:["Cidade: ",e.jsx("span",{children:a.city||"N/A"})]}),e.jsxs(He,{children:["Estado: ",e.jsx("span",{children:a.state||"N/A"})]})]})]}),e.jsxs(Nt,{children:[e.jsxs(It,{children:[e.jsx(Ln,{})," Filho(s)"]}),a.children&&a.children.length>0?e.jsx(Ox,{children:Array.from(new Map(a.children.map(u=>[`${u.id||""}_${u.name||""}_${u.birth||""}`,u])).values()).map(u=>e.jsxs(qx,{children:[u.name," ",e.jsxs("span",{children:["(",gr(u.birth),")"]})]},`${u.id||u.name}_${u.birth||""}`))}):e.jsx(at,{children:"Nenhum filho cadastrado."})]})]}),e.jsxs(Ux,{children:[e.jsxs(It,{children:[e.jsx(Tn,{})," Histórico de Pedidos"]}),a.orders&&a.orders.length>0?e.jsxs(Oa,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(_e,{children:"ID"}),e.jsx(_e,{children:"Plano"}),e.jsx(_e,{children:"Valor"}),e.jsx(_e,{children:"Status Pagamento"}),e.jsx(_e,{children:"Data"})]})}),e.jsx("tbody",{children:Array.from(new Map([...a.orders].sort((u,b)=>(Number(b.id)||0)-(Number(u.id)||0)).map(u=>[String(u.id),u])).values()).map(u=>e.jsxs("tr",{children:[e.jsx(Ce,{children:u.id}),e.jsx(Ce,{children:u.product?.name||"N/A"}),e.jsx(Ce,{children:Wx(u.amount)}),e.jsx(Ce,{children:e.jsx(Hx,{$approved:u.gateway_status==="approved",children:u.gateway_status==="approved"?"Aprovado":"Cancelado"})}),e.jsx(Ce,{children:gr(u.created_at)})]},u.id))})]}):e.jsx(at,{children:"Nenhum pedido encontrado."})]}),e.jsx("div",{children:e.jsxs(Nt,{children:[e.jsx(It,{children:"Histórico de Envios"}),(()=>{const u=Array.isArray(n)?n:[];return u.length===0?e.jsx(at,{children:"Nenhum envio encontrado."}):e.jsxs(Oa,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(_e,{children:"Pedido"}),e.jsx(_e,{children:"Produto"}),e.jsx(_e,{children:"Rastreamento"}),e.jsx(_e,{children:"Status"}),e.jsx(_e,{children:"Data"})]})}),e.jsx("tbody",{children:u.map(b=>e.jsxs("tr",{children:[e.jsxs(Ce,{children:["#",b.order_id||b.id]}),e.jsx(Ce,{children:b.product_name||b.product?.name||(b.product_id?`#${b.product_id}`:"—")}),e.jsx(Ce,{children:b.tracking_code?e.jsx("a",{href:`https://www.muambator.com.br/pacotes/${encodeURIComponent(b.tracking_code)}`,target:"_blank",rel:"noreferrer noopener",style:{color:"#9dd9d2",textDecoration:"none",fontWeight:600},title:"Abrir rastreio em nova aba",children:b.tracking_code}):"—"}),e.jsx(Ce,{children:b.status_label||"Enviado/Coletado"}),e.jsx(Ce,{children:gr(b.created_at)})]},b.id))})]})})()]})})]}):e.jsx(at,{children:"Nenhum dado encontrado."})]})},Vx=r.div`
  max-width: 980px;
  margin: 24px auto;
  background: var(--panel-surface-0, var(--surface-0));
  border-radius: 12px;
  padding: 28px;
  color: var(--panel-text, var(--text));
  box-shadow: 0 10px 30px rgba(3, 6, 12, 0.4);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--panel-surface-2, transparent);
  /* sem efeitos de vidro/blur */
  @media (max-width: 768px) {
    margin: 12px;
    padding: 18px;
  }
`,Gx=r.div`
  text-align: center;
  margin-bottom: 18px;
`,Kx=r.h1`
  margin: 0;
  font-size: 30px;
  line-height: 1.25;
  @media (max-width: 768px) {
    font-size: 22px;
  }
`,Xx=r.p`
  margin: 6px 0 0 0;
  color: var(--panel-text-muted, var(--text-muted));
  font-size: 13px;
`,Qx=r.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
`,Jx=r.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`,$e=r.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`,Wt=r.label`
  font-size: 13px;
  color: var(--panel-text-muted, rgba(230, 238, 248, 0.8));
`,kr=r.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-glass-border, rgba(255,255,255,0.08));
  background: var(--panel-glass-bg, rgba(255, 255, 255, 0.04));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  color: var(--panel-text, inherit);
  outline: none;
  min-height: 44px;
  &:focus {
    box-shadow: 0 0 0 3px var(--panel-ring, var(--ring));
    border-color: transparent;
  }
`,kt=r.div`
  border-radius: 8px;
  transition: box-shadow 160ms ease, border-color 120ms ease;
  display: block;
  & > * {
    width: 100%;
  }
  &:hover {
    box-shadow: 0 6px 18px rgba(3,6,12,0.45);
    /* no translateY on hover - keep subtle */
    border-color: rgba(111,62,248,0.14);
  }
  /* react-select control inside this wrapper (when using classNamePrefix 'ec') */
  .ec__control {
    border-radius: 8px !important;
    border: 1px solid var(--panel-glass-border, var(--panel-surface-2)) !important;
    background: var(--panel-glass-bg, var(--panel-surface-1)) !important;
    -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px)) !important;
    backdrop-filter: blur(var(--panel-glass-blur, 10px)) !important;
    box-shadow: none !important;
  }
`;r.textarea`
  min-height: 180px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-glass-border, rgba(255,255,255,0.08));
  background: var(--panel-glass-bg, rgba(255,255,255,0.04));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  color: var(--panel-text, inherit);
  outline: none;
  @media (max-width: 768px) {
    min-height: 140px;
  }
  &:focus {
    box-shadow: 0 0 0 3px var(--ring);
    border-color: transparent;
  }
`;r.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;const Oo=r.button`
  background: var(--accent);
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: filter 0.15s ease, opacity 0.2s ease;
  &:hover { filter: brightness(1.05); }
  &:active { filter: brightness(0.96); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`,qo=r.button`
  background: transparent;
  color: var(--panel-text, rgba(230, 238, 248, 0.92));
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--panel-surface-2, rgba(255, 255, 255, 0.08));
  cursor: pointer;
`,Zx=r.button`
  background: transparent;
  color: var(--panel-text, rgba(230, 238, 248, 0.9));
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid var(--panel-surface-2, rgba(255, 255, 255, 0.06));
  cursor: pointer;
`,eg=r.div`
  padding: 12px;
  border-radius: 10px;
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  border: 1px solid var(--panel-glass-border, transparent);
`,tg=r(eg)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,rg=r.div`
  font-weight: 600;
  color: var(--panel-text, var(--text));
`,ag=r.div`
  padding: 8px;
  border-radius: 8px;
  background: var(--panel-glass-bg, #041025);
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  border: 1px solid var(--panel-glass-border, transparent);
`,og=r.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(106, 62, 255, 0.12);
  border: 1px solid rgba(106, 62, 255, 0.22);
  color: var(--panel-text, #F0F0F0);
  font-size: 12px;
`;r.span`
  color: var(--panel-text-muted, var(--text-muted));
`;r.div`
  border-radius: 10px;
  border: 1px solid var(--panel-glass-border, transparent);
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
  overflow: hidden;
`;r.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-bottom: 1px solid var(--panel-surface-2, var(--surface-2));
`;r.button`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid var(--panel-surface-2, var(--surface-2));
  background: ${t=>t.$active?"rgba(111,62,248,0.15)":"transparent"};
  cursor: pointer;
  color: inherit;
`;r.div`
  padding: 8px;
`;const ng=r.div`
  border: 1px dashed var(--panel-glass-border, transparent);
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  background: var(--panel-glass-bg, var(--panel-surface-1));
  -webkit-backdrop-filter: blur(var(--panel-glass-blur, 10px));
  backdrop-filter: blur(var(--panel-glass-blur, 10px));
`,sg=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,ig=r.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`,lg=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,dg=r.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,cg=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  position: sticky;
  bottom: 0;
  padding-top: 8px;
  background: var(--panel-surface-0, var(--surface-0));
`,pg=r.span`
  font-size: 12px;
  color: var(--panel-text-muted, var(--text-muted));
`,ug=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`,xg=r.strong``,gg=r.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`,mg=r.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`,hg=r.span`
  font-weight: 700;
  font-size: 15px;
  color: var(--panel-text, var(--text));
`,bg=r.span`
  font-size: 13px;
  color: var(--panel-text-muted, var(--text-muted));
`,fg=r.div`
  position: relative;
`,vg=r.ul`
  position: absolute;
  z-index: 2147483647;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--panel-surface-0, var(--surface-0));
  border: 1px solid var(--panel-surface-2, var(--surface-2));
  border-radius: 8px;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  max-height: 280px;
  overflow: auto;
  box-shadow: 0 10px 30px rgba(3,6,12,0.6);
`,yg=r.li`
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  border-bottom: 1px solid var(--panel-surface-2, rgba(255,255,255,0.03));
  transition: background 120ms ease;
  &:hover {
    background: rgba(111,62,248,0.06);
  }
  &.highlighted {
    background: rgba(111,62,248,0.12);
  }
  &:last-child {
    border-bottom: none;
  }
`,qa=r.div`
  width: 28px;
  height: 28px;
  min-width: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--panel-text, var(--text));
  flex: 0 0 28px;
  svg { width: 18px; height: 18px; color: var(--panel-text-muted, var(--text-muted)); }
`,jg=r.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--panel-surface-2, transparent);
  background: var(--panel-surface-1, rgba(0,0,0,0.02));
  color: var(--panel-text, inherit);
  min-height: 48px;
  cursor: pointer;
  transition: box-shadow 160ms ease, border-color 120ms ease;
  position: relative; /* allow absolutely-positioned chevron */
  padding-right: 56px; /* room for chevron + clear */
  &:hover {
    box-shadow: 0 6px 18px rgba(3,6,12,0.45);
    /* no translateY movement on hover - keep it subtle */
    border-color: rgba(111,62,248,0.14);
  }
`,wg=r.span`
  font-weight: 700;
  font-size: 14px;
  color: var(--panel-text, var(--text));
`,kg=r.span`
  font-size: 12px;
  color: var(--panel-text-muted, var(--text-muted));
`,Sg=r.button`
  background: transparent;
  border: none;
  color: var(--panel-text-muted, var(--text-muted));
  cursor: pointer;
  padding: 6px;
  margin-left: 8px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  svg { width: 12px; height: 12px; }
  &:hover { background: rgba(255,255,255,0.02); color: var(--panel-text, var(--text)); svg { color: var(--panel-text, var(--text)); } }
`,_g=r.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(${t=>t.$open?"180deg":"0deg"});
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--panel-text-muted, var(--text-muted));
  transition: transform 180ms ease, color 120ms ease;
  &:hover { color: var(--panel-text, var(--text)); }
`,Cg=r.div`
  /* tema padrão (roxo/azul atual) */
  --surface-0: #0b1220;
  --surface-1: rgba(255, 255, 255, 0.03);
  --surface-2: rgba(255, 255, 255, 0.06);
  --text: #e6eef8;
  --text-muted: rgba(230, 238, 248, 0.7);
  --ring: rgba(111, 62, 248, 0.18);
  --accent: linear-gradient(90deg, #6f3ef8, #5b2be6);

  /* Panel (EmailComposer content) - Tema Misto: painel claro sobre casca escura */
  /* Panel variables for Soft Dark Mode */
  --panel-surface-0: #1E1E1E; /* main panel background (darker) */
  --panel-surface-1: #2A2A2A; /* component surfaces (inputs, cards, editor) */
  --panel-surface-2: transparent; /* no light borders for dark mode */
  --panel-text: #F0F0F0; /* main text */
  --panel-text-muted: #8B8B8B; /* labels/secondary text */
  --panel-ring: rgba(106, 62, 255, 0.18); /* accent ring (keeps purple accent) */
  --panel-accent: linear-gradient(90deg, #6a3eff, #5b2be6);
  /* Glass variables for Camada 2 */
  --panel-glass-bg: rgba(255, 255, 255, 0.04);
  --panel-glass-border: rgba(255, 255, 255, 0.08);
  --panel-glass-blur: 10px;

  &[data-theme='green'] {
    --surface-0: #0a0e14;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(232, 236, 243, 0.62);
    --ring: rgba(16,185,129,0.18);
    --accent: linear-gradient(90deg, #10b981, #059669);
  }
  &[data-theme='amber'] {
    --surface-0: #100c06;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(244, 234, 210, 0.62);
    --ring: rgba(245,158,11,0.2);
    --accent: linear-gradient(90deg, #f59e0b, #d97706);
  }
  &[data-theme='graphite'] {
    --surface-0: #0f172a; /* slate-800 */
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(210, 218, 230, 0.62);
    --ring: rgba(148,163,184,0.22);
    --accent: linear-gradient(90deg, #94a3b8, #64748b);
  }
  &[data-theme='rose'] {
    --surface-0: #14080c;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(245, 224, 230, 0.66);
    --ring: rgba(244,114,182,0.20);
    --accent: linear-gradient(90deg, #f472b6, #ec4899);
  }
  &[data-theme='teal'] {
    --surface-0: #061214;
    --surface-2: rgba(255, 255, 255, 0.05);
    --text-muted: rgba(220, 240, 240, 0.66);
    --ring: rgba(20,184,166,0.20);
    --accent: linear-gradient(90deg, #14b8a6, #0d9488);
  }
  &[data-theme='slate'] {
    --surface-0: #0c1016;
    --surface-2: rgba(255, 255, 255, 0.055);
    --text-muted: rgba(224, 232, 242, 0.64);
    --ring: rgba(100,116,139,0.20);
    --accent: linear-gradient(90deg, #64748b, #475569);
  }
  &[data-theme='purple'] {
    --surface-0: #090a18;
    --surface-2: rgba(255, 255, 255, 0.06);
    --text-muted: rgba(230, 238, 248, 0.7);
    --ring: rgba(139,92,246,0.20);
    --accent: linear-gradient(90deg, #8b5cf6, #7c3aed);
  }
`,$g=io`
  /* Strong overlay rules to ensure react-select menu appears above everything.
     We use a very large z-index and fixed positioning to escape stacking contexts.
     Keep !important to override third-party styles used elsewhere. */
  .ec__menu,
  .ec__menu-portal,
  .ec__menu-list {
    z-index: 2147483647 !important;
    position: fixed !important;
    pointer-events: auto !important;
    -webkit-transform: none !important;
    transform: none !important;
  }
  /* Ensure the portal container (if present) is placed on top */
  .ec__menu-portal {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
  }
`,yt=[{value:"1",label:"Ana Silva <ana@exemplo.com>",name:"Ana Silva",email:"ana@exemplo.com",id:"1"},{value:"2",label:"Carlos Souza <carlos@exemplo.com>",name:"Carlos Souza",email:"carlos@exemplo.com",id:"2"},{value:"3",label:"Mariana Lima <mariana@exemplo.com>",name:"Mariana Lima",email:"mariana@exemplo.com",id:"3"},{value:"4",label:"Neiva Santos <neiva@exemplo.com>",name:"Neiva Santos",email:"neiva@exemplo.com",id:"4"},{value:"5",label:"José Neiva <jose.neiva@exemplo.com>",name:"José Neiva",email:"jose.neiva@exemplo.com",id:"5"}],Ie=(t="")=>{try{return t?t.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase():""}catch{return String(t||"").toLowerCase()}},Ag=({fetchRecipients:t,minLength:a=2})=>{let o=null;return n=>new Promise(i=>{const l=async()=>{const c=String(n||"").trim();if(!c)return i(yt);if(c.length<a)return i([]);if(typeof t=="function")try{console.debug("[RecipientSearch] loadOptions - query:",c);const p=await t(c),d=Array.isArray(p)?p.map(x=>({value:String(x.id??x.value??x.email??x.name??c),id:x.id??x.value??null,name:x.name??x.label??x.email??"—",email:x.email??"",label:`${x.name??"—"} <${x.email??""}>`})):[];i(d)}catch(p){console.debug("[RecipientSearch] loadOptions - fetchRecipients error:",p);const d=Ie(c),x=yt.filter(g=>{const u=Ie(g.name),b=Ie(g.email),R=Ie(g.email.split("@")[0]||"");return u.includes(d)||b.includes(d)||R.includes(d)});i(x)}else{console.debug("[RecipientSearch] loadOptions - using local mock filter for:",c);const p=Ie(c),d=yt.filter(x=>{const g=Ie(x.name),u=Ie(x.email),b=Ie(x.email.split("@")[0]||"");return g.includes(p)||u.includes(p)||b.includes(p)});i(d)}};clearTimeout(o),o=setTimeout(l,250)})},Eg=({value:t=null,onChange:a,fetchRecipients:o=null,minLength:n=2})=>{t&&(t.id,`${t.name}${t.email}`,t.id,t.name,t.email);const i=Ae.useMemo(()=>Ag({fetchRecipients:o,minLength:n}),[o,n]),[l,c]=s.useState(""),[p,d]=s.useState([]),[x,g]=s.useState(!1),[u,b]=s.useState(!1),[R,y]=s.useState(0),[m,A]=s.useState(!1),I=s.useRef(null),D=s.useRef(null);s.useEffect(()=>{let f=!0;return(async()=>{const Z=String(l||"").trim();if(!Z){d(yt),b(!!yt.length);return}if(Z.length<n){d([]),b(!1);return}g(!0);try{const T=await i(Z);if(!f)return;d(Array.isArray(T)?T:[]),b(Array.isArray(T)&&T.length>0),y(0)}catch{d([]),b(!1)}finally{g(!1)}})(),()=>{f=!1}},[l,i,n]),s.useEffect(()=>{const f=B=>{I.current&&!I.current.contains(B.target)&&b(!1)};return document.addEventListener("mousedown",f),()=>document.removeEventListener("mousedown",f)},[]);const $=f=>{c(f.target.value)},E=f=>{c(f.name||f.label||""),b(!1),a&&a(f?{id:f.id,name:f.name,email:f.email}:null)},L=f=>{f.stopPropagation(),a&&a(null),c(""),b(!0)},H=f=>{if(u)if(f.key==="ArrowDown")f.preventDefault(),y(B=>Math.min(B+1,p.length-1));else if(f.key==="ArrowUp")f.preventDefault(),y(B=>Math.max(B-1,0));else if(f.key==="Enter"){f.preventDefault();const B=p[R];B&&E(B)}else f.key==="Escape"&&b(!1)};return e.jsxs($e,{ref:I,children:[e.jsx(Wt,{children:"Pesquisar Destinatário"}),e.jsxs(fg,{children:[t?e.jsx(jg,{onClick:()=>{A(!0),b(!0),setTimeout(()=>D.current&&D.current.focus(),0)},children:m?e.jsx(kt,{children:e.jsx(kr,{ref:D,"aria-label":"Pesquisar destinatário",value:l,onChange:$,onKeyDown:H,placeholder:"Digite um nome ou e-mail para buscar...",minLength:1,onFocus:()=>{p.length&&b(!0)},onBlur:()=>{A(!1),u||c("")}})}):e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx(qa,{children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M21 7.2l-9 6-9-6",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]})}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",flex:1},children:[e.jsx(wg,{children:t.name}),e.jsx(kg,{children:t.email})]}),e.jsx(Sg,{onClick:L,"aria-label":"Limpar seleção",children:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M18 6L6 18M6 6l12 12",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})}),e.jsx(_g,{$open:u,"aria-hidden":!0,children:e.jsx("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M6 9l6 6 6-6",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})})]})}):e.jsx(kt,{children:e.jsx(kr,{"aria-label":"Pesquisar destinatário",value:l,onChange:$,onKeyDown:H,placeholder:"Digite um nome ou e-mail para buscar...",onFocus:()=>{p.length&&b(!0)}})}),u&&e.jsx(vg,{role:"listbox",children:p.map((f,B)=>e.jsxs(yg,{className:B===R?"highlighted":"",onMouseDown:Z=>{Z.preventDefault(),E(f)},onMouseEnter:()=>y(B),children:[e.jsx(qa,{children:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M3 8.5v7A2.5 2.5 0 0 0 5.5 18h13a2.5 2.5 0 0 0 2.5-2.5v-7",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"}),e.jsx("path",{d:"M21 7.2l-9 6-9-6",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})]})}),e.jsxs(mg,{children:[e.jsx(hg,{children:f.name}),e.jsx(bg,{children:f.email})]})]},f.value??B))})]})]})},zg=r.div`
  width: 100%;
`,Pg=t=>e.jsx(Fn.DropdownIndicator,{...t,children:e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,children:e.jsx("path",{d:"M7 10l5 5 5-5",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})}),Lg={menuPortal:t=>({...t,zIndex:9999}),control:(t,a)=>({...t,borderRadius:8,borderColor:a.isFocused?"#2684FF":t.borderColor,boxShadow:a.isFocused?"0 0 0 4px rgba(38,132,255,0.12)":t.boxShadow,"&:hover":{borderColor:"#2684FF"},minHeight:40,background:"var(--panel-glass-bg, rgba(255,255,255,0.04))",border:"1px solid var(--panel-glass-border, rgba(255,255,255,0.08))",WebkitBackdropFilter:"blur(var(--panel-glass-blur,10px))",backdropFilter:"blur(var(--panel-glass-blur,10px))"}),option:(t,a)=>({...t,backgroundColor:a.isFocused?"rgba(111,62,248,0.06)":a.isSelected?"rgba(106,62,255,0.12)":t.backgroundColor,color:"var(--panel-text, #F0F0F0)",cursor:"pointer"}),singleValue:t=>({...t,color:"var(--panel-text, #F0F0F0)"}),indicatorSeparator:()=>({display:"none"}),dropdownIndicator:t=>({...t,padding:8})},Tg=({options:t=[],value:a=null,onChange:o=()=>{},placeholder:n="Selecione um template...",isClearable:i=!0,ariaLabel:l="Template de mensagem"})=>{const c=p=>{o(p)};return e.jsxs($e,{children:[e.jsx(Wt,{children:"Template de Mensagem"}),e.jsx(kt,{children:e.jsx(zg,{children:e.jsx(Dn,{options:t,value:a,onChange:c,styles:Lg,components:{DropdownIndicator:Pg},menuPortalTarget:typeof document<"u"?document.body:null,menuPosition:"fixed",placeholder:n,isClearable:i,"aria-label":l})})})]})},Uo=({label:t,children:a=null,inputProps:o={}})=>e.jsxs($e,{children:[t?e.jsx(Wt,{children:t}):null,e.jsx(kt,{children:a||e.jsx(kr,{...o})})]}),Dg=({value:t="",onChange:a})=>e.jsx(Uo,{label:"Assunto",inputProps:{placeholder:"Assunto do e-mail",value:t,onChange:o=>a&&a(o.target.value)}}),Fg=({value:t,onChange:a})=>e.jsx("div",{className:"fallback-textarea-container",children:e.jsx("textarea",{value:t,onChange:o=>a&&a(o.target.value),className:"fallback-textarea"})}),Ig=({editor:t})=>{if(!t)return null;const a=s.useCallback(()=>{const i=window.prompt("Insira a URL (ex: https://example.com)");i&&t.chain().focus().extendMarkRange("link").setLink({href:i}).run()},[t]),o=s.useCallback(()=>{t.chain().focus().unsetLink().run()},[t]),n=[{id:"bold",label:"B",action:()=>t.chain().focus().toggleBold().run()},{id:"italic",label:"I",action:()=>t.chain().focus().toggleItalic().run()},{id:"underline",label:"U",action:()=>t.chain().focus().toggleUnderline().run()},{id:"heading",level:2,label:"H2",action:()=>t.chain().focus().toggleHeading({level:2}).run()},{id:"bulletList",label:"• List",action:()=>t.chain().focus().toggleBulletList().run()},{id:"orderedList",label:"1. List",action:()=>t.chain().focus().toggleOrderedList().run()},{id:"link",label:"Link",action:a},{id:"unlink",label:"Unlink",action:o,active:!1}];return e.jsx("div",{className:"message-editor-toolbar",children:n.map(i=>e.jsx("button",{type:"button",onClick:i.action,className:`toolbar-button ${t.isActive(i.id,i.level)?"active":""}`,children:i.label},i.id))})},Rg=({value:t="",onChange:a,height:o=300})=>{const[n,i]=s.useState(typeof window>"u"),l=In({extensions:[Rn,Nn.configure({openOnClick:!0}),Mn.configure({placeholder:"Escreva sua mensagem aqui..."})],content:t||"<p></p>",onUpdate:({editor:p})=>{const d=p.getHTML();a&&a(d)}});if(s.useEffect(()=>{l&&(l.getHTML()===t||l.commands.setContent(t,!1))},[t,l]),n)return e.jsx(Fg,{value:t,onChange:a});const c={"--message-editor-height":`${o}px`};return e.jsx(kt,{style:c,children:e.jsxs("div",{className:"message-editor-container",children:[e.jsx(Ig,{editor:l}),e.jsx(Bn,{editor:l})]})})},Ng=({file:t,onRemove:a})=>t?e.jsxs(lg,{children:[e.jsx(dg,{title:t.name,children:t.name}),e.jsx(Zx,{type:"button",onClick:()=>a&&a(t),children:"Remover"})]}):null,Mg=({attachments:t=[],onAdd:a=()=>{},onRemove:o=()=>{}})=>{const n=s.useCallback(p=>{a&&a(p)},[a]),{getRootProps:i,getInputProps:l,isDragActive:c}=On({onDrop:n});return e.jsxs($e,{children:[e.jsx(Wt,{children:"Anexos"}),e.jsx(Uo,{label:"Anexos",children:e.jsxs(ng,{...i(),children:[e.jsx("input",{...l()}),e.jsxs(sg,{children:[e.jsx("div",{children:c?"Solte os arquivos aqui...":"Arraste e solte arquivos aqui ou clique para selecionar"}),e.jsx(qo,{type:"button",children:"Selecionar"})]}),e.jsx(ig,{children:t.length===0?e.jsx("small",{children:"Nenhum arquivo anexado"}):t.map((p,d)=>e.jsx(Ng,{file:p,onRemove:()=>o(d)},p.name+d))})]})})]})},Bg=({onSend:t=()=>{},isSending:a=!1})=>e.jsxs(cg,{children:[e.jsx(pg,{children:"Dica: Ctrl/⌘ + Enter para enviar"}),e.jsx(Oo,{onClick:()=>t&&t(),disabled:a,children:a?"Enviando...":"Enviar E-mail"})]}),Og=r.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`,qg=r.div`
  width: min(960px, 95%);
  max-height: 80vh;
  overflow: auto;
  background: #071024;
  border-radius: 8px;
  padding: 18px;
  color: #e6eef8;
`,Ug=({html:t="",onClose:a=()=>{},onConfirm:o=()=>{}})=>{const n=hr.sanitize(t||"");return e.jsx(Og,{children:e.jsxs(qg,{children:[e.jsxs(ug,{children:[e.jsx(xg,{children:"Pré-visualização"}),e.jsx("div",{})]}),e.jsx("div",{dangerouslySetInnerHTML:{__html:n}}),e.jsxs(gg,{style:{marginTop:12},children:[e.jsx(qo,{onClick:a,children:"Fechar"}),e.jsx(Oo,{onClick:o,children:"Confirmar Envio"})]})]})})};function Ua(t="",a={}){return t.replace(/{{\s*([a-zA-Z0-9_\.]+)\s*}}/g,(o,n)=>{const i=n.split(".").reduce((l,c)=>l&&l[c]!=null?l[c]:"",a);return String(i??"")})}function Hg(t=""){return/[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(t).trim())}function Wg(t=[],{maxCount:a=10,maxTotalBytes:o=20*1024*1024}={}){return Array.isArray(t)?t.length>a?{valid:!1,reason:"max_count"}:t.reduce((i,l)=>i+(l.size||0),0)>o?{valid:!1,reason:"max_total_size"}:{valid:!0}:{valid:!1,reason:"invalid_files"}}const Ha=[{id:"welcome",name:"Boas-vindas",cause:"Boas-vindas ao serviço",subject:"Bem-vindo(a), {{name}}!",body:"<p>Olá {{name}},<br/>Seja bem-vindo(a)! Estamos felizes em tê-lo(a) conosco. Se tiver qualquer dúvida, responda este e-mail.</p>"},{id:"promo",name:"Promoção",cause:"Oferta comercial",subject:"Oferta especial para {{name}} — até {{discount}} de desconto",body:"<p>Olá {{name}},<br/>Preparamos uma oferta exclusiva: aproveite <strong>{{discount}}</strong> em produtos selecionados. Use o código <em>PROMO{{date}}</em> na finalização.</p>"},{id:"recuperacao",name:"Recuperação de carrinho",cause:"Lembrete de carrinho abandonado",subject:"Você esqueceu algo no carrinho, {{name}}?",body:"<p>Olá {{name}},<br/>Percebemos que você deixou itens no carrinho. Volte para finalizar sua compra — temos estoque limitado.</p>"},{id:"conf_pagamento",name:"Confirmação de Pagamento",cause:"Comprovante / confirmação",subject:"Pagamento recebido — Pedido #{{order_id}}",body:"<p>Olá {{name}},<br/>Recebemos seu pagamento referente ao pedido <strong>#{{order_id}}</strong>. Em breve enviaremos o comprovante e atualizaremos o status da entrega.</p>"},{id:"newsletter",name:"Newsletter Mensal",cause:"Comunicação geral",subject:"Novidades deste mês — {{month}}",body:"<h3>Olá {{name}},</h3><p>Confira as principais novidades e artigos do mês. Temos dicas, lançamentos e casos de sucesso para você.</p>"},{id:"evento",name:"Convite para evento",cause:"Evento / Webinar",subject:"Convite: Participe do nosso evento em {{date}}",body:"<p>Olá {{name}},<br/>Gostaríamos de convidá-lo(a) para o evento <strong>Nome do Evento</strong> em <em>{{date}}</em>. Inscreva-se pelo link e garanta sua vaga.</p>"},{id:"suporte",name:"Resposta do Suporte",cause:"Atendimento ao cliente",subject:"Atualização sobre seu chamado #{{ticket}}",body:"<p>Olá {{name}},<br/>Atualizamos o status do seu chamado <strong>#{{ticket}}</strong>. Nossa equipe avaliou e informou as próximas etapas.</p>"}],Yg=()=>{const[t]=s.useState(()=>{try{return localStorage.getItem("email_theme")||"graphite"}catch{return"graphite"}});s.useEffect(()=>{try{localStorage.setItem("email_theme",t)}catch{}},[t]);const[a,o]=s.useState(null),[n,i]=s.useState(null),[l,c]=s.useState(null),[p,d]=s.useState(""),[x,g]=s.useState(""),[u,b]=s.useState(null),[R,y]=s.useState(null),[m,A]=s.useState([]),[I,D]=s.useState(!1),[$,E]=s.useState(!1),L=s.useCallback(C=>{console.debug("EmailComposer handleSelectRecipient:",C),o(C)},[]),H=s.useCallback(C=>{if(i(C),!C)return;const j=a?.name??"",_=String(p||"").match(/#(\d+)/),N=_?_[1]:"",W={name:j,order_id:N},w=Ua(C.body,W)||"";g(w),b(C.id),y("set"),Xe.info("Template aplicado ao corpo da mensagem"),d(Ua(C.subject,W))},[a,u,R]),f=Ae.useMemo(()=>Ha.map(C=>({value:C.id,label:C.name,raw:C})),[]),B=s.useCallback(C=>{if(c(C||null),!C){i(null);return}const j=(C.raw??Ha.find(_=>String(_.id)===String(C.value)))||null;H(j)},[H]),Z=s.useCallback(C=>{A(j=>[...j,...C])},[]),T=s.useCallback(C=>{A(j=>j.filter((_,N)=>N!==C))},[]),q=s.useCallback(()=>{if(!a||!Hg(a.email)){Xe.error("Selecione um destinatário válido");return}const C=Wg(m);if(!C.valid){Xe.error("Problema com anexos: "+C.reason);return}E(!0)},[a,m]),O=s.useCallback(()=>{E(!1),D(!0);const C=hr.sanitize(x||"");setTimeout(()=>{D(!1),console.debug("Simulated send payload:",{recipient:a,subject:p,body:C,attachments:m}),Xe.success("E-mail enviado (simulado)"),o(null),i(null),c(null),d(""),g(""),A([])},1e3)},[]);s.useEffect(()=>{const C=j=>{(j.ctrlKey||j.metaKey)&&j.key==="Enter"&&(j.preventDefault(),I||q())};return window.addEventListener("keydown",C,!0),()=>window.removeEventListener("keydown",C,!0)},[I,q]);const P=s.useCallback(async C=>{const j=String(C||"").trim();if(!j)return[];try{console.debug("[EmailComposer] fetchRecipients - query:",j);const _=await J.get("/admin/subscribers/search",{params:{q:j}});console.debug("[EmailComposer] fetchRecipients - response:",_&&_.status,_&&_.data);const N=_?.data,W=Array.isArray(N?.data)?N.data:Array.isArray(N)?N:[];return console.debug("[EmailComposer] fetchRecipients - normalized array length:",Array.isArray(W)?W.length:0),W.map(w=>({id:w.id??w.user_id??w.uuid??w.value??null,name:w.name??w.full_name??w.label??w.email??"-",email:w.email??w.mail??""}))}catch(_){const N=_?.response?.status;return console.debug("[EmailComposer] fetchRecipients - error status:",N,_?.response?.data||_.message),N===401||N===419?(Xe.error("Sessão expirada. Por favor faça login novamente."),console.debug("EmailComposer recipients search unauthorized (401/419)"),[]):N===403?(Xe.error("Acesso negado: você não tem permissão para buscar assinantes."),console.debug("EmailComposer recipients search forbidden (403)"),[]):(console.debug("EmailComposer recipients protected search failed:",_),[])}},[]);return e.jsxs(e.Fragment,{children:[e.jsx($g,{}),e.jsx(qn,{}),e.jsx(Cg,{"data-theme":t,children:e.jsxs(Vx,{children:[e.jsxs(Gx,{children:[e.jsx(Kx,{children:"Email Composer"}),e.jsx(Xx,{children:"Crie e envie e-mails com facilidade usando busca inteligente e templates."})]}),e.jsxs(Qx,{children:[e.jsxs(Jx,{children:[e.jsx($e,{children:e.jsx(Eg,{value:a,onChange:L,fetchRecipients:P,minLength:2})}),e.jsx($e,{children:e.jsx(Dg,{value:p,onChange:C=>d(C)})}),e.jsx($e,{children:e.jsx(Tg,{options:f,value:l,onChange:B})})]}),n&&e.jsx($e,{children:e.jsxs(tg,{children:[e.jsxs(rg,{children:[e.jsx(og,{children:"Motivo"})," ",n.cause]}),e.jsxs(ag,{children:[e.jsx("em",{children:"Mensagem modelo:"}),e.jsx("div",{dangerouslySetInnerHTML:{__html:hr.sanitize(n.body)}})]})]})}),e.jsx($e,{children:e.jsx(Rg,{value:x,onChange:C=>g(C)})}),e.jsx($e,{children:e.jsx(Mg,{attachments:m,onAdd:Z,onRemove:T})}),e.jsx(Bg,{onSend:q,isSending:I})]})]})}),$&&e.jsx(Ug,{html:x,onClose:()=>E(!1),onConfirm:O})]})},Wa=()=>e.jsx(Yg,{});function Vg(){return e.jsxs(Un,{children:[e.jsx(de,{path:"/login",element:e.jsx(ks,{})}),e.jsx(de,{path:"/demo-signup",element:e.jsx(lr,{children:e.jsx(vx,{})})}),e.jsx(de,{path:"/demo-subscriber/:id",element:e.jsx(lr,{children:e.jsx(Dx,{})})}),e.jsx(de,{path:"/email-composer-public",element:e.jsx(lr,{children:e.jsx(Wa,{})})}),e.jsx(de,{element:e.jsx(Zn,{}),children:e.jsxs(de,{path:"/",element:e.jsx(_i,{}),children:[e.jsx(de,{index:!0,element:e.jsx(Va,{to:"/dashboard",replace:!0})}),e.jsx(de,{path:"dashboard",element:e.jsx(bl,{})}),e.jsx(de,{path:"assinantes",element:e.jsx(Fd,{})}),e.jsx(de,{path:"assinantes/novo",element:e.jsx(Qd,{})}),e.jsx(de,{path:"assinantes/:id",element:e.jsx(Yx,{})}),e.jsx(de,{path:"produtos",element:e.jsx(Sc,{})}),e.jsx(de,{path:"produtos/novo",element:e.jsx(Hc,{})}),e.jsx(de,{path:"produtos/:productId/editar",element:e.jsx(ep,{})}),e.jsx(de,{path:"estoque",element:e.jsx(_c,{})}),e.jsx(de,{path:"separacao",element:e.jsx(Au,{})}),e.jsx(de,{path:"shipping/labels",element:e.jsx(px,{})}),e.jsx(de,{path:"email-composer",element:e.jsx(Wa,{})}),e.jsx(de,{path:"demo-subscribers",element:e.jsx(Ex,{})}),e.jsx(de,{path:"historico",element:e.jsx(Nc,{})})]})}),e.jsx(de,{path:"*",element:e.jsx("h1",{children:"404 - Página Não Encontrada"})})]})}const Gg=io`
  :root {
    --color-bg-dark:       #1A202C;
    --color-bg-light:      #2D3748;
    --color-sidebar-bg:    #294147;
    --color-primary:       #38B2AC;
    --color-accent:        #EC4899;
    --color-text-light:    #F7FAFC;
    --color-text-muted:    #A0AEC0;
    --color-border:        #4A5568;
    --color-red-danger:    #E53E3E;

    --bg:        var(--color-bg-dark);
    --bg-elev:   var(--color-bg-light);
    --sidebar:   var(--color-sidebar-bg);
    --card:      var(--color-bg-light);
    --accent:    var(--color-primary);
    --accent-d:  rgba(56,178,172,0.14);
    --text:      var(--color-text-light);
    --muted:     var(--color-text-muted);
    --border:    rgba(148,163,184,0.18);

    --radius: 16px;
  }

  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }

  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    background: var(--color-bg-dark);
    color: var(--color-text-light);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: Poppins, Inter, sans-serif;
    color: var(--color-text-light);
    letter-spacing: .2px;
    margin: 0 0 .5rem 0;
  }

  p { color: var(--color-text-muted); margin: 0; }

  :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.28);
    border-radius: 12px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  /* Reset global leve */
  a { color: inherit; text-decoration: none; background: transparent; border: 0; outline: none; }
  a:hover, a:active, a:visited { color: inherit; text-decoration: none; }
  ul, ol { list-style: none; margin: 0; padding: 0; }
  li { margin: 0; padding: 0; }

  /* Reset escopado para o Kanban */
  .kanban-scope a {
    all: unset;
    display: block;
    cursor: pointer;
    color: inherit;
  }
  .kanban-scope a, .kanban-scope a * {
    text-decoration: none !important;
  }
  .kanban-scope *, .kanban-scope *::before, .kanban-scope *::after {
    box-sizing: border-box;
    min-width: 0;
  }

  .u-reset-link { all: unset; cursor: pointer; color: inherit; }
  .u-reset-link, .u-reset-link * { text-decoration: none !important; }
`,Kg=(t,a)=>typeof a=="string"?!new Set(["isActive","$isActive","active","$active","variant","$variant","intent","$intent","size","$size","selected","$selected"]).has(t):!0,Xg=Hn.createRoot(document.getElementById("root"));Xg.render(e.jsxs(Ae.StrictMode,{children:[e.jsx(Gg,{}),e.jsx(Wn,{shouldForwardProp:Kg,children:e.jsx(Yn,{children:e.jsx(Jn,{children:e.jsx(Vg,{})})})})]}));
