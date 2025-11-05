import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import pick from '../../helper/pick';
import { userService } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'role', 'name', 'email']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await userService.getAllUser(filters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const result = await userService.getUserById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserById = catchAsync(async (req, res) => {
  const file = req.file;
  // console.log(file);
  const fromData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await userService.updateUserById(req.user.id, fromData, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteUserById = catchAsync(async (req, res) => {
  const result = await userService.deleteUserById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

const profile = catchAsync(async (req, res) => {
  const result = await userService.profile(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully',
    data: result,
  });
});

const requestAdmin = catchAsync(async (req, res) => {
  const result = await userService.requestAdmin(req.user.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request sent successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const result = await userService.updateAdmin(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request updated successfully',
    data: result,
  });
});
const allRequestAdmin = catchAsync(async (req, res) => {
  const fileters = pick(req.query, ['searchTerm', 'role', 'name', 'email']);
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await userService.allRequestAdmin(fileters, options);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin request fetched successfully',
    data: result,
  });
});

export const userController = {
  createUser,
  getAllUser,
  getUserById,
  updateUserById,
  deleteUserById,
  profile,
  requestAdmin,
  updateAdmin,
  allRequestAdmin,
};
