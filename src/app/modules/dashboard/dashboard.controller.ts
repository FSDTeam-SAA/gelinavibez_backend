import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import { dashboardController } from './dashboard.service';

const dashboardViewCount = catchAsync(async (req, res) => {
  console.log('first');
  const result = await dashboardController.dashboardViewCount();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard view count retrieved successfully',
    data: result,
  });
});

export const dashboardControllers = {
  dashboardViewCount,
};
