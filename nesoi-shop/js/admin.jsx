/* 日島 NESOI — 後台管理 */

/* ---- 欄位輸入 ---- */
function FieldInput({ f, value, onChange }){
  if(f.type==="image") return <ImageUpload value={value||""} onChange={onChange} label={f.label} />;
  if(f.type==="textarea") return <textarea className="textarea" value={value||""} onChange={e => onChange(e.target.value)} />;
  if(f.type==="toggle") return (
    <button className={"btn sm " + (value ? "sea" : "ghost")} style={{ borderRadius:40 }} onClick={() => onChange(!value)}>{value ? "✓ 是" : "否"}</button>
  );
  if(f.type==="color") return (
    <div className="flex acenter gap8">
      <input type="color" value={value||"#cccccc"} onChange={e => onChange(e.target.value)} style={{ width:46, height:38, border:"1px solid var(--hairline-2)", borderRadius:"var(--r)", background:"none" }} />
      <input className="input" value={value||""} onChange={e => onChange(e.target.value)} style={{ maxWidth:130 }} />
    </div>
  );
  if(f.type==="select") return (
    <select className="select" value={value||""} onChange={e => onChange(e.target.value)}>
      <option value="">— 請選擇 —</option>
      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  if(f.type==="multiweave"){
    const weaves = Nesoi.get("weaves");
    const arr = value||[];
    return (
      <div className="flex gap8 wrap">
        {weaves.map(w => {
          const on = arr.includes(w.id);
          return <button key={w.id} className={"btn sm " + (on ? "sea" : "ghost")} style={{ borderRadius:40 }}
            onClick={() => onChange(on ? arr.filter(x => x!==w.id) : [...arr, w.id])}>{on ? "✓ " : ""}{w.name}</button>;
        })}
      </div>
    );
  }
  return <input className="input" type={f.type==="number" ? "number" : "text"} value={value==null ? "" : value}
    onChange={e => onChange(f.type==="number" ? Number(e.target.value) : e.target.value)} />;
}

/* ---- 編輯 Modal ---- */
function EditModal({ open, onClose, type, fields, item }){
  const toast = useToast();
  const [form, setForm] = useState(item || {});
  useEffect(() => { setForm(item || {}); }, [item, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    const rec = { ...form };
    if(!rec.id) rec.id = Nesoi.newId();
    Nesoi.upsert(type, rec); toast("已儲存","ok"); onClose();
  };
  return (
    <Modal open={open} onClose={onClose} wide title={item && item.id ? "編輯" : "新增"}>
      <div className="grid modal-two" style={{ gridTemplateColumns:"1fr 1fr", gap:"6px 20px" }}>
        {fields.map(f => (
          <div key={f.key} className="field" style={{ gridColumn: f.span==="full" ? "1 / -1" : "auto" }}>
            <label>{f.label}</label>
            <FieldInput f={f} value={form[f.key]} onChange={v => set(f.key, v)} />
          </div>
        ))}
      </div>
      <div className="flex gap12" style={{ justifyContent:"flex-end", marginTop:10 }}>
        <button className="btn ghost" onClick={onClose}>取消</button>
        <button className="btn sea" onClick={save}>儲存</button>
      </div>
    </Modal>
  );
}

/* ---- 通用資源管理 ---- */
function ResourceManager({ type, fields, columns, addLabel }){
  const toast = useToast();
  const [edit, setEdit] = useState(null); // null=closed, {} or item
  const items = Nesoi.get(type);
  return (
    <div className="fade">
      <div className="flex between acenter" style={{ marginBottom:16 }}>
        <span className="muted tiny">共 {items.length} 筆</span>
        <button className="btn sm sea" onClick={() => setEdit({})}>＋ {addLabel}</button>
      </div>
      <div className="card scroll-x" style={{ background:"var(--paper-2)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:640 }}>
          <thead>
            <tr style={{ background:"var(--paper-3)" }}>
              {columns.map(c => <th key={c.label} style={{ textAlign:"left", padding:"11px 14px", fontSize:11.5, letterSpacing:".08em", color:"var(--ink-soft)", fontWeight:400, whiteSpace:"nowrap" }}>{c.label}</th>)}
              <th style={{ padding:"11px 14px" }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} style={{ borderTop:"1px solid var(--hairline)" }}>
                {columns.map(c => <td key={c.label} style={{ padding:"10px 14px", fontSize:13, verticalAlign:"middle" }}>{c.render(it)}</td>)}
                <td style={{ padding:"10px 14px", whiteSpace:"nowrap", textAlign:"right" }}>
                  <button className="btn sm ghost" onClick={() => setEdit(it)}>編輯</button>{" "}
                  <button className="btn sm ghost" style={{ borderColor:"color-mix(in srgb,var(--danger) 40%,transparent)", color:"var(--danger)" }}
                    onClick={() => { if(confirm("確定刪除「"+(it.name||it.code)+"」？")){ Nesoi.remove(type, it.id); toast("已刪除"); } }}>刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditModal open={edit!==null} onClose={() => setEdit(null)} type={type} fields={fields} item={edit} />
    </div>
  );
}

/* 小工具：上下架徽章 + 縮圖 */
const ActiveBadge = ({ on }) => on ? <Badge tone="ok">上架</Badge> : <Badge>下架</Badge>;
const Thumb = ({ src, label }) => <div style={{ width:44, height:44, borderRadius:"var(--r)", overflow:"hidden", flexShrink:0 }}><Img src={src} label="" /></div>;

/* ---- 訂單管理 ---- */
function OrderManager(){
  const toast = useToast();
  const [view, setView] = useState(null);
  const orders = Nesoi.get("orders").slice().sort((a,b) => b.createdAt - a.createdAt);
  return (
    <div className="fade">
      <div className="card scroll-x" style={{ background:"var(--paper-2)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
          <thead><tr style={{ background:"var(--paper-3)" }}>
            {["訂單編號","客戶","主石","預估","實際報價","狀態","建立時間",""].map(h => <th key={h} style={{ textAlign:"left", padding:"11px 14px", fontSize:11.5, color:"var(--ink-soft)", fontWeight:400, whiteSpace:"nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {orders.map(o => {
              const stone = Nesoi.byId("stones", o.sel.stoneId);
              const est = o.estPrice || Nesoi.priceOf(o.sel);
              return (
                <tr key={o.id} style={{ borderTop:"1px solid var(--hairline)" }}>
                  <td style={{ padding:"10px 14px", fontSize:12.5 }} className="mono">{o.orderNo}</td>
                  <td style={{ padding:"10px 14px", fontSize:13 }}>{o.name}<br/><span className="tiny muted mono">{o.phone}</span></td>
                  <td style={{ padding:"10px 14px", fontSize:13 }}>{stone ? stone.name : "—"}</td>
                  <td style={{ padding:"10px 14px", fontSize:13 }} className="mono">{money(est)}</td>
                  <td style={{ padding:"10px 14px", fontSize:13 }} className="mono">{o.quotedPrice ? money(o.quotedPrice) : "—"}</td>
                  <td style={{ padding:"10px 14px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding:"10px 14px", fontSize:12 }} className="muted">{new Date(o.createdAt).toLocaleDateString("zh-TW")}</td>
                  <td style={{ padding:"10px 14px", textAlign:"right" }}><button className="btn sm ghost" onClick={() => setView(o)}>檢視</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <OrderDetail order={view} onClose={() => setView(null)} />
    </div>
  );
}

function OrderDetail({ order, onClose }){
  const toast = useToast();
  const [status, setStatus] = useState(""); const [quote, setQuote] = useState("");
  useEffect(() => { if(order){ setStatus(order.status); setQuote(order.quotedPrice||""); } }, [order]);
  if(!order) return null;
  const s = summarize(order.sel);
  const est = order.estPrice || Nesoi.priceOf(order.sel);
  const saveOrder = () => { Nesoi.upsert("orders", { ...order, status, quotedPrice: Number(quote)||0 }); toast("訂單已更新","ok"); onClose(); };
  const Line = ({ k, v }) => <div className="flex between" style={{ gap:14, padding:"7px 0", borderBottom:"1px solid var(--hairline)" }}><span className="tiny muted">{k}</span><span className="tiny" style={{ textAlign:"right" }}>{v}</span></div>;
  return (
    <Modal open={!!order} onClose={onClose} wide title={"訂單 " + order.orderNo}>
      <div className="grid modal-two" style={{ gridTemplateColumns:"1fr 1fr", gap:26 }}>
        <div>
          <h4 className="serif" style={{ fontSize:16, marginBottom:8 }}>客戶</h4>
          <Line k="姓名" v={order.name} /><Line k="電話" v={order.phone} />
          <Line k="Email" v={order.email||"—"} /><Line k="LINE" v={order.lineId||"—"} />
          <h4 className="serif" style={{ fontSize:16, margin:"18px 0 8px" }}>搭配內容</h4>
          <Line k="主石" v={s.stone ? s.stone.name+"（"+s.stone.code+"）" : "—"} />
          <Line k="佩珠" v={s.beads.length ? s.beads.join("、") : "無"} />
          <Line k="線材" v={s.cord ? s.cord.name : "—"} />
          <Line k="編織法" v={s.weave ? s.weave.name : "—"} />
          <Line k="長度" v={lenText(order.sel)} />
          <Line k="包裝" v={s.pkg.length ? s.pkg.join("、") : "標準包裝"} />
          <Line k="備註" v={order.sel.note || "無"} />
        </div>
        <div>
          <div className="card" style={{ padding:"16px 18px", background:"var(--paper-2)" }}>
            <div className="flex between acenter"><span className="serif">預估價格</span><span className="serif mono" style={{ fontSize:18 }}>{money(est)}</span></div>
          </div>
          <div className="field" style={{ marginTop:18 }}>
            <label>訂單狀態</label>
            <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
              {Nesoi.STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label>實際報價 NT$</label>
            <input className="input" type="number" value={quote} onChange={e => setQuote(e.target.value)} placeholder="設計師確認後填寫" />
          </div>
          <button className="btn sea block" onClick={saveOrder}>更新訂單</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---- 後台主框 ---- */
const ADMIN_TABS = [
  { k:"stones", t:"主石" }, { k:"beads", t:"佩珠" }, { k:"cords", t:"線材" },
  { k:"weaves", t:"編織法" }, { k:"orders", t:"訂單" }
];

function AdminApp(){
  useStore();
  const toast = useToast();
  const [authed, setAuthed] = useState(sessionStorage.getItem("nesoi_admin")==="1");
  const [tab, setTab] = useState("stones");
  const [pw, setPw] = useState("");

  if(!authed) return (
    <div className="page" style={{ minHeight:"80vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="card fade" style={{ padding:"38px 34px", maxWidth:380, width:"100%", textAlign:"center", background:"var(--paper-2)" }}>
        <LogoMark size={40} />
        <h2 className="serif" style={{ fontSize:22, margin:"16px 0 4px", letterSpacing:".05em" }}>日島後台</h2>
        <p className="muted tiny" style={{ marginBottom:22 }}>請輸入管理密碼（測試密碼：nesoi2024）</p>
        <input className="input" type="password" value={pw} placeholder="管理密碼"
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key==="Enter" && login()} style={{ textAlign:"center" }} />
        <button className="btn sea block" style={{ marginTop:14 }} onClick={login}>登入</button>
        <button className="btn ghost block" style={{ marginTop:10 }} onClick={() => go("#/")}>← 回前台</button>
      </div>
    </div>
  );
  function login(){ if(pw==="nesoi2024"){ sessionStorage.setItem("nesoi_admin","1"); setAuthed(true); } else toast("密碼錯誤","warn"); }

  const stoneFields = [
    { key:"code", label:"主石編號" }, { key:"name", label:"主石名稱" },
    { key:"img", label:"主石照片", type:"image", span:"full" },
    { key:"size", label:"尺寸" }, { key:"shape", label:"形狀" },
    { key:"colorFamily", label:"色系" }, { key:"price", label:"價格", type:"number" },
    { key:"meaning", label:"寓意", type:"textarea", span:"full" },
    { key:"weaves", label:"可搭配編織法", type:"multiweave", span:"full" },
    { key:"inStock", label:"庫存狀態（現貨）", type:"toggle" }, { key:"active", label:"是否上架", type:"toggle" }
  ];
  const beadFields = [
    { key:"name", label:"佩珠名稱" }, { key:"img", label:"照片", type:"image", span:"full" },
    { key:"category", label:"分類" }, { key:"material", label:"材質" },
    { key:"colorFamily", label:"色系" }, { key:"price", label:"單顆價格", type:"number" },
    { key:"stockQty", label:"庫存數量", type:"number" }, { key:"active", label:"是否上架", type:"toggle" }
  ];
  const cordFields = [
    { key:"name", label:"線材名稱" }, { key:"code", label:"色號" },
    { key:"swatch", label:"色票顏色", type:"color" }, { key:"material", label:"材質" },
    { key:"desc", label:"說明", type:"textarea", span:"full" },
    { key:"surcharge", label:"加價金額", type:"number" },
    { key:"waterproof", label:"可親水配戴", type:"toggle" }, { key:"active", label:"是否上架", type:"toggle" }
  ];
  const weaveFields = [
    { key:"name", label:"編織法名稱" }, { key:"img", label:"示意圖片", type:"image", span:"full" },
    { key:"shapes", label:"適合主石形狀" }, { key:"difficulty", label:"製作難度", type:"select", options:["易","中","難"] },
    { key:"style", label:"風格說明", type:"textarea", span:"full" },
    { key:"surcharge", label:"加價金額", type:"number" }, { key:"active", label:"是否上架", type:"toggle" }
  ];

  return (
    <div className="page section-pad fade">
      <div className="flex between acenter wrap" style={{ gap:16, marginBottom:22 }}>
        <div><p className="eyebrow" style={{ marginBottom:8 }}>Admin · 後台管理</p><h2 className="serif" style={{ fontSize:"clamp(22px,3vw,30px)", letterSpacing:".05em" }}>日島營運後台</h2></div>
        <div className="flex gap8">
          <button className="btn ghost sm" onClick={() => go("#/")}>前台</button>
          <button className="btn ghost sm" onClick={() => { sessionStorage.removeItem("nesoi_admin"); setAuthed(false); }}>登出</button>
        </div>
      </div>

      <div className="scroll-x" style={{ marginBottom:24, borderBottom:"1px solid var(--hairline)" }}>
        <div className="flex" style={{ minWidth:"max-content", gap:4 }}>
          {ADMIN_TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ border:"none", background:"none", padding:"12px 18px", fontSize:14, letterSpacing:".06em", color: tab===t.k ? "var(--ink)" : "var(--ink-soft)", borderBottom: tab===t.k ? "2px solid var(--sea)" : "2px solid transparent" }}>{t.t}</button>
          ))}
        </div>
      </div>

      {tab==="stones" && <ResourceManager type="stones" addLabel="新增主石" fields={stoneFields} columns={[
        { label:"", render:it => <Thumb src={it.img} /> },
        { label:"編號", render:it => <span className="mono tiny">{it.code}</span> },
        { label:"名稱", render:it => <b className="serif">{it.name}</b> },
        { label:"尺寸/形狀", render:it => <span className="tiny muted">{it.size}・{it.shape}</span> },
        { label:"價格", render:it => <span className="mono">{money(it.price)}</span> },
        { label:"庫存", render:it => it.inStock ? <Badge tone="ok">現貨</Badge> : <Badge tone="out">售出</Badge> },
        { label:"狀態", render:it => <ActiveBadge on={it.active} /> }
      ]} />}

      {tab==="beads" && <ResourceManager type="beads" addLabel="新增佩珠" fields={beadFields} columns={[
        { label:"", render:it => <Thumb src={it.img} /> },
        { label:"名稱", render:it => <b className="serif">{it.name}</b> },
        { label:"分類/材質", render:it => <span className="tiny muted">{it.category}・{it.material}</span> },
        { label:"單價", render:it => <span className="mono">{money(it.price)}</span> },
        { label:"庫存", render:it => <span className="mono tiny">{it.stockQty}</span> },
        { label:"狀態", render:it => <ActiveBadge on={it.active} /> }
      ]} />}

      {tab==="cords" && <ResourceManager type="cords" addLabel="新增線材" fields={cordFields} columns={[
        { label:"色票", render:it => <div style={{ width:32, height:32, borderRadius:"50%", background:it.swatch, border:"1px solid var(--hairline-2)" }}></div> },
        { label:"名稱", render:it => <b className="serif">{it.name}</b> },
        { label:"色號", render:it => <span className="mono tiny">{it.code}</span> },
        { label:"材質", render:it => <span className="tiny muted">{it.material}</span> },
        { label:"親水", render:it => it.waterproof ? <Badge tone="ok">可親水</Badge> : <Badge tone="warn">避免久泡</Badge> },
        { label:"加價", render:it => <span className="mono tiny">{it.surcharge>0 ? "+"+it.surcharge : "0"}</span> },
        { label:"狀態", render:it => <ActiveBadge on={it.active} /> }
      ]} />}

      {tab==="weaves" && <ResourceManager type="weaves" addLabel="新增編織法" fields={weaveFields} columns={[
        { label:"", render:it => <Thumb src={it.img} /> },
        { label:"名稱", render:it => <b className="serif">{it.name}</b> },
        { label:"適合形狀", render:it => <span className="tiny muted">{it.shapes}</span> },
        { label:"難度", render:it => <Badge>{it.difficulty}</Badge> },
        { label:"加價", render:it => <span className="mono tiny">{it.surcharge>0 ? "+"+money(it.surcharge) : "0"}</span> },
        { label:"狀態", render:it => <ActiveBadge on={it.active} /> }
      ]} />}

      {tab==="orders" && <OrderManager />}
    </div>
  );
}
Object.assign(window, { AdminApp });
