import { Types } from 'mongoose';

export interface IApartment {
  title: string;
  description: string;
  aboutListing?: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;

  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };

  amenities?: string[];
  images?: string[];
  videos?: string[];

  availableFrom?: {
    month: string;
    time: Date;
    day: string;
  };

  action: 'available' | 'rented' | 'maintenance';
  status: 'approve' | 'pending' | 'denied';

  ownerId: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}
