export default (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        userID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firebaseUID: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })

    return Users;
}