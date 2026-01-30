/* =========================================================
   UPSC NOTES SYSTEM (FINAL CLEAN)
   ========================================================= */

const NOTES_KEY = "upsc_notes";
const EDITOR_KEY = "upsc_manual_notes";

/* =========================================================
   LOAD NOTES PAGE
   ========================================================= */

function loadNotes() {
  const content = document.getElementById("content");

  const savedNotes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  const manualText = localStorage.getItem(EDITOR_KEY) || "";

  content.innerHTML = `
    ${backButton()}

    <h1>📝 My Notes</h1>

    <h2 class="sub">Notebook</h2>
    <textarea id="note-editor" placeholder="Write or paste your notes here...">${manualText}</textarea>

    <div class="editor-actions">
      <button onclick="saveEditor()">💾 Save Notebook</button>
      <button onclick="exportPDF()">📄 Export PDF</button>
      <button onclick="clearEditor()">🗑 Clear</button>
    </div>

    <h2 class="sub">Saved Articles</h2>
    <div id="notes-list">
      ${savedNotes.length ? "" : "<p>No saved articles yet.</p>"}
    </div>
  `;

  const list = document.getElementById("notes-list");

  savedNotes.forEach((n, i) => {
    const div = document.createElement("div");
    div.className = "ca-card";
    div.innerHTML = `
      <h3>${n.title}</h3>
      <p>${n.description || ""}</p>
      <button onclick="deleteNote(${i})">Delete</button>
    `;
    list.appendChild(div);
  });
}

/* =========================================================
   NOTEBOOK SAVE (LOCAL + FIREBASE CLOUD)
   ========================================================= */

async function saveEditor() {
  const text = document.getElementById("note-editor").value;

  if (!text.trim()) {
    alert("Notebook empty!");
    return;
  }

  // ✅ Save locally first (always works)
  localStorage.setItem(EDITOR_KEY, text);

  // ✅ Save to Firebase cloud
  try {
    await saveCloudNote(text);
    alert("Saved locally + cloud ✔");
  } catch (err) {
    console.error(err);
    alert("Saved locally ✔ (cloud offline)");
  }
}

/* =========================================================
   CLEAR NOTEBOOK
   ========================================================= */

function clearEditor() {
  if (!confirm("Clear notebook?")) return;
  localStorage.removeItem(EDITOR_KEY);
  loadNotes();
}

/* =========================================================
   SAVE ARTICLE NOTE
   ========================================================= */

function saveNote(article) {
  const notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];

  notes.unshift({
    title: article.title,
    description: article.description
  });

  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  alert("Saved to Notes ✔");
}

/* =========================================================
   DELETE NOTE
   ========================================================= */

function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  notes.splice(index, 1);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  loadNotes();
}

/* =========================================================
   EXPORT NOTEBOOK TO PDF
   ========================================================= */

function exportPDF() {
  const { jsPDF } = window.jspdf;

  const text = document.getElementById("note-editor").value;

  if (!text.trim()) {
    alert("Notebook is empty!");
    return;
  }

  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);

  doc.text(lines, 15, 20);
  doc.save("upsc_notes.pdf");
}
