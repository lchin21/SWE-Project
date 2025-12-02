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
        },
        mealType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Breakfast", "Lunch", "Dinner", "Snack"]]
            }
        }
    })

    PlannedMeals.associate = (models) => {
        PlannedMeals.belongsTo(models.Meals, {
            foreignKey: {
                name: "mealID",
                allowNull: false,
            },
            as: "meal",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        })
    }

    return PlannedMeals;
}