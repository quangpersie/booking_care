const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('sern', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
})

let connectDB = async () => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;