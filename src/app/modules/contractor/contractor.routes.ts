import express from 'express';
import { contractorController } from './contractor.controller';
import { fileUploader } from '../../helper/fileUploder';
const router = express.Router();

router.post(
  '/',
  fileUploader.upload.single('image'),
  contractorController.createContractor,
);

router.get('/', contractorController.getAllContractor);
router.get('/:id', contractorController.getSingleContractor);
router.put('/:id', contractorController.updateContractor);
router.delete('/:id', contractorController.deleteContractor);

export const contractorRouter = router;
