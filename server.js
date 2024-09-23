import express from "express";
import cors from "cors";
import pg from "pg";
import Sequelize from "sequelize";
import { db, Wizard, Spell, User } from "./db/db.js";
import bcrypt from "bcrypt";

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

// Endpoint to fetch all spells
server.get("/spells", async (req, res) => {
    try {
        const spells = await Spell.findAll(); // Fetch all spells from the database
        res.json(spells); // Send spells as a JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching spells",
        });
    }
});

server.get("/wizards/:wizardId/spells", async (req, res) => {
    const wizardId = req.params.wizardId;
    try {
        const knownSpells = await db.wizardspells.findAll({
            where: { wizardId },
            include: [{ model: db.spells }], // Include spell details
        });
        res.json(knownSpells);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.patch("/wizardspells/:id", async (req, res) => {
    const { is_known } = req.body; // Expecting is_known in the body
    try {
        const wizardSpell = await db.wizardspells.findByPk(req.params.id);
        if (!wizardSpell) return res.status(404).json({ error: "Not found" });
        wizardSpell.is_known = is_known; // Update the known status
        await wizardSpell.save();
        res.json(wizardSpell);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put("/wizards/:wizardId/spells/:spellId", async (req, res) => {
    const { wizardId, spellId } = req.params;
    const { is_known } = req.body;

    try {
        const wizardSpell = await WizardSpells.findOne({
            where: {
                wizardId: wizardId,
                spellId: spellId,
            },
        });

        if (wizardSpell) {
            wizardSpell.is_known = is_known;
            await wizardSpell.save();
            res.status(200).json(wizardSpell);
        } else {
            res.status(404).json({ message: "WizardSpell not found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

server.get("/", (req, res) => {
    res.send({ server: "running" });
});

server.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    try {
        const newUser = await User.create({
            username,
            password: hashedPassword,
        });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
});

server.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Username or password incorrect." });
        }

        // Compare the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({ message: "Username or password incorrect." });
        }

        // Successful login, you can send back user info or a token
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

server.listen(3001, "0.0.0.0", () => {
    console.log("Server is listening");
});
