const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)

module.exports.createPaymentIntent = async (req, res, next) => {
    try {
        const { price } = req.body;
        const amount = parseInt(price * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: 'Internal server error' });
        next(err);
    }
};