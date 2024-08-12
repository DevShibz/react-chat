import { createSlice, current } from "@reduxjs/toolkit";

export const DataSlice = createSlice({
  name: "Data",
  initialState: {
    data: [],
    flag: true,
  },
  reducers: {
    addData: (state, action) => {
      state.data.push(action.payload);
      console.log(current(state).data);
    },
    setFlag: (state, action) => {
        console.log(action.payload);
      state.flag = action.payload;
    },
  },
});

export const { addData,setFlag } = DataSlice.actions;

export default DataSlice.reducer;
