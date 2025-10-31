import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { tenantController } from './tenant.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.get(
  '/my',
  auth(userRole.user),
  tenantController.getMyAllTenantApplication,
);

router.post(
  '/',
  auth(userRole.user),
  fileUploader.upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'ssnDoc', maxCount: 1 },
    { name: 'voucherDoc', maxCount: 1 },
    { name: 'incomeDoc', maxCount: 1 },
  ]),
  tenantController.createTenant,
);

router.get('/', auth(userRole.admin), tenantController.getAllTenantApplication);

router.get(
  '/:id',
  auth(userRole.admin, userRole.user),
  tenantController.getTenantApplication,
);

router.put(
  '/:id',
  auth(userRole.user, userRole.admin),
  fileUploader.upload.fields([
    { name: 'idCard', maxCount: 1 },
    { name: 'ssnDoc', maxCount: 1 },
    { name: 'voucherDoc', maxCount: 1 },
    { name: 'incomeDoc', maxCount: 1 },
  ]),
  tenantController.updateTenantApplication,
);

router.delete(
  '/:id',
  auth(userRole.user, userRole.admin),
  tenantController.deleteTenantApplication,
);

router.patch(
  '/:id/approve',
  auth(userRole.admin),
  tenantController.approveTenant,
);
router.patch('/:id/deny', auth(userRole.admin), tenantController.denyTenant);

export const tenantRouter = router;
