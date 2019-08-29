const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    // User model
    class User extends Sequelize.Model {}
    User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    }, { sequelize });

    // define associations between models
    User.associate = (models) => {
        // Add associations.
        User.hasMany(models.Course, {
            foreignKey: {
            fieldName: 'userId',
            allowNull: false,
        }});
    };

    return User;
};

