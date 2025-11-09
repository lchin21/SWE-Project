import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import db from "../Database/models/index.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

app.use(express.json())
app.use(cors())

const port = 3000

import usersRouter from "./Routes/users.js"
app.use("/api/v1/users", usersRouter);

import mealsRouter from "./Routes/meals.js"
app.use("/api/v1/meals", mealsRouter);

import goalsRouter from "./Routes/goals.js"
app.use("/api/v1/meals", goalsRouter);

// Only need to implement if hosting actual site w/o vercel or something similar.
// app.all("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

db.sequelize.sync()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync DB or start server:", err);
  });
