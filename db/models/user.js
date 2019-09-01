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
        validate: {
            notEmpty: {
              msg: "First name is required!"
            }
        },
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Last name is required!"
            }
        },
    },
    emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Email address is required!"
            }
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Password is required!"
            }
        },
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

