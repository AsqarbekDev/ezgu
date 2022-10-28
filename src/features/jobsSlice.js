import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  myAddedJobs: [],
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.value = action.payload;
    },
    setMyAddedJobs: (state, action) => {
      state.myAddedJobs = action.payload;
    },
  },
});

export const { setJobs, setMyAddedJobs } = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.value;
export const selectMyAddedJobs = (state) => state.jobs.myAddedJobs;

export default jobsSlice.reducer;
