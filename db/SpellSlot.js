import { DataTypes } from "sequelize";

const SpellSlot = (db) => {
    return db.define("spellSlot", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        level: DataTypes.INTEGER,
        remaining_slots: DataTypes.INTEGER,
        total_slots: DataTypes.INTEGER,
    });
};

export default SpellSlot;
