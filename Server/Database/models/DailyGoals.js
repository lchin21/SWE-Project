export default (sequelize, DataTypes) => {

    const DailyGoals = sequelize.define("DailyGoals", {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        calories: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        protein: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        fat: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        carbs: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    })

    return DailyGoals;
}