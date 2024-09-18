import { DataTypes } from "sequelize";

const WizardSpells = (db) => {
    return db.define("wizardspells", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        is_known: DataTypes.BOOLEAN,
        is_prepared: DataTypes.BOOLEAN,
        is_active: DataTypes.BOOLEAN,
    });
};

export default WizardSpells;
