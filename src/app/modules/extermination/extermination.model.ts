import mongoose, { Schema } from 'mongoose';
import { IExtermination } from './extermination.interface';

const exterminationSchema = new Schema<IExtermination>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    propertyAddress: { type: String, required: true },

    typeOfProperty: {
      type: String,
      enum: ['Residential', 'Commercial', 'Multi-unit Building'],
      required: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['Phone', 'Email', 'Text Message'],
      required: true,
    },

    typeOfPestProblem: { type: [String], required: true },
    locationOfProblem: { type: [String], required: true },
    durationOfIssue: { type: String },

    previousExterminationService: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    previousExterminationDate: { type: String },

    preferredServiceDate: { type: String, required: true },
    preferredTime: {
      type: String,
      enum: ['Morning', 'Afternoon', 'Evening'],
      required: true,
    },
    buildingAccessRequired: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    contactInfo: { type: String },

    signature: { type: String, required: true },
    date: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contractor: { type: Schema.Types.ObjectId, ref: 'Contractor' },
  },
  {
    timestamps: true,
  },
);
const Extermination = mongoose.model<IExtermination>(
  'Extermination',
  exterminationSchema,
);

export default Extermination;
