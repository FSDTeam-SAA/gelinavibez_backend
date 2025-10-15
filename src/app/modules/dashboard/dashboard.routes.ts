import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { dashboardController } from './dashboard.service';
const router = express.Router();

router.get(
  '/',
  auth(userRole.admin),
  dashboardController.dashboardViewCount,
);

export const dashboardRouter = router;
