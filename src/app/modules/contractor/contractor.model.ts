import mongoose from 'mongoose';
import { IContractor } from './contractor.interface';

const constractorSchema = new mongoose.Schema<IContractor>(
  {
    companyName: {
      type: String,
      required: true,
    },
    CompanyAddress: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    serviceAreas: {
      type: String,
    },
    scopeWork: {
      type: String,
    },
    worlHour: {
      type: Number,
      required: true,
    },
    superContact: {
      type: String,
    },
    superName: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    serviceCategory: [
      {
        type: String,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assigningContractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

// constractorSchema.virtual('user', {
//   ref: 'User',
//   localField: 'email',
//   foreignField: 'email',
//   justOne: true,
// });

// constractorSchema.set('toObject', { virtuals: true });
// constractorSchema.set('toJSON', { virtuals: true });

const Contractor = mongoose.model<IContractor>('Contractor', constractorSchema);
export default Contractor;
