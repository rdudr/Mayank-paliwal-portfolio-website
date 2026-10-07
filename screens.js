// Home-page monitors: two simple live screens that keep "working".
//   edit  — an illustrated scene plays big; the playhead runs across a slim timeline.
//   draw  — the same illustration gets graded by a sweeping wipe while one render bar fills.
//   Both loop every 12 s: at the end the screen blurs out, then the work restarts.
// index.js calls MPScreens.attach(mesh, kind, CanvasTexture, originalTexture).
(function () {
  const C = {
    bg: "#181a1f", panel: "#24272e", panel2: "#2c3038", line: "#343842", text: "#eef0f4",
    dim: "#969ba8", orange: "#ff923e", blue: "#60a5fa", teal: "#2ec4b6", rose: "#e0698e",
    lav: "#a393eb", mango: "#f2a93b", red: "#ff0033", navy: "#091434",
  };
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

  // Flat illustrated scene (no photos): sky, sun, drifting clouds, layered hills,
  // a lake, and a tiny filmmaker with a camera on a tripod.
  function scene(ctx, x, y, w, h, t) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, "#3aa6c9");
    sky.addColorStop(0.65, "#ffd0a1");
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h);
    // sun
    ctx.fillStyle = "#ffb347";
    ctx.beginPath();
    ctx.arc(x + w * 0.72, y + h * 0.38, h * 0.13, 0, Math.PI * 2);
    ctx.fill();
    // clouds drift
    ctx.fillStyle = "rgba(255,255,255,.85)";
    [[0.1, 0.18, 1], [0.55, 0.12, 0.8], [0.85, 0.24, 0.7]].forEach(function (c) {
      const cx = x + (((c[0] * w + t * 10 * c[2]) % (w + 80)) - 40), cy = y + c[1] * h, r = h * 0.05 * c[2] + 6;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.arc(cx + r, cy - r * 0.4, r * 1.1, 0, Math.PI * 2);
      ctx.arc(cx + r * 2.1, cy, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });
    // hills (back → front)
    const hill = function (base, amp, freq, col) {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      for (let i = 0; i <= 40; i++) {
        const px = x + (i / 40) * w;
        ctx.lineTo(px, y + h * base - Math.sin(i * freq) * h * amp - Math.sin(i * freq * 2.3) * h * amp * 0.4);
      }
      ctx.lineTo(x + w, y + h);
      ctx.fill();
    };
    hill(0.62, 0.1, 0.35, "#5b6fb3");
    hill(0.7, 0.07, 0.5, "#3d4f8f");
    // lake
    ctx.fillStyle = "#4fb0c6";
    ctx.fillRect(x, y + h * 0.74, w, h * 0.08);
    ctx.fillStyle = "rgba(255,255,255,.35)";
    for (let i = 0; i < 6; i++) ctx.fillRect(x + w * (0.1 + i * 0.15) + Math.sin(t + i) * 4, y + h * 0.77, w * 0.05, 2);
    // ground
    ctx.fillStyle = "#2e8f6a";
    ctx.fillRect(x, y + h * 0.82, w, h * 0.18);
    // filmmaker + tripod camera
    const gx = x + w * 0.28, gy = y + h * 0.84, u = h * 0.012;
    ctx.fillStyle = "#091434";
    ctx.beginPath(); // tripod legs
    ctx.moveTo(gx + 26 * u, gy - 20 * u);
    ctx.lineTo(gx + 18 * u, gy + 6 * u);
    ctx.lineTo(gx + 20 * u, gy + 6 * u);
    ctx.lineTo(gx + 27 * u, gy - 18 * u);
    ctx.lineTo(gx + 34 * u, gy + 6 * u);
    ctx.lineTo(gx + 36 * u, gy + 6 * u);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#ff923e"; // camera body
    ctx.fillRect(gx + 18 * u, gy - 30 * u, 18 * u, 11 * u);
    ctx.fillStyle = "#091434";
    ctx.fillRect(gx + 36 * u, gy - 27 * u, 6 * u, 5 * u);
    ctx.fillStyle = "#f3c9a0"; // person
    ctx.beginPath();
    ctx.arc(gx + 6 * u, gy - 38 * u, 5 * u, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2a2a33";
    ctx.fillRect(gx + 1 * u, gy - 33 * u, 10 * u, 18 * u);
    ctx.fillStyle = "#1d2233";
    ctx.fillRect(gx + 1 * u, gy - 15 * u, 4 * u, 20 * u);
    ctx.fillRect(gx + 7 * u, gy - 15 * u, 4 * u, 20 * u);
    ctx.strokeStyle = "#2a2a33"; // arm to camera
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    ctx.moveTo(gx + 10 * u, gy - 30 * u);
    ctx.lineTo(gx + 19 * u, gy - 26 * u);
    ctx.stroke();
    ctx.restore();
  }

  // One scene for the whole loop. Each loop: the work runs start → finish,
  // the screen blurs out for the last moment, then it restarts.
  const LOOP = 12;
  const phase = (t) => (t % LOOP) / LOOP;
  const blurAt = (k) => (k > 0.9 ? (k - 0.9) / 0.1 : 0); // 0 → 1 over the last 10%

  let blurCss = ""; // appended to any filter a screen sets, so the end blur covers everything

  function withEndBlur(ctx, k, draw) {
    const b = blurAt(k);
    blurCss = b > 0 ? " blur(" + (b * 10).toFixed(1) + "px)" : "";
    ctx.save();
    ctx.filter = blurCss || "none";
    draw();
    ctx.restore();
    if (b > 0) {
      ctx.fillStyle = "rgba(24,26,31," + (b * 0.6).toFixed(2) + ")";
      ctx.fillRect(0, 0, 512, 1000);
    }
  }

  // ── edit: big preview + slim timeline, playhead runs the length of the edit ──
  const CLIPS = (function () {
    const cols = [C.orange, C.blue, C.teal, C.rose, C.lav];
    const out = [];
    let x = 0;
    for (let i = 0; i < 6; i++) {
      const w = 62 + ((i * 41) % 40);
      out.push({ x: x, w: w, c: cols[i % cols.length] });
      x += w + 3;
    }
    const scale = 488 / x;
    out.forEach((c) => ((c.x *= scale), (c.w *= scale)));
    return out;
  })();

  function drawEdit(ctx, W, H, t) {
    const s = W / 512;
    ctx.save();
    ctx.scale(s, s);
    const h = H / s, k = phase(t);
    const tlH = 74, ty = h - tlH;
    withEndBlur(ctx, k, function () {
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, 512, h);
      scene(ctx, 0, 0, 512, ty, t);
      ctx.fillStyle = C.panel;
      ctx.fillRect(0, ty, 512, tlH);
      CLIPS.forEach(function (c) {
        const x = 12 + c.x;
        ctx.fillStyle = c.c;
        rrect(ctx, x, ty + 12, c.w, 22, 4);
        ctx.fill();
        ctx.fillStyle = "#2e8f80";
        rrect(ctx, x, ty + 42, c.w, 22, 4);
        ctx.fill();
        ctx.fillStyle = "#a8f0e6";
        for (let q = 3; q < c.w - 3; q += 4) {
          const a = Math.abs(Math.sin((c.x + q) * 0.37)) * 8 + 1;
          ctx.fillRect(x + q, ty + 53 - a, 2, a * 2);
        }
      });
      const px = 12 + 488 * Math.min(1, k / 0.9);
      ctx.fillStyle = C.orange;
      ctx.fillRect(px - 1.5, ty + 2, 3, tlH - 4);
    });
    ctx.restore();
  }

  // ── grade: before / after wipe across the photo + one render bar ──
  function drawGrade(ctx, W, H, t) {
    const s = W / 512;
    ctx.save();
    ctx.scale(s, s);
    const h = H / s, k = phase(t), p = Math.min(1, k / 0.9);
    const barH = 46, vh = h - barH;
    withEndBlur(ctx, k, function () {
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, 512, h);
      // graded on the left of the wipe, flat log footage still to the right
      ctx.save();
      ctx.filter = "saturate(0.25) contrast(0.62) brightness(1.18)" + blurCss;
      scene(ctx, 0, 0, 512, vh, t);
      ctx.restore();
      const wipe = 512 * p;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, wipe, vh);
      ctx.clip();
      ctx.filter = "saturate(1.6) contrast(1.3) brightness(0.95) sepia(0.2)" + blurCss;
      scene(ctx, 0, 0, 512, vh, t);
      ctx.filter = blurCss || "none";
      ctx.globalCompositeOperation = "soft-light";
      const tone = ctx.createLinearGradient(0, 0, 0, vh);
      tone.addColorStop(0, "rgba(0,150,170,.55)");
      tone.addColorStop(1, "rgba(255,130,40,.6)");
      ctx.fillStyle = tone;
      ctx.fillRect(0, 0, wipe, vh);
      ctx.restore();
      if (p < 1) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(wipe - 1.5, 0, 3, vh);
      }
      ctx.fillStyle = C.panel;
      ctx.fillRect(0, vh, 512, barH);
      ctx.fillStyle = C.text;
      ctx.font = font(14, 600);
      ctx.fillText(p < 1 ? "Rendering  " + Math.floor(p * 100) + "%" : "Render complete", 16, vh + 20);
      ctx.fillStyle = "#1b1d22";
      rrect(ctx, 16, vh + 28, 480, 8, 4);
      ctx.fill();
      ctx.fillStyle = p < 1 ? C.orange : C.teal;
      rrect(ctx, 16, vh + 28, Math.max(8, 480 * p), 8, 4);
      ctx.fill();
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
