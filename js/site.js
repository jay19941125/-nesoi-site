/* 日島 NESOI — 官方網站互動 */
(function(){
  "use strict";

  /* ---- sticky nav state + mobile toggle ---- */
  var topbar = document.querySelector('.topbar');
  var onScroll = function(){
    if(topbar){ topbar.classList.toggle('scrolled', window.scrollY > 20); }
  };
  window.addEventListener('scroll', onScroll, { passive:true }); onScroll();

  var navToggle = document.querySelector('.nav-toggle');
  var navlinks  = document.querySelector('.navlinks');
  if(navToggle && navlinks){
    navToggle.addEventListener('click', function(){
      navlinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    navlinks.addEventListener('click', function(e){
      if(e.target.closest('a')){ navlinks.classList.remove('open'); navToggle.classList.remove('active'); }
    });
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.12, rootMargin:"0px 0px -6% 0px" });
  document.querySelectorAll('.reveal, .product').forEach(function(el){ io.observe(el); });

  /* ---- parallax (hero sun + horizon) ---- */
  var sun = document.querySelector('.hero .sun');
  var ridge = document.querySelector('.hero .ridge');
  var ticking = false;
  var parallax = function(){
    var y = window.scrollY;
    if(sun)   sun.style.transform   = 'translateY(' + (y * 0.22) + 'px)';
    if(ridge) ridge.style.transform = 'translateY(' + (y * 0.08) + 'px)';
    ticking = false;
  };
  window.addEventListener('scroll', function(){
    if(!ticking){ requestAnimationFrame(parallax); ticking = true; }
  }, { passive:true });

  /* ---- count-up stats ---- */
  var statObserver = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      var el = e.target, target = parseFloat(el.dataset.count), dur = 1500, t0 = null;
      var dec = (el.dataset.count.indexOf('.') >= 0) ? 1 : 0;
      var step = function(ts){
        if(!t0) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if(p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec);
      };
      requestAnimationFrame(step);
      statObserver.unobserve(el);
    });
  }, { threshold:.5 });
  document.querySelectorAll('[data-count]').forEach(function(el){ statObserver.observe(el); });

  /* ---- catalog filter ---- */
  var filters = document.querySelectorAll('.filter');
  var products = document.querySelectorAll('.product');
  filters.forEach(function(btn){
    btn.addEventListener('click', function(){
      filters.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.dataset.cat;
      products.forEach(function(p){
        var show = (cat === 'all') || (p.dataset.cat === cat);
        p.classList.toggle('hide', !show);
        if(show){ p.classList.add('in'); }
      });
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      if(isOpen){
        item.classList.remove('open'); ans.style.maxHeight = null;
      } else {
        item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
})();
