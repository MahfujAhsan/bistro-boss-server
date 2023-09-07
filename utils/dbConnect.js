const mongoose = require('mongoose');

const connectDB = async (dbName) => {
    try {
        const dbURI = `${process.env.ATLAS_URI}`;

        const connect = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected to ${connect.connection.host}.`)
    } catch (err) {
        console.log(error)
        process.exit(1)
    }
};

module.exports = connectDB;


