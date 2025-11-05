import express from 'express';
import { userController } from './user.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../helper/fileUploder';
import { userRole } from './user.constant';

const router = express.Router();

router.post(
  '/create-user',
  validationRequest(userValidation.userSchema),
  userController.createUser,
);

router.get(
  '/profile',
  auth(userRole.admin, userRole.contractor, userRole.user, userRole.superadmin),
  userController.profile,
);
router.put(
  '/profile',
  auth(userRole.admin, userRole.contractor, userRole.user, userRole.superadmin),
  fileUploader.upload.single('profileImage'),
  userController.updateUserById,
);

// request admin
router.post('/request-admin', auth(userRole.user), userController.requestAdmin);
router.put(
  '/update-admin/:id',
  auth(userRole.superadmin),
  userController.updateAdmin,
);
router.delete(
  '/delete-admin/:id',
  auth(userRole.superadmin),
  userController.deleteAdmin,
);
router.get(
  '/all-request-admin',
  auth(userRole.superadmin),
  userController.allRequestAdmin,
);

router.get(
  '/all-user',
  auth(userRole.admin, userRole.superadmin),
  userController.getAllUser,
);
router.get(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.getUserById,
);

router.delete(
  '/:id',
  auth(userRole.admin, userRole.superadmin),
  userController.deleteUserById,
);

export const userRoutes = router;
