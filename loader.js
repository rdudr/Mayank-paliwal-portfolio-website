// Motion-graphics loading screen.
// index.js reports progress (window "mp-progress" events), asks MPLoader.wait() how long to
// hold before closing (so the animation is always seen), and calls MPLoader.exit() when the
// site opens. Sounds are synthesised with WebAudio (no files); browsers only allow audio
// after a tap, so a "Tap for sound" chip appears until then.
(function () {
  const root = document.getElementById("mp-loader");
  if (!root) return;
  const START = performance.now();
  const MIN_SHOW = 2600; // ms — always show the animation at least this long
  const soundAllowed = localStorage.getItem("soundActive") !== "false";

  // name: letter-by-letter rise
  const name = root.querySelector(".mpl-name");
  const text = name.textContent.trim();
  name.textContent = "";
  [...text].forEach(function (ch, i) {
    const s = document.createElement("span");
    if (ch === " ") s.className = "gap";
    else s.textContent = ch;
    s.style.animationDelay = 0.35 + i * 0.045 + "s";
    name.appendChild(s);
  });

  // timeline clips + waveform
  const track = root.querySelector(".mpl-track");
  const COLS = ["#ff923e", "#60a5fa", "#2ec4b6", "#e0698e", "#a393eb", "#f2a93b"];
  const clips = [];
  let x = 0;
  for (let i = 0; i < 8; i++) {
    const w = 9 + ((i * 7) % 6);
    const c = document.createElement("div");
    c.className = "mpl-clip";
    c.style.left = x + "%";
    c.style.width = Math.min(w, 100 - x) - 0.6 + "%";
    c.style.background = COLS[i % COLS.length];
    track.appendChild(c);
    clips.push({ el: c, end: (x + w) / 100 });
    x += w;
    if (x >= 100) break;
  }
  clips[clips.length - 1].el.style.width = 100 - parseFloat(clips[clips.length - 1].el.style.left) + "%";
  clips[clips.length - 1].end = 1;
  const wave = root.querySelector(".mpl-wave");
  const bars = [];
  for (let i = 0; i < 64; i++) {
    const b = document.createElement("b");
    b.style.height = 20 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 80 + "%";
    wave.appendChild(b);
    bars.push(b);
  }
  const head = root.querySelector(".mpl-head");
  const pctEl = root.querySelector(".pct");
  const tcEl = root.querySelector(".tc");

  // ── sound ────────────────────────────────────────────────
  let ctx = null, riser = null, unlocked = false;
  const chip = root.querySelector(".mpl-sound");
  function audio() {
    if (!soundAllowed) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }
  function tick(freq, dur, vol) {
    const a = audio();
    if (!a || a.state !== "running") return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = "triangle";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.05, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + (dur || 0.08));
    o.connect(g).connect(a.destination);
    o.start();
    o.stop(a.currentTime + (dur || 0.08) + 0.02);
  }
  function startRiser() {
    const a = audio();
    if (!a || a.state !== "running" || riser) return;
    const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(70, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, a.currentTime + 3);
    f.type = "lowpass";
    f.frequency.setValueAtTime(300, a.currentTime);
    f.frequency.exponentialRampToValueAtTime(1600, a.currentTime + 3);
    g.gain.setValueAtTime(0.0001, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.035, a.currentTime + 0.6);
    o.connect(f).connect(g).connect(a.destination);
    o.start();
    riser = { o: o, g: g };
  }
  function stopRiser() {
    if (!riser || !ctx) return;
    riser.g.gain.cancelScheduledValues(ctx.currentTime);
    riser.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    riser.o.stop(ctx.currentTime + 0.5);
    riser = null;
  }
  function clack() {
    const a = audio();
    if (!a || a.state !== "running") return;
    // short noise burst = clapperboard snap
    const len = Math.floor(a.sampleRate * 0.12);
    const buf = a.createBuffer(1, len, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 6);
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf;
    f.type = "bandpass";
    f.frequency.value = 2200;
    f.Q.value = 0.8;
    g.gain.value = 0.55;
    src.connect(f).connect(g).connect(a.destination);
    src.start();
    tick(140, 0.25, 0.08); // low thump under it
  }
  function unlock() {
    const a = audio();
    if (!a) return;
    a.resume().then(function () {
      unlocked = true;
      chip && chip.classList.add("is-on");
      if (!done) startRiser();
    });
  }
  if (soundAllowed && chip) {
    chip.addEventListener("click", unlock);
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
  } else if (chip) {
    chip.classList.add("is-on");
  }

  // ── progress (smoothed) ──────────────────────────────────
  let target = 0, shown = 0, done = false, lastClip = -1;
  window.addEventListener("mp-progress", function (e) {
    target = Math.max(target, Math.min(1, e.detail || 0));
  });
  function frame() {
    // ease toward the real progress, but never finish before MIN_SHOW
    const t = performance.now() - START;
    const cap = Math.min(1, t / MIN_SHOW);
    const goal = Math.min(target, Math.max(cap, target < 1 ? 0 : cap));
    shown += (goal - shown) * 0.12;
    if (goal >= 1 && shown > 0.995) shown = 1;
    const p = shown;
    head.style.left = "calc(" + p * 100 + "% - 1px)";
    pctEl.textContent = String(Math.round(p * 100)).padStart(2, "0") + "%";
    const secs = p * 5.0;
    tcEl.textContent = "00:00:" + String(Math.floor(secs)).padStart(2, "0") + ":" + String(Math.floor((secs % 1) * 25)).padStart(2, "0");
    clips.forEach(function (c, i) {
      if (p >= c.end - 0.02 && !c.el.classList.contains("is-in")) {
        c.el.classList.add("is-in");
        if (i > lastClip) (lastClip = i), tick(520 + i * 70, 0.06, 0.04);
      }
    });
    const lit = Math.floor(p * bars.length);
    for (let i = 0; i < lit; i++) bars[i].classList.add("is-in");
    if (!done) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.MPLoader = {
    // seconds index.js should still wait before closing the intro
    wait: function (minSeconds) {
      const left = (MIN_SHOW + 350 - (performance.now() - START)) / 1000;
      return Math.max(minSeconds, left);
    },
    exit: function () {
      if (done) return;
      done = true;
      shown = 1;
      head.style.left = "calc(100% - 1px)";
      pctEl.textContent = "100%";
      clips.forEach((c) => c.el.classList.add("is-in"));
      bars.forEach((b) => b.classList.add("is-in"));
      root.classList.add("is-done"); // clapper snaps shut
      stopRiser();
      clack();
      setTimeout(function () {
        root.classList.add("is-out"); // wipe up to reveal the site
      }, 120);
      setTimeout(function () {
        root.style.display = "none";
      }, 1300);
    },
  };
})();
