import 'dotenv/config';
import env from '../utils/envValidate';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: env.FB_API_KEY,
  authDomain: env.FB_AUTH_DOMAIN,
  projectId: env.FB_PROJECT_ID,
  storageBucket: env.FB_STORAGE_BUCKET,
  messagingSenderId: env.FB_MESSAGING_SENDER_ID,
  appId: env.FB_APP_ID,
  measurementId: env.FB_MEASUREMENT_ID,
};

export default firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
