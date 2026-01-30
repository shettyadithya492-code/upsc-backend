/* =========================================
   SPA NAVIGATION – UPSC HUB (FINAL CLEAN)
   ========================================= */

const content = document.getElementById("content");

/* =========================================
   HOME DASHBOARD RENDER
   ========================================= */
function loadHome() {
  content.innerHTML = `
    <section class="section visible">

      <h1>Welcome to UPSC Aspirant Hub</h1>
      <p class="welcome-sub">
        Your all-in-one preparation dashboard for UPSC success.
      </p>

      <div class="welcome-grid">

        <div class="welcome-card" data-page="current">
          <h3>📰 Current Affairs</h3>
          <p>Stay updated with daily national news curated for UPSC.</p>
        </div>

        <div class="welcome-card" data-page="global">
          <h3>🌍 Global Affairs</h3>
          <p>International events explained in exam-focused format.</p>
        </div>

        <div class="welcome-card" data-page="newspaper">
          <h3>🗞 Online Newspaper</h3>
          <p>Quick access to trusted editorial sources.</p>
        </div>

        <div class="welcome-card" data-page="study">
          <h3>📚 Study Material</h3>
          <p>Structured resources for Prelims & Mains.</p>
        </div>

        <div class="welcome-card" data-page="quiz">
          <h3>🎯 Daily Quiz</h3>
          <p>Test your preparation with daily MCQs.</p>
        </div>

        <div class="welcome-card" data-page="notes">
          <h3>📝 My Notes</h3>
          <p>Save and organize your revision notes.</p>
        </div>

      </div>

    </section>
  `;

  attachCardNavigation();
}

/* =========================================
   UNIVERSAL BACK BUTTON
   ========================================= */
function backButton() {
  return `<button class="back-btn" onclick="loadHome()">← Back to Home</button>`;
}

/* =========================================
   CORE ROUTER
   ========================================= */
function navigate(page) {

  if (page === "current") loadCurrentAffairsHome();
  else if (page === "global") loadGlobalAffairsHome();
  else if (page === "newspaper") loadNewspaperHome();
  else if (page === "study") loadStudyDashboard();
  else if (page === "notes") loadNotes();
  else if (page === "quiz") loadQuizPage();
  else loadHome();
}

/* =========================================
   CARD CLICK HANDLER
   ========================================= */
function attachCardNavigation() {
  document.querySelectorAll(".welcome-card").forEach(card => {
    card.addEventListener("click", () => {
      const page = card.dataset.page;
      navigate(page);
    });
  });
}

/* =========================================
   INITIAL LOAD
   ========================================= */
loadHome();
