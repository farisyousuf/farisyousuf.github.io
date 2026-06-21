(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    document.body.classList.add("reveal-ready");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- hero terminal: signed request type-on ---------- */
  var terminal = document.getElementById("terminalBody");
  if (terminal) {
    var lines = [
      { text: "POST /api/v2/transfer", cls: "" },
      { text: "X-Device-Binding: a8f3c1...e91c", cls: "dim" },
      { text: "X-Signature: 4f9b7c2e...verified", cls: "ok" },
      { text: "HMAC-SHA256 — request authenticated \u2713", cls: "dim" }
    ];

    if (reduceMotion) {
      terminal.innerHTML = lines
        .map(function (l) { return '<span class="' + l.cls + '">' + l.text + "</span>"; })
        .join("\n");
    } else {
      typeLines(terminal, lines);
    }
  }

  function typeLines(container, lines) {
    var lineIndex = 0;
    var charIndex = 0;
    container.innerHTML = "";
    var currentSpan = null;

    function step() {
      if (lineIndex >= lines.length) {
        var cursor = document.createElement("span");
        cursor.className = "cursor";
        container.appendChild(cursor);
        return;
      }

      var line = lines[lineIndex];

      if (charIndex === 0) {
        currentSpan = document.createElement("span");
        currentSpan.className = line.cls;
        container.appendChild(currentSpan);
      }

      if (charIndex < line.text.length) {
        currentSpan.textContent += line.text.charAt(charIndex);
        charIndex++;
        setTimeout(step, 14 + Math.random() * 18);
      } else {
        container.appendChild(document.createTextNode("\n"));
        lineIndex++;
        charIndex = 0;
        setTimeout(step, 220);
      }
    }

    setTimeout(step, 500);
  }

  /* ---------- active nav link on scroll ---------- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav a");

  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }
})();
