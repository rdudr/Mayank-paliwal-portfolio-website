// Home-page monitors: live canvas screens that keep "working".
//   edit  — video-editing timeline: playhead sweeps, preview cuts between real clips,
//           timecode runs, audio meters bounce, effect sliders move.
//   draw  — colour page: before/after wipe over a real clip, drifting colour wheels,
//           a live RGB parade, and a render queue that keeps encoding clip after clip.
// index.js calls MPScreens.attach(mesh, kind, CanvasTexture, originalTexture).
(function () {
  const C = {
    bg: "#181a1f", panel: "#24272e", panel2: "#2c3038", line: "#343842", text: "#eef0f4",
    dim: "#969ba8", orange: "#ff923e", blue: "#60a5fa", teal: "#2ec4b6", rose: "#e0698e",
    lav: "#a393eb", mango: "#f2a93b", red: "#ff0033", navy: "#091434",
  };
  const PREVIEWS = [
    "images/projects/daud.jpg", "images/projects/raj-shamani.jpg", "images/projects/beerbiceps.jpg",
    "media/projects/daud/ep02.jpg", "media/projects/daud/ep05.jpg", "media/projects/beerbiceps/DJwtPf2sVbm.jpg",
  ].map(function (src) {
    const im = new Image();
    im.src = src;
    return im;
  });
  const ready = (im) => im.complete && im.naturalWidth > 0;

  function cover(ctx, im, x, y, w, h) {
    if (!ready(im)) {
      ctx.fillStyle = "#000";
      return ctx.fillRect(x, y, w, h);
    }
    const r = w / h, ir = im.naturalWidth / im.naturalHeight;
    let sw = im.naturalWidth, sh = im.naturalHeight, sx = 0, sy = 0;
    if (ir > r) (sw = sh * r), (sx = (im.naturalWidth - sw) / 2);
    else (sh = sw / r), (sy = (im.naturalHeight - sh) / 2);
    ctx.drawImage(im, sx, sy, sw, sh, x, y, w, h);
  }

  function rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const font = (px, w) => (w || 600) + " " + px + "px Poppins, 'Segoe UI', sans-serif";

  // ── edit: timeline ───────────────────────────────────────────
  const CLIPS = (function () {
    const cols = [C.orange, C.blue, C.teal, C.rose, C.lav, C.mango];
    const out = [];
    let x = 0;
    for (let i = 0; i < 24; i++) {
      const w = 40 + ((i * 37) % 50);
      out.push({ x: x, w: w, c: cols[i % cols.length], img: i % PREVIEWS.length });
      x += w + 2;
    }
    return { list: out, length: x };
  })();

  function drawEdit(ctx, W, H, t) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    const s = W / 512;
    ctx.save();
    ctx.scale(s, s);
    const h = H / s;

    // title bar
    ctx.fillStyle = "#121317";
    ctx.fillRect(0, 0, 512, 22);
    ctx.fillStyle = C.orange;
    ctx.font = font(11, 700);
    ctx.fillText("Pr", 10, 15);
    ctx.fillStyle = C.dim;
    ctx.font = font(10, 500);
    ctx.fillText("Mayank_Paliwal.prproj  —  Sequence: FO566_final", 32, 15);
    ctx.fillStyle = C.red;
    ctx.beginPath();
    ctx.arc(498, 11, 4, 0, Math.PI * 2);
    ctx.fill();

    const speed = 38; // timeline px per second
    const head = (t * speed) % CLIPS.length;
    const clip = CLIPS.list.find((c) => head >= c.x && head < c.x + c.w) || CLIPS.list[0];

    // program monitor
    const px = 8, py = 30, pw = 300, ph = 168.75;
    cover(ctx, PREVIEWS[clip.img], px, py, pw, ph);
    // cut flash
    const into = head - clip.x;
    if (into < 3) {
      ctx.fillStyle = "rgba(255,255,255," + (0.35 * (1 - into / 3)) + ")";
      ctx.fillRect(px, py, pw, ph);
    }
    // animated lower third
    const lt = Math.min(1, Math.max(0, (into - 4) / 10));
    if (lt > 0) {
      ctx.save();
      ctx.globalAlpha = lt;
      ctx.fillStyle = C.orange;
      ctx.fillRect(px + 14, py + ph - 46, 4, 30);
      ctx.fillStyle = C.navy;
      ctx.fillRect(px + 18, py + ph - 46, 150 * lt, 17);
      ctx.fillStyle = C.orange;
      ctx.fillRect(px + 18, py + ph - 29, 100 * lt, 13);
      ctx.fillStyle = "#fff";
      ctx.font = font(10, 700);
      ctx.fillText("MAYANK PALIWAL", px + 24, py + ph - 33.5);
      ctx.font = font(8.5, 600);
      ctx.fillText("Video Editor", px + 24, py + ph - 19.5);
      ctx.restore();
    }
    // timecode
    const secs = 732 + t;
    const tc = [Math.floor(secs / 3600), Math.floor(secs / 60) % 60, Math.floor(secs) % 60, Math.floor((secs % 1) * 25)]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
    ctx.fillStyle = "rgba(0,0,0,.65)";
    rrect(ctx, px + pw - 92, py + 6, 86, 18, 4);
    ctx.fill();
    ctx.fillStyle = C.orange;
    ctx.font = font(10, 600);
    ctx.fillText(tc, px + pw - 86, py + 19);

    // effect controls (sliders breathing)
    const ex = 318;
    ctx.fillStyle = C.panel;
    ctx.fillRect(ex, 30, 186, 168.75);
    ctx.fillStyle = C.text;
    ctx.font = font(10, 600);
    ctx.fillText("Effect Controls", ex + 10, 47);
    [["Scale", C.orange, 0.0], ["Opacity", C.blue, 1.3], ["Lumetri", C.teal, 2.1], ["Blur", C.lav, 3.4], ["Warp", C.rose, 4.2]].forEach(function (r, i) {
      const y = 66 + i * 26;
      ctx.fillStyle = C.dim;
      ctx.font = font(9, 500);
      ctx.fillText(r[0], ex + 10, y + 4);
      ctx.fillStyle = C.line;
      ctx.fillRect(ex + 66, y, 108, 4);
      const v = 0.5 + 0.38 * Math.sin(t * 0.9 + r[2]);
      ctx.fillStyle = r[1];
      ctx.fillRect(ex + 66, y, 108 * v, 4);
      ctx.beginPath();
      ctx.arc(ex + 66 + 108 * v, y + 2, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // timeline
    const ty = 206, th = h - ty - 6;
    ctx.fillStyle = C.panel;
    ctx.fillRect(0, ty, 512, th + 6);
    const tracks = ["V2", "V1", "A1", "A2"];
    const rowH = Math.min(24, (th - 18) / 4);
    const x0 = 34, view = 512 - x0 - 8;
    const scroll = Math.max(0, head - view * 0.45);
    // ruler
    ctx.fillStyle = C.dim;
    ctx.font = font(8, 500);
    for (let m = Math.floor(scroll / 40) * 40; m < scroll + view; m += 40) {
      const xx = x0 + m - scroll;
      if (xx < x0) continue;
      ctx.fillRect(xx, ty + 4, 1, 6);
    }
    tracks.forEach(function (name, ti) {
      const y = ty + 14 + ti * (rowH + 3);
      ctx.fillStyle = C.dim;
      ctx.font = font(9, 600);
      ctx.fillText(name, 8, y + rowH / 2 + 3);
      ctx.fillStyle = "#1d2026";
      ctx.fillRect(x0, y, view, rowH);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, y, view, rowH);
      ctx.clip();
      CLIPS.list.forEach(function (c, ci) {
        // stagger tracks a little so the edit looks real
        const off = ti === 0 ? 18 : ti === 2 ? -6 : ti === 3 ? 30 : 0;
        if (ti === 0 && ci % 3) return;
        const xx = x0 + c.x + off - scroll;
        const ww = ti === 0 ? c.w * 0.6 : c.w;
        if (xx > x0 + view || xx + ww < x0) return;
        if (ti < 2) {
          ctx.fillStyle = c.c;
          rrect(ctx, xx, y + 1, ww, rowH - 2, 3);
          ctx.fill();
          if (ti === 1 && ww > 30) {
            cover(ctx, PREVIEWS[c.img], xx + 2, y + 3, Math.min(30, ww - 4), rowH - 6);
          }
        } else {
          ctx.fillStyle = ti === 2 ? "#2e8f80" : "#5560a8";
          rrect(ctx, xx, y + 1, ww, rowH - 2, 3);
          ctx.fill();
          ctx.fillStyle = ti === 2 ? "#a8f0e6" : "#c9cdf7";
          for (let k = 2; k < ww - 2; k += 3) {
            const a = Math.abs(Math.sin((c.x + k) * 0.37) * Math.cos((c.x + k) * 0.11)) * (rowH / 2 - 3) + 1;
            ctx.fillRect(xx + k, y + rowH / 2 - a, 1.5, a * 2);
          }
        }
      });
      ctx.restore();
    });
    // playhead
    const phx = x0 + head - scroll;
    ctx.fillStyle = C.orange;
    ctx.fillRect(phx - 1, ty + 2, 2, th + 2);
    ctx.beginPath();
    ctx.moveTo(phx - 6, ty + 2);
    ctx.lineTo(phx + 6, ty + 2);
    ctx.lineTo(phx, ty + 10);
    ctx.fill();
    ctx.restore();
  }

  // ── grade: colour page + render queue (DaVinci-style) ────────
  // Runs continuously: the grade drifts, a before/after wipe sweeps the viewer,
  // wheels and scopes react, and the render bar keeps filling clip after clip.
  const RENDERS = ["FO566_final.mp4", "Daud_EP06_master.mov", "BB_Bhuvi_reel.mp4", "FO563_teaser.mp4"];

  function wheel(ctx, cx, cy, r, ang, amt, label, tint) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "#3a3d46");
    g.addColorStop(1, "#1d1f25");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    // hue ring
    for (let a = 0; a < 360; a += 10) {
      ctx.strokeStyle = "hsl(" + a + ",70%,55%)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 2, (a * Math.PI) / 180, ((a + 11) * Math.PI) / 180);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();
    // puck
    const px = cx + Math.cos(ang) * r * amt, py = cy + Math.sin(ang) * r * amt;
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = C.dim;
    ctx.font = font(9, 600);
    ctx.fillText(label, cx - ctx.measureText(label).width / 2, cy + r + 15);
  }

  function drawGrade(ctx, W, H, t) {
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    const s = W / 512;
    ctx.save();
    ctx.scale(s, s);
    const h = H / s;

    // title bar + page tabs
    ctx.fillStyle = "#121317";
    ctx.fillRect(0, 0, 512, 22);
    ctx.fillStyle = C.orange;
    ctx.font = font(10, 700);
    ctx.fillText("Colour", 10, 15);
    ctx.fillStyle = C.dim;
    ctx.font = font(10, 500);
    ctx.fillText("Mayank_Paliwal  —  Node 03: Look  ·  Rec.709", 58, 15);
    ["Edit", "Fusion", "Color", "Deliver"].forEach(function (p, i) {
      ctx.fillStyle = i === 2 ? C.orange : C.dim;
      ctx.font = font(9, i === 2 ? 700 : 500);
      ctx.fillText(p, 340 + i * 42, 15);
    });

    // viewer with a before / after wipe
    const clipIdx = Math.floor(t / 9) % PREVIEWS.length;
    const im = PREVIEWS[clipIdx];
    const vx = 8, vy = 30, vw = 300, vh = 168.75;
    const temp = Math.sin(t * 0.5), sat = 1.25 + 0.2 * Math.sin(t * 0.8);
    ctx.save();
    ctx.filter = "saturate(0.25) contrast(0.62) brightness(1.18)"; // flat log look
    cover(ctx, im, vx, vy, vw, vh);
    ctx.restore();
    const wipe = vx + vw * (0.5 + 0.38 * Math.sin(t * 0.7));
    ctx.save();
    ctx.beginPath();
    ctx.rect(wipe, vy, vx + vw - wipe, vh);
    ctx.clip();
    ctx.filter = "saturate(" + (sat + 0.25).toFixed(2) + ") contrast(1.32) brightness(0.94) sepia(" + (0.18 + 0.1 * temp).toFixed(2) + ") hue-rotate(" + (-10 * temp).toFixed(1) + "deg)";
    cover(ctx, im, vx, vy, vw, vh);
    ctx.filter = "none";
    // teal & orange split-tone
    ctx.globalCompositeOperation = "soft-light";
    const tone = ctx.createLinearGradient(0, vy, 0, vy + vh);
    tone.addColorStop(0, "rgba(0,150,170,.55)");
    tone.addColorStop(1, "rgba(255,130,40,.6)");
    ctx.fillStyle = tone;
    ctx.fillRect(wipe, vy, vx + vw - wipe, vh);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
    ctx.fillStyle = "#fff";
    ctx.fillRect(wipe - 1, vy, 2, vh);
    ctx.beginPath();
    ctx.arc(wipe, vy + vh / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.6)";
    ctx.fillRect(vx + 6, vy + 6, 42, 15);
    ctx.fillRect(vx + vw - 44, vy + 6, 38, 15);
    ctx.fillStyle = "#fff";
    ctx.font = font(8.5, 600);
    ctx.fillText("LOG", vx + 16, vy + 17);
    ctx.fillText("GRADE", vx + vw - 40, vy + 17);

    // scopes: RGB parade reacting to the grade
    const sx = 318, sy = 30, sw = 186, sh = 168.75;
    ctx.fillStyle = "#0e0f12";
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = C.dim;
    ctx.font = font(9, 600);
    ctx.fillText("Parade", sx + 8, sy + 14);
    ctx.strokeStyle = "rgba(255,255,255,.08)";
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(sx, sy + 20 + i * ((sh - 26) / 5));
      ctx.lineTo(sx + sw, sy + 20 + i * ((sh - 26) / 5));
      ctx.stroke();
    }
    const cols = ["rgba(255,80,80,.55)", "rgba(80,255,120,.55)", "rgba(90,140,255,.6)"];
    const bias = [0.08 * temp, 0.02, -0.08 * temp];
    for (let c = 0; c < 3; c++) {
      const bx = sx + 8 + c * ((sw - 16) / 3), bw = (sw - 16) / 3 - 6;
      ctx.fillStyle = cols[c];
      for (let x = 0; x < bw; x += 1.5) {
        const base = 0.5 + 0.28 * Math.sin(x * 0.09 + c + t * 0.6) + bias[c];
        for (let k = 0; k < 5; k++) {
          const y = sy + 22 + (1 - Math.min(0.98, Math.max(0.02, base + (k - 2) * 0.06 + Math.sin(x * 0.4 + k) * 0.03))) * (sh - 30);
          ctx.fillRect(bx + x, y, 1.2, 1.2);
        }
      }
    }

    // colour wheels + render queue
    const wy = 206, wh = h - wy - 6;
    ctx.fillStyle = C.panel;
    ctx.fillRect(0, wy, 512, wh + 6);
    const r = Math.min(26, (wh - 34) / 2);
    const cy = wy + 12 + r;
    wheel(ctx, 40, cy, r, t * 0.6 + 3.6, 0.35 + 0.15 * Math.sin(t), "Lift", "#7fb6ff");
    wheel(ctx, 108, cy, r, t * 0.45 + 1.0, 0.25 + 0.12 * Math.sin(t * 1.3), "Gamma", "#9ff5c9");
    wheel(ctx, 176, cy, r, -t * 0.5 + 0.4, 0.4 + 0.15 * Math.sin(t * 0.7), "Gain", "#ffc27a");

    // render queue
    const rx = 222, rw = 282;
    ctx.fillStyle = C.text;
    ctx.font = font(10, 600);
    ctx.fillText("Render Queue", rx, wy + 16);
    const job = Math.floor(t / 12) % RENDERS.length;
    const prog = (t % 12) / 12;
    RENDERS.forEach(function (name, i) {
      const y = wy + 26 + i * 18;
      if (y + 14 > h - 4) return;
      ctx.fillStyle = i === job ? C.panel2 : "#282b32";
      ctx.fillRect(rx, y, rw, 15);
      ctx.fillStyle = i === job ? C.text : C.dim;
      ctx.font = font(8.5, 500);
      ctx.fillText(name, rx + 6, y + 11);
      const bx = rx + 140, bw = rw - 190;
      ctx.fillStyle = "#1b1d22";
      ctx.fillRect(bx, y + 5, bw, 5);
      // earlier jobs in this pass are done, the current one is encoding, later ones wait
      const p = i < job ? 1 : i === job ? prog : 0;
      const label = i < job ? "Done" : i === job ? Math.floor(prog * 100) + "%" : "Queued";
      ctx.fillStyle = label === "Done" ? C.teal : C.orange;
      ctx.fillRect(bx, y + 5, bw * p, 5);
      ctx.fillStyle = label === "Done" ? C.teal : i === job ? C.orange : C.dim;
      ctx.font = font(8.5, 600);
      ctx.fillText(label, bx + bw + 6, y + 11);
    });
    ctx.restore();
  }

  const screens = [];
  let timer = null;

  function tick() {
    const t = performance.now() / 1000;
    screens.forEach(function (sc) {
      sc.draw(sc.ctx, sc.canvas.width, sc.canvas.height, t);
      sc.texture.needsUpdate = true;
    });
  }

  window.MPScreens = {
    attach: function (mesh, kind, CanvasTexture, original) {
      try {
        // Fit the canvas to the part of the texture this plane actually shows (its UV box).
        const uv = mesh.geometry.attributes.uv;
        let u0 = 1, u1 = 0, v0 = 1, v1 = 0;
        for (let i = 0; i < uv.count; i++) {
          const u = uv.getX(i), v = uv.getY(i);
          (u0 = Math.min(u0, u)), (u1 = Math.max(u1, u)), (v0 = Math.min(v0, v)), (v1 = Math.max(v1, v));
        }
        mesh.geometry.computeBoundingBox();
        const b = mesh.geometry.boundingBox, e = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z].sort((a, c) => c - a);
        const aspect = e[0] / (e[1] || e[0]);
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = Math.round(512 / aspect);
        const tex = new CanvasTexture(canvas);
        if (original) {
          tex.flipY = original.flipY;
          tex.encoding = original.encoding;
          tex.anisotropy = original.anisotropy;
        }
        tex.repeat.set(1 / (u1 - u0 || 1), 1 / (v1 - v0 || 1));
        tex.offset.set(-u0 * tex.repeat.x, -v0 * tex.repeat.y);
        mesh.material.map = tex;
        mesh.material.needsUpdate = true;
        screens.push({ canvas: canvas, ctx: canvas.getContext("2d"), texture: tex, draw: kind === "edit" ? drawEdit : drawGrade });
        tick();
        if (!timer) timer = setInterval(tick, 66);
        return tex;
      } catch (err) {
        return null;
      }
    },
  };
})();
