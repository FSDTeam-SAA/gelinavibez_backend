import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
import AdminTracker from '../admintracker/admintracker.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IExtermination } from './extermination.interface';
import Extermination from './extermination.model';

const exterminationCreate = async (userId: string, payload: IExtermination) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, 'User not found');
  const result = await Extermination.create({ ...payload, user: user._id });
  if (!result) throw new AppError(400, 'Failed to create extermination');
  return result;
};

const getAllExtermination = async (params: any, options: IOption) => {
  const { page, skip, limit, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const addCondition: any[] = [];
  const searchableFields = [
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredContactMethod',
    'typeOfPestProblem',
    'durationOfIssue',
    'previousExterminationService',
    'previousExterminationDate',
    'preferredTime',
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
  const result = await Extermination.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email profileImage role');
  // .populate('contractor');

  const total = await Extermination.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleExtermination = async (id: string) => {
  const result = await Extermination.findById(id).populate(
    'user',
    'firstName lastName email profileImage role',
  );
  if (!result) throw new AppError(400, 'Failed to get extermination');
  return result;
};

const updateExtermination = async (id: string, payload: IExtermination) => {
  const result = await Extermination.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(400, 'Failed to update extermination');
  return result;
};

const deleteExtermination = async (id: string) => {
  const result = await Extermination.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Failed to delete extermination');
  return result;
};

const addContractor = async (id: string, contractorId: string) => {
  const result = await Extermination.findByIdAndUpdate(
    id,
    { contractor: contractorId },
    { new: true },
  );
  if (!result) throw new AppError(400, 'Failed to add contractor');
  return result;
};

const addAdminExterminationAssign = async (
  adminId: string,
  exterminationId: string,
  assigningExtermination: string,
) => {
  const admin = await User.findById(adminId);
  if (!admin) throw new AppError(404, 'Admin not found');

  const contractor = await Extermination.findById(exterminationId);
  if (!contractor) throw new AppError(404, 'Extermination not found');

  const assignedUser = await User.findById(assigningExtermination);
  if (!assignedUser) throw new AppError(404, 'User not found');

  if (assignedUser.role !== userRole.exterminator) {
    throw new AppError(403, 'Only exterminator role can be assigned');
  }

  const result = await Extermination.findByIdAndUpdate(
    exterminationId,
    { assigningExtermination: assignedUser._id },
    { new: true },
  );

  await AdminTracker.create({
    adminId: admin._id,
    action: 'add',
    model: 'Extermination',
    targetId: exterminationId,
    description: 'Extermination assigned by admin',
  });

  return result;
};

const getMyAssignExtermination = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredServiceDate',
    'preferredTime',
    'buildingAccessRequired',
    'contactInfo',
    'signature',
    'status',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andCondition.push({ assigningExtermination: user._id });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Extermination.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Extermination.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const chargesExtermination = async (
  userId: string,
  exterminationId: string,
  charges: number,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  const allowedRoles = [
    userRole.exterminator,
    userRole.admin,
    userRole.superadmin,
  ];

  if (!allowedRoles.includes(user.role as any)) {
    throw new AppError(403, 'You are not allowed to update charges');
  }

  const extermination = await Extermination.findById(exterminationId);
  if (!extermination) throw new AppError(404, 'Extermination not found');

  extermination.charges = charges;
  await extermination.save();

  if (user.role === userRole.admin || user.role === userRole.superadmin) {
    await AdminTracker.create({
      adminId: user._id,
      action: 'update',
      model: 'Extermination',
      targetId: exterminationId,
      description: 'Extermination charges updated',
    });
  }

  return extermination;
};

const getMyExterminationService = async (
  userId: string,
  params: any,
  options: IOption,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondition: any[] = [];
  const userSearchableFields = [
    'fullName',
    'email',
    'phoneNumber',
    'propertyAddress',
    'typeOfProperty',
    'preferredServiceDate',
    'preferredTime',
    'buildingAccessRequired',
    'contactInfo',
    'signature',
    'status',
  ];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  andCondition.push({ user: user._id });

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Extermination.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder } as any);

  const total = await Extermination.countDocuments(whereCondition);

  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

const updateStatusAdmin = async (
  userId: string,
  exterminationId: string,
  status: string,
) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');
  if (user.role !== userRole.admin && user.role !== userRole.superadmin)
    throw new AppError(403, 'Only admin or superadmin can update status');

  const extermination = await Extermination.findById(exterminationId);
  if (!extermination) throw new AppError(404, 'Extermination not found');
  const result = await Extermination.findByIdAndUpdate(
    exterminationId,
    { status },
    { new: true },
  );

  await AdminTracker.create({
    adminId: user._id,
    action: 'update',
    model: 'Extermination',
    targetId: exterminationId,
    description: 'Extermination status updated',
  });
  return result;
};

export const exterminationService = {
  exterminationCreate,
  getAllExtermination,
  getSingleExtermination,
  updateExtermination,
  deleteExtermination,
  addContractor,
  getMyExterminationService,
  updateStatusAdmin,

  addAdminExterminationAssign,
  getMyAssignExtermination,
  chargesExtermination,
};
