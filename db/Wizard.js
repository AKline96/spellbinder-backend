import { DataTypes } from "sequelize";
import Spell from "./Spell.js";
import { User } from "./db.js";

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
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "users", // Refers to the user model
                key: "id",
            },
        },
    });
};

export default Wizard;
