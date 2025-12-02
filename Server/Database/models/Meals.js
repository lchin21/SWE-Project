export default (sequelize, DataTypes) => {

    const Meals = sequelize.define("Meals", {
        mealID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
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
        }
    })

    Meals.associate = (models) => {
        Meals.hasMany(models.PlannedMeals, {
            foreignKey: "mealID",
            as: "plannedMeals",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            hooks: true,
        });
    };

    return Meals;
}