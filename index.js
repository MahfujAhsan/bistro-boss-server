const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
const connectDB = require('./utils/dbConnect');
const menuRoutes = require("./routes/v1/menu.route.js");
const bookingRoutes = require("./routes/v1/booking.route.js");
const usersRoutes = require("./routes/v1/users.route.js");
const paymentIntendedRoutes = require("./routes/v1/paymentIntend.route.js");
const paymentRoutes = require("./routes/v1/payments.route.js");
const adminStatsRoutes = require("./routes/v1/adminStats.route.js");
const orderStatsRoutes = require("./routes/v1/orderStats.route.js");
const cartRoutes = require("./routes/v1/carts.route");
const reviewRoutes = require("./routes/v1/reviews.route");
const jwtRoutes = require("./routes/v1/jwt.route");
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/booking', bookingRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/users/admin', usersRoutes)
app.use('/api/v1/menu', menuRoutes)
app.use('/api/v1/create-payment-intent', paymentIntendedRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/admin-stats', adminStatsRoutes)
app.use('/api/v1/order-stats', orderStatsRoutes)
app.use('/api/v1/carts', cartRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/jwt', jwtRoutes)


app.get('/', (req, res) => {
    res.send('Bistro is running')
})

// app.listen(port, () => {
//     console.log(`Bistro is listening on port ${port}`)
// });

const database = 'bistroDb';

const startServer = async (req, res) => {
    try {
        await connectDB(database);
        app.listen(port, () => {
            console.log(`Server Running on port ${port}`);
        });
    }
    catch (error) {
        console.log(error)
    }
};

startServer();

