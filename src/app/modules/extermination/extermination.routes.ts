import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { exterminationController } from './extermination.controller';
const router = express.Router();

router.put(
  '/add-contractor/:id',
  auth(userRole.admin,userRole.superadmin),
  exterminationController.addContractor,
);

router.post(
  '/',
  auth(userRole.user),
  exterminationController.exterminationCreate,
);
router.get(
  '/',
  auth(userRole.admin,userRole.superadmin),
  exterminationController.getAllExtermination,
);
router.get(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  exterminationController.getSingleExtermination,
);
router.put(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  exterminationController.updateExtermination,
);
router.delete(
  '/:id',
  auth(userRole.admin,userRole.superadmin),
  exterminationController.deleteExtermination,
);

export const exterminationRouter = router;
