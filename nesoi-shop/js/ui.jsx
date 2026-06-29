/* 日島 NESOI — 共用 UI 元件 */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* 訂閱 store：任何資料變動都重繪 */
function useStore(){
  const [, force] = useState(0);
  useEffect(() => Nesoi.subscribe(() => force(v => v + 1)), []);
}

/* hash 路由 */
function useHash(){
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const on = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return hash;
}
function go(h){ window.location.hash = h; }

const money = n => "NT$ " + (n||0).toLocaleString("en-US");

/* 品牌符號 */
function LogoMark({ stroke = "var(--ink)", size = 30 }){
  return (
    <svg className="logo-mark" viewBox="0 0 120 120" width={size} height={size} fill="none" stroke={stroke}>
      <path d="M34 80 L60 38 L86 80 Z" strokeWidth="3"/>
      <line x1="26" y1="80" x2="94" y2="80" strokeWidth="3"/>
      <circle cx="60" cy="80" r="6" fill={stroke} stroke="none"/>
    </svg>
  );
}

/* 圖片佔位 / 實圖 */
function Img({ src, label = "image", style, className = "", round }){
  const base = { borderRadius: round || 0, ...style };
  if(src) return <img src={src} alt={label} className={className} style={{ objectFit:"cover", width:"100%", height:"100%", ...base }} />;
  return (
    <div className={"ph " + className} style={{ width:"100%", height:"100%", ...base }}>
      <span className="lbl">{label}</span>
    </div>
  );
}

/* 圖片上傳（FileReader → base64） */
function ImageUpload({ value, onChange, label = "點擊上傳照片" }){
  const ref = useRef();
  const pick = e => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader();
    r.onload = () => onChange(r.result);
    r.readAsDataURL(f);
  };
  return (
    <div>
      <div onClick={() => ref.current.click()}
        style={{ cursor:"pointer", aspectRatio:"4/3", borderRadius:"var(--r)", overflow:"hidden", border:"1px dashed var(--hairline-2)", position:"relative" }}>
        <Img src={value} label={label} />
        {value && <button className="btn sm ghost" style={{ position:"absolute", top:8, right:8, background:"var(--paper)" }}
          onClick={e => { e.stopPropagation(); onChange(""); }}>移除</button>}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display:"none" }} />
    </div>
  );
}

function Badge({ children, tone = "", className = "" }){
  return <span className={"badge " + (tone ? tone + " " : "") + className}>{children}</span>;
}
function StatusBadge({ status }){
  return <Badge tone={Nesoi.STATUS_TONE[status] || ""}>{status}</Badge>;
}

/* 數量加減 */
function QtyStepper({ value, onChange, min = 0, max = 99 }){
  const btn = { width:30, height:30, borderRadius:"50%", border:"1px solid var(--hairline-2)", background:"var(--paper)", fontSize:16, lineHeight:1, color:"var(--ink)" };
  return (
    <div className="flex acenter gap8">
      <button style={btn} onClick={() => onChange(Math.max(min, value-1))} disabled={value<=min}>−</button>
      <span className="mono" style={{ minWidth:22, textAlign:"center" }}>{value}</span>
      <button style={btn} onClick={() => onChange(Math.min(max, value+1))} disabled={value>=max}>＋</button>
    </div>
  );
}

/* Modal */
function Modal({ open, onClose, title, children, wide }){
  if(!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:90, background:"rgba(40,36,30,.42)", backdropFilter:"blur(3px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"5vh 16px", overflowY:"auto" }}>
      <div onClick={e => e.stopPropagation()} className="fade"
        style={{ background:"var(--paper)", border:"1px solid var(--hairline)", borderRadius:"var(--rl)", boxShadow:"var(--shadow)", width:"100%", maxWidth: wide ? 760 : 520 }}>
        <div className="flex between acenter" style={{ padding:"18px 22px", borderBottom:"1px solid var(--hairline)" }}>
          <h3 className="serif" style={{ fontSize:19, letterSpacing:".04em" }}>{title}</h3>
          <button onClick={onClose} style={{ border:"none", background:"none", fontSize:22, color:"var(--ink-soft)", lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:"22px" }}>{children}</div>
      </div>
    </div>
  );
}

/* Toast */
const ToastCtx = createContext(() => {});
function ToastProvider({ children }){
  const [items, setItems] = useState([]);
  const push = useCallback((msg, tone = "ink") => {
    const id = Math.random();
    setItems(a => [...a, { id, msg, tone }]);
    setTimeout(() => setItems(a => a.filter(t => t.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:120, display:"flex", flexDirection:"column", gap:8, alignItems:"center" }}>
        {items.map(t => (
          <div key={t.id} className="fade" style={{ background: t.tone==="ok" ? "var(--ok)" : t.tone==="warn" ? "var(--warn)" : "var(--ink)", color:"var(--paper)", padding:"11px 20px", borderRadius:40, fontSize:13.5, letterSpacing:".04em", boxShadow:"var(--shadow)" }}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

Object.assign(window, {
  useStore, useHash, go, money, LogoMark, Img, ImageUpload,
  Badge, StatusBadge, QtyStepper, Modal, ToastProvider, useToast
});
