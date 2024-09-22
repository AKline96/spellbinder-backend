import { DataTypes } from "sequelize";
import { db } from "./db.js";

const Spell = (db) => {
    return db.define("spell", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING,
        level: DataTypes.INTEGER,
        school: DataTypes.STRING,
        casting_time: DataTypes.STRING,
        range: DataTypes.STRING,
        components: DataTypes.STRING,
        duration: DataTypes.STRING,
        description: DataTypes.STRING,
        is_custom: DataTypes.BOOLEAN,
    });
};

export default Spell;
