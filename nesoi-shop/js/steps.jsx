/* 日島 NESOI — 搭配器步驟面板 (Step 1–5) */

/* Step 1 — 主石（單選，單顆庫存） */
function StoneStep({ sel, set }){
  const stones = Nesoi.get("stones").filter(s => s.active);
  return (
    <div className="grid fade" style={{ gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))" }}>
      {stones.map(s => {
        const chosen = sel.stoneId === s.id;
        const out = !s.inStock;
        return (
          <div key={s.id} className={"card" + (chosen ? " sel" : "")} style={{ display:"flex", flexDirection:"column", opacity: out ? .62 : 1 }}>
            <div style={{ aspectRatio:"1/1", position:"relative" }}>
              <Img src={s.img} label={s.code + " 主石照片"} />
              <span style={{ position:"absolute", top:10, left:10 }}><Badge className="solid">{s.code}</Badge></span>
              <span style={{ position:"absolute", top:10, right:10 }}>{out ? <Badge tone="out">已售出</Badge> : <Badge tone="ok">現貨 1 件</Badge>}</span>
            </div>
            <div style={{ padding:"15px 16px 17px", display:"flex", flexDirection:"column", flex:1 }}>
              <div className="flex between acenter">
                <h4 className="serif" style={{ fontSize:18, letterSpacing:".04em" }}>{s.name}</h4>
                <span className="mono" style={{ fontSize:14 }}>{money(s.price)}</span>
              </div>
              <p className="muted tiny" style={{ margin:"6px 0 12px", lineHeight:1.85 }}>
                {s.size}・{s.shape}・{s.colorFamily}<br/>寓意：{s.meaning}
              </p>
              <button className={"btn block " + (chosen ? "" : "ghost")} style={{ marginTop:"auto" }}
                disabled={out} onClick={() => set({ stoneId: chosen ? null : s.id })}>
                {chosen ? "✓ 已選擇" : out ? "已售出" : "選擇這顆主石"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Step 2 — 佩珠（多選 + 數量） */
function BeadStep({ sel, set }){
  const beads = Nesoi.get("beads").filter(b => b.active);
  const qtyOf = id => { const f = (sel.beads||[]).find(x => x.id===id); return f ? f.qty : 0; };
  const setQty = (id, q) => {
    let arr = (sel.beads||[]).filter(x => x.id!==id);
    if(q>0) arr.push({ id, qty:q });
    set({ beads: arr });
  };
  return (
    <div>
      <p className="muted tiny" style={{ marginBottom:16 }}>佩珠可複選並調整數量，搭配在主石兩側點綴。</p>
      <div className="grid fade" style={{ gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))" }}>
        {beads.map(b => {
          const q = qtyOf(b.id);
          return (
            <div key={b.id} className={"card" + (q>0 ? " sel" : "")} style={{ display:"flex", flexDirection:"column" }}>
              <div style={{ aspectRatio:"4/3" }}><Img src={b.img} label={b.name} /></div>
              <div style={{ padding:"13px 15px 15px", flex:1, display:"flex", flexDirection:"column" }}>
                <div className="flex between acenter">
                  <h4 className="serif" style={{ fontSize:16 }}>{b.name}</h4>
                  <span className="mono tiny">{money(b.price)}/顆</span>
                </div>
                <p className="muted tiny" style={{ margin:"5px 0 12px" }}>{b.category}・{b.material}・{b.colorFamily}</p>
                <div className="flex between acenter" style={{ marginTop:"auto" }}>
                  <span className="tiny muted">數量</span>
                  <QtyStepper value={q} onChange={n => setQty(b.id, n)} max={b.stockQty} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Step 3 — 線材顏色（色票單選） */
function CordStep({ sel, set }){
  const cords = Nesoi.get("cords").filter(c => c.active);
  return (
    <div className="grid fade" style={{ gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))" }}>
      {cords.map(c => {
        const chosen = sel.cordId === c.id;
        return (
          <button key={c.id} className={"card" + (chosen ? " sel" : "")} onClick={() => set({ cordId: c.id })}
            style={{ textAlign:"left", padding:0, border:chosen ? undefined : "1px solid var(--hairline)", background:"var(--paper-2)" }}>
            <div style={{ height:70, background:c.swatch, borderBottom:"1px solid var(--hairline)" }}></div>
            <div style={{ padding:"13px 15px 16px" }}>
              <div className="flex between acenter">
                <h4 className="serif" style={{ fontSize:16 }}>{c.name}</h4>
                <span className="mono tiny muted">{c.code}</span>
              </div>
              <p className="muted tiny" style={{ margin:"6px 0 10px", lineHeight:1.8 }}>{c.material}<br/>{c.desc}</p>
              <div className="flex between acenter">
                {c.waterproof ? <Badge tone="ok">可親水</Badge> : <Badge tone="warn">避免久泡</Badge>}
                <span className="mono tiny">{c.surcharge>0 ? "+"+money(c.surcharge) : "不加價"}</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* Step 4 — 編織法（單選，標示適配主石） */
function WeaveStep({ sel, set }){
  const weaves = Nesoi.get("weaves").filter(w => w.active);
  const stone = sel.stoneId ? Nesoi.byId("stones", sel.stoneId) : null;
  return (
    <div className="grid fade" style={{ gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))" }}>
      {weaves.map(w => {
        const chosen = sel.weaveId === w.id;
        const rec = stone && stone.weaves && stone.weaves.includes(w.id);
        return (
          <div key={w.id} className={"card" + (chosen ? " sel" : "")} style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ aspectRatio:"3/2", position:"relative" }}>
              <Img src={w.img} label={w.name + " 示意圖"} />
              {rec && <span style={{ position:"absolute", top:10, left:10 }}><Badge tone="sea">建議搭配主石</Badge></span>}
            </div>
            <div style={{ padding:"14px 16px 16px", flex:1, display:"flex", flexDirection:"column" }}>
              <div className="flex between acenter">
                <h4 className="serif" style={{ fontSize:17 }}>{w.name}</h4>
                <span className="mono tiny">{w.surcharge>0 ? "+"+money(w.surcharge) : "不加價"}</span>
              </div>
              <p className="muted tiny" style={{ margin:"6px 0 10px", lineHeight:1.85 }}>適合：{w.shapes}<br/>{w.style}</p>
              <div className="flex between acenter" style={{ marginTop:"auto" }}>
                <Badge>難度 {w.difficulty}</Badge>
                <button className={"btn sm " + (chosen ? "" : "ghost")} onClick={() => set({ weaveId: w.id })}>{chosen ? "✓ 已選" : "選擇"}</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Step 5 — 尺寸與備註 */
function SizeStep({ sel, set }){
  const lenLabel = { "40":"40 cm", "45":"45 cm", "50":"50 cm", "55":"55 cm", "custom":"自訂長度" };
  const Toggle = ({ on, onClick, children }) => (
    <button onClick={onClick} className={"btn sm " + (on ? "sea" : "ghost")} style={{ borderRadius:40 }}>{on ? "✓ " : ""}{children}</button>
  );
  return (
    <div className="fade" style={{ maxWidth:560 }}>
      <div className="field">
        <label>項鍊長度 <span className="req">*</span></label>
        <div className="flex gap8 wrap">
          {Nesoi.LENGTHS.map(L => (
            <button key={L} onClick={() => set({ length: L })}
              className={"btn sm " + (sel.length===L ? "sea" : "ghost")} style={{ borderRadius:40 }}>
              {lenLabel[L]}{Nesoi.PRICE.length[L]>0 ? "  +"+money(Nesoi.PRICE.length[L]) : ""}
            </button>
          ))}
        </div>
        {sel.length==="custom" && (
          <input className="input" style={{ marginTop:12, maxWidth:240 }} placeholder="請輸入希望長度，例如 60cm"
            value={sel.custom||""} onChange={e => set({ custom: e.target.value })} />
        )}
      </div>
      <hr className="hr" />
      <div className="field">
        <label>加購選項</label>
        <div className="flex gap8 wrap">
          <Toggle on={sel.adjustable} onClick={() => set({ adjustable: !sel.adjustable })}>可調節尾扣　+{money(Nesoi.PRICE.adjustable)}</Toggle>
          <Toggle on={sel.giftBox} onClick={() => set({ giftBox: !sel.giftBox })}>禮盒包裝　+{money(Nesoi.PRICE.giftBox)}</Toggle>
          <Toggle on={sel.isGift} onClick={() => set({ isGift: !sel.isGift })}>這是一份禮物</Toggle>
        </div>
      </div>
      <div className="field">
        <label>備註需求</label>
        <textarea className="textarea" placeholder="想對設計師說的話、配戴者個性、希望的氛圍、特殊寓意…" value={sel.note||""} onChange={e => set({ note: e.target.value })}></textarea>
      </div>
    </div>
  );
}

Object.assign(window, { StoneStep, BeadStep, CordStep, WeaveStep, SizeStep });
