import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Payment } from './payment.model';
import Tenant from '../tenant/tenant.model';
import config from '../../config';
import Charge from '../charge/charge.model';

const stripe = new Stripe(config.stripe.secretKey!);

const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret!
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const payment = await Payment.findOne({ stripeSessionId: session.id });

      if (payment) {
        payment.status = 'approved';
        payment.paymentDate = new Date();
        payment.stripePaymentIntentId = session.payment_intent as string;
        await payment.save();

        // Charge update
        await Charge.findByIdAndUpdate(payment.chargeId, { status: 'paid' });

        // Tenant optional update (admin approval needed)
        await Tenant.findByIdAndUpdate(payment.tenantId, { status: 'pending' });
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (payment) {
        payment.status = 'denied';
        await payment.save();
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).send(`Webhook Error: ${(error as Error).message}`);
  }
};


export default stripeWebhook;
