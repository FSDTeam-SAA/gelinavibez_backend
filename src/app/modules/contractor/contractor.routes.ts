import express from 'express';
import { contractorController } from './contractor.controller';
import { fileUploader } from '../../helper/fileUploder';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
const router = express.Router();

// কন্ট্রাক্টর Stripe account তৈরি করবে
router.post(
  '/create-stripe-account',
  auth(userRole.contractor),
  contractorController.createStripeAccount,
);

// কন্ট্রাক্টর Stripe dashboard লিংক নেবে
router.get(
  '/dashboard-link',
  auth(userRole.contractor),
  contractorController.getStripeDashboardLink,
);

router.get(
  '/my-assign-extermination',
  auth(userRole.contractor),
  contractorController.getMyContractorAssignExtermination,
);
router.get(
  '/admin-assign-extermination',
  auth(userRole.admin, userRole.superadmin),
  contractorController.getAdminContractorAssignExtermination,
);

router.post(
  '/',
  auth(userRole.user),
  fileUploader.upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 },
  ]),
  contractorController.createContractor,
);

router.get('/', contractorController.getAllContractor);
router.get('/:id', contractorController.getSingleContractor);
router.put('/:id', contractorController.updateContractor);
router.delete('/:id', contractorController.deleteContractor);

export const contractorRouter = router;
