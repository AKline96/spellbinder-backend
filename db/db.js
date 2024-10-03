import Sequelize from "sequelize";
import WizardModel from "./Wizard.js";
import SpellModel from "./Spell.js";
import SpellSlotModel from "./SpellSlot.js";
import UserModel from "./User.js";
import WizardSpellsModel from "./WizardSpells.js";
import spellSeed from "./spellSeed.json" with {type: "json"};
// process.env.DATABASE_URL

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

Wizard.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Wizard.belongsToMany(Spell, { through: WizardSpells, foreignKey: "wizardId" });
Spell.belongsToMany(Wizard, { through: WizardSpells, foreignKey: "spellId" });
WizardSpells.belongsTo(Spell, { foreignKey: "spellId" });

const connectToDB = async () => {
    try {
        await db.authenticate();
        console.log("Connected to DB");

        db.sync({alter:true});

        const exisitingSpells = await Spell.findAll();
        if (!exisitingSpells.length){
        for (const spellData of spellSeed){
            await Spell.create(spellData);
        }}

        // WizardSpells.belongsTo(Spell, {foreignKey: "spellId"})
    } catch (error) {
        console.error(error);
        console.log("DB ISSUE");
    }
};

await connectToDB();

export { db, Wizard, Spell, User, WizardSpells };
