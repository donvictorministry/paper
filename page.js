(function () {
'use strict';
var D = window.DV;
if (!D || !D.contents) return;
var C = D.contents, S = C.sections;

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function txt(b) { return typeof b === 'string' ? b : (b.h || b.g || b.r || (b.b ? b.b + ' ' + b.t : '')); }

function blk(b, i, id) {
  var k = 'id="dv-' + id + '-' + i + '"';
  if (typeof b === 'string') return '<p ' + k + '>' + esc(b) + '</p>';
  if (b.h) return '<h2 ' + k + '>' + esc(b.h) + '</h2>';
  if (b.g) return '<h3 ' + k + '>' + esc(b.g) + '</h3>';
  if (b.r) return '<p class="dvRef" ' + k + '>' + esc(b.r) + '</p>';
  if (b.b) return '<p ' + k + '><strong>' + esc(b.b) + '</strong> ' + esc(b.t) + '</p>';
  if (b.ic) return '<div class="dvIcons" ' + k + '>' + b.ic.map(function (c) {
    var u = (C.meta.contacts || {})[c[0]] || '';
    return u
      ? '<a class="dvIconBtn" href="' + esc(u) + '" aria-label="' + c[0] + '"' + (/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '') + '>' + D.icon(c[1]) + '</a>'
      : '<button type="button" class="dvIconBtn" data-dv-empty="1" aria-label="' + c[0] + '">' + D.icon(c[1]) + '</button>';
  }).join('') + '</div>';
  return '';
}

function html(s) {
  return '<section id="dv-sec-' + s.id + '"><h1>' + esc(s.title) + '</h1>' +
    (s.by ? '<p class="dvBy">' + esc(s.by) + '</p>' : '') +
    s.blocks.map(function (b, i) { return blk(b, i, s.id); }).join('') + '</section>';
}

function find(id) { for (var i = 0; i < S.length; i++) if (S[i].id === id) return S[i]; }

D.page = {
  render: function (id) {
    var s = find(id) || S[0];
    D.article.innerHTML = html(s);
    window.scrollTo(0, 0);
    D.emit('rendered', s.id);
  },
  renderAll: function () {
    D.article.innerHTML = S.map(html).join('');
    window.scrollTo(0, 0);
  },
  open: function (id, i) {
    if (D.go && D.cur !== id) D.go(id);
    var el = i < 0 ? null : document.getElementById('dv-' + id + '-' + i);
    if (!el) { if (i < 0) { var t = document.getElementById('dv-sec-' + id); if (t) t.scrollIntoView(); else window.scrollTo(0, 0); } return; }
    el.scrollIntoView({ block: 'start' });
    el.classList.remove('dvFlash'); void el.offsetWidth; el.classList.add('dvFlash');
    setTimeout(function () { el.classList.remove('dvFlash'); }, 1900);
  }
};

D.article.addEventListener('click', function (e) {
  if (e.target.closest('[data-dv-empty]')) D.toast('Link not set yet');
});

function dvSearch() {
  var w = document.createElement('div');
  w.innerHTML = '<input class="dvInput" type="search" placeholder="Search the paper" aria-label="Search the paper" autocomplete="off"><div class="dvResults"></div>';
  var inp = w.querySelector('input'), out = w.querySelector('.dvResults'), m = D.modal('Search', w);
  inp.addEventListener('input', function () {
    var q = inp.value.trim().toLowerCase(), r = [];
    out.innerHTML = '';
    if (q.length < 2) return;
    S.forEach(function (s) {
      s.blocks.forEach(function (b, i) {
        var t = txt(b), x = t.toLowerCase().indexOf(q);
        if (x >= 0 && r.length < 40) r.push({ s: s, i: i, t: (x > 50 ? '…' : '') + t.substr(Math.max(0, x - 50), 130) + '…' });
      });
    });
    var n = document.createElement('p'); n.className = 'dvResInfo';
    n.textContent = r.length ? r.length + (r.length === 40 ? '+' : '') + ' results' : 'No results';
    out.appendChild(n);
    r.forEach(function (o) {
      var b = document.createElement('button'), a = document.createElement('strong'), c = document.createElement('span');
      b.type = 'button'; b.className = 'dvRes'; a.textContent = o.s.menu; c.textContent = o.t;
      b.appendChild(a); b.appendChild(c);
      b.addEventListener('click', function () { m.close(); D.page.open(o.s.id, o.i); });
      out.appendChild(b);
    });
  });
  inp.focus();
}

function dvToc() {
  var w = document.createElement('div'), m = D.modal('Contents', w);
  function row(label, cls, id, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'dvRes ' + cls; b.textContent = label;
    b.addEventListener('click', function () { m.close(); D.page.open(id, i); });
    w.appendChild(b);
  }
  S.forEach(function (s) {
    row(s.menu, 'dvTocSec', s.id, -1);
    s.blocks.forEach(function (b, i) { if (b.h && s.id !== 'home') row(b.h, 'dvTocSub', s.id, i); });
  });
}

D.menu('right').add({ icon: 'list', label: 'Contents', fn: dvToc, top: true });
D.menu('right').add({ icon: 'search', label: 'Search', fn: dvSearch, top: true });

D.on('route', function (id) { D.page.render(id); });
D.on('ready', function () { if (!D.go) D.page.renderAll(); });
})();
