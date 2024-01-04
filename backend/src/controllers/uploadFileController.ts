import express, { RequestHandler } from 'express';
import { initializeApp } from 'firebase/app';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import firebaseConfig from '../configs/firebase.config';
import multer from 'multer';

const router = express.Router();

initializeApp(firebaseConfig);

const storage = getStorage();

// const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  res.send('hi');
});

export const uploadFile: RequestHandler = async (req, res) => {
  try {
    const dateTime = giveCurrentDateTime();

    const filename = `${req.file?.originalname}-${dateTime}`;

    const storageRef = ref(storage, `files/${filename}`);

    const metadata = {
      contentType: req.file?.mimetype,
    };

    if (!req.file?.buffer) {
      throw Error('no file founded');
    }

    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('file successfuly uploaded');

    return res.send({
      message: 'file uploaded to firebase storage',
      name: req.file.originalname,
      storageFileName: filename,
      type: req.file.mimetype,
      downloadURL: downloadURL,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};
export const uploadMultipleFile = async (req: any, res: any) => {
  try {
    let filesRes: any = [];

    await Promise.all(
      req.files?.map(async (file: any) => {
        const dateTime = giveCurrentDateTime();
        const filename = `${file.originalname}-${dateTime}`;
        const storageRef = ref(storage, `files/${filename}`);
        const metadata = {
          contentType: file.mimetype,
        };

        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        filesRes.push({
          message: 'file uploaded to firebase storage',
          name: file.originalname,
          storageFileName: filename,
          type: file.mimetype,
          downloadURL: downloadURL,
        });

        console.log(filesRes);
      })
    );

    return res.send(filesRes);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err);
  }
};

// export const deleteFile: RequestHandler = async (req, res) => {
//   const filename = req.params.filename;
//   try {
//     const desertRef = ref(storage, `files/${filename}`);
//     deleteObject(desertRef)
//       .then(() => {
//         // File deleted successfully
//         res.send('Deleted');
//       })
//       .catch((error) => {
//         // Uh-oh, an error occurred!
//         res.send('error');
//       });
//   } catch (err) {
//     return res.status(400).send(err);
//   }
// };

const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + '-' + time;
  return dateTime;
};
