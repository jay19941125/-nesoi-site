/* 日島 NESOI — 首頁 */
function Home(){
  return (
    <div className="fade">
      {/* HERO */}
      <section style={{ position:"relative", overflow:"hidden", minHeight:"82vh", display:"flex", alignItems:"center" }}>
        <div aria-hidden style={{ position:"absolute", left:0, right:0, bottom:0, height:"44%", background:"linear-gradient(180deg, transparent, color-mix(in srgb,var(--sea) 20%, transparent))" }}></div>
        <div aria-hidden style={{ position:"absolute", right:"10%", top:"16%", width:"min(34vw,260px)", aspectRatio:1, borderRadius:"50%", background:"radial-gradient(circle, color-mix(in srgb,var(--gold) 50%, var(--paper)), transparent 70%)", opacity:.75 }}></div>
        <div className="page" style={{ position:"relative", zIndex:2 }}>
          <p className="eyebrow" style={{ marginBottom:22 }}>旅行選品 · 編織珠飾 · 山海日誌</p>
          <h1 className="serif" style={{ fontSize:"clamp(46px,9vw,104px)", letterSpacing:".1em", lineHeight:1 }}>日島</h1>
          <div className="en" style={{ fontSize:"clamp(24px,5vw,46px)", color:"var(--brown)", marginTop:".1em", marginLeft:".1em" }}>Nesoi</div>
          <p className="serif" style={{ fontSize:"clamp(16px,2.2vw,22px)", letterSpacing:".16em", color:"var(--ink-soft)", marginTop:34 }}>島映自然靈魂，陪伴旅途是日</p>
          <p className="en" style={{ color:"var(--mineral)", fontSize:"clamp(14px,1.8vw,18px)", marginTop:".4em" }}>Always unexpected warmth in life</p>
          <div className="flex gap12 wrap" style={{ marginTop:42 }}>
            <button className="btn sea" onClick={() => go("#/build")}>開始搭配我的項鍊　→</button>
            <button className="btn ghost" onClick={() => document.getElementById("about").scrollIntoView({ behavior:"smooth" })}>關於日島</button>
          </div>
        </div>
      </section>

      {/* 品牌介紹 */}
      <section id="about" className="section-pad" style={{ borderTop:"1px solid var(--hairline)" }}>
        <div className="page home-about" style={{ display:"grid", gridTemplateColumns:"1.1fr .9fr", gap:"clamp(28px,5vw,70px)", alignItems:"center" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom:14 }}>Brand Story</p>
            <h2 className="serif" style={{ fontSize:"clamp(24px,3.4vw,36px)", letterSpacing:".05em", lineHeight:1.4, marginBottom:20 }}>
              每一顆晶礦，<br/>都有自己的靈魂與旅途
            </h2>
            <p className="muted" style={{ maxWidth:"36em", lineHeight:2 }}>
              日島是手作編織珠礦飾品品牌。我們將每一位擁有自主靈魂、色系與個性的晶礦，選取相互應和的珠飾與線材一一串連。
              採用低污染的「極線」與具 SGS 歐盟無毒認證的南美、巴西圓蠟線織就；作品皆可佩戴從事任何水類活動、無需取下，
              讓你更貼近晶礦純粹、肉眼可見的美麗。
            </p>
            <div className="flex gap8 wrap" style={{ marginTop:24 }}>
              <Badge>可下水佩戴</Badge><Badge>SGS 歐盟無毒</Badge><Badge>環保蠟線</Badge><Badge>手作客製</Badge>
            </div>
          </div>
          <div className="ph" style={{ aspectRatio:"4/5", borderRadius:"var(--rl)", border:"1px solid var(--hairline)" }}>
            <span className="lbl">品牌主視覺・晶礦特寫 brand hero</span>
          </div>
        </div>
      </section>

      {/* 三步流程 */}
      <section className="section-pad" style={{ background:"var(--paper-2)", borderTop:"1px solid var(--hairline)" }}>
        <div className="page">
          <p className="eyebrow center" style={{ marginBottom:10 }}>How it works</p>
          <h2 className="serif center" style={{ fontSize:"clamp(22px,3vw,32px)", letterSpacing:".06em", marginBottom:40 }}>三個步驟，織就專屬於你的那一條</h2>
          <div className="grid three-col" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
            {[
              ["01","挑選與搭配","選一顆與你共鳴的主石，依序搭配佩珠、線材顏色、編織法與長度。"],
              ["02","即時預估","系統即時計算預估價格與完整搭配摘要，所見即所得。"],
              ["03","送出訂製","送出需求，由日島設計師確認搭配可行性後與你回覆報價。"]
            ].map(([n,t,d]) => (
              <div key={n} className="card" style={{ padding:"28px 24px", background:"var(--paper)" }}>
                <div className="en" style={{ fontSize:34, color:"var(--mist)" }}>{n}</div>
                <h3 className="serif" style={{ fontSize:19, margin:"6px 0 10px", letterSpacing:".04em" }}>{t}</h3>
                <p className="muted tiny" style={{ lineHeight:1.9 }}>{d}</p>
              </div>
            ))}
          </div>
          <div className="center" style={{ marginTop:42 }}>
            <button className="btn sea" onClick={() => go("#/build")}>開始搭配我的項鍊　→</button>
          </div>
        </div>
      </section>
    </div>
  );
}
Object.assign(window, { Home });
