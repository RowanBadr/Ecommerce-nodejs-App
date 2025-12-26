const stripe = require('stripe')('your_stripe_secret_key');

async function processPayment(amount, currency, paymentToken) {
    try {
        // Process payment using Stripe
        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency: currency,
            source: paymentToken,
            description: 'Payment for order'
        });

        return charge;
    } catch (error) {
        console.error('Error processing payment:', error);
        throw new Error('Failed to process payment. Please try again later.');
    }
}

module.exports = {
    processPayment
};
