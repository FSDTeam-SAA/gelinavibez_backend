// charge.controller.ts
import { Request, Response } from 'express';
import { chargeService } from './charge.service';
import catchAsync from '../../utils/catchAsycn';
import sendResponse from '../../utils/sendResponse';
import pick from '../../helper/pick';

// কন্ট্রাক্টর নতুন চার্জ তৈরি করবে
const createCharge = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const result = await chargeService.createCharge(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Charge created successfully',
    data: result,
  });
});


// ইউজার তার pending চার্জগুলো দেখবে
const getMyCharges = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  const result = await chargeService.getUserCharges(userId, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User charges retrieved successfully',
    data: result,
  });
});

// কন্ট্রাক্টর তার তৈরি করা চার্জগুলো দেখবে
const getMyContractorCharges = catchAsync(
  async (req: Request, res: Response) => {
    const contractorId = req.user?.id;
    const result = await chargeService.getContractorCharges(contractorId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Contractor charges retrieved successfully',
      data: result,
    });
  },
);

// নির্দিষ্ট চার্জের ডিটেইল্স দেখবে
const getChargeDetail = catchAsync(async (req: Request, res: Response) => {
  const { chargeId } = req.params;
  const result = await chargeService.getChargeById(chargeId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Charge details retrieved successfully',
    data: result,
  });
});


export const chargeController = {
  createCharge,
  getMyCharges,
  getMyContractorCharges,
  getChargeDetail,


};
