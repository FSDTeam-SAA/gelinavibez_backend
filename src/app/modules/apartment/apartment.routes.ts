import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { apartmentController } from './apartment.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  auth(userRole.admin, userRole.contractor),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.createApartment,
);
router.get('/', apartmentController.getAllApartment);
router.get('/:id', apartmentController.singleApartment);
router.put(
  '/:id',
  auth(userRole.admin, userRole.contractor),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.updateApartment,
);
router.delete(
  '/:id',
  auth(userRole.admin, userRole.contractor),
  apartmentController.deleteApartment,
);

export const apartmentRouter = router;
