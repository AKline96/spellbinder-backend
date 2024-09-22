import { DataTypes } from "sequelize";
import { db } from "./db.js";

const User = (db) => {
    return db.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_active: DataTypes.BOOLEAN,
    });
};

export default User;
