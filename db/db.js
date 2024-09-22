import Sequelize from "sequelize";
import WizardModel from "./Wizard.js";
import SpellModel from "./Spell.js";
import SpellSlotModel from "./SpellSlot.js";
import UserModel from "./User.js";
import WizardSpellsModel from "./WizardSpells.js";
import spellSeed from "./spellSeed.json" with { type: "json" };

let db;

if (process.env.DATABASE_URL === undefined) {
    console.log("Connected locally");
    db = new Sequelize("postgres://localhost:5432/spellbinder_db", {
        logging: false,
    });
} else {
    db = new Sequelize(process.env.DATABASE_URL, {
        logging: false,
    });
}

const Wizard = WizardModel(db);
const Spell = SpellModel(db);
const SpellSlot = SpellSlotModel(db);
const User = UserModel(db);
const WizardSpells = WizardSpellsModel(db);

const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("Connected to DB");
        await db.sync({ alter: true });

        const existingSpells = await Spell.findAll();
        if (!existingSpells.length) {
            for (const spellData of spellSeed) {
                await Spell.create(spellData);
            }
        }
    } catch (error) {
        console.error(error);
        console.log("DB ISSUE");
    }
};

Wizard.belongsTo(User); // associate wizard with user
Wizard.belongsToMany(Spell, { through: "WizardSpells" });

export { db, Wizard, Spell, SpellSlot, User, WizardSpells, connectToDB };
