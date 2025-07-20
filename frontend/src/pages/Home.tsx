// the layout should have the companyListPanel on the left side of the page, taking up 1/4 of the width
// the job log table should be on the right and take up 3/4 of the width

import { JobLogTable } from "../layouts/JobLogTable";
import { CompanyListPanel } from "../layouts/CompanyListPanel";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "15%" },
          minWidth: 240,
          maxWidth: 400,
          height: "100vh",
          borderRight: "1px solid #e0e0e0",
          bgcolor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
        component={Paper}
        square
        elevation={0}
      >
        <CompanyListPanel />
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "85%" },
          height: "100vh",
          bgcolor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
        component={Paper}
        square
        elevation={0}
      >
        <JobLogTable />
      </Box>
    </Box>
  );
};

export default Home;
