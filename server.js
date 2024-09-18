import express from "express";
import cors from "cors";
import pg from "pg";
import Sequelize from "sequelize";
import { db, Wizard } from "./db/db.js";

const server = express();

server.use(cors());
server.use(express.json());

server.get("/wizard", async (req, res) => {
    res.send({ wizard: await Wizard.findAll() });
});

server.get("/wizard/:id", async (req, res) => {
    try {
        // Find the wizard by ID (assuming the ID is passed in the URL)
        const wizard = await Wizard.findByPk(req.params.id);
        if (wizard) {
            res.json({
                name: wizard.name,
                level: wizard.level,
                intelligence_score: wizard.intelligence_score,
            });
        } else {
            res.status(404).json({ error: "Wizard not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wizard data" });
    }
});

server.post("/wizard", async (req, res) => {
    console.log(req.body);
    const newWizard = await Wizard.create(req.body);
    res.send({ newWizard });
});

// server.post("/wizards", async (req, res) => {
//     await Wizard;
// });

server.get("/", (req, res) => {
    res.send({ server: "running" });
});

server.listen(3001, "0.0.0.0", () => {
    console.log("Server is listening");
});
