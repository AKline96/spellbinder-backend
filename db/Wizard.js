// Wizard.js
import { DataTypes } from "sequelize";

const Wizard = (db) => {
    return db.define("wizard", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        intelligence_score: DataTypes.INTEGER,
        level: DataTypes.INTEGER,
    });
};

export default Wizard;
