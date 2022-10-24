import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  currentShowing: null,
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
    setCurrentShowing: (state, action) => {
      if (state.value !== null) {
        const curentJob = state.value.filter(
          (item) => item.id === action.payload
        );
        state.currentShowing = curentJob[0];
      }
    },
  },
});

export const { setJobs, setMyAddedJobs, setCurrentShowing } = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.value;
export const selectMyAddedJobs = (state) => state.jobs.myAddedJobs;
export const selectCurrentShowing = (state) => state.jobs.currentShowing;

export default jobsSlice.reducer;
