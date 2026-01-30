function loadStudyDashboard() {
  const content = document.getElementById("content");

  content.innerHTML = `
    ${backButton()}

    <h1>Study Materials & Strategy</h1>
    <p class="sub">Quick dashboard of useful study material.</p>

    <div class="study-dashboard">

      <div class="study-box">
        <h2>Official UPSC Resources</h2>
        <ul>
          <li>UPSC Official Site</li>
          <li>Previous Year Questions (PYQs)</li>
        </ul>
        <button onclick="openResource('upsc')">Open</button>
      </div>

      <div class="study-box" onclick="openResource('ncert')">
        <h2>NCERTs & Basic Books</h2>
        <ul>
          <li>6–12th NCERTs</li>
          <li>Standard books for Polity, Economy, History</li>
        </ul>
      </div>

      <div class="study-box" onclick="openResource('answer')">
        <h2>Answer Writing & Tests</h2>
        <ul>
          <li>Practice 2–3 answers daily</li>
          <li>Use PYQs for trend analysis</li>
        </ul>
      </div>

    </div>

    <p class="build-time">Build updated: ${new Date().toLocaleString()}</p>
  `;
}

/* ---------- OPEN RESOURCES ---------- */
function openResource(type) {
  const links = {
    upsc: "https://www.upsc.gov.in/",
    ncert: "https://ncert.nic.in/textbook.php",
    answer: "https://www.upsc.gov.in/examinations/previous-question-papers"
  };

  window.open(links[type], "_blank");
}
