import express from 'express';
import { deleteFile, uploadFile } from '../controllers/uploadFileController';
import multer from 'multer';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
router.post('/', upload.single('filename'), uploadFile);

router.delete('/:filename', deleteFile);

export default router;
