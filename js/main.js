/* ============================================================
   PAL SIGNS · interaction layer
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Hero typewriter ---------- */
  const tw = document.querySelector(".tw");
  if (tw && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const words = (tw.dataset.words || "").split("|").filter(Boolean);
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const word = words[wi];
      tw.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(tick, 78 + Math.random() * 60);
      } else if (!deleting && ci === word.length) {
        deleting = true;
        setTimeout(tick, 1600);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(tick, 36);
      } else {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 320);
      }
    };
    setTimeout(tick, 1100);
  } else if (tw) {
    tw.textContent = (tw.dataset.words || "").split("|")[0] || "";
  }

  /* ---------- Nav: scrolled state + mobile menu ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.querySelector(".burger");
  const links = document.querySelector(".nav-links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        burger.classList.remove("open");
      })
    );
  }

  /* ---------- Wordmark ignition ---------- */
  const wm = document.querySelector(".wordmark");
  if (wm && !wm.dataset.split) {
    wm.dataset.split = "1";
    wm.querySelectorAll(".ln").forEach((line) => {
      line.querySelectorAll("span, em").forEach((seg) => {
        const text = seg.textContent;
        seg.textContent = "";
        [...text].forEach((c) => {
          const s = document.createElement("span");
          s.className = "ch";
          s.textContent = c === " " ? " " : c;
          seg.appendChild(s);
        });
      });
    });
    const chars = wm.querySelectorAll(".ch");
    chars.forEach((c, i) => { c.style.animationDelay = 220 + i * 55 + "ms"; });
    requestAnimationFrame(() => wm.classList.add("lit"));
  }

  /* ---------- Scroll reveals ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up stats ---------- */
  const counters = document.querySelectorAll(".cv[data-count]");
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        cio.unobserve(el);
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 1400, start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Living logo — real 3D extrusion + neon loop ---------- */
  const stage = document.querySelector(".letterstage");
  if (stage) {
    const DEPTH = 22, STEP = 1.5;
    const FRONT = "c8c0b0", BACK = "221c14"; // aluminium front edge → deep back

    const hexMix = (a, b, t) => {
      const ca = a.match(/\w\w/g).map((h) => parseInt(h, 16));
      const cb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
      return "#" + ca.map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, "0")).join("");
    };

    const host = stage.querySelector(".ls-letter");
    if (host) {
      // aluminium return: depth layers from the back (darkest) toward the face
      for (let i = DEPTH; i >= 1; i--) {
        const layer = document.createElement("div");
        layer.className = "ls-layer";
        layer.style.transform = `translateZ(${(-i * STEP).toFixed(2)}px)`;
        layer.style.background = hexMix(FRONT, BACK, i / DEPTH);
        host.appendChild(layer);
      }
      // the acrylic face, front and centre (colour driven by the loop)
      const face = document.createElement("div");
      face.className = "ls-layer ls-face";
      host.appendChild(face);
    }

    // tilt the logo toward the cursor — silky and centred (fine pointers only).
    // The pointer sets a target pose; a rAF lerp eases the live pose toward it,
    // so the sign glides instead of snapping. The yaw is symmetric around 0deg,
    // so the logo never carries a resting lean to one side.
    const scene = stage.querySelector(".ls-scene");
    if (scene && window.matchMedia("(pointer:fine)").matches) {
      const REST_RX = 6, REST_RY = 0;     // rest pose: faces you, a hint top-down
      const SWING_Y = 22, SWING_X = 12;   // symmetric travel around the rest pose
      let curX = REST_RX, curY = REST_RY, tgtX = REST_RX, tgtY = REST_RY, raf = 0;

      const frame = () => {
        curX += (tgtX - curX) * 0.1;
        curY += (tgtY - curY) * 0.1;
        const done = Math.abs(tgtX - curX) < 0.02 && Math.abs(tgtY - curY) < 0.02;
        if (done) { curX = tgtX; curY = tgtY; }
        scene.style.setProperty("--rx", curX.toFixed(2) + "deg");
        scene.style.setProperty("--ry", curY.toFixed(2) + "deg");
        raf = done ? 0 : requestAnimationFrame(frame);
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;  // -0.5 … 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        tgtY = px * SWING_Y;                // centred on 0 → no left/right bias
        tgtX = REST_RX - py * SWING_X;
        kick();
      });
      stage.addEventListener("pointerleave", () => {
        tgtX = REST_RX; tgtY = REST_RY;     // glide back to rest, never snap
        kick();
      });
    }

    // run the power-cycle only while the stage is on screen
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle("live", entry.isIntersecting));
    }, { threshold: 0.3 });
    sio.observe(stage);
  }

  /* ---------- Work filter (work page) ---------- */
  const pills = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-cat]");
  if (pills.length && cards.length) {
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        const f = pill.dataset.filter;
        cards.forEach((card) => {
          const show = f === "all" || card.dataset.cat.includes(f);
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  /* ---------- Contact form (opens an email to sales) ---------- */
  const form = document.querySelector("#quote-form");
  if (form) {
    const TO = "sales@palsigns.ca";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      const subject = (form.querySelector("[name=subject]")?.value || "").trim();
      const message = (form.querySelector("[name=message]")?.value || "").trim();
      if (!subject || !message) {
        if (note) note.textContent = "Add a subject and a message, then send.";
        return;
      }
      const href = `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      if (note) note.textContent = "Opening your email app...";
      window.location.href = href;
    });
  }

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
