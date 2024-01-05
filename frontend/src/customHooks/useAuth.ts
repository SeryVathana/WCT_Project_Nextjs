import { auth } from '@/configs/firebase-config';
import { logIn } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  auth.onAuthStateChanged(async (userCred) => {
    if (userCred) {
      const token = await userCred.getIdToken();
      dispatch(logIn({ username: userCred.displayName, email: userCred.email, token: token }));
      window.localStorage.setItem('auth', 'true');
    }
  });
};
