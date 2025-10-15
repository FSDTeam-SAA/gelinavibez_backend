import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { dashboardControllers } from './dashboard.controller';

const router = express.Router();

router.get(
  '/',
  auth(userRole.admin),
  dashboardControllers.dashboardViewCount,
);

export const dashboardRouter = router;
