import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
  currentShowing: null,
};

export const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.value = action.payload;
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

export const { setJobs, setCurrentShowing } = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.value;
export const selectCurrentShowing = (state) => state.jobs.currentShowing;

export default jobsSlice.reducer;
