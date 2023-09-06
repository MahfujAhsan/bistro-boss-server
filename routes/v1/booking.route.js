const express = require('express');
const bookingController = require('../../controllers/bookings.controller');
const viewCount = require('../../middleware/viewCount');
const limiter = require('../../middleware/limiter');
const verifyJWT = require('../../middleware/verifyJWT');

const router = express.Router();

// router.post('/booking', (req, res) => {
//     res.send("booking successfully")
// });

// router.get('/', (req, res) => {
//     res.send("booking found")
// });

router
   .route("/")
   /**
* @api {get} /booking All Bookings
* @apiDescription Get all the bookings
* @apiPermission register user
* 
* @apiHeader {String} Authorization User's access token
* 
* @apiParam {Number {1-}}    [page=1]    List Page
* @apiParam {Number {1-100}}    [limit=10]    Users per page
* 
* @apiSuccess {Object[]} all the bookings.
* 
* @apiError {Unauthorized 401} Unauthorized Only authenticated users can access the data
* @apiError {Forbidden 403} Forbidden Only admins can access the data
*/
   .get(verifyJWT, bookingController.getBookings)
   /**
* @api {post} /booking save a booking
* @apiDescription Post a booking
* @apiPermission register user
* 
* @apiHeader {String} Authorization User's access token
* 
* @apiParam {Number {1-}}    [page=1]    List Page
* @apiParam {Number {1-100}}    [limit=10]    Users per page
* 
* @apiSuccess inserted data object.
* 
* @apiError {Unauthorized 401} Unauthorized Only authenticated users can access the data
* @apiError {Forbidden 403} Forbidden Only admins can access the data
*/
   .post(bookingController.saveABooking);

router.route("/:id")
   .get(viewCount, limiter, bookingController.getSingleBooking)

module.exports = router;