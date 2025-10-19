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

  // নতুন ফিল্ড যোগ করুন Contractor-Extermination এর জন্য
  contractor?: Types.ObjectId; // কোন কন্ট্রাক্টর সার্ভিস দিচ্ছে
  extermination?: Types.ObjectId; // কোন এক্সটারমিনেশন রিকোয়েস্ট
  service?: Types.ObjectId; // কোন সার্ভিস টাইপ
  apartmentName?: string; // অ্যাপার্টমেন্টের নাম
  typeOfProblem?: string; // কী ধরনের সমস্যা
}
