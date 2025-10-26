import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { paymentController } from './payment.controller';
const router = express.Router();

router.get('/', auth(userRole.admin), paymentController.getAllPayment);
router.get(
  '/my',
  auth(userRole.contractor, userRole.admin, userRole.user),
  paymentController.getMyAllPayment,
);
router.get('/:id', auth(userRole.admin), paymentController.singlePayment);
router.put('/:id', auth(userRole.admin), paymentController.updatePayment);
router.delete('/:id', auth(userRole.admin), paymentController.deletePayment);

export const paymentRouter = router;
