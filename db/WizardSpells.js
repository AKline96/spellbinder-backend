import { DataTypes } from "sequelize";

const WizardSpells = (db) => {
    return db.define("wizardspells", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        wizardId: {
            type: DataTypes.INTEGER,
            references: {
                model: "wizards",
                key: "id",
            },
        },
        spellId: {
            type: DataTypes.INTEGER,
            references: {
                model: "spells",
                key: "id",
            },
        },
        is_known: DataTypes.BOOLEAN,
        is_prepared: DataTypes.BOOLEAN,
        is_active: DataTypes.BOOLEAN,
    });
};

export default WizardSpells;
