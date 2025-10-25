import mongoose from 'mongoose';
import { IContractor } from './contractor.interface';

const constractorSchema = new mongoose.Schema<IContractor>(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
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
    image: {
      type: String,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
  },
  { timestamps: true },
);

const Contractor = mongoose.model<IContractor>('Contractor', constractorSchema);
export default Contractor;
