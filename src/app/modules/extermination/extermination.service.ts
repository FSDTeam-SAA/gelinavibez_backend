import AppError from '../../error/appError';
import pagination, { IOption } from '../../helper/pagenation';
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

export const exterminationService = {
  exterminationCreate,
  getAllExtermination,
  getSingleExtermination,
  updateExtermination,
  deleteExtermination,
};
