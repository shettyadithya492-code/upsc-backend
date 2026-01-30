function loadNewspaperHome() {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}

    <h1>Online Newspaper</h1>
    <p>Trusted sources for analysis & official updates.</p>

    <div class="newspaper-grid">
      <div class="newspaper-btn" onclick="openSource('thehindu')">The Hindu</div>
      <div class="newspaper-btn" onclick="openSource('indianexpress')">Indian Express</div>
      <div class="newspaper-btn" onclick="openSource('pib')">PIB</div>
      <div class="newspaper-btn" onclick="openSource('prs')">PRS India</div>
      <div class="newspaper-btn" onclick="openSource('downtoearth')">Down To Earth</div>
      <div class="newspaper-btn" onclick="openSource('epw')">EPW</div>
    </div>

    <p class="np-footer">Build updated: ${new Date().toLocaleString()}</p>
  `;
}

function openSource(source) {
  const urls = {
    thehindu: "https://www.thehindu.com/news/",
    indianexpress: "https://indianexpress.com/section/india/",
    pib: "https://pib.gov.in/",
    prs: "https://prsindia.org/",
    downtoearth: "https://www.downtoearth.org.in/",
    epw: "https://www.epw.in/"
  };

  window.open(urls[source], "_blank");
}
