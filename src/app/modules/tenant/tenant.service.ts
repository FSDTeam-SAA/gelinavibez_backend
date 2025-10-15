import config from '../../config';
import Stripe from 'stripe';
import Tenant from './tenant.model';
import { Payment } from '../payment/payment.model';
import User from '../user/user.model';
import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import sendMailer from '../../helper/sendMailer';
import { ITenant } from './tanant.interface';
import pagination, { IOption } from '../../helper/pagenation';

const stripe = new Stripe(config.stripe.secretKey!, {
  apiVersion: '2023-10-16' as any,
});

// Tenant create + Payment create + Stripe session
const createTenant = async (
  userId: string,
  payload: Partial<ITenant>,
  files?: Record<string, Express.Multer.File[]>,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  // ফাইল আপলোড
  if (files) {
    payload.uploads = {};
    const allowedUploadKeys = [
      'idCard',
      'ssnDoc',
      'voucherDoc',
      'incomeDoc',
    ] as const;
    for (const key of Object.keys(files)) {
      if (allowedUploadKeys.includes(key as any)) {
        const file = files[key][0];
        const uploaded = await fileUploader.uploadToCloudinary(file);
        (payload.uploads as any)[key] = uploaded.secure_url;
      }
    }
  }

  // Tenant create
  const tenant = await Tenant.create({ ...payload, createBy: user._id });

  // Payment create
  const payment = await Payment.create({
    tenantId: tenant._id,
    tenantName: `${tenant.firstName} ${tenant.lastName}`,
    tenantEmail: tenant.email,
    amount: 20,
    user: user._id,
  });

  // Stripe checkout session (manual capture)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: tenant.email,
    payment_intent_data: { capture_method: 'manual' },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tenant Fee' },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    success_url: `${config.frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrl}/payment-cancel`,
    metadata: {
      tenantId: tenant._id.toString(),
      paymentId: payment._id.toString(),
    },
  });

  // Stripe session ID save
  payment.stripeSessionId = session.id;
  await payment.save();

  tenant.paymentId = payment._id;
  await tenant.save();

  // Email notify user
  await sendMailer(
    tenant.email,
    'Application Received',
    `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is received and pending admin approval.</p>`,
  );

  return { tenant, stripeSessionUrl: session.url };
};

// Admin approve tenant (capture payment)
const approveTenant = async (tenantId: string) => {
  const tenant = await Tenant.findById(tenantId).populate('paymentId');
  if (!tenant) throw new AppError(404, 'Tenant not found');

  const payment = await Payment.findById(tenant.paymentId);
  if (!payment) throw new AppError(404, 'Payment not found');

  if (payment.stripePaymentIntentId)
    await stripe.paymentIntents.capture(payment.stripePaymentIntentId);

  tenant.status = 'approved';
  payment.status = 'approved';
  await tenant.save();
  await payment.save();

  await sendMailer(
    tenant.email,
    'Application Approved',
    `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is approved.</p>`,
  );

  return { message: 'Tenant approved and payment captured' };
};

// Admin deny tenant (refund payment)
const denyTenant = async (tenantId: string) => {
  const tenant = await Tenant.findById(tenantId).populate('paymentId');
  if (!tenant) throw new AppError(404, 'Tenant not found');

  const payment = await Payment.findById(tenant.paymentId);
  if (!payment) throw new AppError(404, 'Payment not found');

  if (payment.stripePaymentIntentId)
    await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

  tenant.status = 'denied';
  payment.status = 'denied';
  await tenant.save();
  await payment.save();

  await sendMailer(
    tenant.email,
    'Application Denied',
    `<p>Hi ${tenant.firstName + ' ' + tenant.lastName}, your application is denied.</p>`,
  );

  return { message: 'Tenant denied and payment refunded' };
};

const getAllTenantApplication = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'ssn',
    'status',
  ];
  if (searchTerm) {
    addCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filterData).length) {
    addCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = addCondition.length > 0 ? { $and: addCondition } : {};
  const result = await Tenant.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet',
    )
    .populate('createBy', 'firstName lastName email profileImage role');

  const total = await Tenant.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getTenantApplication = async (tenantId: string) => {
  const tenant = await Tenant.findById(tenantId)
    .populate(
      'apartmentId',
      'title description aboutListing price bedrooms bathrooms squareFeet',
    )
    .populate('createBy', 'firstName lastName email profileImage role');
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

const updateTenantApplication = async (
  tenantId: string,
  payload: Partial<ITenant>,
  files?: Record<string, Express.Multer.File[]>,
) => {
  // ফাইল আপলোড
  if (files) {
    payload.uploads = {};
    const allowedUploadKeys = [
      'idCard',
      'ssnDoc',
      'voucherDoc',
      'incomeDoc',
    ] as const;
    for (const key of Object.keys(files)) {
      if (allowedUploadKeys.includes(key as any)) {
        const file = files[key][0];
        const uploaded = await fileUploader.uploadToCloudinary(file);
        (payload.uploads as any)[key] = uploaded.secure_url;
      }
    }
  }
  const tenant = await Tenant.findByIdAndUpdate(tenantId, payload, {
    new: true,
  });
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

const deleteTenantApplication = async (tenantId: string) => {
  const tenant = await Tenant.findByIdAndDelete(tenantId);
  if (!tenant) throw new AppError(404, 'Tenant not found');
  return tenant;
};

export const tenantService = {
  createTenant,
  approveTenant,
  denyTenant,
  getAllTenantApplication,
  getTenantApplication,
  updateTenantApplication,
  deleteTenantApplication,
};
