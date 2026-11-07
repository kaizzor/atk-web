import path from "path";
import { fileURLToPath } from "url"; 
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import itemsRoutes from "./routes/mainMenuRoutes.js";
import reportRoutes from "./routes/dashboard.js";
import supplierRoutes from "./routes/supplierRoutes.js"; 
import { dashboard } from "./controllers/dashboard.js";
import { db } from "./services/sqlDB.js";
import transactionsRoutes from "./routes/transactionsRoutes.js"; 

console.log("Cloudinary:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/src", express.static(path.join(__dirname, "../src")));
app.use("/dist", express.static(path.join(__dirname, "../dist")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/login", authRoutes);
app.use("/items", itemsRoutes);
app.use("/report", reportRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/transactions", transactionsRoutes); 
app.use("/reports", transactionsRoutes);


// Cek koneksi DB: buka /health/db di browser
app.get("/health/db", async (req, res) => {
  const env = {
    DB_HOST: !!process.env.DB_HOST, DB_PORT: process.env.DB_PORT || "(default 3306)",
    DB_USER: !!process.env.DB_USER, DB_PASS: !!process.env.DB_PASS,
    DB_NAME: !!process.env.DB_NAME, DB_SSL: process.env.DB_SSL || "(kosong)",
    DB_SSL_CA: !!process.env.DB_SSL_CA,
  };
  try {
    const [[r]] = await db.query("SELECT DATABASE() AS db, (SELECT COUNT(*) FROM products) AS products, (SELECT COUNT(*) FROM users) AS users");
    res.json({ ok: true, ...r, env });
  } catch (err) {
    res.status(500).json({ ok: false, code: err.code, message: err.message, env });
  }
});

app.get("/dashboard", dashboard);
app.get("/", (req, res) => {
  res.redirect("/src/login.html");
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Di Vercel app di-export sebagai serverless function; listen hanya untuk lokal/Render.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API ready at http://localhost:${PORT}`);
  });
}

export default app;
