export interface IUser {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: 'admin' | 'user' | 'contractor' | 'superadmin';
  profileImage?: string;
  bio?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  otp?: string;
  otpExpiry?: Date;
  verified?: boolean;
  stripeAccountId?: string;
  requestAdmin?: boolean;
  accessRoutes?: string[];
}
