import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

class Payments {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key is not set in .env');
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
    });
  }

  /** Create a PaymentIntent (Pix or other methods) */
  async createPayment({ amount, currency = 'brl', payment_method_types = ['card'], customer }) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types,
        customer,
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  /** Create a PaymentIntent specifically for Pix */
  async createPixPayment({ amount, customer }) {
    return this.createPayment({
      amount,
      currency: 'brl',
      payment_method_types: ['pix'],
      customer,
    });
  }

  /** Retrieve a payment by ID */
  async getPayment(paymentId) {
    try {
      const payment = await this.stripe.paymentIntents.retrieve(paymentId);
      return payment;
    } catch (error) {
      console.error('Error retrieving payment:', error);
      throw error;
    }
  }

  /** List payments */
  async listPayments(limit = 10) {
    try {
      const payments = await this.stripe.paymentIntents.list({ limit });
      return payments;
    } catch (error) {
      console.error('Error listing payments:', error);
      throw error;
    }
  }

  /** Cancel a PaymentIntent */
  async cancelPayment(paymentId) {
    try {
      const canceled = await this.stripe.paymentIntents.cancel(paymentId);
      return canceled;
    } catch (error) {
      console.error('Error canceling payment:', error);
      throw error;
    }
  }

  /** Verify and process Stripe webhook */
  handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody, // rawBody required in express: express.raw({ type: 'application/json' })
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Example of handling events
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object);
        // Update payment status in your database here
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object);
        break;
      case 'charge.succeeded':
        console.log('Charge succeeded:', event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
}

export default Payments;
