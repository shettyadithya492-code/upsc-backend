/* =========================================================
   CURRENT AFFAIRS – UPSC (INDIA + HYBRID + 24H REFRESH)
   ========================================================= */

/* ---------- CONFIG ---------- */
const CA_API_URL =
  "https://newsdata.io/api/1/news?apikey=pub_01ae2d7a5f5f45b88c392430cd7f38d1&country=in&language=en";

const CA_CACHE_KEY = "upsc_current_affairs";
const CA_CACHE_TIME = 1000 * 60 * 60 * 24; // ✅ 24 HOURS AUTO REFRESH

/* ---------- CATEGORY KEYWORDS ---------- */
const CA_CATEGORIES = {
  polity: ["constitution", "parliament", "supreme court", "governance"],
  economy: ["economy", "rbi", "inflation", "budget", "finance"],
  ir: ["foreign", "international", "UN", "G20", "BRICS", "neighbour"],
  environment: ["climate", "environment", "biodiversity", "wildlife"]
};

/* ---------- OFFICIAL INDIAN SOURCES (HYBRID) ---------- */
const CA_OFFICIAL_SOURCES = {
  polity: [
    { name: "PIB", url: "https://pib.gov.in/" },
    { name: "PRS India", url: "https://prsindia.org/" },
    { name: "Supreme Court of India", url: "https://main.sci.gov.in/" }
  ],
  economy: [
    { name: "RBI", url: "https://www.rbi.org.in/" },
    { name: "Ministry of Finance", url: "https://www.finmin.nic.in/" },
    { name: "Economic Survey", url: "https://www.indiabudget.gov.in/" }
  ],
  ir: [
    { name: "MEA India", url: "https://mea.gov.in/" },
    { name: "Indian Missions Abroad", url: "https://mea.gov.in/indian-missions-abroad.htm" }
  ],
  environment: [
    { name: "MoEFCC", url: "https://moef.gov.in/" },
    { name: "Down To Earth", url: "https://www.downtoearth.org.in/" }
  ]
};

/* =========================================================
   HOME – CARD PATTERN
   ========================================================= */
function loadCurrentAffairsHome() {
  const content = document.getElementById("content");

  content.innerHTML = `
  ${backButton()}
  <h1>Current Affairs</h1>
    <p class="sub">India-focused UPSC daily updates</p>

    <div class="ca-grid">
      <div class="ca-card-home" onclick="openCACategory('polity')">Polity</div>
      <div class="ca-card-home" onclick="openCACategory('economy')">Economy</div>
      <div class="ca-card-home" onclick="openCACategory('ir')">International Relations</div>
      <div class="ca-card-home" onclick="openCACategory('environment')">Environment</div>
    </div>
  `;
}

/* =========================================================
   CATEGORY VIEW
   ========================================================= */
function openCACategory(category) {
  const content = document.getElementById("content");

  content.innerHTML = `
    <h1>${capitalize(category)} – Current Affairs</h1>
    <button class="back-btn" onclick="loadCurrentAffairsHome()">← Back</button>
    <div id="ca-list">Loading...</div>
  `;

  fetchCurrentAffairs(category);
}

/* =========================================================
   FETCH + HYBRID RENDER
   ========================================================= */
function fetchCurrentAffairs(category) {
  const cached = localStorage.getItem(CA_CACHE_KEY);

  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.time < CA_CACHE_TIME) {
      renderHybridCA(data.articles, category);
      return;
    }
  }

  fetch(CA_API_URL)
    .then(res => res.json())
    .then(data => {
      const articles = data.results || [];
      localStorage.setItem(
        CA_CACHE_KEY,
        JSON.stringify({ time: Date.now(), articles })
      );
      renderHybridCA(articles, category);
    })
    .catch(() => {
      document.getElementById("ca-list").innerHTML =
        "<p>Unable to load current affairs.</p>";
    });
}

function renderHybridCA(articles, category) {
  const container = document.getElementById("ca-list");
  const keywords = CA_CATEGORIES[category];
  const sources = CA_OFFICIAL_SOURCES[category] || [];

  const filtered = articles.filter(a =>
    keywords.some(k =>
      (a.title + a.description)
        ?.toLowerCase()
        .includes(k)
    )
  );

  let newsHTML = filtered.length
    ? filtered.slice(0, 10).map(a => `
        <div class="ca-article">
          <h3>${a.title}</h3>
          <p>${a.description || ""}</p>
          <div class="ca-actions">
            <a href="${a.link}" target="_blank">Read Full</a>
            <button onclick='saveNote(${JSON.stringify(a)})'>Save</button>
          </div>
        </div>
      `).join("")
    : "<p>No major developments found.</p>";

  let sourcesHTML = `
    <h2 class="sub">Official & Reference Sources</h2>
    <div class="official-links">
      ${sources.map(s =>
        `<a href="${s.url}" target="_blank">${s.name}</a>`
      ).join("")}
    </div>
  `;

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
