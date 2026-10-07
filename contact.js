// Last page — cinematic contact stage.
// The site scrolls with transforms, so visibility is checked by polling the stage's
// position instead of IntersectionObserver. The video only plays while on screen.
(function () {
  const stage = document.getElementById("contact-stage");
  if (!stage) return;
  const video = stage.querySelector(".cs-video");
  let inView = null;

  function check() {
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight;
    const visible = r.top < vh * 0.65 && r.bottom > vh * 0.2;
    // The navy header logo would vanish once the dark stage sits under it — flip it to cream.
    document.body.classList.toggle("cs-dark", r.top < 70 && r.bottom > 70);
    if (visible !== inView) {
      inView = visible;
      stage.classList.toggle("is-in", visible);
      if (video) {
        if (visible) {
          const p = video.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          video.pause();
        }
      }
    }
  }
  setInterval(check, 200);
  window.addEventListener("resize", check);
  check();

  // Copy-email chip
  const copy = stage.querySelector(".cs-copy");
  if (copy) {
    const label = copy.querySelector(".cs-copy-label");
    copy.addEventListener("click", function () {
      const text = copy.dataset.copy;
      const done = function () {
        copy.classList.add("is-copied");
        label.textContent = "Copied";
        setTimeout(function () {
          copy.classList.remove("is-copied");
          label.textContent = "Copy";
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          window.location.href = "mailto:" + text;
        });
      } else {
        window.location.href = "mailto:" + text;
      }
    });
  }
})();
