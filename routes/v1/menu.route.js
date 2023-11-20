const express = require('express');
const menuController = require('../../controllers/menu.controller');
const verifyJWT = require('../../middlewares/verifyJWT');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const router = express.Router();

router.route('/')
    .get(menuController.getMenu)
    .post(verifyJWT, verifyAdmin, menuController.createMenuItem)

router.route('/:id')
    .get(menuController.getMenuItemById)
    .delete(verifyJWT, verifyAdmin, menuController.deleteMenuItemById)
    .patch(menuController.updateMenuItemById)

module.exports = router;