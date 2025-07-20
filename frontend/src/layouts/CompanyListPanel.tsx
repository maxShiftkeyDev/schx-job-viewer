// this is a side panel that displays the list of companies represented in the jobs list
// ity should use mui just like the other components
// when clicking on a job that will filter the list to only display jobs from that company
import { useEffect, useState } from "react";

import type { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { filterByCompany } from "../features/jobsListSlice";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const CompanyListPanel = () => {
  const [companies, setCompanies] = useState<string[]>([]);
  const jobs = useSelector((state: RootState) => state.jobsList.allJobs);
  const dispatch = useDispatch();

  useEffect(() => {
    // only store unique company names
    setCompanies(
      jobs.reduce((memo, job) => {
        if (!memo.includes(job.companyName)) {
          memo.push(job.companyName);
        }
        return memo;
      }, [] as string[])
    );
  }, [jobs]);

  return (
    <Stack direction="column" spacing={2}>
      {companies.map((company) => (
        <Button
          key={company}
          onClick={() => dispatch(filterByCompany(company))}
        >
          {company}
        </Button>
      ))}
    </Stack>
  );
};
