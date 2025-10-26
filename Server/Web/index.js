import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import express from "express"

import db from "../Database/models/index.js"

const app = express()

app.use(express.json())
app.use(cors())

const port = 3000

// routes go here, should be from most specific to least specific
import usersRouter from "./Routes/users.js"
app.use("/api/v1/users", usersRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.all("*path", (req, res) => {
    res.sendFile("index.html");
});

db.sequelize.sync()
    .then(() => {
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to sync DB or start server:", err);
    });
