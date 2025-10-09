import dotenv from "dotenv";
import express from "express";
import type { Request, Response } from "express";

const app = express();
dotenv.config()
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the API!" });
});

app.listen(PORT, () => {
  console.log(`Server running at Port http://localhost:${PORT}`);
});
