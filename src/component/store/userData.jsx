import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removerUser: (state, action) => {
        state.users.filter((user) => action.payload !== user.id)
    }
  },
});

export const { setUsers, addUser, deleteUser, updateUser } = userDataSlice.actions;

export default userDataSlice.reducer;