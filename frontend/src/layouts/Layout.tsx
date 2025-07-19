import { Outlet } from "react-router";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

// Layout component with header
export const Layout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Job Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      {/* the content should span the entire page without margin on left or right */}
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
