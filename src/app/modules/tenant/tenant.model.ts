import mongoose, { Schema } from 'mongoose';
import { ITenant } from './tanant.interface';


const TenantSchema = new Schema<ITenant>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    ssn: { type: String },

    rentalHistory: {
      currentAddress: String,
      city: String,
      state: String,
      zip: String,
      landlordName: String,
      landlordNumber: String,
    },

    employmentInfo: {
      employerName: String,
      jobTitle: String,
      employerAddress: String,
      monthlyIncome: Number,
      sourceOfIncome: String,
    },

    appliedAddress: {
      address: String,
      city: String,
      state: String,
      zip: String,
    },

    hasVoucher: { type: Boolean, default: false },
    livesInShelter: { type: Boolean, default: false },
    affiliatedWithHomebase: { type: Boolean, default: false },

    uploads: {
      idCard: String,
      ssnDoc: String,
      voucherDoc: String,
      incomeDoc: String,
    },

    voucherInfo: {
      programType: String,
      caseworkerName: String,
      caseworkerEmail: String,
      caseworkerNumber: String,
    },

    applicantSignature: String,
    date: Date,
    acceptedTerms: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ['pending', 'approved', 'denied'],
      default: 'pending',
    },

    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    createBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    apartmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Apartment',
    },
  },
  { timestamps: true },
);

const Tenant = mongoose.model<ITenant>('Tenant', TenantSchema);
export default Tenant;
