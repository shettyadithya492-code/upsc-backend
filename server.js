import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* =============================
   Middleware
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   MongoDB Connection
============================= */

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err.message);
  process.exit(1);
});

/* =============================
   Schema + Model
============================= */

const NoteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);

/* =============================
   Routes
============================= */

app.get("/", (req, res) => {
  res.send("🚀 UPSC Backend Running");
});

app.post("/save", async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content required" });
    }

    const note = new Note({ content });
    await note.save();

    res.json({ status: "saved", id: note._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

/* =============================
   Server
============================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
