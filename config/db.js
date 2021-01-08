const sequalize = require('sequelize');

const connectDB = async() => {
    try {
        const Sequalize = new sequalize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
            host:'127.0.0.1',
            dialect:'postgres'
        });

        await Sequalize.authenticate(() => {
            console.log('Successfully connected to Postgres DB')
        })
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

module.exports = connectDB;