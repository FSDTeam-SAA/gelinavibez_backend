import MessagingRequest from './messagingRequest.model';
import AppError from '../../error/appError';

const createRequest = async (requesterId: string, targetId: string) => {
  if (requesterId === targetId) {
    throw new AppError(400, 'Invalid request');
  }

  const exists = await MessagingRequest.findOne({
    requester: requesterId,
    target: targetId,
    status: 'pending',
  });

  if (exists) {
    throw new AppError(400, 'Request already sent');
  }

  return MessagingRequest.create({
    requester: requesterId,
    target: targetId,
  });
};

const getAllPending = async () => {
  return MessagingRequest.find({ status: 'pending' })
    .populate('requester', 'firstName lastName role email')
    .populate('target', 'firstName lastName role email');
};

export const messagingRequestService = {
  createRequest,
  getAllPending,
};
