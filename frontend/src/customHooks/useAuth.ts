import { auth } from '@/configs/firebase-config';
import { logIn } from '@/redux/features/auth-slice';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged(async (userCred) => {
      if (userCred) {
        const token = await userCred.getIdToken();
        const userRes = await axios.get(`${API_URL}/user/${userCred.uid}`);
        const userData = await userRes.data[0];
        if (userData) {
          dispatch(
            logIn({
              uid: userCred.uid,
              username: userData.lastName + ' ' + userData.firstName,
              email: userData.email,
              token: token,
              pfURL: userData.photoURL,
              isModerator: userData.isModerator,
            })
          );
          localStorage.setItem('auth', 'true');
        }
      }
    });
  }, []);

  return true;
};
