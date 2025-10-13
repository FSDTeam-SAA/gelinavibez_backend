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
  auth(userRole.admin, userRole.contractor, userRole.expert, userRole.tenant),
  userController.profile,
);

router.get('/all-user', auth(userRole.admin), userController.getAllUser);
router.get('/:id', auth(userRole.admin), userController.getUserById);
router.put(
  '/:id',
  auth(userRole.admin),
  fileUploader.upload.single('profileImage'),
  validationRequest(userValidation.updateUserSchema),
  userController.updateUserById,
);
router.delete('/:id', auth(userRole.admin), userController.deleteUserById);

export const userRoutes = router;
