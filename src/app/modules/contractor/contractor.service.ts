import AppError from '../../error/appError';
import { fileUploader } from '../../helper/fileUploder';
import pagination, { IOption } from '../../helper/pagenation';
import sendMailer from '../../helper/sendMailer';
import Extermination from '../extermination/extermination.model';
import User from '../user/user.model';
import { IContractor } from './contractor.interface';
import Contractor from './contractor.model';

const createContractor = async (
  payload: IContractor,
  file?: Express.Multer.File,
) => {
  // Upload contractor image if provided
  if (file) {
    const uploaded = await fileUploader.uploadToCloudinary(file);
    payload.image = uploaded.secure_url;
  }

  // Create contractor in DB
  const contractor = await Contractor.create(payload);
  if (!contractor) {
    throw new AppError(400, 'Contractor not created');
  }

  // Generate random password for contractor login
  const generatedPassword = `${contractor.name.split(' ')[0].toLowerCase()}${Math.floor(
    Math.random() * 10000 + 1,
  )}`;

  // Create a linked user account
  const newUser = new User({
    firstName: contractor.name,
    lastName: '',
    email: contractor.email,
    phone: contractor.number,
    role: 'contractor',
    password: generatedPassword,
    profileImage: contractor.image,
  });

  await newUser.save();

  // Send email with credentials
  await sendMailer(
    contractor.email,
    'Contractor Account Created',
    `
      <h2>Welcome, ${contractor.name}</h2>
      <p>Your contractor account has been created successfully.</p>
      <p><strong>Login Email:</strong> ${contractor.email}</p>
      <p><strong>Password:</strong> ${generatedPassword}</p>
      <p>You can now log in using your credentials.</p>
      <p>Thank you for joining us!</p>
    `,
  );

  return contractor;
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
    .limit(limit)
    .populate('service');

  if (!result) throw new AppError(400, 'Failed to get contact');
  const total = await Contractor.countDocuments(whereCondition);
  return {
    meta: { total, page, limit },
    data: result,
  };
};

const getSingleContractor = async (id: string) => {
  const result = await Contractor.findById(id).populate('service');
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
  }).populate('service');
  if (!result) throw new AppError(400, 'Failed to update contact');
  return result;
};

const deleteContractor = async (id: string) => {
  const contractor = await Contractor.findById(id);
  if (!contractor) throw new AppError(404, 'Contractor not found');

  const deletedContractor = await Contractor.findByIdAndDelete(id);
  if (!deletedContractor)
    throw new AppError(400, 'Failed to delete contractor');

  await User.findOneAndDelete({
    email: contractor.email,
    role: 'contractor',
  });

  return deletedContractor;
};

const getMyContractorAssignExtermination = async (
  userId: string,
  options: IOption,
) => {
  const { page, limit, skip, sortBy, sortOrder } = pagination(options);
  const user = await User.findById(userId);
  if (!user) throw new AppError(404, 'User not found');

  const contractor = await Contractor.findOne({ email: user.email });
  if (!contractor)
    throw new AppError(404, 'Contractor not found for this user');

  const exterminations = await Extermination.find({
    contractor: contractor._id,
  })
    .populate('user', 'firstName lastName email phone')
    .sort({
      [sortBy]: sortOrder,
    } as any)
    .skip(skip)
    .limit(limit);

  if (!exterminations) throw new AppError(400, 'Failed to get contact');

  const total = await Extermination.countDocuments({
    contractor: contractor._id,
  });

  return {
    contractor,
    exterminations,
    meta: { total, page, limit },
  };
};

export const contractorService = {
  createContractor,
  getAllContractor,
  getSingleContractor,
  updateContractor,
  deleteContractor,
  getMyContractorAssignExtermination,
};
