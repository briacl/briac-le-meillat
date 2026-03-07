import{j as e,u as v,a as k,r as g}from"./index-B_6FCcrP.js";import{s as w}from"./berangere-series-u9DdaP3O.js";function T({videoUrl:i,posterUrl:f,title:t,onPlay:d,isDarkMode:x=!1,className:m=""}){return e.jsx("div",{className:`relative w-full ${m}`,children:e.jsxs("video",{controls:!0,poster:f,className:"w-full h-full rounded-lg",preload:"metadata",onPlay:d,"aria-label":t,children:[i&&e.jsx("source",{src:i,type:"video/mp4"}),"Votre navigateur ne supporte pas la lecture de vidéos."]})})}const j=`
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Light.otf') format('opentype');
    font-weight: 300; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-LightItalic.otf') format('opentype');
    font-weight: 300; font-style: italic;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Book.otf') format('opentype');
    font-weight: 400; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BookItalic.otf') format('opentype');
    font-weight: 400; font-style: italic;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Demi.otf') format('opentype');
    font-weight: 500; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceText';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-Bold.otf') format('opentype');
    font-weight: 700; font-style: normal;
  }
  @font-face {
    font-family: 'NeutrafaceTextDemiSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-DemiSC.otf') format('opentype');
  }
  @font-face {
    font-family: 'NeutrafaceTextBookSC';
    src: url('/briac-le-meillat/fonts/NeutrafaceText-BookSC.otf') format('opentype');
  }

  *, *::before, *::after { box-sizing: border-box; }

  .ep-arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.55;
    transition: opacity 0.2s, transform 0.15s;
    flex-shrink: 0;
  }
  .ep-arrow-btn:hover { opacity: 1; transform: scale(1.12); }
  .ep-arrow-btn:disabled { opacity: 0.15; cursor: default; }
  .ep-arrow-btn:disabled:hover { transform: none; }

  .ep-back-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255,255,255,0.65);
    font-family: 'NeutrafaceText', sans-serif;
    font-weight: 400;
    font-style: italic;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    padding: 0;
    transition: color 0.2s;
  }
  .ep-back-btn:hover { color: rgba(255,255,255,0.95); }
`;function p({size:i=18}){return e.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"15,18 9,12 15,6"})})}function S({size:i=18}){return e.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"9,6 15,12 9,18"})})}function F(){const{id:i}=v(),f=k(),[t,d]=g.useState(!1),[x,m]=g.useState(!1),b=w,a=g.useMemo(()=>b.find(r=>r.id===i),[i]),l=g.useMemo(()=>a?.series?.[0]?b.filter(r=>r.series?.[0]===a.series[0]).sort((r,s)=>(r.season??0)!==(s.season??0)?(r.season??0)-(s.season??0):(r.episode??0)-(s.episode??0)):[],[a]),u=l.findIndex(r=>r.id===i),n=l[u-1]??null,o=l[u+1]??null,c=r=>f(`/berangere/serie/${r.id}`,{replace:!1});if(!a)return e.jsxs("div",{style:{minHeight:"100vh",background:"#0a0a0a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'NeutrafaceText', sans-serif",color:"#555",letterSpacing:"0.12em",fontStyle:"italic"},children:[e.jsx("style",{children:j}),"Épisode introuvable."]});const y=a.createdAt?new Date(a.createdAt).getFullYear():null,h=`Saison ${a.season??"?"} Episode ${a.episode??"?"}`;return e.jsxs("div",{style:{minHeight:"100vh",background:t?"#0c0c0c":"#f5f5f5",fontFamily:"'NeutrafaceText', sans-serif",display:"flex",flexDirection:"column",transition:"background 0.4s ease"},children:[e.jsx("style",{children:j}),e.jsxs("header",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.25rem clamp(1.5rem, 5vw, 4rem)",borderBottom:t?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.08)"},children:[e.jsx("span",{style:{color:t?"#fff":"#000",fontWeight:300,fontStyle:"italic",letterSpacing:"0.42em",fontSize:"1rem",fontFamily:"'NeutrafaceText', sans-serif"},children:"Bérangère"}),e.jsx("span",{style:{fontFamily:"'NeutrafaceTextDemiSC', sans-serif",fontSize:"0.78rem",color:t?"rgba(255,255,255,0.55)":"rgba(0,0,0,0.55)",letterSpacing:"0.1em"},children:a.series?.[0]}),e.jsx("div",{style:{width:120}})]}),e.jsxs("div",{style:{flex:1,display:"flex",flexDirection:"row",gap:0,minHeight:0},children:[e.jsxs("div",{style:{flex:"1 1 50%",background:t?"#000":"#fff",display:"flex",flexDirection:"column",position:"relative",minHeight:"clamp(280px, 56vw, 680px)"},children:[x?e.jsx(T,{videoUrl:a.videoLink,posterUrl:a.imageUrl,title:a.title,onPlay:()=>d(!0),isDarkMode:t}):e.jsx("div",{style:{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",padding:"2rem"},children:e.jsxs("div",{onClick:()=>{m(!0),d(!0)},style:{width:"90%",maxWidth:"800px",aspectRatio:"16/9",position:"relative",cursor:"pointer",borderRadius:"16px",overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.15)",transition:"transform 0.3s ease, box-shadow 0.3s ease"},onMouseEnter:r=>{r.currentTarget.style.transform="scale(1.02)",r.currentTarget.style.boxShadow="0 12px 48px rgba(0,0,0,0.25)"},onMouseLeave:r=>{r.currentTarget.style.transform="scale(1)",r.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.15)"},children:[a.imageUrl&&e.jsx("img",{src:a.imageUrl,alt:a.title,style:{width:"100%",height:"100%",objectFit:"cover",position:"absolute",top:0,left:0}}),e.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.3)",transition:"background 0.3s ease"},onMouseEnter:r=>r.currentTarget.style.background="rgba(0,0,0,0.5)",onMouseLeave:r=>r.currentTarget.style.background="rgba(0,0,0,0.3)"}),e.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:2,width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.95)",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform 0.3s ease, background 0.3s ease",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"},onMouseEnter:r=>{r.currentTarget.style.transform="translate(-50%, -50%) scale(1.1)",r.currentTarget.style.background="rgba(255,255,255,1)"},onMouseLeave:r=>{r.currentTarget.style.transform="translate(-50%, -50%) scale(1)",r.currentTarget.style.background="rgba(255,255,255,0.95)"},children:e.jsx("svg",{width:"32",height:"32",viewBox:"0 0 24 24",fill:"none",style:{marginLeft:"4px"},children:e.jsx("path",{d:"M8 5v14l11-7z",fill:"#000"})})})]})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",padding:"0.85rem clamp(1rem, 3vw, 2rem)",borderTop:t?"1px solid rgba(255,255,255,0.06)":"1px solid rgba(0,0,0,0.08)",background:t?"#0a0a0a":"#fafafa"},children:[e.jsxs("button",{className:"ep-back-btn",onClick:()=>f("/berangere#series"),style:{color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)"},children:[e.jsx(p,{size:14}),"Retour"]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.75rem"},children:[e.jsx("button",{className:"ep-arrow-btn",onClick:()=>n&&c(n),disabled:!n,title:n?n.title:"",style:{color:t?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.7)"},children:e.jsx(p,{size:16})}),e.jsx("span",{style:{fontFamily:"'NeutrafaceTextDemiSC', sans-serif",fontSize:"0.82rem",color:t?"rgba(255,255,255,0.8)":"rgba(0,0,0,0.8)",letterSpacing:"0.08em",userSelect:"none"},children:h}),e.jsx("button",{className:"ep-arrow-btn",onClick:()=>o&&c(o),disabled:!o,title:o?o.title:"",style:{color:t?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.7)"},children:e.jsx(S,{size:16})})]})]})]}),e.jsxs("div",{style:{width:"clamp(320px, 50%, 600px)",flexShrink:0,padding:"clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)",background:t?"#111":"#fff",borderLeft:t?"1px solid rgba(255,255,255,0.05)":"1px solid rgba(0,0,0,0.08)",overflowY:"auto",display:"flex",flexDirection:"column",gap:"0"},children:[e.jsx("p",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontStyle:"normal",fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.05em",marginBottom:"0.6rem",margin:0},children:a.series?.[0]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.6rem",marginTop:"0.6rem",marginBottom:"0.5rem"},children:[e.jsx("button",{className:"ep-arrow-btn",onClick:()=>n&&c(n),disabled:!n,style:{color:t?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.7)"},children:e.jsx(p,{size:20})}),e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:700,fontSize:"1.1rem",color:t?"#fff":"#000",letterSpacing:"0.02em"},children:h}),e.jsx("button",{className:"ep-arrow-btn",onClick:()=>o&&c(o),disabled:!o,style:{color:t?"rgba(255,255,255,0.7)":"rgba(0,0,0,0.7)"},children:e.jsx(S,{size:20})})]}),e.jsxs("h1",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:700,fontSize:"clamp(1.5rem, 2.8vw, 2.2rem)",color:t?"#fff":"#000",letterSpacing:"0.02em",lineHeight:1.3,margin:0,marginBottom:"0.8rem"},children:[e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"2.5em",lineHeight:"0",display:"inline-block",verticalAlign:"middle",transform:"translateY(-0.05em)",marginRight:"0.15em"},children:"·"}),a.title]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",flexWrap:"wrap",gap:"0.4rem 0.6rem",marginTop:"0.2rem",marginBottom:"1.8rem",paddingBottom:"1.8rem",borderBottom:t?"1px solid rgba(255,255,255,0.07)":"1px solid rgba(0,0,0,0.08)"},children:[e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:"Bérangère"}),e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"0.9rem",margin:"0 0.5em"},children:"|"}),a.category&&e.jsxs(e.Fragment,{children:[e.jsxs("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:["Séries ",a.category]}),e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"2.2em",lineHeight:"0",display:"inline-block",verticalAlign:"middle",transform:"translateY(-0.08em)",margin:"0 0.2em"},children:"·"})]}),y&&e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:y}),e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"2.2em",lineHeight:"0",display:"inline-block",verticalAlign:"middle",transform:"translateY(-0.08em)",margin:"0 0.2em"},children:"·"})]}),e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:"Vidéo"}),a.duration&&e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"2.2em",lineHeight:"0",display:"inline-block",verticalAlign:"middle",transform:"translateY(-0.08em)",margin:"0 0.2em"},children:"·"}),e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:a.duration})]}),e.jsx("span",{style:{color:t?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.4)",fontSize:"2.2em",lineHeight:"0",display:"inline-block",verticalAlign:"middle",transform:"translateY(-0.08em)",margin:"0 0.2em"},children:"·"}),e.jsx("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontSize:"0.9rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.04em"},children:"Français"})]}),a.description&&e.jsxs("div",{children:[e.jsx("p",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontStyle:"italic",fontSize:"0.72rem",letterSpacing:"0.2em",textTransform:"uppercase",color:t?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)",marginBottom:"0.6rem"},children:"Synopsis"}),e.jsx("p",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:300,fontStyle:"italic",fontSize:"0.95rem",color:t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",lineHeight:1.8},children:a.description})]}),e.jsx("div",{style:{marginTop:"2.5rem",marginBottom:"1.5rem",height:"1px",background:t?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}}),l.length>1&&e.jsxs("div",{children:[e.jsx("p",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontStyle:"italic",fontSize:"0.72rem",letterSpacing:"0.2em",textTransform:"uppercase",color:t?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)",marginBottom:"1rem"},children:"Autres épisodes"}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"0.75rem"},children:l.map(r=>e.jsxs("button",{onClick:()=>c(r),style:{background:r.id===i?t?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)":"none",border:r.id===i?t?"1px solid rgba(255,255,255,0.1)":"1px solid rgba(0,0,0,0.1)":"1px solid transparent",borderRadius:8,padding:"0.7rem 0.9rem",cursor:r.id===i?"default":"pointer",display:"flex",alignItems:"center",gap:"0.85rem",textAlign:"left",transition:"background 0.15s, border-color 0.15s"},onMouseEnter:s=>{r.id!==i&&(s.currentTarget.style.background=t?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.04)")},onMouseLeave:s=>{r.id!==i&&(s.currentTarget.style.background="none")},children:[r.imageUrl&&e.jsx("div",{style:{width:64,aspectRatio:"16/9",borderRadius:5,overflow:"hidden",flexShrink:0,background:"#000"},children:e.jsx("img",{src:r.imageUrl,alt:r.title,style:{width:"100%",height:"100%",objectFit:"cover",display:"block",opacity:r.id===i?1:.7}})}),e.jsxs("div",{style:{flex:1,minWidth:0},children:[e.jsxs("span",{style:{fontFamily:"'NeutrafaceText', sans-serif",fontWeight:400,fontStyle:"italic",fontSize:"0.7rem",color:t?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.5)",letterSpacing:"0.1em",display:"block",marginBottom:"0.2rem"},children:["S",r.season," E",r.episode]}),e.jsx("span",{style:{fontFamily:"'NeutrafaceTextDemiSC', sans-serif",fontSize:"0.82rem",color:r.id===i?t?"rgba(255,255,255,0.9)":"rgba(0,0,0,0.9)":t?"rgba(255,255,255,0.65)":"rgba(0,0,0,0.65)",letterSpacing:"0.05em",display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:r.title})]})]},r.id))})]})]})]})]})}export{F as default};
