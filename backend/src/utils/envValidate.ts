import { cleanEnv, port, str } from 'envalid';

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING: str(),
  PORT: port(),
  FB_API_KEY: str(),
  FB_AUTH_DOMAIN: str(),
  FB_PROJECT_ID: str(),
  FB_STORAGE_BUCKET: str(),
  FB_MESSAGING_SENDER_ID: str(),
  FB_APP_ID: str(),
  FB_MEASUREMENT_ID: str(),
});
