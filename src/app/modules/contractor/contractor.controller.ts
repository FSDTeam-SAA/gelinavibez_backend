import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { contractorService } from './contractor.service';

const createContractor = catchAsync(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const fromdata = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await contractorService.createContractor(fromdata, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor created successfully',
    data: result,
  });
});

const getAllContractor = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
    'companyName',
    'CompanyAddress',
    'name',
    'number',
    'email',
    'serviceAreas',
    'scopeWork',
    'superContact',
    'superName',
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getAllContractor(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    data: result,
  });
});

const getSingleContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contractorService.getSingleContractor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    data: result,
  });
});

const updateContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = req.file as Express.Multer.File;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await contractorService.updateContractor(id, fromData, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor updated successfully',
    data: result,
  });
});

const deleteContractor = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await contractorService.deleteContractor(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor deleted successfully',
    data: result,
  });
});

const getMyContractorAssignExtermination = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await contractorService.getMyContractorAssignExtermination(
    userId,
    options,
  );
  const { meta, ...data } = result;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Contractor fetched successfully',
    meta: meta,
    data: data,
  });
});

const createStripeAccount = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contractorService.createContractorStripeAccount(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { url: result.url },
  });
});

// Dashboard লিংক নেবে
const getStripeDashboardLink = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const result = await contractorService.getStripeDashboardLink(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: { url: result.url },
  });
});

export const contractorController = {
  createContractor,
  getAllContractor,
  getSingleContractor,
  updateContractor,
  deleteContractor,
  getMyContractorAssignExtermination,

  createStripeAccount,
  getStripeDashboardLink,
};
