import { CircularProgress } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDisableScroll } from "../features/disableScrollSlice";
import { selectTheme } from "../features/themeSlice";
import { selectWaiting } from "../features/userSlice";

function DefaultLoadingModul() {
  const theme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const waiting = useSelector(selectWaiting);

  useEffect(() => {
    dispatch(setDisableScroll(true));
    return () => {
      dispatch(setDisableScroll(false));
    };
  }, [dispatch]);

  return (
    <div
      role="status"
      className={`w-full h-screen ${
        !waiting && "-mt-14"
      } flex items-center justify-center`}
    >
      <CircularProgress
        size={60}
        color={theme.type === "dark" ? "primary" : "inherit"}
      />
    </div>
  );
}

export default DefaultLoadingModul;
