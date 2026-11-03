/* Planimetrie: schede Prima / Dopo con immagini */
(function () {
  "use strict";
  function mount(el) {
    var imgs = JSON.parse(el.getAttribute("data-imgs"));
    var name = el.getAttribute("data-name") || "";
    var tabs = document.createElement("div"); tabs.className = "plan-tabs"; tabs.setAttribute("role", "tablist");
    var stage = document.createElement("div"); stage.className = "plan-stage";
    var note = document.createElement("p"); note.className = "plan-note";
    el.append(tabs, stage, note);
    function show(i) {
      tabs.querySelectorAll("button").forEach(function (b, j) { b.setAttribute("aria-selected", String(i === j)); });
      var it = imgs[i];
      stage.innerHTML = '<img src="' + it[1] + '" alt="Planimetria di ' + name + ' ' + it[0].toLowerCase() + ' dei lavori" loading="lazy">';
      note.textContent = {"Dopo": "Il progetto.", "Prima": "Lo stato di fatto, com'era la casa prima dei lavori.", "Lavorazioni": "In rosso i muri nuovi, in giallo i muri demoliti."}[it[0]] || "";
    }
    imgs.forEach(function (it, i) {
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.textContent = it[0];
      b.addEventListener("click", function () { show(i); }); tabs.appendChild(b);
    });
    var d = imgs.findIndex(function (x) { return x[0] === "Dopo"; }); show(d < 0 ? imgs.length - 1 : d);
  }
  function init() { document.querySelectorAll(".plan-view[data-imgs]").forEach(mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
