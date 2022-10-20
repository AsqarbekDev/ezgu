import React, { useEffect, useState } from "react";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import WorkIcon from "@mui/icons-material/Work";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddHomeWorkOutlinedIcon from "@mui/icons-material/AddHomeWorkOutlined";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function BottomNavigation() {
  const [currentScreen, setCurrentScreen] = useState("/");
  const location = useLocation();
  const user = useSelector(selectUser);

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <div className="fixed bottom-0 z-50 w-full flex items-center justify-between bg-white border-t">
      <Link className="iconContainer" to="/">
        {currentScreen === "/" ? <WorkIcon /> : <WorkOutlineIcon />}
      </Link>
      <Link className="iconContainer" to="/homes">
        {currentScreen === "/homes" ? (
          <AddHomeWorkIcon />
        ) : (
          <AddHomeWorkOutlinedIcon />
        )}
      </Link>
      <Link
        className="iconContainer"
        to={user?.emailVerified ? "/add" : "/loading/add"}
      >
        {currentScreen === "/add" ? (
          <AddCircleIcon />
        ) : (
          <AddCircleOutlineIcon />
        )}
      </Link>
      <Link
        className="iconContainer"
        to={user?.emailVerified ? "/chats" : "/loading/chats"}
      >
        {currentScreen === "/chats" ? (
          <QuestionAnswerIcon />
        ) : (
          <QuestionAnswerOutlinedIcon />
        )}
      </Link>
      <Link
        className="iconContainer"
        to={user?.emailVerified ? "/profile" : "/loading/profile"}
      >
        {currentScreen === "/profile" ? (
          <AccountCircleIcon />
        ) : (
          <AccountCircleOutlinedIcon />
        )}
      </Link>
    </div>
  );
}

export default BottomNavigation;
