import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  value: AuthState;
};

type AuthState = {
  isAuth: boolean;
  username: string;
  userID: string;
  isModerator: boolean;
  userEmail: string;
  userToken: string;
  userPfURL: string;
};

const initialState = {
  value: {
    userID: '',
    username: 'Guest',
    userEmail: '',
    userToken: '',
    // isAuth: localStorage.getItem('auth') == 'true' || false,
    isAuth: false,
    isModerator: false,
    userPfURL: '',
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      localStorage.setItem('auth', 'false');
      return initialState;
    },

    logIn: (state, actions) => {
      return {
        value: {
          isAuth: true,
          username: actions.payload.username,
          userID: actions.payload.uid,
          userEmail: actions.payload.email,
          isModerator: actions.payload.isModerator,
          userToken: actions.payload.token,
          userPfURL: actions.payload.pfURL,
        },
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;

export default auth.reducer;
