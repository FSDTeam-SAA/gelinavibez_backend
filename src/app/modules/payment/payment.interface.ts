import { Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  tenantName: string;
  tenantEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'denied';
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paymentDate?: Date;
  user: Types.ObjectId;
}
