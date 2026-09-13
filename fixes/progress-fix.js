// Fortschritt-Fix: robustes, nicht-destruktives Script
// Leg dieses File in fixes/progress-fix.js und binde es in deine HTML (z.B. <script src="/fixes/progress-fix.js" defer></script>)

(function () {
  'use strict';

  // Hilfsfunktionen
  function toNumber(v, fallback = 0) {
    var n = Number(v);
    if (!isFinite(n)) return fallback;
    return n;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // Setze progress element sicher
  function setNativeProgress(el, value, max) {
    var v = toNumber(value, 0);
    var m = (max !== undefined) ? toNumber(max, 100) : (el.max ? toNumber(el.max, 100) : 100);
    if (m <= 0) m = 100;
    v = clamp(v, 0, m);
    try {
      el.value = v;
      el.max = m;
      el.setAttribute('aria-valuenow', String(v));
      el.setAttribute('aria-valuemax', String(m));
    } catch (e) {
      // fail silently — nicht destruktiv
      console.warn('progress-fix: konnte native progress nicht setzen', e);
    }
  }

  // Setze CSS-basierte progress bar (.progress__fill oder role=progressbar)
  function setCssProgressFill(el, percent) {
    var p = toNumber(percent, 0);
    p = clamp(p, 0, 100);
    try {
      el.style.width = p + '%';
      el.setAttribute('aria-valuenow', String(p));
    } catch (e) {
      console.warn('progress-fix: konnte CSS-Fill nicht setzen', e);
    }
  }

  // Versucht, einen Prozentwert aus verschiedenen Quellen zu lesen
  function readPercentFromAttributes(el) {
    // data-progress, data-percent, aria-valuenow, textContent like "50%"
    var attrs = ['data-progress', 'data-percent', 'aria-valuenow', 'value'];
    for (var i = 0; i < attrs.length; i++) {
      var a = attrs[i];
      var v = el.getAttribute && el.getAttribute(a);
      if (v == null) continue;
      // strip %
      v = String(v).trim().replace('%', '');
      var n = Number(v);
      if (isFinite(n)) return n;
    }
    // textContent fall-back
    if (el.textContent) {
      var t = el.textContent.trim().match(/(-?\d+(?:\.\d+)?)\s*%?/);
      if (t) {
        var nn = Number(t[1]);
        if (isFinite(nn)) return nn;
      }
    }
    return null;
  }

  // Normalisiere vorhandene Elemente auf der Seite
  function normalizeExisting() {
    // native <progress>
    var native = Array.prototype.slice.call(document.getElementsByTagName('progress'));
    native.forEach(function (el) {
      var v = readPercentFromAttributes(el);
      var max = el.getAttribute('max') || 100;
      if (v === null && el.hasAttribute('value')) v = toNumber(el.getAttribute('value'), 0);
      if (v === null) v = 0;
      // falls max looks like percent (0..100) but progress expects absolute, we assume max is absolute
      setNativeProgress(el, v, max);
    });

    // CSS fills: heuristic: .progress__fill, .progress-bar__fill, .bar-fill, [role="progressbar"] inside .progress
    var fills = Array.prototype.slice.call(document.querySelectorAll('.progress__fill, .progress-bar__fill, .bar-fill'));
    // Add role=progressbar targets: but don't double-add elements already in fills
    var roleTargets = Array.prototype.slice.call(document.querySelectorAll('[role="progressbar"]'));
    roleTargets.forEach(function (el) {
      if (fills.indexOf(el) === -1) fills.push(el);
    });

    fills.forEach(function (el) {
      var p = readPercentFromAttributes(el);
      if (p === null) {
        // maybe parent has data-progress
        var parent = el.parentElement;
        if (parent) p = readPercentFromAttributes(parent);
      }
      if (p === null) p = 0;
      setCssProgressFill(el, p);
    });

    // elements that display percent text (e.g. <span class="percent">50%</span>) — keep them consistent
    var percentTexts = Array.prototype.slice.call(document.querySelectorAll('[data-percent-text], .percent, .progress-percent, .progress__text'));
    percentTexts.forEach(function (el) {
      var p = readPercentFromAttributes(el);
      if (p === null) {
        // try numeric content
        var t = el.textContent && el.textContent.trim().match(/(-?\d+(?:\.\d+)?)\s*%?/);
        if (t) p = Number(t[1]);
      }
      if (p === null) return;
      p = clamp(p, 0, 100);
      // replace text with a normalized percentage
      el.textContent = Math.round(p) + '%';
    });
  }

  // Beobachte Änderungen und korrigiere fehlerhafte Updates (z.B. NaN%)
  function observeAndRepair() {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        // target kann ein attribute target sein
        var targets = [];
        if (m.type === 'attributes') targets.push(m.target);
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(function (n) { if (n.nodeType === 1) targets.push(n); });
        }
        targets.forEach(function (el) {
          try {
            // Wenn <progress>
            if (el.tagName && el.tagName.toLowerCase() === 'progress') {
              var v = readPercentFromAttributes(el);
              if (v === null && el.hasAttribute('value')) v = toNumber(el.getAttribute('value'), 0);
              setNativeProgress(el, v || 0, el.getAttribute('max') || 100);
              return;
            }
            // CSS fills
            if (el.classList && (el.classList.contains('progress__fill') || el.classList.contains('progress-bar__fill') || el.classList.contains('bar-fill'))) {
              var p = readPercentFromAttributes(el) || 0;
              setCssProgressFill(el, p);
              return;
            }
            // role=progressbar
            var role = el.getAttribute && el.getAttribute('role');
            if (role === 'progressbar') {
              // try to determine percent
              var p2 = readPercentFromAttributes(el);
              if (p2 != null) setCssProgressFill(el, p2);
            }
          } catch (e) {
            // never throw
          }
        });
      });
    });

    mo.observe(document.documentElement || document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'width', 'value', 'data-progress', 'data-percent', 'aria-valuenow']
    });
  }

  // Initialisierung sicher nach DOM fertig
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      normalizeExisting();
      observeAndRepair();
    });
  } else {
    normalizeExisting();
    observeAndRepair();
  }

  // Export in window für manuelle Nutzung
  window.__progressFix = {
    setNativeProgress: setNativeProgress,
    setCssProgressFill: setCssProgressFill,
    normalizeExisting: normalizeExisting
  };

})();
