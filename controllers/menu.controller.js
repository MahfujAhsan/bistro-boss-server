const Menu = require("../models/menuModel.js");



module.exports.getMenu = async (req, res, next) => {
    try {
        const menuItems = await Menu.find();
        res.status(200).json({ success: true, data: menuItems });
    } catch (err) {
        next(err);
    }
}

module.exports.getMenuItemById = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Use Mongoose's findById method to find a menu item by its ID
        const menuItem = await Menu.findById(id);

        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, data: menuItem });
    } catch (err) {
        next(err);
    }
};

module.exports.createMenuItem = async (req, res, next) => {
    try {
        const newItem = req.body;

        // Use Mongoose's create method to create a new menu item
        const createdMenuItem = await Menu.create(newItem);

        res.status(201).json({ success: true, data: createdMenuItem });
    } catch (err) {
        next(err);
    }
};

module.exports.deleteMenuItemById = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Use Mongoose's findByIdAndRemove method to delete a menu item by its ID
        const deletedMenuItem = await Menu.findByIdAndRemove(id);

        if (!deletedMenuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, data: deletedMenuItem });
    } catch (err) {
        next(err);
    }
};

module.exports.updateMenuItemById = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const updateData = req.body;

        // Use Mongoose's findByIdAndUpdate method to update a menu item by its ID
        const updatedItem = await Menu.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, data: updatedItem });
    } catch (err) {
        next(err);
    }
};