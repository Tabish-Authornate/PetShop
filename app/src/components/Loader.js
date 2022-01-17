import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

export default function CircularColor({ color }) {
  return (
    <Stack
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      sx={{ color: "grey.500" }}
      spacing={2}
      direction="column"
    >
      <CircularProgress color={color != null ? color : "secondary"} />
    </Stack>
  );
}
