/* =========================================================
   日島 NESOI — 資料層 (localStorage 模擬資料庫 + pub/sub)
   正式上線時，把 get/set/upsert/remove 換成 Supabase/Firebase 呼叫即可。
   ========================================================= */
(function(){
  "use strict";
  var KEY = "nesoi_shop_v1";

  /* ---------- 價格設定 ---------- */
  var PRICE = {
    base: 350,                                  // 基本製作費
    length: { "40":0, "45":0, "50":80, "55":120, "custom":160 },
    adjustable: 60,                             // 可調節尾扣
    giftBox: 150                                // 禮盒包裝
  };
  var LENGTHS = ["40","45","50","55","custom"];
  var STATUSES = ["待確認","已報價","等待付款","製作中","已完成","已出貨","已取消"];
  var STATUS_TONE = { "待確認":"warn","已報價":"sea","等待付款":"warn","製作中":"sea","已完成":"ok","已出貨":"ok","已取消":"out" };

  /* ---------- 種子資料 ---------- */
  function seed(){
    return {
      stones:[
        { id:"s1", code:"NS-001", name:"月光石", img:"", size:"12mm", colorFamily:"霧白藍", meaning:"內在平靜・新的開始", shape:"橢圓", weaves:["w1","w2","w3"], price:880, inStock:true, active:true },
        { id:"s2", code:"NS-002", name:"海水藍寶", img:"", size:"10mm", colorFamily:"海藍", meaning:"勇氣與溝通", shape:"水滴", weaves:["w1","w3"], price:1280, inStock:true, active:true },
        { id:"s3", code:"NS-003", name:"拉長石", img:"", size:"14mm", colorFamily:"灰綠閃光", meaning:"直覺與保護", shape:"自由形", weaves:["w2","w4"], price:760, inStock:true, active:true },
        { id:"s4", code:"NS-004", name:"粉晶", img:"", size:"12mm", colorFamily:"柔粉", meaning:"溫柔的愛", shape:"圓珠", weaves:["w1","w2"], price:520, inStock:true, active:true },
        { id:"s5", code:"NS-005", name:"黑曜石", img:"", size:"13mm", colorFamily:"墨黑", meaning:"紮根與防護", shape:"圓珠", weaves:["w1","w4"], price:480, inStock:false, active:true },
        { id:"s6", code:"NS-006", name:"青金石", img:"", size:"11mm", colorFamily:"深海藍", meaning:"智慧與真實", shape:"方形", weaves:["w3","w4"], price:990, inStock:true, active:true },
        { id:"s7", code:"NS-007", name:"太陽石", img:"", size:"10mm", colorFamily:"暖橘金", meaning:"溫暖與活力", shape:"橢圓", weaves:["w1","w2"], price:690, inStock:true, active:true },
        { id:"s8", code:"NS-008", name:"天河石", img:"", size:"12mm", colorFamily:"霧綠", meaning:"希望與療癒", shape:"圓珠", weaves:["w1","w2","w3"], price:640, inStock:true, active:true }
      ],
      beads:[
        { id:"b1", name:"淡水珍珠", img:"", category:"珍珠", material:"天然珍珠", colorFamily:"米白", price:60, stockQty:40, active:true },
        { id:"b2", name:"椰殼圓珠", img:"", category:"天然", material:"椰殼", colorFamily:"暖棕", price:25, stockQty:80, active:true },
        { id:"b3", name:"黃銅隔珠", img:"", category:"金屬", material:"黃銅", colorFamily:"金", price:35, stockQty:120, active:true },
        { id:"b4", name:"啞光瑪瑙", img:"", category:"礦石", material:"瑪瑙", colorFamily:"礦石灰", price:55, stockQty:50, active:true },
        { id:"b5", name:"檀木圓珠", img:"", category:"天然", material:"檀木", colorFamily:"暖棕", price:20, stockQty:90, active:true },
        { id:"b6", name:"海藍玻璃珠", img:"", category:"玻璃", material:"再生玻璃", colorFamily:"海藍", price:30, stockQty:70, active:true },
        { id:"b7", name:"純銀小圓珠", img:"", category:"金屬", material:"925 純銀", colorFamily:"銀白", price:80, stockQty:30, active:true },
        { id:"b8", name:"砂金石", img:"", category:"礦石", material:"砂金石", colorFamily:"墨藍金", price:45, stockQty:60, active:true }
      ],
      cords:[
        { id:"c1", name:"霧白", code:"WX-01", swatch:"#ECE6DA", material:"巴西圓蠟線", desc:"最百搭的底色，凸顯主石。", surcharge:0, waterproof:true, active:true },
        { id:"c2", name:"沙色", code:"WX-02", swatch:"#CDB99B", material:"巴西圓蠟線", desc:"溫暖中性，海島氣息。", surcharge:0, waterproof:true, active:true },
        { id:"c3", name:"深海藍", code:"WX-03", swatch:"#33506E", material:"南美圓蠟線", desc:"沉穩內斂，襯冷色晶礦。", surcharge:0, waterproof:true, active:true },
        { id:"c4", name:"礦石灰", code:"WX-04", swatch:"#9A9588", material:"巴西圓蠟線", desc:"低調霧感，質地高級。", surcharge:0, waterproof:true, active:true },
        { id:"c5", name:"霧綠", code:"WX-05", swatch:"#7E8B73", material:"南美圓蠟線", desc:"植感療癒，貼近自然。", surcharge:0, waterproof:true, active:true },
        { id:"c6", name:"暖棕", code:"WX-06", swatch:"#6F5C49", material:"巴西圓蠟線", desc:"大地暖調，旅人氣質。", surcharge:0, waterproof:true, active:true },
        { id:"c7", name:"極線・透明", code:"PL-01", swatch:"#C8D2D0", material:"低污染極線", desc:"極細隱形，輕盈無存在感。", surcharge:40, waterproof:true, active:true },
        { id:"c8", name:"月光銀", code:"MT-01", swatch:"#C6CACD", material:"金屬感蠟線", desc:"微光澤點綴，建議避免長泡水。", surcharge:20, waterproof:false, active:true }
      ],
      weaves:[
        { id:"w1", name:"平結", img:"", shapes:"圓珠・橢圓", style:"經典耐看，乾淨俐落的基礎編法。", difficulty:"易", surcharge:0, active:true },
        { id:"w2", name:"包石編", img:"", shapes:"自由形・不規則", style:"立體包覆主石，凸顯礦石原形。", difficulty:"中", surcharge:180, active:true },
        { id:"w3", name:"螺旋結", img:"", shapes:"圓珠・水滴", style:"帶律動感的螺旋紋理，靈動柔軟。", difficulty:"中", surcharge:120, active:true },
        { id:"w4", name:"網狀編", img:"", shapes:"方形・大顆", style:"繁複華麗的網狀包覆，存在感強。", difficulty:"難", surcharge:280, active:true }
      ],
      orders:[
        { id:"o1", orderNo:"NSO-240615-01", name:"林小海", phone:"0912-345-678", email:"hai@example.com", lineId:"hai_ocean",
          sel:{ stoneId:"s1", beads:[{id:"b1",qty:2},{id:"b3",qty:1}], cordId:"c2", weaveId:"w2", length:"45", adjustable:true, giftBox:true, isGift:true, note:"想送給剛畢業的妹妹，希望溫柔一點。" },
          estPrice:0, quotedPrice:0, status:"待確認", createdAt: Date.now()-86400000*2 },
        { id:"o2", orderNo:"NSO-240618-02", name:"陳嶼", phone:"0922-111-222", email:"yu@example.com", lineId:"yu.island",
          sel:{ stoneId:"s6", beads:[{id:"b8",qty:3}], cordId:"c3", weaveId:"w4", length:"50", adjustable:false, giftBox:false, isGift:false, note:"" },
          estPrice:0, quotedPrice:1980, status:"已報價", createdAt: Date.now()-86400000 }
      ],
      meta:{ orderSeq: 2 }
    };
  }

  /* ---------- load / persist ---------- */
  var db = null;
  function load(){
    if(db) return db;
    try{ var raw = localStorage.getItem(KEY); if(raw){ db = JSON.parse(raw); } }catch(e){}
    if(!db){ db = seed(); persist(); }
    if(!db.meta) db.meta = { orderSeq: db.orders ? db.orders.length : 0 };
    return db;
  }
  function persist(){
    try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){ console.warn("persist failed", e); }
  }

  /* ---------- pub/sub ---------- */
  var listeners = [];
  function notify(){ persist(); listeners.slice().forEach(function(fn){ try{ fn(); }catch(e){} }); }

  /* ---------- pricing ---------- */
  function priceOf(sel, data){
    data = data || load();
    var total = PRICE.base;
    var stone = data.stones.find(function(s){ return s.id===sel.stoneId; });
    if(stone) total += stone.price;
    (sel.beads||[]).forEach(function(b){
      var bead = data.beads.find(function(x){ return x.id===b.id; });
      if(bead) total += bead.price * (b.qty||0);
    });
    var weave = data.weaves.find(function(w){ return w.id===sel.weaveId; });
    if(weave) total += weave.surcharge;
    var cord = data.cords.find(function(c){ return c.id===sel.cordId; });
    if(cord) total += cord.surcharge;
    if(sel.length && PRICE.length[sel.length]!=null) total += PRICE.length[sel.length];
    if(sel.adjustable) total += PRICE.adjustable;
    if(sel.giftBox) total += PRICE.giftBox;
    return total;
  }

  /* ---------- public API ---------- */
  window.Nesoi = {
    PRICE: PRICE, LENGTHS: LENGTHS, STATUSES: STATUSES, STATUS_TONE: STATUS_TONE,
    all: function(){ return load(); },
    get: function(type){ return load()[type] || []; },
    set: function(type, arr){ load()[type] = arr; notify(); },
    upsert: function(type, item){
      var arr = load()[type];
      var i = arr.findIndex(function(x){ return x.id===item.id; });
      if(i>=0) arr[i] = item; else arr.unshift(item);
      notify(); return item;
    },
    remove: function(type, id){
      var d = load(); d[type] = d[type].filter(function(x){ return x.id!==id; }); notify();
    },
    byId: function(type, id){ return load()[type].find(function(x){ return x.id===id; }); },
    priceOf: priceOf,
    newId: function(){ return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2,6); },
    nextOrderNo: function(){
      var d = load(); d.meta.orderSeq = (d.meta.orderSeq||0)+1;
      var dt = new Date(); var ymd = String(dt.getFullYear()).slice(2) + String(dt.getMonth()+1).padStart(2,"0") + String(dt.getDate()).padStart(2,"0");
      return "NSO-" + ymd + "-" + String(d.meta.orderSeq).padStart(2,"0");
    },
    subscribe: function(fn){ listeners.push(fn); return function(){ listeners = listeners.filter(function(f){ return f!==fn; }); }; },
    resetSeed: function(){ db = seed(); notify(); }
  };
})();
