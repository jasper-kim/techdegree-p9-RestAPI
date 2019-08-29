const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  // Course model
    class Course extends Sequelize.Model {}
    Course.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Title is required!"
            }
        },
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
              msg: "Description is required!"
            }
        },
    },
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            notEmpty: {
              msg: "estimatedTime is required!"
            }
        },
    },
    materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            notEmpty: {
              msg: "materialsNeeded is required!"
            }
        },
    },
    }, { sequelize });

    // define associations between models
    Course.associate = (models) => {
        // Add associations.
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
        }});
    };

    return Course;
};

