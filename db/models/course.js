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
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    estimatedTime: {
        type: Sequelize.STRING,
        materialsNeeded: true,
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

