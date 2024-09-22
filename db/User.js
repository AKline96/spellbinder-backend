import { DataTypes } from "sequelize";
import { db } from "./db.js";

const User = (db) => {
    return db.define("user", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: DataTypes.STRING,
        password: DataTypes.INTEGER,
        email: DataTypes.STRING,
        is_active: DataTypes.BOOLEAN,
    });
};

export default User;
