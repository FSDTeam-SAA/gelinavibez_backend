import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { apartmentController } from './apartment.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.get('/group-by-day', apartmentController.getAllApartmentGroupByDay);
router.get('/locations', apartmentController.getAllApartmentLocations);

// my apartment-------------------

router.get(
  '/my-apartments',
  auth(userRole.admin, userRole.user, userRole.contractor),
  apartmentController.getMyApartments,
);
router.get(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor),
  apartmentController.getMySingleApartment,
);
router.put(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.updateMyApartment,
);
router.delete(
  '/my-apartments/:id',
  auth(userRole.admin, userRole.user, userRole.contractor),
  apartmentController.deleteMyApartment,
);

// ---------------------------------

router.post(
  '/',
  auth(userRole.admin, userRole.user, userRole.contractor),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.createApartment,
);
router.get('/', apartmentController.getAllApartment);

router.put(
  '/:id/status',
  auth(userRole.admin),
  apartmentController.updateApartmentStatus,
);

router.get('/:id', apartmentController.singleApartment);
router.put(
  '/:id',
  auth(userRole.admin, userRole.user, userRole.contractor),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  apartmentController.updateApartment,
);
router.delete(
  '/:id',
  auth(userRole.admin),
  apartmentController.deleteApartment,
);

export const apartmentRouter = router;
