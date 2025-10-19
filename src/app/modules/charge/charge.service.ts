/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
// charge.service.ts
import mongoose from 'mongoose';
import AppError from '../../error/appError';
import { ICharge } from './charge.interface';
import Extermination from '../extermination/extermination.model';
import Contractor from '../contractor/contractor.model';
import User from '../user/user.model';
import Charge from './charge.model';
import pagination, { IOption } from '../../helper/pagenation';
import Stripe from 'stripe';
import config from '../../config';
import { Payment } from '../payment/payment.model';

interface ICreateCharge {
  exterminationId: string;
  amount: number;
  description?: string;
  dueDate?: Date;
}

// কন্ট্রাক্টর চার্জ তৈরি করবে
// charge.service.ts - বিকল্প পদ্ধতি
const createCharge = async (userId: string, payload: ICreateCharge) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // ১. লগইন করা ইউজার ডিটেইল্স নিন
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // ২. ইউজারের email দিয়ে কন্ট্রাক্টর খুঁজে বের করুন
    const contractor = await Contractor.findOne({ email: user.email });
    if (!contractor) {
      throw new AppError(404, 'Contractor not found for this user');
    }

    // ৩. এক্সটারমিনেশন ডিটেইল্স নিন
    const extermination = await Extermination.findById(
      payload.exterminationId,
    ).populate('user');

    if (!extermination) {
      throw new AppError(404, 'Extermination request not found');
    }

    // ৪. চেক করুন যে এই এক্সটারমিনেশনে এই কন্ট্রাক্টর অ্যাসাইন করা আছে কিনা
    if (extermination.contractor?.toString() !== contractor._id.toString()) {
      throw new AppError(403, 'You are not assigned to this extermination');
    }

    // ৫. এক্সটারমিনেশন এর ইউজার ডিটেইল্স নিন
    const exterminationUser = await User.findById(extermination.user);
    if (!exterminationUser) {
      throw new AppError(404, 'Extermination user not found');
    }

    // ৬. নতুন চার্জ তৈরি করুন
    const chargeData: Partial<ICharge> = {
      extermination: extermination._id,
      contractor: contractor._id,
      user: exterminationUser._id,
      amount: payload.amount,
      description: payload.description,
      dueDate: payload.dueDate,
      apartmentName: extermination.propertyAddress,
      serviceType: 'Extermination Service',
      status: 'pending',
    };

    const charge = await Charge.create([chargeData], { session });

    await session.commitTransaction();
    return charge[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ইউজারের pending চার্জগুলো দেখাবে
const getUserCharges = async (userId: string, options: IOption) => {
  const { sortBy, sortOrder, page, limit, skip } = pagination(options);
  const charges = await Charge.find({
    user: userId,
    status: 'pending',
  })
    .populate('contractor', 'companyName name email phone')
    .populate(
      'extermination',
      'propertyAddress typeOfPestProblem preferredServiceDate',
    )
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);

  const total = await Charge.countDocuments({
    user: userId,
    status: 'pending',
  });

  return {
    meta: { total, page, limit },
    data: charges,
  };
};

// কন্ট্রাক্টরের তৈরি করা সকল চার্জ দেখাবে
const getContractorCharges = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  const contractor = await Contractor.findOne({ email: user.email });
  if (!contractor) {
    throw new AppError(404, 'Contractor not found for this user');
  }

  // ৩. কন্ট্রাক্টরের তৈরি করা সকল চার্জ খুঁজে বের করুন
  const charges = await Charge.find({ contractor: contractor._id })
    .populate('user', 'firstName lastName email phone')
    .populate(
      'extermination',
      'propertyAddress typeOfPestProblem preferredServiceDate',
    )
    .sort({ createdAt: -1 });

  return charges;
};

// নির্দিষ্ট চার্জের ডিটেইল্স দেখাবে
const getChargeById = async (chargeId: string) => {
  const charge = await Charge.findById(chargeId)
    .populate('user', 'firstName lastName email phone profileImage')
    .populate('contractor', 'companyName name email phone service')
    .populate('extermination');

  if (!charge) {
    throw new AppError(404, 'Charge not found');
  }

  return charge;
};

// pay user

const stripe = new Stripe(config.stripe.secretKey!);

/**
 * ✅ ইউজার চার্জের পেমেন্ট করবে
 */
const payCharge = async (userId: string, chargeId: string) => {
  const charge = await Charge.findById(chargeId)
    .populate('user')
    .populate('contractor');

  if (!charge) throw new AppError(404, 'Charge not found');
  if (charge.status !== 'pending')
    throw new AppError(400, 'Charge already paid or cancelled');

  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const contractor = await User.findOne({
    email: (charge.contractor as any)?.email,
    role: 'contractor',
  });

  if (!contractor) throw new AppError(404, 'Contractor not found');
  if (!contractor.stripeAccountId)
    throw new AppError(400, 'Contractor not onboarded with Stripe');

  // Amount divide করা (Admin 10% / Contractor 90%)
  const totalAmount = Math.round(charge.amount * 100); // Stripe amount in cents
  const adminShare = Math.round(totalAmount * 0.1);
  const contractorShare = totalAmount - adminShare;

  // ✅ Stripe Checkout Session তৈরি
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: user.email,
    success_url: `${config.frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/payment-cancel`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Service Payment - ${charge.apartmentName}`,
            description: charge.description || 'Extermination Service Payment',
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: adminShare, // Admin 10%
      transfer_data: {
        destination: contractor.stripeAccountId, // Contractor account (90%)
      },
      metadata: {
        chargeId: charge._id.toString(),
        contractorId: contractor._id.toString(),
        userId: user._id.toString(),
      },
    },
  });

  // ✅ Payment entry তৈরি
  await Payment.create({
    tenantId: user._id,
    tenantName: `${user.firstName} ${user.lastName}`,
    tenantEmail: user.email,
    amount: charge.amount,
    status: 'pending',
    stripeSessionId: session.id,
    user: user._id,
    contractor: charge.contractor,
    extermination: charge.extermination,
    apartmentName: charge.apartmentName,
    typeOfProblem: charge.serviceType,
    chargeId: charge._id,
  });

  return { url: session.url };
};

export const chargeService = {
  createCharge,

  getUserCharges,
  getContractorCharges,
  getChargeById,
  payCharge,
};
