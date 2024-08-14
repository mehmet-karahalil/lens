import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: {
    increment (state) {
         state.count++
    },
    decrement (state){
       state.count--
    },
    reflesh (state) {
        state.count = 0
    },
    customIncrement (state, action) {
        state.count += action.payload
    },
  },
});

export const { increment, decrement, reflesh, customIncrement } = counterSlice.actions;
export default counterSlice.reducer;