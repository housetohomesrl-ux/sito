/* Messaggio "prima di andare": compare una volta per visita, quando la persona sta per lasciare il sito.
   Pc: il mouse esce dalla pagina verso l'alto. Telefono: risalita veloce della pagina.
   Stato salvato solo nel browser di chi visita (nessun dato inviato). */
(function(){
  var KEY = "h2h_stato", SHOWN = "h2h_uscita_vista";
  function leggi(){ try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch(e){ return {}; } }
  function scrivi(o){ try { localStorage.setItem(KEY, JSON.stringify(o)); } catch(e){} }
  function segna(k){ var s = leggi(); if(!s[k]){ s[k] = Date.now(); scrivi(s); } }
  window.H2H_segna = segna;

  // qualsiasi clic su link o pulsanti del sito
  document.addEventListener("click", function(e){
    var t = e.target.closest && e.target.closest("a,button,summary,label");
    if(t && !t.closest(".h2h-exit")) segna("clic");
  }, true);

  var TESTI = {
    sondaggio: {
      t: "Hai completato il sondaggio",
      p: ["Abbiamo notato che hai completato il sondaggio. Non lasciare che i dubbi ti allontanino dalla casa che desideri: scrivici, anche solo per un confronto senza impegno."]
    },
    calcolo: {
      t: "Hai fatto i tuoi conti",
      p: ["Le cifre ti sembrano alte? Considera che, acquistando una casa da ristrutturare, i soli lavori costano almeno 1.000 €/m².",
          "Con noi hai un servizio completo, con professionisti che ti seguono in ogni aspetto: non dovrai cercare un geometra per il progetto, un'impresa per i lavori o un architetto che ti consigli come ottimizzare gli spazi e dove scegliere i materiali. E con noi puoi ottenere il mutuo che ti serve per realizzare la casa che desideri.",
          "Non fermarti alla cifra che vedi: pensa a quello che avrai."]
    },
    visita: {
      t: "Ti interessa quello che facciamo?",
      p: ["Abbiamo notato che stai scoprendo come realizziamo i desideri dei nostri clienti. Scrivici oggi, senza impegno: ti spieghiamo come possiamo aiutarti."]
    }
  };

  function quale(){
    var s = leggi();
    if(s.inviato) return null;
    if(s.calcolo) return "calcolo";
    if(s.sondaggio) return "sondaggio";
    if(!s.clic) return "visita";
    return null;
  }

  function vaiAiDati(tipo){
    var form = document.getElementById("c-nome");
    if(form){ chiudi(); form.scrollIntoView({behavior:"smooth", block:"center"}); setTimeout(function(){ try{ form.focus({preventScroll:true}); }catch(e){} }, 500); return; }
    location.href = "/sondaggio/#scrivici-" + tipo;
  }

  var box = null;
  function chiudi(){ if(box){ box.remove(); box = null; document.documentElement.style.overflow = ""; } }

  function mostra(){
    var tipo = quale();
    try { if(sessionStorage.getItem(SHOWN)) return; } catch(e){}
    if(!tipo || box) return;
    try { sessionStorage.setItem(SHOWN, "1"); } catch(e){}
    var T = TESTI[tipo];
    box = document.createElement("div");
    box.className = "h2h-exit";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "h2h-exit-t");
    box.innerHTML =
      '<div class="h2h-exit-card">' +
        '<button class="h2h-exit-x" type="button" aria-label="Chiudi">×</button>' +
        '<p class="h2h-exit-k">Prima di andare</p>' +
        '<h2 id="h2h-exit-t"></h2>' +
        '<div class="h2h-exit-p"></div>' +
        '<button class="h2h-exit-go" type="button">Scrivici subito <span aria-hidden="true">→</span></button>' +
        '<button class="h2h-exit-no" type="button">No grazie, continuo a guardare</button>' +
      '</div>';
    box.querySelector("h2").textContent = T.t;
    var pp = box.querySelector(".h2h-exit-p");
    T.p.forEach(function(x){ var p = document.createElement("p"); p.textContent = x; pp.appendChild(p); });
    box.querySelector(".h2h-exit-x").onclick = chiudi;
    box.querySelector(".h2h-exit-no").onclick = chiudi;
    box.querySelector(".h2h-exit-go").onclick = function(){ vaiAiDati(tipo); };
    box.addEventListener("click", function(e){ if(e.target === box) chiudi(); });
    document.addEventListener("keydown", function esc(e){ if(e.key === "Escape"){ chiudi(); document.removeEventListener("keydown", esc); } });
    document.body.appendChild(box);
    document.documentElement.style.overflow = "hidden";
    box.querySelector(".h2h-exit-go").focus();
  }

  var css = document.createElement("style");
  css.textContent =
    ".h2h-exit{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px max(16px,env(safe-area-inset-right,0px)) 20px max(16px,env(safe-area-inset-left,0px));background:rgba(20,28,34,.55);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:h2hIn .25s ease}" +
    ".h2h-exit-card{position:relative;width:100%;max-width:460px;max-height:calc(100dvh - 40px);overflow:auto;background:#2F4858;color:#fff;border-radius:18px;padding:30px 26px 22px;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:inherit}" +
    ".h2h-exit-k{margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FAE89E}" +
    ".h2h-exit h2{margin:0 0 12px;font-family:Merriweather,Georgia,serif;font-size:23px;line-height:1.25;color:#fff;text-align:left!important}" +
    ".h2h-exit-p p{margin:0 0 10px;font-size:15.5px;line-height:1.55;color:#E6ECEF}" +
    ".h2h-exit-go{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:52px;margin-top:10px;border:0;border-radius:999px;background:#FAE89E;color:#3F4042;font-weight:700;font-size:16px;font-family:inherit;cursor:pointer}" +
    ".h2h-exit-no{display:block;width:100%;margin-top:10px;padding:10px;border:0;background:none;color:#C9D3D8;font-size:14px;font-family:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:3px}" +
    ".h2h-exit-x{position:absolute;top:10px;right:12px;width:40px;height:40px;border:0;background:none;color:#C9D3D8;font-size:26px;line-height:1;cursor:pointer}" +
    "@keyframes h2hIn{from{opacity:0}to{opacity:1}}";
  document.head.appendChild(css);

  var inizio = Date.now();
  var pronto = function(){ return Date.now() - inizio > 8000; };

  // pc: il mouse esce dalla finestra verso l'alto
  document.addEventListener("mouseout", function(e){
    if(!e.relatedTarget && e.clientY <= 0 && pronto()) mostra();
  });

  // telefono: risalita veloce dopo essere scesi nella pagina
  var lastY = window.scrollY, lastT = Date.now(), maxY = 0;
  window.addEventListener("scroll", function(){
    var y = window.scrollY, t = Date.now();
    maxY = Math.max(maxY, y);
    var v = (lastY - y) / Math.max(1, t - lastT); // px/ms verso l'alto
    if(window.matchMedia("(hover: none)").matches && pronto() && maxY > 600 && v > 2.2 && y < maxY - 400) mostra();
    lastY = y; lastT = t;
  }, {passive:true});
})();
