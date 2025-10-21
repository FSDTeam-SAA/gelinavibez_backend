import { Types } from 'mongoose';

export interface IContractor {
  companyName: string;
  CompanyAddress: string;
  name: string;
  number: string;
  email: string;
  serviceAreas: string;
  scopeWork: string;
  worlHour: number;
  superContact: string;
  superName: string;
  image: string;
  service: Types.ObjectId;
}
