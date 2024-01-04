import express from 'express';
import { uploadFile, uploadMultipleFile } from '../controllers/uploadFileController';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post('/', upload.single('filename'), uploadFile);
router.post('/multiple', upload.array('filename'), uploadMultipleFile);

// router.delete('/:filename', deleteFile);

export default router;
