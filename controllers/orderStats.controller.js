const Payment = require('../models/paymentModel'); // Import your Payment model

module.exports.getOrderStats = async (req, res, next) => {
    try {
        const pipeline = [
            {
                $addFields: {
                    menuItemsIds: {
                        $map: {
                            input: '$menuItems',
                            as: 'itemId',
                            in: { $convert: { input: '$$itemId', to: 'objectId' } }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'menu', // Assuming the collection name is 'menu'
                    localField: 'menuItemsIds',
                    foreignField: '_id',
                    as: 'menuItemsData'
                }
            },
            {
                $unwind: '$menuItemsData'
            },
            {
                $group: {
                    _id: '$menuItemsData.category',
                    count: { $sum: 1 },
                    totalPrice: { $sum: '$menuItemsData.price' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    count: 1,
                    total: { $round: ['$totalPrice', 2] },
                    _id: 0
                }
            }
        ];

        const result = await Payment.aggregate(pipeline);

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};