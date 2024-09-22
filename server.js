import express from "express";
import cors from "cors";
import Sequelize from "sequelize";
import { db, Wizard, Spell, SpellSlot, User, WizardSpells } from "./db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDB } from "./db/db.js";

const server = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your_secret"; // Ensure your JWT secret is defined

// Middleware for CORS and JSON body parsing
server.use(cors());
server.use(express.json());

// Authentication middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header
    if (!token) return res.sendStatus(401); // No token provided

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token is invalid
        req.user = user; // Save user data to request
        next(); // Proceed to next middleware/route
    });
};

// Endpoint to fetch all wizards for the authenticated user
server.get("/wizards", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Get the userId from the logged-in user's session or token
        const wizards = await Wizard.findAll({ where: { userId } }); // Fetch wizards for this user
        res.json(wizards); // Respond with the user's wizards
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wizards" });
    }
});

// Endpoint to create a new wizard for the authenticated user
server.post("/wizard", authenticateToken, async (req, res) => {
    try {
        const { name, intelligence_score, level } = req.body; // Expecting name, intelligence_score, and level in the request body
        const userId = req.user.id; // Get the userId from the logged-in user's session or token

        // Create a new wizard and associate it with the user
        const newWizard = await Wizard.create({
            name,
            intelligence_score, // Include intelligence_score in the wizard creation
            level,
            userId, // Associate the wizard with the user
        });

        res.status(201).json({ newWizard }); // Respond with the created wizard
    } catch (error) {
        res.status(400).json({ message: "Error creating wizard", error });
    }
});

// Endpoint to fetch a specific wizard by ID
server.get("/wizard/:id", authenticateToken, async (req, res) => {
    try {
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

// Health check endpoint
server.get("/", (req, res) => {
    res.send({ server: "running" });
});

// Sign-up endpoint to create a new user
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

// Login endpoint
server.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Username or password incorrect." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({ message: "Username or password incorrect." });
        }

        // Create a token for the user
        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET
        );
        res.json({ message: "Login successful", token }); // Respond with the token
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

server.get("/spells", async (req, res) => {
    const { level } = req.query;

    try {
        const spells = await Spell.findAll({
            where: {
                level: level, // Assuming your spells table has a level column
            },
        });
        res.json(spells);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while fetching spells",
        });
    }
});

const startServer = async () => {
    await connectToDB();
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};

startServer();
