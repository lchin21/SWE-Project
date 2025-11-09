export default (sequelize, DataTypes) => {

    const PlannedMeals = sequelize.define("PlannedMeals", {
        ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        day: { // Monday, Tuesday, etc.
            type: DataTypes.STRING,
            allowNull: false
        },
        mealID: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    PlannedMeals.associate = (models) => {
        PlannedMeals.hasOne(models.Meals, {
            foreignKey: "mealID",
            as: "meal"
        })
    }

    return PlannedMeals;
}