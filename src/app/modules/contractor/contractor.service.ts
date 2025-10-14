import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import { IContractor } from './contractor.interface';
import Contractor from './contractor.model';

const createContractor = async (
  payload: IContractor,
  file?: Express.Multer.File,
) => {
  if (file) {
    const contractorimage = await fileUploader.uploadToCloudinary(file);
    payload.image = contractorimage.secure_url;
  }
  const result = await Contractor.create(payload);
  if (!result) {
    throw new AppError(400, 'contractor is not create');
  }
  return result;
};

const getAllContractor = async (params: any, options: IOption) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const { searchTerm, ...filterData } = params;
  const andCondition: any[] = [];
  const searchableFields = [
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
  ];
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const result = await Contractor.find(whereCondition)
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit);

  if (!result) throw new AppError(400, 'Failed to get contact');
  const total = await Contractor.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleContractor = async (id: string) => {
  const result = await Contractor.findById(id);
  if (!result) throw new AppError(400, 'Failed to get contact');
  return result;
};

const updateContractor = async (
  id: string,
  payload: Partial<IContractor>,
  file?: Express.Multer.File,
) => {
  if (file) {
    const contractorimage = await fileUploader.uploadToCloudinary(file);
    payload.image = contractorimage.secure_url;
  }
  const result = await Contractor.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) throw new AppError(400, 'Failed to update contact');
  return result;
};

const deleteContractor = async (id: string) => {
  const result = await Contractor.findByIdAndDelete(id);
  if (!result) throw new AppError(400, 'Failed to delete contact');
  return result;
};

export const contractorService = {
  createContractor,
  getAllContractor,
  getSingleContractor,
  updateContractor,
  deleteContractor,
};
