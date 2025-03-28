import { Box, Paper } from "@mui/material";
import { ReactNode } from "react";

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          padding: { xs: 3, sm: 6 },
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};
