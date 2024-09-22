// Wizard.js
import { DataTypes } from "sequelize";
import sequelize from "./db"; // Adjust based on your setup
import { db } from "./db.js";

const Wizard = sequelize.define("Wizard", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    intelligence_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default level
        validate: {
            min: 1,
            max: 20,
        },
    },
});

export default Wizard;
