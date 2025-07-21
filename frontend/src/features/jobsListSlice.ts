import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchJobs = createAsyncThunk("jobs/fetchJobs", async () => {
  const response = await fetch(`${API_URL}/list-jobs`);
  return response.json().then((data) => {
    const jobsArray = data.jobs || data;
    return jobsArray;
  });
});

export interface Job {
  jobId: string;
  companyName: string;
  jobType: string;
  tenantName: string;
  totalItemsProcessed: number;
  totalInvalidItems: number;
  jobTimestamp: string;
  s3ObjectKey: string;
}

interface JobsListState {
  allJobs: Job[];
  visibleJobs: Job[];
  selectedCompany: string;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JobsListState = {
  allJobs: [],
  visibleJobs: [],
  selectedCompany: "",
  status: "idle",
  error: null,
};

// here, I will be updating this slice with the recpoinse fropm an api request where we will get a list of jobs.
// we simply want to add the jobs to the state when we get a response from the api.
export const jobsListSlice = createSlice({
  name: "jobsList",
  initialState,
  reducers: {
    filterByCompany: (state, action: PayloadAction<string>) => {
      const company = action.payload;
      state.selectedCompany = company;
      state.visibleJobs = state.allJobs.filter(
        (job) => job.companyName === company
      );
    },
    clearCompanyFilter: (state) => {
      state.selectedCompany = "";
      state.visibleJobs = state.allJobs;
    },
    setVisibleJobs: (state, action: PayloadAction<Job[]>) => {
      state.visibleJobs = action.payload;
    },
    setAllJobs: (state, action: PayloadAction<Job[]>) => {
      state.allJobs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobs.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.allJobs = action.payload;
      state.visibleJobs = action.payload;
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch jobs";
    });
  },
});

export const {
  filterByCompany,
  clearCompanyFilter,
  setVisibleJobs,
  setAllJobs,
} = jobsListSlice.actions;

export default jobsListSlice.reducer;
