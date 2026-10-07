const oM = [
    {
      id: 0,
      name: "Raj Shamani — Figuring Out",
      description: "Long-form podcast editor since Sep 2025 — 16 episodes so far: Emmanuel Macron (FO473), Smriti Mandhana, DY Chandrachud, Kiara Advani, Lakshya Sen, Imtiaz Ali, Kiran Mazumdar-Shaw & more.",
      image: "https://i.ytimg.com/vi/9QXCkMTbrSk/hqdefault.jpg",
      tags: ["editing", "podcast", "storytelling"],
      liveview: "https://www.youtube.com/rajshamani",
      alt: "Raj Shamani Figuring Out podcast editing",
    },
    {
      id: 1,
      name: "Raj Shamani — Reels",
      description: "Short-form cut: \"Why Smuggling Happens\" with Utkarsh Dave, made for the Figuring Out reels page.",
      image: "images/projects/raj-shamani.jpg",
      tags: ["reels", "editing", "motion"],
      liveview: "https://www.instagram.com/reel/DP53WW8Er2r/",
      alt: "Raj Shamani Why Smuggling Happens reel",
    },
    {
      id: 2,
      name: "BeerBiceps",
      description: "Video editor, Feb 2025 – May 2025. Reel: Bhuvneshwar Kumar on his crazy cricket debut.",
      image: "images/projects/beerbiceps.jpg",
      tags: ["editing", "reels", "podcast"],
      liveview: "https://www.instagram.com/reel/DXqrk1BDLHF/",
      alt: "BeerBiceps Bhuvneshwar Kumar reel",
    },
    {
      id: 3,
      name: "Daud — Behind the Scenes",
      description: "6-episode series on the making of the short film Daud (2024): 500K+ Instagram views and 2,500 new followers in 3 days.",
      image: "images/projects/daud.jpg",
      tags: ["editing", "storytelling", "motion"],
      liveview: "https://www.instagram.com/arpitjainn__/",
      alt: "Daud behind the scenes series",
    },
    {
      id: 4,
      name: "Freelance",
      description: "2021 – Jan 2025. Independent editing, colour and sound for creators and brands — including the Daud series.",
      image: "media/projects/freelance/fl-01.jpg",
      tags: ["editing", "storytelling", "motion"],
      liveview: "https://www.instagram.com/mayankpaliwaal",
      alt: "Freelance video editing",
    },
  ];
  
  class lM {
    constructor() {
      he(this, "domElements", {
        renderContainer: document.getElementById("work-render-container"),
      });
      (this.experience = new ye()),
        (this.sounds = this.experience.sounds),
        (this.items = oM),
        (this.tags = aM),
        this.renderItems();
    }
  
    renderItems() {
      this.items.forEach((e) => {
        this.domElements.renderContainer.insertAdjacentHTML(
          "beforeend",
          `
              <div id="work-item-${e.id}" class="work-item-container column">
                  <img class="work-item-image" src="${e.image}" alt="${
            e.alt
          }" height="300" width="334"/>
                  <div class="work-item-content-container">
                      <h3>${e.name}</h3>
                      <div class="work-item-tag-container row">
                          ${this.renderTags(e.tags)}
                      </div>
                      <span>${e.description}</span>
                  </div>
                  <div class="work-item-button-container row">
                      ${this.renderButtons(e)}
                  </div>
                  ${e.bannerIcons ? this.renderBanner(e) : ""}
              </div>
              `
        ),
          this.addEventListenersToCard(e);
      });
    }
  
    renderBanner(e) {
      let t = "";
      return (
        (t = `
              <div class="work-banner-container row center">
                  ${e.bannerIcons.map(
                    (n) =>
                      `<img src="${n.src}" alt="${n.alt}" height="64" width="64"/>`
                  )}
                  <span>Website Of<br>The Day</span>
              </div>
          `),
        t
      );
    }
  
    renderButtons(e) {
      // Only the Live View button will be rendered if available
      let t = "";
      if (e.liveview) {
        t = `
          <div id="work-item-orange-button-${e.id}" class="work-item-orange-button small-button center orange-hover" style="width: 100%; margin: 0;">
              Watch
          </div>`;
      } else {
        t = `
          <div id="work-item-gray-button-${e.id}" class="work-item-gray-button center" style="width: 100%; background: #a7adb8; cursor: unset;">
              Work in progress
          </div>`;
      }
      return t;
    }
  
    renderTags(e) {
      let t = "";
      for (let n = 0; n < e.length; n++) t += this.tags[e[n]];
      return t;
    }
  
    addEventListenersToCard(e) {
      const t = document.getElementById("work-item-" + e.id);
      t.addEventListener("click", () => {
        t.classList.contains("work-inactive-item-container") &&
          document
            .getElementById("work-item-0")
            .classList.contains("work-item-container-transition") &&
          ((this.experience.ui.work.cards.currentItemIndex = -e.id + 4),
          this.experience.ui.work.cards.updatePositions(),
          this.sounds.play("buttonClick"));
      });
  
      if (e.liveview) {
        document
          .getElementById("work-item-orange-button-" + e.id)
          .addEventListener("click", () => {
            window.open(e.liveview, "_blank").focus();
          });
      }
    }
  }
  