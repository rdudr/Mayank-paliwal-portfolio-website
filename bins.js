// Page 3 — "The bins": Premiere's Project panel, ported from the Mayank Paliwal site
// (src/components/Bins.tsx + ProjectModal.tsx + content/site.ts). Plain JS, no build step.
(function () {
  const CLIENTS = {
    "raj-shamani": { label: "Raj Shamani", bin: "RAJ_SHAMANI", color: "#f2a93b" },
    beerbiceps: { label: "BeerBiceps", bin: "BEERBICEPS", color: "#e0698e" },
    daud: { label: "Daud Short Film", bin: "DAUD_SHORT_FILM", color: "#2ec4b6" },
  };
  const BINS = ["daud", "raj-shamani", "beerbiceps"];
  const FAN_MAX = 7;

  const rs = (id, episode, title) => ({ id, client: "raj-shamani", episode, title, role: "Editor", link: "https://youtu.be/" + id });
  const daud = (n, title) => {
    const id = "ep" + String(n).padStart(2, "0");
    return { id, client: "daud", episode: "EP " + String(n).padStart(2, "0"), title, role: "Actor & Video Editor", video: "media/projects/daud/" + id + ".mp4", link: "https://www.instagram.com/arpitjainn__/" };
  };

  const PROJECTS = [
    rs("pbLFmU1p-7A", "FO566", "How Much Does It Cost To Own A Private Jet? Business Explained — Abhinav Tripathi"),
    rs("WnYgRL456ps", "FO563", "How To Break Anyone & Make Them Reveal Their Secrets — Evy Poumpouras"),
    rs("46P1rL0rzPE", "FO561", "Smriti Mandhana on Controlling Emotions, Handling Pressure & Failures"),
    rs("GKn7ywUpB6c", "FO555", "Why Is Watchmaking So Difficult? The Business Behind Luxury — Gaurav Mehta"),
    rs("JWPrgCbUwC8", "FO553", "Sanjiv Goenka On Billionaires, The Next Big Opportunities & Building Wealth"),
    rs("9CADz6sP40I", "FO551", "The Most Expensive Cars Compete on Emotion, Not Engineering — Frank Walliser"),
    rs("zN_lhtJFsgg", "FO550", "How Osama Bin Laden Built a Terror Network & 9/11 — Aimen Dean"),
    rs("YMTJw1G3yOM", "FO549", "Habits That Make People Dislike You! The 4 Boxes You're Put In — Mark Bowden"),
    rs("h-0u0ui8ESQ", "FO548", "9 Titles in One Year: How Anahat Singh Became World Champion at 18"),
    rs("ywd-Ve8a8Tc", "FO547", "World Order Is a Lie: The Next 50 Years Will Change Everything — Prof. Jiang"),
    rs("zSkxqtTbEGU", "FO545", "Why America Is No Longer the World’s Leader — Ian Bremmer"),
    rs("PXMyK7JxGOk", "FO537", "Billion-Dollar Founder: Why Success in India Is So Hard — Kiran Mazumdar-Shaw"),
    rs("a3UVcK612iU", "FO536", "Astronaut Shubhanshu Shukla On Space, ISS, Zero Gravity & Human Body"),
    rs("o-h3STaeFro", "FO529", "Why Banks Are Dying: Bitcoin, Crypto & De-dollarisation — Richard Teng"),
    rs("0TBjnUfulGw", "FO527", "Inside India’s Supreme Court: Money, Justice & Free Speech — DY Chandrachud"),
    rs("NGV5S9j_oL4", "FO523", "Russian Spy: Mind Control, Seduction & Manipulation — Aliia Roza"),
    rs("qt2XslRMOto", "FO521", "Nobel Laureate Explains India’s Economy, Poverty, GDP & AI — Abhijit Banerjee"),
    rs("lacFcgcHx6I", "FO518", "Top Brain Scientist: Billionaire Brain, Anxiety & Addictions — Vidita Vaidya"),
    rs("sGpc8-f2e8U", "FO517", "Imtiaz Ali on Love, Heartbreak, Rockstar, Tamasha & Bollywood Filmmaking"),
    rs("sdMHVIcPGwg", "FO516", "Liquor License, Alcohol Tax & Liquor Business Secrets in India — Mokksh Sani"),
    rs("kKNoBH0iE1k", "FO514", "How To Grow Your Salary To ₹1 Crore Using AI — Vaibhav Sisinty"),
    rs("JCOb1w_LTOg", "FO512", "Champion Mindset: High Performance, Discipline & Obsession"),
    rs("3otrmTL24OA", "FO507", "Kiara Advani on Marriage, Motherhood, Relationships & Bollywood"),
    rs("23dbj3silMU", "FO504", "Lakshya Sen on Champion Mindset, Olympic Heartbreak & Comebacks"),
    rs("CdsneNlNpXw", "FO502", "The Hidden Danger in Rice and Wheat: Focus Issues, Iron Loss & Anemia"),
    rs("rb9536WrfDA", "FO501", "Indian Diet Problem: Low Protein, High Calories & Muscle Loss — Prashant Desai"),
    rs("x5lkswNc1Wc", "FO492", "Janhvi Kapoor on Addictions, Bollywood, Childhood, Parents & Relationships"),
    rs("9QXCkMTbrSk", "FO473", "President of France on Trump, India, Modi, Tech & Future — Emmanuel Macron"),
    rs("1Iz-wq5W4WE", "FO466", "Ashish Chanchlani on Career, Comeback, Loneliness, Trolls & Ekaki"),
    rs("_ObNMjRq_WM", "FO446", "Why Women Rule Sex Toys: G-Spot, VR Dolls, Men vs Women & Sales — Raj Armani"),
    rs("x3qyh9XpqAk", "FO445", "Gut Health & Sex Connection: Anxiety, Sex Life & Health Risk — Anant Agarwal"),
    { id: "rs-smuggling", client: "raj-shamani", episode: "REEL", title: "Why Smuggling Happens — Utkarsh Dave", role: "Editor", link: "https://www.instagram.com/reel/DP53WW8Er2r/" },
    { id: "bb-varun", client: "beerbiceps", episode: "TRAILER", title: "Varun Dhawan on The Ranveer Show", role: "Editor", video: "media/projects/beerbiceps/bb-varun.mp4" },
    { id: "bb-bhuvi", client: "beerbiceps", episode: "REEL", title: "Bhuvneshwar Kumar on His Crazy Cricket Debut", role: "Editor", link: "https://www.instagram.com/reel/DXqrk1BDLHF/" },
    { id: "DO8Utz4jD5k", client: "beerbiceps", episode: "REEL", title: "Power of Mahavidya Sadhana — Maa Gyaan Suveera", role: "Editor", link: "https://www.instagram.com/reel/DO8Utz4jD5k/" },
    { id: "DJwtPf2sVbm", client: "beerbiceps", episode: "REEL", title: "Kavya Karnatac Talks About Life in Meghalaya", role: "Editor", link: "https://www.instagram.com/reel/DJwtPf2sVbm/" },
    { id: "DJwtvHos9Mt", client: "beerbiceps", episode: "REEL", title: "Kavya Karnatac Talks About the Reality of Jharkhand", role: "Editor", link: "https://www.instagram.com/reel/DJwtvHos9Mt/" },
    { id: "DJEA7Dlvt3y", client: "beerbiceps", episode: "REEL", title: "Prathamesh Sinha Talks About the Mahabharata", role: "Editor", link: "https://www.instagram.com/reel/DJEA7Dlvt3y/" },
    { id: "DJEAck4PIAk", client: "beerbiceps", episode: "REEL", title: "The Best Feeling Ever", role: "Editor", link: "https://www.instagram.com/reel/DJEAck4PIAk/" },
    { id: "DIb5QDwSw-n", client: "beerbiceps", episode: "REEL", title: "Bhuvi Talks About Lionel Messi", role: "Editor", link: "https://www.instagram.com/reel/DIb5QDwSw-n/" },
    daud(1, "Sach ka Samna"),
    daud(2, "Shadyantra"),
    daud(3, "Duvidha"),
    daud(4, "Grahon Ka Khel"),
    daud(5, "Khulasa"),
    daud(6, "Finally Actress Mil Gayi"),
  ].filter(function (p, i, all) {
    // Same video added twice (e.g. a link pasted with a different ?si= / ?stkn= tracker) shows once.
    const key = (q) => (q.link && (q.link.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/) || q.link.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/) || [])[1]) || q.video || q.id;
    return all.findIndex((q) => key(q) === key(p)) === i;
  }).map(function (p) {
    const yt = p.link && (p.link.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/) || [])[1];
    const ig = p.link && !p.video && (p.link.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/) || [])[1];
    return Object.assign({}, p, {
      yt: yt,
      ig: ig,
      meta: CLIENTS[p.client],
      thumb: yt ? "https://i.ytimg.com/vi/" + yt + "/maxresdefault.jpg" : "media/projects/" + p.client + "/" + p.id + ".jpg?v=2",
    });
  });

  // Clips that open a bin's fan first, in this order (by episode); the rest follow.
  const FEATURED = {
    "raj-shamani": ["FO523", "FO507", "FO561", "FO551", "FO527", "FO517", "FO537"],
  };
  const byClient = (c) => {
    const all = PROJECTS.filter((p) => p.client === c);
    const real = all.filter((p) => !p.placeholder);
    const list = real.length ? real : all;
    const order = FEATURED[c] || [];
    const rank = (p) => (order.indexOf(p.episode) < 0 ? order.length : order.indexOf(p.episode));
    return list.map((p, i) => [p, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0]);
  };
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  // YouTube's maxres thumbnail doesn't exist for every video — fall back to hq.
  const thumbFallback = "this.onerror=null;this.src=this.src.replace('maxresdefault','hqdefault')";
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';

  const root = document.getElementById("bins");
  if (!root) return;
  let active = "raj-shamani";
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function folder(color) {
    return (
      '<svg viewBox="0 0 120 90" aria-hidden="true">' +
      '<path d="M6 14a6 6 0 0 1 6-6h30l8 9h58a6 6 0 0 1 6 6v5H6z" fill="' + color + '" opacity=".85"/>' +
      '<path class="bins-folder-front" d="M6 26h108v52a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill="#fff" stroke="' + color + '" stroke-opacity=".55" stroke-width="2"/>' +
      "</svg>"
    );
  }

  root.innerHTML =
    '<div class="bins-bar"><span>Project: Mayank_Paliwal.prproj</span><span>' + BINS.reduce((n, c) => n + byClient(c).length, 0) + " items</span></div>" +
    '<div class="bins-tabs" role="tablist" aria-label="Client bins">' +
    BINS.map(function (c) {
      const m = CLIENTS[c];
      return (
        '<button class="bins-tab" role="tab" data-client="' + c + '" aria-controls="bins-panel">' +
        '<span class="bins-folder">' + folder(m.color) + "</span>" +
        '<span class="bins-tab-name">' + m.bin + "</span>" +
        '<span class="bins-tab-count">' + byClient(c).length + " items</span>" +
        "</button>"
      );
    }).join("") +
    "</div>" +
    '<div id="bins-panel" role="tabpanel"><div class="bins-fan"></div><ul class="bins-list"></ul></div>';

  const fan = root.querySelector(".bins-fan");
  const list = root.querySelector(".bins-list");
  const tabs = Array.from(root.querySelectorAll(".bins-tab"));

  function layoutFan() {
    const cards = Array.from(fan.children);
    const n = cards.length;
    const w = fan.clientWidth || 800;
    const cardW = Math.min(270, Math.max(118, w * (n > 3 ? 0.24 : 0.3)));
    const mid = (n - 1) / 2;
    const stepX = n > 1 ? Math.min(cardW * 0.78, (w - cardW * 1.3 - 24) / (n - 1)) : 0;
    const stepR = Math.min(7, 36 / Math.max(n, 1));
    fan.style.height = cardW * 0.5625 + 150 + "px";
    cards.forEach(function (card, i) {
      const d = i - mid;
      card.style.width = cardW + "px";
      card.style.marginLeft = -cardW / 2 + "px";
      card.style.marginTop = -(cardW * 0.5625) / 2 + "px";
      card.style.zIndex = 10 + i;
      card.style.setProperty("--x", d * stepX + "px");
      card.style.setProperty("--y", Math.abs(d) * 8 + "px");
      card.style.setProperty("--r", d * stepR + "deg");
    });
  }

  function render() {
    tabs.forEach(function (t) {
      const on = t.dataset.client === active;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    const items = byClient(active);
    const color = CLIENTS[active].color;

    fan.innerHTML = items
      .slice(0, FAN_MAX)
      .map(function (p, i) {
        return (
          '<button class="bins-card" data-id="' + p.id + '" aria-label="Open ' + esc(p.title) + '" style="transition-delay:' + i * 35 + 'ms">' +
          '<span class="bins-card-frame" style="border-color:' + color + '"><img src="' + p.thumb + '" alt="" loading="lazy" onerror="' + thumbFallback + '"></span>' +
          '<span class="bins-card-label">' + esc(p.episode || p.id.toUpperCase()) + "</span>" +
          "</button>"
        );
      })
      .join("");
    layoutFan();
    // Deal the cards out on the next frame so the transition runs.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        fan.classList.add("is-dealt");
      });
    });

    list.innerHTML = items
      .map(function (p) {
        return (
          '<li><button class="bins-row" data-id="' + p.id + '">' +
          '<span class="bins-row-thumb"><img src="' + p.thumb + '" alt="" loading="lazy" onerror="' + thumbFallback + '"><span class="bins-row-play">' + PLAY + "</span></span>" +
          '<span class="bins-row-text"><span class="bins-row-ep"><i style="background:' + p.meta.color + '"></i>' + esc(p.episode || p.meta.bin + "_" + p.id.toUpperCase()) + "</span>" +
          '<span class="bins-row-title">' + esc(p.title) + "</span></span>" +
          "</button></li>"
        );
      })
      .join("");

    // The page got taller/shorter: let the 3D scroll re-measure so the camera stays in sync.
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }

  function pick(c) {
    if (c === active) return;
    active = c;
    fan.classList.remove("is-dealt");
    render();
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      pick(t.dataset.client);
    });
    if (finePointer)
      t.addEventListener("pointerenter", function () {
        pick(t.dataset.client);
      });
  });
  root.addEventListener("click", function (e) {
    const b = e.target.closest("[data-id]");
    if (b) openProject(PROJECTS.find((p) => p.id === b.dataset.id));
  });
  window.addEventListener("resize", function () {
    layoutFan();
  });

  // ── Project modal ──────────────────────────────────────────
  const modal = document.createElement("div");
  modal.id = "project-modal";
  modal.className = "hide";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  document.body.appendChild(modal);
  // Keep the page's wheel/touch scrolling from moving the site behind the modal.
  ["wheel", "mousewheel", "touchstart", "touchmove", "keydown"].forEach(function (ev) {
    modal.addEventListener(ev, function (e) {
      e.stopPropagation();
    });
  });

  function closeProject() {
    modal.classList.add("hide");
    modal.innerHTML = "";
  }

  function player(p) {
    if (p.ig)
      return '<button class="pm-facade" data-play="ig" aria-label="Play ' + esc(p.title) + '"><img src="' + p.thumb + '" alt=""><span class="pm-play pm-play-ig">' + PLAY + "</span></button>";
    if (p.yt)
      return '<button class="pm-facade" data-play="yt" aria-label="Play ' + esc(p.title) + '"><img src="' + p.thumb + '" alt="" onerror="' + thumbFallback + '"><span class="pm-play pm-play-yt">' + PLAY + "</span></button>";
    if (p.video) return '<video src="' + p.video + '" poster="' + p.thumb + '" controls autoplay playsinline></video>';
    return '<img src="' + p.thumb + '" alt="">';
  }

  function openProject(p) {
    if (!p) return;
    const external = p.link && p.link.indexOf("http") === 0 ? p.link : "";
    modal.innerHTML =
      '<div class="pm-backdrop" data-close></div>' +
      '<div class="pm-box">' +
      '<div class="pm-media">' + player(p) + '<button class="pm-close" data-close aria-label="Close">&times;</button></div>' +
      '<div class="pm-info"><div>' +
      '<p class="pm-meta"><i style="background:' + p.meta.color + '"></i>' + p.meta.label + (p.episode ? " · " + esc(p.episode) : "") + "</p>" +
      "<h3>" + esc(p.title) + "</h3><p class=\"pm-role\">" + esc(p.role) + "</p></div>" +
      (external
        ? '<a class="pm-link small-button orange-hover" href="' + external + '" target="_blank" rel="noreferrer">' + (p.yt ? "Watch on YouTube" : "Watch on Instagram") + "</a>"
        : "") +
      "</div></div>";
    modal.classList.remove("hide");
    const media = modal.querySelector(".pm-media");
    const facade = modal.querySelector(".pm-facade");
    if (facade)
      facade.addEventListener("click", function () {
        if (facade.dataset.play === "yt") {
          media.insertAdjacentHTML("afterbegin", '<iframe src="https://www.youtube-nocookie.com/embed/' + p.yt + '?autoplay=1&rel=0" title="' + esc(p.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>');
        } else {
          media.classList.add("is-ig");
          media.insertAdjacentHTML("afterbegin", '<iframe class="pm-ig" src="https://www.instagram.com/reel/' + p.ig + '/embed/" title="' + esc(p.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>');
        }
        facade.remove();
      });
  }

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeProject();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hide")) closeProject();
  });

  render();
})();
