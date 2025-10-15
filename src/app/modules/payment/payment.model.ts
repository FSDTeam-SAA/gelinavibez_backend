import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const PaymentSchema = new Schema<IPayment>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
    tenantName: { type: String, required: true },
    tenantEmail: { type: String, required: true },
    amount: { type: Number, default: 20 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    paymentDate: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
