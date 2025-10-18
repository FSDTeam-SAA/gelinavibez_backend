import pick from '../../helper/pick';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { exterminationService } from './extermination.service';

const exterminationCreate = catchAsync(async (req, res) => {
  const result = await exterminationService.exterminationCreate(
    req.user?.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination created successfully',
    data: result,
  });
});

const getAllExtermination = catchAsync(async (req, res) => {
  const filters = pick(req.query, [
    'searchTerm',
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
  ]);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await exterminationService.getAllExtermination(
    filters,
    options,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.getSingleExtermination(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Extermination retrieved successfully',
    data: result,
  });
});
const updateExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.updateExtermination(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination updated successfully',
    data: result,
  });
});
const deleteExtermination = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await exterminationService.deleteExtermination(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Extermination deleted successfully',
    data: result,
  });
});
export const exterminationController = {
  exterminationCreate,
  getAllExtermination,
  getSingleExtermination,
  updateExtermination,
  deleteExtermination,
};
