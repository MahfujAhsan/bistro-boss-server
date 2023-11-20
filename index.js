const express = require('express');
// const multer = require('multer');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./utils/dbConnect');
const jwtRoutes = require("./routes/v1/jwt.route");
const usersRoutes = require("./routes/v1/users.route.js");
const menuRoutes = require("./routes/v1/menu.route.js");
const cartRoutes = require("./routes/v1/carts.route");
const bookingRoutes = require("./routes/v1/booking.route.js");
const paymentIntendedRoutes = require("./routes/v1/paymentIntend.route.js");
const paymentRoutes = require("./routes/v1/payments.route.js");
const adminStatsRoutes = require("./routes/v1/adminStats.route.js");
const orderStatsRoutes = require("./routes/v1/orderStats.route.js");
const reviewRoutes = require("./routes/v1/reviews.route.js");
const imagesRoutes = require("./routes/v1/images.route.js");
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// api routes
app.use('/api/v1/jwt', jwtRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/users/admin', usersRoutes)
app.use('/api/v1/menu', menuRoutes)
app.use('/api/v1/carts', cartRoutes)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/booking', bookingRoutes)
app.use('/api/v1/create-payment-intent', paymentIntendedRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/admin-stats', adminStatsRoutes)
app.use('/api/v1/order-stats', orderStatsRoutes)
app.use('/api/v1/images', imagesRoutes)


app.get('/', (req, res) => {
    res.send('Server Running...')
})

const database = 'bistroDb';

// const storage = multer.memoryStorage();

// const upload = multer({ storage: storage })

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

