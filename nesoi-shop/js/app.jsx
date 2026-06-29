/* 日島 NESOI — 路由與外殼 */
function TopNav(){
  const hash = useHash();
  const is = h => hash===h || (h==="#/" && hash==="");
  return (
    <nav className="nav">
      <div className="inner">
        <a href="#/" className="brand">
          <LogoMark size={28} />
          <span className="word">Nesoi</span>
          <span className="cn">日島</span>
        </a>
        <div className="links">
          <a href="#/" className={is("#/") ? "active" : ""}>首頁</a>
          <a href="#/build" className={hash.startsWith("#/build") ? "active" : ""}>搭配項鍊</a>
          <a href="#/admin" className={hash.startsWith("#/admin") ? "active" : ""}>後台</a>
        </div>
      </div>
    </nav>
  );
}

function Footer(){
  return (
    <footer style={{ background:"var(--ink)", color:"var(--paper)", marginTop:60 }}>
      <div className="page" style={{ padding:"54px 24px", display:"flex", flexDirection:"column", gap:18 }}>
        <div className="flex acenter gap12"><LogoMark size={30} stroke="var(--paper)" /><span className="en" style={{ fontSize:22 }}>Nesoi · 日島</span></div>
        <p className="serif" style={{ fontSize:"clamp(20px,3vw,30px)", letterSpacing:".08em" }}>島映自然靈魂，陪伴旅途是日</p>
        <p className="en" style={{ color:"color-mix(in srgb,var(--paper) 65%,transparent)", fontSize:18 }}>Always unexpected warmth in life</p>
        <div className="flex between wrap gap12 mono" style={{ fontSize:11, letterSpacing:".12em", textTransform:"uppercase", color:"color-mix(in srgb,var(--paper) 55%,transparent)", borderTop:"1px solid rgba(236,230,218,.18)", paddingTop:22, marginTop:8 }}>
          <span>@nesoi2024</span><span>旅行選品 · 編織珠飾 · 山海日誌</span><span>© 2024–2026 Nesoi</span>
        </div>
      </div>
    </footer>
  );
}

function App(){
  const hash = useHash();
  const route = hash.replace(/^#/, "");
  const isAdmin = route.startsWith("/admin");
  return (
    <ToastProvider>
      <TopNav />
      {route.startsWith("/build") ? <Configurator /> :
       isAdmin ? <AdminApp /> : <Home />}
      {!isAdmin && !route.startsWith("/build") && <Footer />}
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
