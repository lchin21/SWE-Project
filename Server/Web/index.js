import dotenv from "dotenv"
import cors from "cors"
import express from "express"
import db from "../Database/models/index.js"


const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

const port = 3000

// routes go here

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
