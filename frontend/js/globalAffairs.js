/* =========================================================
   GLOBAL AFFAIRS – UPSC (CATEGORY + WORLD MAP + HYBRID)
   ========================================================= */

/* ---------- CONFIG ---------- */
const GLOBAL_API_URL =
  "https://newsdata.io/api/1/news?apikey=pub_01ae2d7a5f5f45b88c392430cd7f38d1&language=en";

const GLOBAL_CACHE_KEY = "upsc_global_affairs";
const GLOBAL_CACHE_TIME = 1000 * 60 * 60 * 24; // refresh every 24 hours

/* ---------- CATEGORY KEYWORDS ---------- */
const GLOBAL_CATEGORIES = {
  geopolitics: ["war", "conflict", "border", "military", "nato"],
  institutions: ["un", "who", "imf", "world bank", "wto"],
  diplomacy: ["summit", "treaty", "agreement", "bilateral"],
  climate: ["climate", "carbon", "cop", "emissions"],
  economy: ["global economy", "recession", "trade", "sanctions"]
};

/* ---------- REGION KEYWORDS ---------- */
const GLOBAL_REGIONS = {
  americas: ["usa", "united states", "canada", "latin america"],
  europe: ["europe", "eu", "russia", "ukraine", "nato"],
  africa: ["africa", "sahel", "sudan", "african union"],
  middleeast: ["middle east", "israel", "palestine", "iran", "gulf"],
  southasia: ["south asia", "india", "pakistan", "bangladesh", "sri lanka"],
  eastasia: ["china", "japan", "korea", "taiwan"],
  indopacific: ["indo-pacific", "asean", "south china sea", "quad"]
};

/* ---------- OFFICIAL SOURCES (HYBRID) ---------- */
const OFFICIAL_SOURCES = {
  americas: [
    { name: "United Nations", url: "https://www.un.org/en/" },
    { name: "US State Department", url: "https://www.state.gov/" },
    { name: "World Bank", url: "https://www.worldbank.org/" }
  ],
  europe: [
    { name: "European Union", url: "https://european-union.europa.eu/" },
    { name: "NATO", url: "https://www.nato.int/" },
    { name: "UN Europe", url: "https://www.un.org/en/" }
  ],
  africa: [
    { name: "African Union", url: "https://au.int/" },
    { name: "UN Africa", url: "https://www.un.org/africa/osaa/" },
    { name: "WHO Africa", url: "https://www.afro.who.int/" }
  ],
  middleeast: [
    { name: "UN Middle East", url: "https://www.un.org/unispal/" },
    { name: "GCC", url: "https://www.gcc-sg.org/" },
    { name: "WHO EMRO", url: "https://www.emro.who.int/" }
  ],
  southasia: [
    { name: "MEA India", url: "https://mea.gov.in/" },
    { name: "SAARC", url: "https://www.saarc-sec.org/" },
    { name: "UN South Asia", url: "https://www.un.org/en/" }
  ],
  eastasia: [
    { name: "ASEAN", url: "https://asean.org/" },
    { name: "UN East Asia", url: "https://www.un.org/en/" },
    { name: "WHO WPRO", url: "https://www.who.int/westernpacific" }
  ],
  indopacific: [
    { name: "ASEAN", url: "https://asean.org/" },
    { name: "Quad", url: "https://www.state.gov/the-quad/" },
    { name: "UN Indo-Pacific", url: "https://www.un.org/en/" }
  ]
};

/* =========================================================
   HOME
   ========================================================= */
function loadGlobalAffairsHome() {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}
    <h1>Global Affairs</h1>
    <p class="sub">International relations & world developments</p>

    <div class="ga-top">
      <button class="ga-map-btn" onclick="loadWorldMapView()">🌍 World Map View</button>
    </div>

    <div class="ga-grid">
      <div class="ga-card" onclick="openGlobalCategory('geopolitics')">Geopolitics</div>
      <div class="ga-card" onclick="openGlobalCategory('institutions')">Global Institutions</div>
      <div class="ga-card" onclick="openGlobalCategory('diplomacy')">Diplomacy</div>
      <div class="ga-card" onclick="openGlobalCategory('climate')">Climate & Environment</div>
      <div class="ga-card" onclick="openGlobalCategory('economy')">Global Economy</div>
    </div>
  `;
}

/* =========================================================
   CATEGORY VIEW
   ========================================================= */
function openGlobalCategory(category) {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}
    <h1>${capitalize(category)} – Global Affairs</h1>
    <div id="ga-list">Loading...</div>
  `;

  fetchGlobalNews(GLOBAL_CATEGORIES[category], null);
}

/* =========================================================
   WORLD MAP VIEW
   ========================================================= */
function loadWorldMapView() {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}

    <h1>🌍 Global Regions</h1>
    <p class="sub">Select a region to explore international affairs</p>

    <div class="region-panel">

      <div class="region-list">
        <div class="region-item" onclick="openRegion('americas')">Americas</div>
        <div class="region-item" onclick="openRegion('europe')">Europe</div>
        <div class="region-item" onclick="openRegion('africa')">Africa</div>
        <div class="region-item" onclick="openRegion('middleeast')">Middle East</div>
        <div class="region-item" onclick="openRegion('southasia')">South Asia</div>
        <div class="region-item" onclick="openRegion('eastasia')">East Asia</div>
        <div class="region-item" onclick="openRegion('indopacific')">Indo-Pacific</div>
      </div>

    </div>

    <div id="ga-list"></div>
  `;
}

function openRegion(region) {
  document.getElementById("ga-list").innerHTML = "Loading regional affairs...";
  fetchGlobalNews(GLOBAL_REGIONS[region], region);
}

/* =========================================================
   FETCH + HYBRID RENDER
   ========================================================= */
function fetchGlobalNews(keywords, regionKey) {
  const cached = localStorage.getItem(GLOBAL_CACHE_KEY);

  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < GLOBAL_CACHE_TIME) {
      renderHybrid(data.articles, keywords, regionKey);
      return;
    }
  }

  fetch(GLOBAL_API_URL)
    .then(res => res.json())
    .then(data => {
      const articles = data.results || [];
      localStorage.setItem(
        GLOBAL_CACHE_KEY,
        JSON.stringify({ time: Date.now(), articles })
      );
      renderHybrid(articles, keywords, regionKey);
    })
    .catch(() => {
      document.getElementById("ga-list").innerHTML =
        "<p>Unable to load global affairs.</p>";
    });
}

function renderHybrid(articles, keywords, regionKey) {
  const container = document.getElementById("ga-list");

  const filtered = articles.filter(a =>
    keywords.some(k =>
      (a.title + a.description)
        ?.toLowerCase()
        .includes(k)
    )
  );

  let newsHTML = filtered.length
    ? filtered.slice(0, 8).map(a => `
        <div class="ga-article">
          <h3>${a.title}</h3>
          <p>${a.description || ""}</p>
          <div class="ga-actions">
            <a href="${a.link}" target="_blank">Read Full</a>
            <button onclick='saveNote(${JSON.stringify(a)})'>Save</button>
          </div>
        </div>
      `).join("")
    : "<p>No major developments found.</p>";

  let sourcesHTML = "";
  if (regionKey && OFFICIAL_SOURCES[regionKey]) {
    sourcesHTML = `
      <h2 class="sub">Official & Reference Sources</h2>
      <div class="official-links">
        ${OFFICIAL_SOURCES[regionKey].map(s =>
          `<a href="${s.url}" target="_blank">${s.name}</a>`
        ).join("")}
      </div>
    `;
  }

  container.innerHTML = `
    <h2 class="sub">Latest Developments</h2>
    ${newsHTML}
    ${sourcesHTML}
  `;
}

/* =========================================================
   UTIL
   ========================================================= */
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
