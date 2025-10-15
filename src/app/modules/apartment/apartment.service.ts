import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';
import { IApartment } from './apartment.interface';
import Apartment from './apartment.model';

const createApartment = async (
  ownerId: string,
  payload: IApartment,
  images?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  const user = await User.findById(ownerId);
  if (!user) throw new AppError(404, 'user not found');

  if (user.role === userRole.admin) {
    payload.status = 'approve';
  }
  if (images && images.length > 0) {
    const uploadImage = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(image);
        return secure_url;
      }),
    );
    payload.images = uploadImage;
  }

  if (videos && videos.length > 0) {
    const uploadVideo = await Promise.all(
      videos.map(async (video) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(video);
        return secure_url;
      }),
    );
    payload.videos = uploadVideo;
  }

  payload.ownerId = user._id;

  const result = await Apartment.create(payload);
  if (!result) throw new AppError(400, 'apartment is not create');
  return result;
};

const getAllApartment = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
  ];

  const andCondition: any[] = [];

  // Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
        // Special handling for array field "amenities"
        if (field === 'amenities') {
          return {
            [field]: { $elemMatch: { $regex: searchTerm, $options: 'i' } },
          };
        }
        return { [field]: { $regex: searchTerm, $options: 'i' } };
      }),
    });
  }

  // Filters
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => {
        return { [field]: value };
      }),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Apartment.find(whereCondition)
    .sort({ [sortBy]: sortOrder } as any)
    .skip(skip)
    .limit(limit);

  const total = await Apartment.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleApartment = async (id: string) => {
  const result = await Apartment.findById(id);
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const updateApartment = async (
  id: string,
  payload: Partial<IApartment>,
  images?: Express.Multer.File[],
  videos?: Express.Multer.File[],
) => {
  if (images && images.length > 0) {
    const uploadImage = await Promise.all(
      images.map(async (image) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(image);
        return secure_url;
      }),
    );
    payload.images = uploadImage;
  }

  if (videos && videos.length > 0) {
    const uploadVideo = await Promise.all(
      videos.map(async (video) => {
        const { secure_url } = await fileUploader.uploadToCloudinary(video);
        return secure_url;
      }),
    );
    payload.videos = uploadVideo;
  }

  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const deleteApartment = async (id: string) => {
  const result = await Apartment.findByIdAndDelete(id);
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

const getAllApartmentGroupByDay = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;

  const searchableFields = [
    'title',
    'description',
    'aboutListing',
    'address.street',
    'address.city',
    'address.state',
    'address.zipCode',
    'amenities',
    'status',
    'day',
  ];

  const andCondition: any[] = [];

  // 🔍 Search term
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => {
        if (field === 'amenities') {
          return {
            [field]: { $elemMatch: { $regex: searchTerm, $options: 'i' } },
          };
        }
        return { [field]: { $regex: searchTerm, $options: 'i' } };
      }),
    });
  }

  // 🎯 Filters
  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};

  // 📦 Group by Day
  const result = await Apartment.aggregate([
    { $match: whereCondition },
    { $sort: { [sortBy || 'createdAt']: sortOrder === 'asc' ? 1 : -1 } },
    {
      $group: {
        _id: '$day',
        apartments: { $push: '$$ROOT' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await Apartment.countDocuments(whereCondition);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateApartmentStatus = async (
  id: string,
  payload: { status: 'approve' | 'denied' },
) => {
  const result = await Apartment.findByIdAndUpdate(id, payload, { new: true });
  if (!result) throw new AppError(404, 'apartment not found');
  return result;
};

export const apartmentService = {
  createApartment,
  getAllApartment,
  singleApartment,
  updateApartment,
  deleteApartment,
  getAllApartmentGroupByDay,
  updateApartmentStatus,
};
