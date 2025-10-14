import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { callRequestController } from './callRequest.controller';
const router = express.Router();

router.post('/', auth(userRole.user), callRequestController.createCallRequest);
router.get('/', auth(userRole.admin), callRequestController.getAllCallRequest);
router.get(
  '/:id',
  auth(userRole.admin),
  callRequestController.singleCallRequest,
);
router.put(
  '/:id',
  auth(userRole.admin),
  callRequestController.updateCallRequest,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  callRequestController.deleteCallRequest,
);

export const callRequestRouter = router;
