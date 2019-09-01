const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  logging: false
});

// test connection to database
(async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection to the database successful!!');
    } catch (err) {
      console.error('Error connecting to the database: ', err);
    }
  }) ();

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.User = require('./models/user.js')(sequelize);
db.models.Course = require('./models/course.js')(sequelize);

// If available, call method to create associations.
Object.keys(db.models).forEach((modelName) => {
    if (db.models[modelName].associate) {
      console.info(`Configuring the associations for the ${modelName} model...`);
      db.models[modelName].associate(db.models);
    } else {
        console.log('Wow!!');
    }
});

module.exports = db;