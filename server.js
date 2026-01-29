import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const NoteSchema = new mongoose.Schema({
  content: String
});

const Note = mongoose.model("Note", NoteSchema);

app.post("/save", async (req, res) => {
  const note = new Note({ content: req.body.content });
  await note.save();
  res.json({ status: "saved" });
});

app.get("/", (req, res) => {
  res.send("UPSC Backend Running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
