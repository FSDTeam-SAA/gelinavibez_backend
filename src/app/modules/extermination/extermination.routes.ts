import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { exterminationController } from './extermination.controller';
const router = express.Router();

router.post(
  '/',
  auth(userRole.user),
  exterminationController.exterminationCreate,
);
router.get(
  '/',
  auth(userRole.admin),
  exterminationController.getAllExtermination,
);
router.get(
  '/:id',
  auth(userRole.admin),
  exterminationController.getSingleExtermination,
);
router.put(
  '/:id',
  auth(userRole.admin),
  exterminationController.updateExtermination,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  exterminationController.deleteExtermination,
);

export const exterminationRouter = router;
