/* 日島 NESOI — 搭配器主容器（左預覽 + 右六步 + 送出） */
const STEPS = [
  { n:1, t:"選擇主石" }, { n:2, t:"選擇佩珠" }, { n:3, t:"線材顏色" },
  { n:4, t:"編織法" }, { n:5, t:"尺寸與備註" }, { n:6, t:"確認並送出" }
];

function lenText(sel){
  if(!sel.length) return "—";
  if(sel.length==="custom") return sel.custom ? "自訂 " + sel.custom : "自訂長度（待確認）";
  return sel.length + " cm";
}
function summarize(sel){
  const stone = sel.stoneId && Nesoi.byId("stones", sel.stoneId);
  const cord = sel.cordId && Nesoi.byId("cords", sel.cordId);
  const weave = sel.weaveId && Nesoi.byId("weaves", sel.weaveId);
  const beads = (sel.beads||[]).map(b => { const x = Nesoi.byId("beads", b.id); return x ? x.name + " ×" + b.qty : null; }).filter(Boolean);
  const pkg = [sel.adjustable && "可調節尾扣", sel.giftBox && "禮盒包裝", sel.isGift && "禮物"].filter(Boolean);
  return { stone, cord, weave, beads, pkg };
}

/* 左側即時預覽 */
function Preview({ sel }){
  const s = summarize(sel);
  const price = Nesoi.priceOf(sel);
  const Row = ({ k, children }) => (
    <div className="flex between" style={{ gap:16, padding:"10px 0", borderBottom:"1px solid var(--hairline)" }}>
      <span className="tiny muted" style={{ whiteSpace:"nowrap" }}>{k}</span>
      <span className="tiny" style={{ textAlign:"right", lineHeight:1.7 }}>{children || "—"}</span>
    </div>
  );
  return (
    <aside style={{ position:"sticky", top:78 }}>
      <div className="card" style={{ background:"var(--paper-2)" }}>
        <div style={{ aspectRatio:"4/3", position:"relative", borderBottom:"1px solid var(--hairline)" }}>
          <Img src={s.stone ? s.stone.img : ""} label={s.stone ? s.stone.name + " 主石" : "選擇主石後即時預覽"} />
          {s.cord && <span style={{ position:"absolute", bottom:12, left:12, display:"flex", alignItems:"center", gap:8, background:"color-mix(in srgb,var(--paper) 85%,transparent)", padding:"5px 10px", borderRadius:30, border:"1px solid var(--hairline-2)" }}>
            <i style={{ width:14, height:14, borderRadius:"50%", background:s.cord.swatch, border:"1px solid var(--hairline-2)" }}></i>
            <span className="tiny">{s.cord.name}</span>
          </span>}
        </div>
        <div style={{ padding:"18px 20px 20px" }}>
          <p className="eyebrow" style={{ marginBottom:12 }}>我的搭配 · My Design</p>
          <Row k="主石">{s.stone ? s.stone.name + "（" + s.stone.code + "）" : null}</Row>
          <Row k="佩珠">{s.beads.length ? s.beads.join("、") : null}</Row>
          <Row k="線材">{s.cord ? s.cord.name + "・" + s.cord.code : null}</Row>
          <Row k="編織法">{s.weave ? s.weave.name : null}</Row>
          <Row k="長度">{lenText(sel)}</Row>
          <Row k="包裝">{s.pkg.length ? s.pkg.join("、") : "標準包裝"}</Row>
          <div className="flex between acenter" style={{ marginTop:16 }}>
            <span className="serif" style={{ fontSize:15 }}>預估價格</span>
            <span className="serif" style={{ fontSize:26, color:"var(--sea)" }}>{money(price)}</span>
          </div>
          <p className="tiny muted" style={{ marginTop:10, lineHeight:1.7, background:"var(--paper-3)", padding:"10px 12px", borderRadius:"var(--r)" }}>
            此價格為預估價格，實際製作價格會由日島設計師確認搭配可行性後回覆。
          </p>
        </div>
      </div>
    </aside>
  );
}

/* 第六步：確認送出 */
function ConfirmStep({ sel }){
  const toast = useToast();
  const [c, setC] = useState({ name:"", phone:"", email:"", lineId:"" });
  const [done, setDone] = useState(null);
  const s = summarize(sel);
  const price = Nesoi.priceOf(sel);
  const ready = sel.stoneId && sel.cordId && sel.weaveId && sel.length && (sel.length!=="custom" || sel.custom);
  const valid = ready && c.name.trim() && c.phone.trim();

  const submit = () => {
    if(!valid) return;
    const orderNo = Nesoi.nextOrderNo();
    Nesoi.upsert("orders", {
      id: Nesoi.newId(), orderNo, name:c.name.trim(), phone:c.phone.trim(), email:c.email.trim(), lineId:c.lineId.trim(),
      sel: JSON.parse(JSON.stringify(sel)), estPrice: price, quotedPrice: 0, status:"待確認", createdAt: Date.now()
    });
    setDone(orderNo);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  if(done) return (
    <div className="fade center" style={{ padding:"30px 10px", maxWidth:520, margin:"0 auto" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:"1px solid var(--ok)", color:"var(--ok)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 18px" }}>✓</div>
      <h3 className="serif" style={{ fontSize:24, letterSpacing:".05em" }}>訂製需求已送出</h3>
      <p className="muted" style={{ marginTop:10 }}>訂單編號 <b className="mono">{done}</b></p>
      <p className="muted tiny" style={{ marginTop:14, lineHeight:1.9 }}>日島設計師將於 1–3 個工作天內，確認搭配可行性與實際報價後與你聯繫。感謝你讓晶礦陪伴你的旅途。</p>
      <div className="flex gap12 wrap" style={{ justifyContent:"center", marginTop:26 }}>
        <button className="btn ghost" onClick={() => go("#/")}>回到首頁</button>
        <button className="btn sea" onClick={() => window.location.reload()}>再搭一條</button>
      </div>
    </div>
  );

  return (
    <div className="fade conf-two" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:30 }}>
      <div>
        <h3 className="serif" style={{ fontSize:18, marginBottom:14, letterSpacing:".04em" }}>聯絡資料</h3>
        <div className="field"><label>姓名 <span className="req">*</span></label><input className="input" value={c.name} onChange={e => setC({ ...c, name:e.target.value })} placeholder="你的稱呼" /></div>
        <div className="row">
          <div className="field"><label>電話 <span className="req">*</span></label><input className="input" value={c.phone} onChange={e => setC({ ...c, phone:e.target.value })} placeholder="0912-345-678" /></div>
          <div className="field"><label>LINE ID</label><input className="input" value={c.lineId} onChange={e => setC({ ...c, lineId:e.target.value })} placeholder="選填" /></div>
        </div>
        <div className="field"><label>Email</label><input className="input" value={c.email} onChange={e => setC({ ...c, email:e.target.value })} placeholder="選填" /></div>
      </div>
      <div>
        <h3 className="serif" style={{ fontSize:18, marginBottom:14, letterSpacing:".04em" }}>訂製摘要</h3>
        <div className="card" style={{ padding:"16px 18px", background:"var(--paper-2)" }}>
          {[["主石", s.stone ? s.stone.name + "（"+s.stone.code+"）" : "未選"],
            ["佩珠", s.beads.length ? s.beads.join("、") : "無"],
            ["線材", s.cord ? s.cord.name : "未選"],
            ["編織法", s.weave ? s.weave.name : "未選"],
            ["長度", lenText(sel)],
            ["包裝", s.pkg.length ? s.pkg.join("、") : "標準包裝"],
            ["備註", sel.note || "無"]].map(([k,v]) => (
            <div key={k} className="flex between" style={{ gap:14, padding:"7px 0", borderBottom:"1px solid var(--hairline)" }}>
              <span className="tiny muted">{k}</span><span className="tiny" style={{ textAlign:"right" }}>{v}</span>
            </div>
          ))}
          <div className="flex between acenter" style={{ marginTop:14 }}>
            <span className="serif">預估價格</span><span className="serif" style={{ fontSize:22, color:"var(--sea)" }}>{money(price)}</span>
          </div>
        </div>
        {!ready && <p className="tiny" style={{ color:"var(--warn)", marginTop:12 }}>請先完成主石、線材、編織法與長度的選擇。</p>}
        <div className="flex gap8 wrap cta-stack" style={{ marginTop:18 }}>
          <button className="btn sea block" disabled={!valid} onClick={submit}>送出訂製需求</button>
          <button className="btn ghost" style={{ flex:1 }} disabled={!ready} onClick={() => toast("已加入購物車（測試版）","ok")}>加入購物車</button>
          <button className="btn line" style={{ flex:1 }} onClick={() => toast("已開啟 LINE 詢問（測試版）")}>LINE 詢問設計師</button>
        </div>
        <p className="tiny muted" style={{ marginTop:12, lineHeight:1.7 }}>* 第一版為測試流程，「加入購物車」與「LINE 詢問」尚未串接正式服務。</p>
      </div>
    </div>
  );
}

function Configurator(){
  useStore();
  const [step, setStep] = useState(1);
  const [sel, setSel] = useState({ stoneId:null, beads:[], cordId:null, weaveId:null, length:"45", custom:"", adjustable:false, giftBox:false, isGift:false, note:"" });
  const set = patch => setSel(s => ({ ...s, ...patch }));
  const reqDone = { 1: !!sel.stoneId, 2: true, 3: !!sel.cordId, 4: !!sel.weaveId, 5: !!sel.length && (sel.length!=="custom"||sel.custom), 6:true };
  const goStep = n => { setStep(n); window.scrollTo({ top:0, behavior:"smooth" }); };

  return (
    <div className="page section-pad fade">
      <div className="flex between acenter wrap" style={{ gap:16, marginBottom:24 }}>
        <div>
          <p className="eyebrow" style={{ marginBottom:8 }}>Custom Necklace · 客製搭配器</p>
          <h2 className="serif" style={{ fontSize:"clamp(22px,3vw,30px)", letterSpacing:".05em" }}>搭配我的項鍊</h2>
        </div>
        <button className="btn ghost sm" onClick={() => go("#/")}>← 回首頁</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"minmax(280px,360px) 1fr", gap:"clamp(20px,3vw,42px)", alignItems:"start" }} className="cfg-grid">
        <Preview sel={sel} />
        <div>
          {/* 步驟列 */}
          <div className="scroll-x" style={{ marginBottom:24 }}>
            <div className="flex gap8" style={{ minWidth:"max-content" }}>
              {STEPS.map(st => {
                const active = step===st.n;
                const ok = reqDone[st.n] && st.n<step;
                return (
                  <button key={st.n} onClick={() => goStep(st.n)}
                    className={"btn sm " + (active ? "" : "ghost")}
                    style={{ borderRadius:40, borderColor: ok && !active ? "var(--mist)" : undefined, color: ok && !active ? "var(--mist)" : undefined }}>
                    <span className="mono" style={{ fontSize:11 }}>{ok ? "✓" : String(st.n).padStart(2,"0")}</span>　{st.t}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ minHeight:340 }}>
            {step===1 && <StoneStep sel={sel} set={set} />}
            {step===2 && <BeadStep sel={sel} set={set} />}
            {step===3 && <CordStep sel={sel} set={set} />}
            {step===4 && <WeaveStep sel={sel} set={set} />}
            {step===5 && <SizeStep sel={sel} set={set} />}
            {step===6 && <ConfirmStep sel={sel} />}
          </div>

          {/* 上下步 */}
          <div className="flex between" style={{ marginTop:28, borderTop:"1px solid var(--hairline)", paddingTop:20 }}>
            <button className="btn ghost" disabled={step===1} onClick={() => goStep(step-1)}>← 上一步</button>
            {step<6 && <button className="btn sea" disabled={!reqDone[step]} onClick={() => goStep(step+1)}>下一步：{STEPS[step].t} →</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { Configurator });
