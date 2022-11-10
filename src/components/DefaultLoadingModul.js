import { CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "../features/themeSlice";

function DefaultLoadingModul() {
  const theme = useSelector(selectTheme);

  return (
    <div
      role="status"
      className="w-full h-screen -mt-14 flex items-center justify-center"
    >
      <CircularProgress
        size={60}
        color={theme.type === "dark" ? "primary" : "inherit"}
      />
    </div>
  );
}

export default DefaultLoadingModul;
