import { Types } from 'mongoose';

export interface IExtermination {
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyAddress: string;
  typeOfProperty: 'Residential' | 'Commercial' | 'Multi-unit Building';
  preferredContactMethod: 'Phone' | 'Email' | 'Text Message';

  typeOfPestProblem: string[];
  locationOfProblem: string[];
  durationOfIssue?: string;
  previousExterminationService: 'Yes' | 'No';
  previousExterminationDate?: string;

  preferredServiceDate: string;
  preferredTime: 'Morning' | 'Afternoon' | 'Evening';
  buildingAccessRequired: 'Yes' | 'No';
  contactInfo?: string;

  signature: string;
  date: string;
  user: Types.ObjectId;
  contractor?: Types.ObjectId;
  status?: 'pending'| 'assigned'| 'completed'| 'paid';
}
