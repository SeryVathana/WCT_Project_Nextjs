import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
  value: AuthState;
};

type AuthState = {
  isAuth: boolean;
  username: string;
  userID: string;
  isModerator: boolean;
};

const initialState = {
  value: {
    isAuth: true,
    username: 'Sery Vathana',
    userID: '',
    isModerator: false,
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => {
      return initialState;
    },

    logIn: (state, actions) => {
      return {
        value: {
          isAuth: true,
          username: actions.payload.username,
          userID: '92183yh1ud9a7213',
          userEmail: actions.payload.email,
          isModerator: true,
        },
      };
    },
  },
});

export const { logIn, logOut } = auth.actions;

export default auth.reducer;
