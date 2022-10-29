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
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectChats } from "../features/chatsSlice";
import BottomNavigationM from "@mui/material/BottomNavigation";
import { BottomNavigationAction } from "@mui/material";

function BottomNavigation({ jobId }) {
  const [currentScreen, setCurrentScreen] = useState("/");
  const [newMessages, setNewMessages] = useState([]);
  const location = useLocation();
  const user = useSelector(selectUser);
  const chats = useSelector(selectChats);
  const navigate = useNavigate();

  useEffect(() => {
    const newMessagesArray = [];
    Object.keys(chats).map((key) => {
      for (let i = 0; i < chats[key]?.messages.length; i++) {
        if (
          chats[key]?.messages[i].uid !== user?.uid &&
          !chats[key]?.messages[i].seen
        ) {
          newMessagesArray.push(key);
          break;
        }
      }
      return null;
    });
    setNewMessages(newMessagesArray);
  }, [chats, user?.uid]);

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <div
      className={`${
        currentScreen === "/" ||
        currentScreen === `/jobs/${jobId}` ||
        currentScreen === "/homes" ||
        currentScreen === "/add" ||
        currentScreen === "/loading/add" ||
        currentScreen === "/chats" ||
        currentScreen === "/loading/chats" ||
        currentScreen === "/profile" ||
        currentScreen === "/loading/profile"
          ? ""
          : "hidden"
      } fixed bottom-0 z-50 w-full bg-white xl:hidden`}
    >
      <BottomNavigationM className="w-full max-w-2xl flex items-center justify-between border-t">
        <BottomNavigationAction
          className="iconContainer"
          onClick={() =>
            navigate(user?.currentJob ? `/jobs/${user.currentJob}` : "/")
          }
          icon={
            currentScreen === "/" || currentScreen === `/jobs/${jobId}` ? (
              <WorkIcon style={{ fontSize: 30, color: "black" }} />
            ) : (
              <WorkOutlineIcon style={{ fontSize: 30, color: "black" }} />
            )
          }
        />
        <BottomNavigationAction
          className="iconContainer"
          onClick={() => navigate("/homes")}
          icon={
            currentScreen === "/homes" ? (
              <AddHomeWorkIcon style={{ fontSize: 30, color: "black" }} />
            ) : (
              <AddHomeWorkOutlinedIcon
                style={{ fontSize: 30, color: "black" }}
              />
            )
          }
        />
        <BottomNavigationAction
          className="iconContainer"
          onClick={() =>
            navigate(user?.emailVerified ? "/add" : "/loading/add")
          }
          icon={
            currentScreen === "/add" || currentScreen === "/loading/add" ? (
              <AddCircleIcon style={{ fontSize: 30, color: "black" }} />
            ) : (
              <AddCircleOutlineIcon style={{ fontSize: 30, color: "black" }} />
            )
          }
        />
        <BottomNavigationAction
          className="iconContainer"
          onClick={() =>
            navigate(user?.emailVerified ? "/chats" : "/loading/chats")
          }
          icon={
            currentScreen === "/chats" || currentScreen === "/loading/chats" ? (
              <div className="relative">
                {newMessages.length > 0 && (
                  <div className="absolute -top-3 -right-2 bg-blue-500 rounded-full flex items-center justify-center m-1">
                    <p className="text-xs text-white px-[5.1px] py-[1px] -mb-[1px]}">
                      {newMessages.length}
                    </p>
                  </div>
                )}
                <QuestionAnswerIcon style={{ fontSize: 30, color: "black" }} />
              </div>
            ) : (
              <div className="relative">
                {newMessages.length > 0 && (
                  <div className="absolute -top-3 -right-2 bg-blue-500 rounded-full flex items-center justify-center m-1">
                    <p className="text-xs text-white px-[5.1px] py-[1px] -mb-[1px]">
                      {newMessages.length}
                    </p>
                  </div>
                )}
                <QuestionAnswerOutlinedIcon
                  style={{ fontSize: 30, color: "black" }}
                />
              </div>
            )
          }
        />
        <BottomNavigationAction
          className="iconContainer"
          onClick={() =>
            navigate(user?.emailVerified ? "/profile" : "/loading/profile")
          }
          icon={
            currentScreen === "/profile" ||
            currentScreen === "/loading/profile" ? (
              <AccountCircleIcon style={{ fontSize: 30, color: "black" }} />
            ) : (
              <AccountCircleOutlinedIcon
                style={{ fontSize: 30, color: "black" }}
              />
            )
          }
        />
      </BottomNavigationM>
    </div>
  );
}

export default BottomNavigation;
