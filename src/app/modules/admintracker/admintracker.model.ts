import mongoose from 'mongoose';
import { IAdminTracker } from './admintracker.interface';

const adminTrackerSchema = new mongoose.Schema<IAdminTracker>(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['create', 'update', 'delete','add'] },
    model: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

const AdminTracker = mongoose.model<IAdminTracker>(
  'AdminTracker',
  adminTrackerSchema,
);
export default AdminTracker;
