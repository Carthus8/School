// @ts-nocheck
(function () {
  var KEY = "miniTaskTracker.v2";
  var DAY = 86400000;
  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var DOWS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseYmd(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(n) { var d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + n); return ymd(d); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function uid() { return "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function $(id) { return document.getElementById(id); }

  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} }

  function seed() {
    return [
      { id: uid(), type: "task", title: "performance task 5", date: addDays(0), time: "23:59", course: "Performance Task", done: false, sample: false },
      { id: uid(), type: "task", title: "Chapter 3 reading response", date: addDays(1), time: "08:00", course: "Literature", done: false, sample: true },
      { id: uid(), type: "task", title: "Lab report: titration", date: addDays(2), time: "17:00", course: "Chemistry", done: false, sample: true },
      { id: uid(), type: "event", title: "Group study session", date: addDays(3), time: "14:00", course: "Math", done: false, sample: true },
      { id: uid(), type: "task", title: "Research proposal draft", date: addDays(6), time: "23:59", course: "Research", done: false, sample: true },
      { id: uid(), type: "event", title: "Midterm exam", date: addDays(9), time: "09:00", course: "Statistics", done: false, sample: true },
      { id: uid(), type: "task", title: "Problem set 4", date: addDays(-1), time: "23:59", course: "Math", done: true, sample: true }
    ];
  }

  var items = load() || seed();
  var filter = "all";
  var today = new Date();
  var viewY = today.getFullYear(), viewM = today.getMonth();
  var selected = ymd(today);

  function dueMs(it) {
    var t = it.time || (it.type === "event" ? "09:00" : "23:59");
    var p = it.date.split("-"), q = t.split(":");
    return new Date(+p[0], +p[1] - 1, +p[2], +q[0], +q[1]).getTime();
  }
  function fmtDate(s) {
    var d = parseYmd(s);
    return DOWS[d.getDay()] + ", " + MONTHS[d.getMonth()].slice(0, 3) + " " + d.getDate();
  }
  function fmtTime(t) {
    if (!t) return "";
    var p = t.split(":"), h = +p[0], ap = h >= 12 ? "PM" : "AM";
    return ((h + 11) % 12 + 1) + ":" + p[1] + " " + ap;
  }
  function rel(ms) {
    var diff = ms - Date.now(), a = Math.abs(diff);
    var m = Math.round(a / 60000), h = Math.floor(a / 3600000), d = Math.floor(a / DAY);
    var txt = a < 3600000 ? m + "m" : a < DAY ? h + "h" : d + "d " + (h % 24) + "h";
    if (a >= DAY * 2) txt = d + "d";
    return diff < 0 ? "Overdue " + txt : "in " + txt;
  }
  function urgency(it) {
    if (it.type !== "task" || it.done) return "";
    var diff = dueMs(it) - Date.now();
    if (diff < DAY) return "crit";
    if (diff < 3 * DAY) return "soon";
    return "";
  }

  var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  var TRASH = '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  function rowHtml(it, withDate) {
    var u = urgency(it);
    var mark = it.type === "event"
      ? '<span class="evt-mark" aria-hidden="true"></span>'
      : '<button class="chk" type="button" data-act="toggle" aria-label="Mark ' + esc(it.title) + (it.done ? ' not done' : ' done') + '">' + CHECK + '</button>';
    var bits = [];
    if (withDate) bits.push('<span class="mono">' + fmtDate(it.date) + '</span>');
    if (it.time) bits.push('<span class="mono">' + fmtTime(it.time) + '</span>');
    if (it.course) bits.push('<span class="pill' + (it.type === "event" ? " evt" : "") + '">' + esc(it.course) + '</span>');
    if (it.type === "event") bits.push('<span class="pill evt">Event</span>');
    if (it.type === "task" && it.done) bits.push('<span class="pill ok">Done</span>');
    else if (u === "crit") bits.push('<span class="pill crit">' + rel(dueMs(it)) + '</span>');
    else if (u === "soon") bits.push('<span class="pill warn">' + rel(dueMs(it)) + '</span>');
    return '<li class="item' + (it.done ? " done" : "") + '" data-id="' + it.id + '">' + mark +
      '<div class="body"><span class="name">' + esc(it.title) + '</span><div class="meta">' + bits.join("") + '</div></div>' +
      '<button class="del" type="button" data-act="del" aria-label="Delete ' + esc(it.title) + '">' + TRASH + '</button></li>';
  }

  function sorted(list) {
    return list.slice().sort(function (a, b) { return dueMs(a) - dueMs(b); });
  }

  function renderHeader() {
    var n = new Date();
    $("todayLabel").textContent = DOWS[n.getDay()] + " · " + MONTHS[n.getMonth()] + " " + n.getDate() + ", " + n.getFullYear();
    var tasks = items.filter(function (i) { return i.type === "task"; });
    var done = tasks.filter(function (i) { return i.done; }).length;
    var pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
    $("ringPct").textContent = pct + "%";
    $("ringMain").textContent = done + " of " + tasks.length + " done";
    $("ringBar").setAttribute("stroke-dashoffset", (213.63 * (1 - pct / 100)).toFixed(2));
    var open = tasks.length - done;
    $("ringSub").textContent = open === 0 ? "all caught up" : open + " still open";
  }

  function renderDue() {
    var soon = sorted(items.filter(function (i) {
      return i.type === "task" && !i.done && dueMs(i) - Date.now() < 3 * DAY;
    })).slice(0, 5);
    var ul = $("dueList");
    if (!soon.length) {
      ul.innerHTML = '<li class="empty">Nothing is due in the next 3 days. Nice work.</li>';
      return;
    }
    ul.innerHTML = soon.map(function (it) {
      var crit = dueMs(it) - Date.now() < DAY;
      return '<li class="due-card' + (crit ? " crit" : "") + '" data-id="' + it.id + '">' +
        '<button class="chk" type="button" data-act="toggle" aria-label="Mark ' + esc(it.title) + ' done">' + CHECK + '</button>' +
        '<div class="t"><b>' + esc(it.title) + '</b><small>' + fmtDate(it.date) + ' · ' + fmtTime(it.time || "23:59") + (it.course ? ' · ' + esc(it.course) : '') + '</small></div>' +
        '<span class="when">' + rel(dueMs(it)) + '</span></li>';
    }).join("");
  }

  function renderList() {
    var list = items.filter(function (i) {
      if (filter === "task") return i.type === "task" && !i.done;
      if (filter === "event") return i.type === "event";
      if (filter === "done") return i.type === "task" && i.done;
      return true;
    });
    list = sorted(list);
    if (filter === "all") list = list.filter(function (i) { return !(i.done); }).concat(list.filter(function (i) { return i.done; }));
    $("countSub").textContent = list.length + (list.length === 1 ? " item" : " items");
    $("items").innerHTML = list.length
      ? list.map(function (i) { return rowHtml(i, true); }).join("")
      : '<li class="empty">Nothing here yet. Add an assignment or event above.</li>';
    $("sampleNotice").hidden = !items.some(function (i) { return i.sample; });
  }

  function renderCal() {
    $("calH").textContent = MONTHS[viewM] + " " + viewY;
    var first = new Date(viewY, viewM, 1);
    var start = new Date(viewY, viewM, 1 - first.getDay());
    var byDay = {};
    items.forEach(function (i) { (byDay[i.date] = byDay[i.date] || []).push(i); });
    var todayS = ymd(new Date());
    var html = "";
    for (var k = 0; k < 42; k++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + k);
      var s = ymd(d), list = byDay[s] || [];
      var dots = list.slice(0, 3).map(function (i) {
        var c = "dot";
        if (i.type === "event") c += " evt";
        else if (i.done) c += " done";
        else if (urgency(i) === "crit") c += " crit";
        return '<i class="' + c + '"></i>';
      }).join("");
      var cls = "day" + (d.getMonth() !== viewM ? " out" : "") + (s === todayS ? " today" : "") + (s === selected ? " sel" : "");
      html += '<button type="button" class="' + cls + '" data-date="' + s + '" aria-label="' + fmtDate(s) + ', ' + list.length + ' items"' + (s === selected ? ' aria-pressed="true"' : "") + '>' +
        '<span>' + d.getDate() + '</span><span class="dots">' + dots + '</span></button>';
    }
    $("days").innerHTML = html;

    var dayItems = sorted(byDay[selected] || []);
    $("agendaH").innerHTML = esc(fmtDate(selected)) + ' <small>' + dayItems.length + (dayItems.length === 1 ? " item" : " items") + '</small>';
    $("agenda").innerHTML = dayItems.length
      ? dayItems.map(function (i) { return rowHtml(i, false); }).join("")
      : '<li class="empty">Nothing scheduled. Pick this date in the form to add something.</li>';
  }

  function renderAll() { renderHeader(); renderDue(); renderList(); renderCal(); }

  /* events */
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var title = $("fTitle").value.trim();
    var date = $("fDate").value;
    var type = document.querySelector('input[name="type"]:checked').value;
    if (!title) { $("err").textContent = "Enter a title first."; $("fTitle").focus(); return; }
    if (!date) { $("err").textContent = "Choose a date."; $("fDate").focus(); return; }
    $("err").textContent = "";
    items.push({ id: uid(), type: type, title: title, date: date, time: $("fTime").value || "", course: $("fCourse").value.trim(), done: false, sample: false });
    save();
    $("fTitle").value = ""; $("fCourse").value = "";
    var d = parseYmd(date); selected = date; viewY = d.getFullYear(); viewM = d.getMonth();
    renderAll();
    $("fTitle").focus();
  });

  function setType() {
    var ev = $("typeEvent").checked;
    $("timeLbl").textContent = ev ? "Start time" : "Due time";
    document.querySelector(".add-btn").lastChild.textContent = ev ? "Add Event" : "Add Task";
  }
  $("typeTask").addEventListener("change", setType);
  $("typeEvent").addEventListener("change", setType);

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-act]");
    if (btn) {
      var row = btn.closest("[data-id]"); if (!row) return;
      var id = row.getAttribute("data-id");
      if (btn.getAttribute("data-act") === "toggle") {
        items.forEach(function (i) { if (i.id === id) i.done = !i.done; });
        save();
        var chk = btn; chk.classList.add("popping");
        setTimeout(renderAll, 180);
      } else {
        var rows = document.querySelectorAll('[data-id="' + id + '"]');
        rows.forEach(function (r) { r.classList.add("leaving"); });
        setTimeout(function () { items = items.filter(function (i) { return i.id !== id; }); save(); renderAll(); }, 260);
      }
      return;
    }
    var day = e.target.closest(".day");
    if (day) {
      selected = day.getAttribute("data-date");
      var d = parseYmd(selected);
      if (d.getMonth() !== viewM) { viewY = d.getFullYear(); viewM = d.getMonth(); }
      $("fDate").value = selected;
      renderCal();
    }
  });

  $("tabs").addEventListener("click", function (e) {
    var t = e.target.closest(".tab"); if (!t) return;
    filter = t.getAttribute("data-f");
    document.querySelectorAll(".tab").forEach(function (b) { b.setAttribute("aria-pressed", String(b === t)); });
    renderList();
  });
  $("prevM").addEventListener("click", function () { viewM--; if (viewM < 0) { viewM = 11; viewY--; } renderCal(); });
  $("nextM").addEventListener("click", function () { viewM++; if (viewM > 11) { viewM = 0; viewY++; } renderCal(); });
  $("todayBtn").addEventListener("click", function () {
    var n = new Date(); viewY = n.getFullYear(); viewM = n.getMonth(); selected = ymd(n); $("fDate").value = selected; renderCal();
  });
  $("clearSamples").addEventListener("click", function () {
    items = items.filter(function (i) { return !i.sample; }); save(); renderAll();
  });

  /* theme toggle */
  $("themeBtn").addEventListener("click", function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    root.setAttribute("data-theme", cur === "dark" ? "light" : "dark");
  });

  /* start */
  $("fDate").value = selected;
  setType();
  renderAll();
  setInterval(function () { renderHeader(); renderDue(); renderList(); renderCal(); }, 60000);
})();
