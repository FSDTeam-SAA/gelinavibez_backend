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

export const apartmentController = {
  createApartment,
  getAllApartment,
  singleApartment,
  updateApartment,
  deleteApartment,
};
