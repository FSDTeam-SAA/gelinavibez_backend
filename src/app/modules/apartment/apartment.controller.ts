import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { apartmentService } from './apartment.service';

const createApartment = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const images = files?.images;
  const videos = files?.videos;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await apartmentService.createApartment(
    req.user.id,
    fromData,
    images,
    videos,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment created successfully',
    data: result,
  });
});

const getAllApartment = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
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
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await apartmentService.getAllApartment(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment retrieved successfully',
    data: result,
  });
});

const singleApartment = catchAsync(async (req, res) => {
  const result = await apartmentService.singleApartment(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment retrieved successfully',
    data: result,
  });
});

const updateApartment = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const images = files?.images;
  const videos = files?.videos;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await apartmentService.updateApartment(
    req.params.id,
    fromData,
    images,
    videos,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment updated successfully',
    data: result,
  });
});

const deleteApartment = catchAsync(async (req, res) => {
  const result = await apartmentService.deleteApartment(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment deleted successfully',
    data: result,
  });
});

const getAllApartmentGroupByDay = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
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
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await apartmentService.getAllApartmentGroupByDay(
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment retrieved successfully',
    data: result,
  });
});

const updateApartmentStatus = catchAsync(async (req, res) => {
  const result = await apartmentService.updateApartmentStatus(req.params.id, {
    status: req.body.status,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment status updated successfully',
    data: result,
  });
});

// my apartment-------------------
// ✅ Get all my apartments
const getMyApartments = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const filters = pick(req.query, [
    'searchTerm',
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
  ]);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await apartmentService.getMyApartments(
    userId,
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My apartments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// ✅ Get single my apartment
const getMySingleApartment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await apartmentService.getMySingleApartment(
    userId,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single apartment retrieved successfully',
    data: result,
  });
});

// ✅ Update my apartment
const updateMyApartment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const images = files?.images;
  const videos = files?.videos;
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;

  const result = await apartmentService.updateMyApartment(
    userId,
    req.params.id,
    fromData,
    images,
    videos,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment updated successfully',
    data: result,
  });
});

// ✅ Delete my apartment
const deleteMyApartment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await apartmentService.deleteMyApartment(
    userId,
    req.params.id,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Apartment deleted successfully',
    data: result,
  });
});

export const apartmentController = {
  createApartment,
  getAllApartment,
  singleApartment,
  updateApartment,
  deleteApartment,
  getAllApartmentGroupByDay,
  updateApartmentStatus,
  getMyApartments,
  getMySingleApartment,
  updateMyApartment,
  deleteMyApartment,
};
