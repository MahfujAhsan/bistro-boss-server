const express = require('express');
const usersController = require('../../controllers/users.controller');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyAdmin = require('../../middleware/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(verifyJWT, verifyAdmin, usersController.getUsers)
    .post(usersController.createUser)

router.route('/:id')
    .delete(verifyJWT, verifyAdmin, usersController.deleteUser)

router.route('/:email')
    .get(verifyJWT, usersController.checkAdminStatus)

router.route('/:id')
    .patch(verifyJWT, verifyAdmin, usersController.updateUserRole)


module.exports = router;