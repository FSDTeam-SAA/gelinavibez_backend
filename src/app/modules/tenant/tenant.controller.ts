import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { tenantService } from './tenant.service';

const createTenant = catchAsync(async (req, res) => {
  const formData = req.body.data ? JSON.parse(req.body.data) : req.body;
  const result = await tenantService.createTenant(
    req.user?.id,
    formData,
    req.files as any,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant created',
    data: result,
  });
});

const approveTenant = catchAsync(async (req, res) => {
  const result = await tenantService.approveTenant(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant approved',
    data: result,
  });
});

const denyTenant = catchAsync(async (req, res) => {
  const result = await tenantService.denyTenant(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Tenant denied',
    data: result,
  });
});

export const tenantController = { createTenant, approveTenant, denyTenant };
