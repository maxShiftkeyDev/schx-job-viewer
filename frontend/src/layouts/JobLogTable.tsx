// this is the layout for the job log table
// it will contain a list of job logs and a search bar to filter the jobs
// it shoiuld use mui and display each job as a row with ciolumns for each data point

import { useEffect } from "react";

import type { RootState, AppDispatch } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { fetchJobs, clearCompanyFilter } from "../features/jobsListSlice";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Download } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const JobLogTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const jobs = useSelector((state: RootState) => state.jobsList.visibleJobs);
  const status = useSelector((state: RootState) => state.jobsList.status);
  const allJobs = useSelector((state: RootState) => state.jobsList.allJobs);
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Format timestamp to YYYY-MM-DD HH:MM TZ
  const formatTimestamp = (timestamp: string) => {
    console.log("Timestamp:", timestamp);
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Get timezone abbreviation
    // This works in most modern browsers
    const tzMatch = date
      .toLocaleTimeString("en-us", { timeZoneName: "short" })
      .match(/\b([A-Z]{2,5})\b$/);
    const tzAbbr = tzMatch ? tzMatch[1] : "";

    const formatted = `${year}-${month}-${day} ${hours}:${minutes} ${tzAbbr}`;
    console.log("Formatted timestamp:", formatted);
    return formatted;
  };

  // Handle download logs
  const handleDownloadLogs = async (s3ObjectName: string) => {
    try {
      const response = await fetch(
        "https://vsa99h8mq4.execute-api.us-east-1.amazonaws.com/Prod/download-job-logs",
        {
          method: "POST",
          body: JSON.stringify({ s3ObjectName }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Download response data:", data);

        if (data.presignedUrl) {
          window.open(data.presignedUrl, "_blank");
        } else {
          console.error("No presigned URL found in response");
        }
      } else {
        console.error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  //   now lets display the jobs in a table
  //   use jobId as the unique identifier for the rows
  const columns: GridColDef[] = [
    { field: "companyName", headerName: "Company Name", width: 200 },
    { field: "tenantName", headerName: "Tenant Name", width: 200 },
    { field: "jobType", headerName: "Job Type", width: 100 },

    {
      field: "totalItemsProcessed",
      headerName: "Total Items Processed",
      width: 100,
    },
    {
      field: "totalInvalidItems",
      headerName: "Total Invalid Items",
      width: 100,
    },
    {
      field: "jobTimestamp",
      headerName: "Job Timestamp",
      width: 200,
      valueFormatter: (params) => formatTimestamp(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Download />}
          label="Download Logs"
          onClick={() => handleDownloadLogs(params.row.s3ObjectKey)}
        />,
      ],
    },
  ];

  if (status === "loading") {
    return <div>Loading jobs...</div>;
  }

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={() => dispatch(clearCompanyFilter())}
          disabled={jobs.length === allJobs.length}
        >
          Clear Filter
        </Button>
      </Stack>
      <DataGrid rows={jobs} columns={columns} getRowId={(row) => row.jobId} />
    </div>
  );
};
