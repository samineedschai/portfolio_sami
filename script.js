/* ============================================================
   script.js — Portfolio of Md Samiul Hauque Chowdhury
   ============================================================
   TABLE OF CONTENTS
   1.  Custom Cursor
   2.  Particle Background Canvas
   3.  Typed Text (Hero)          ← Edit words array here
   4.  Scroll Reveal
   5.  Skill Bars + Histogram     ← Edit histogram heights here
   6.  Project Card Canvas
   7.  Gallery Lightbox
   8.  Mobile Nav Toggle
   9.  Active Nav Highlight on Scroll
   ============================================================ */

(function () {
  "use strict";

  /* ===========================================================
     1. CUSTOM CURSOR
     Dot follows mouse instantly.
     Ring trails behind with smooth lerp.
  =========================================================== */
  var cur  = document.getElementById("cursor");
  var ring = document.getElementById("cursor-trail");
  var mx = -100, my = -100;   /* current mouse position      */
  var rx = -100, ry = -100;   /* smoothed ring position      */
  var cursorVisible = false;

  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = (mx - 5)  + "px";
    cur.style.top  = (my - 5)  + "px";
    if (!cursorVisible) {
      cursorVisible = true;
      cur.style.opacity  = "1";
      ring.style.opacity = "1";
    }
  });

  document.addEventListener("mouseleave", function () {
    cur.style.opacity  = "0";
    ring.style.opacity = "0";
    cursorVisible = false;
  });

  document.addEventListener("mouseenter", function () {
    if (cursorVisible) {
      cur.style.opacity  = "1";
      ring.style.opacity = "1";
    }
  });

  /* Grow cursor on interactive elements */
  var hoverTargets = document.querySelectorAll(
    "a, button, .project-card, .stat-card, .contact-link-card, .gallery-item"
  );
  hoverTargets.forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      cur.style.width      = "20px";
      cur.style.height     = "20px";
      cur.style.marginLeft = "-5px";
      cur.style.marginTop  = "-5px";
      ring.style.transform = "scale(1.5)";
    });
    el.addEventListener("mouseleave", function () {
      cur.style.width      = "10px";
      cur.style.height     = "10px";
      cur.style.marginLeft = "0";
      cur.style.marginTop  = "0";
      ring.style.transform = "scale(1)";
    });
  });

  /* Smooth trailing ring via requestAnimationFrame */
  function tickRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = (rx - 16) + "px";
    ring.style.top  = (ry - 16) + "px";
    requestAnimationFrame(tickRing);
  }
  tickRing();


  /* ===========================================================
     2. PARTICLE BACKGROUND CANVAS
     Draws animated dot-and-line network in the background.
  =========================================================== */
  var bgCanvas = document.getElementById("bg-canvas");
  var bctx     = bgCanvas.getContext("2d");
  var bW, bH;

  function resizeBg() {
    bW = bgCanvas.width  = window.innerWidth;
    bH = bgCanvas.height = window.innerHeight;
  }
  resizeBg();
  window.addEventListener("resize", resizeBg);

  /* Build particle array */
  var PTS = [];
  for (var i = 0; i < 80; i++) {
    PTS.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.4 + 0.4,
      o:  Math.random() * 0.45 + 0.1
    });
  }

  function drawBg() {
    bctx.clearRect(0, 0, bW, bH);

    /* Move and draw dots */
    for (var pi = 0; pi < PTS.length; pi++) {
      var p = PTS[pi];
      p.x += p.vx;  p.y += p.vy;
      if (p.x < 0)  p.x = bW;
      if (p.x > bW) p.x = 0;
      if (p.y < 0)  p.y = bH;
      if (p.y > bH) p.y = 0;
      bctx.beginPath();
      bctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bctx.fillStyle = "rgba(0,229,255," + p.o + ")";
      bctx.fill();
    }

    /* Draw connecting lines between nearby dots */
    for (var ii = 0; ii < PTS.length; ii++) {
      for (var jj = ii + 1; jj < PTS.length; jj++) {
        var d = Math.hypot(PTS[ii].x - PTS[jj].x, PTS[ii].y - PTS[jj].y);
        if (d < 130) {
          bctx.beginPath();
          bctx.moveTo(PTS[ii].x, PTS[ii].y);
          bctx.lineTo(PTS[jj].x, PTS[jj].y);
          bctx.strokeStyle = "rgba(0,229,255," + (0.07 * (1 - d / 130)) + ")";
          bctx.lineWidth   = 0.5;
          bctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawBg);
  }
  drawBg();


  /* ===========================================================
     3. TYPED TEXT (HERO)
     ← Edit the WORDS array below to change the cycling phrases
  =========================================================== */
  var WORDS    = [
    "actionable insights.",
    "predictive models.",
    "intelligent systems.",
    "data-driven stories."
  ];
  var wi       = 0;
  var ci       = 0;
  var deleting = false;
  var tel      = document.getElementById("typed");

  function doType() {
    var w = WORDS[wi];
    if (!deleting) {
      ci++;
      tel.textContent = w.slice(0, ci);
      if (ci === w.length) {
        deleting = true;
        setTimeout(doType, 1800);
        return;
      }
    } else {
      ci--;
      tel.textContent = w.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % WORDS.length;
      }
    }
    setTimeout(doType, deleting ? 48 : 82);
  }
  doType();


  /* ===========================================================
     4. SCROLL REVEAL
     Any element with class="reveal" fades in when it enters
     the viewport. Timeline items use the same logic.
  =========================================================== */
  var revEls = document.querySelectorAll(".reveal, .timeline-item");
  var ro     = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.08 });

  revEls.forEach(function (el) { ro.observe(el); });


  /* ===========================================================
     5. SKILL BARS + HISTOGRAM
     Bars animate in when the #skills section scrolls into view.
     ← Edit histogram heights array below (values 0–100)
  =========================================================== */
  var skillsDone = false;
  var skillSec   = document.getElementById("skills");

  /* ← EDIT: Change these numbers (0–100) to set histogram bar heights */
  var HISTOGRAM_HEIGHTS = [40, 55, 72, 88, 92, 85, 78, 65, 50, 38, 60, 80];

  var so = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !skillsDone) {
        skillsDone = true;

        /* Animate each skill bar with a staggered delay */
        var fills = document.querySelectorAll(".skill-bar-fill");
        fills.forEach(function (f, idx) {
          setTimeout(function () {
            f.style.width = f.dataset.pct + "%";
          }, idx * 90);
        });

        /* Build and animate histogram columns */
        var histEl = document.getElementById("hist-bars");
        if (histEl) {
          HISTOGRAM_HEIGHTS.forEach(function (h, idx) {
            var b       = document.createElement("div");
            b.className = "h-bar";
            histEl.appendChild(b);
            setTimeout(function () { b.style.height = h + "%"; }, 350 + idx * 75);
          });
        }
      }
    });
  }, { threshold: 0.15 });

  if (skillSec) so.observe(skillSec);


  /* ===========================================================
     6. PROJECT CARD CANVAS
     Draws a live animated network graph in each project card
     image area that has a <canvas class="proj-canvas">.
     ← Replace the canvas with a real <img> for actual screenshots
  =========================================================== */
  var canvases = document.querySelectorAll(".proj-canvas");
  canvases.forEach(function (cv) {
    var col  = cv.dataset.color || "#00e5ff";
    var ctx2 = cv.getContext("2d");
    var par  = cv.parentElement;
    var cW   = par.offsetWidth || 320;
    var cH   = 180;
    cv.width  = cW;
    cv.height = cH;

    var nodes = [];
    for (var n = 0; n < 7; n++) {
      nodes.push({
        x:  Math.random() * cW,
        y:  Math.random() * cH,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8
      });
    }

    function drawCard() {
      ctx2.clearRect(0, 0, cW, cH);
      nodes.forEach(function (p) {
        p.x += p.vx;  p.y += p.vy;
        if (p.x < 0 || p.x > cW) p.vx *= -1;
        if (p.y < 0 || p.y > cH) p.vy *= -1;
      });
      for (var a = 0; a < nodes.length; a++) {
        for (var b2 = a + 1; b2 < nodes.length; b2++) {
          var dist = Math.hypot(nodes[a].x - nodes[b2].x, nodes[a].y - nodes[b2].y);
          if (dist < 190) {
            var al = Math.floor((1 - dist / 190) * 100).toString(16).padStart(2, "0");
            ctx2.beginPath();
            ctx2.moveTo(nodes[a].x, nodes[a].y);
            ctx2.lineTo(nodes[b2].x, nodes[b2].y);
            ctx2.strokeStyle = col + al;
            ctx2.lineWidth   = 1;
            ctx2.stroke();
          }
        }
        ctx2.beginPath();
        ctx2.arc(nodes[a].x, nodes[a].y, 2.5, 0, Math.PI * 2);
        ctx2.fillStyle = col;
        ctx2.fill();
      }
      requestAnimationFrame(drawCard);
    }
    drawCard();
  });


  /* ===========================================================
     7. GALLERY LIGHTBOX
     Clicking any .gallery-item image opens it fullscreen.
     Click the close button or press Escape to dismiss.
  =========================================================== */
  var lightbox      = document.getElementById("lightbox");
  var lightboxImg   = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");

  if (lightbox && lightboxImg) {
    /* Open on image click */
    document.querySelectorAll(".gallery-item img").forEach(function (img) {
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    /* Close on button click */
    if (lightboxClose) {
      lightboxClose.addEventListener("click", closeLightbox);
    }

    /* Close on backdrop click */
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    /* Close on Escape key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
  }


  /* ===========================================================
     8. MOBILE NAV TOGGLE
     The hamburger button shows/hides the nav links on small screens.
  =========================================================== */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks  = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });

    /* Close menu when a link is clicked */
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }


  /* ===========================================================
     9. ACTIVE NAV HIGHLIGHT ON SCROLL
     Highlights the correct nav link as you scroll through sections.
  =========================================================== */
  var navSecs     = document.querySelectorAll("section[id]");
  var navLinkEls  = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", function () {
    var current = "";
    navSecs.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    navLinkEls.forEach(function (a) {
      a.classList.remove("active");
      if (a.getAttribute("href") === "#" + current) {
        a.classList.add("active");
      }
    });
  }, { passive: true });

})();
