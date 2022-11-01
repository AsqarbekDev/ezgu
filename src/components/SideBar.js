import React from "react";
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
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import CircleNotificationsOutlinedIcon from "@mui/icons-material/CircleNotificationsOutlined";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectChats } from "../features/chatsSlice";
import { useEffect } from "react";
import { selectNotifications } from "../features/notificationsSlice";
import { Divider, ListItemButton, Switch } from "@mui/material";
import { selectTheme } from "../features/themeSlice";
import { useCookies } from "react-cookie";

function SideBar({ jobId }) {
  const [currentScreen, setCurrentScreen] = useState("/");
  const [newMessages, setNewMessages] = useState([]);
  const [newNotifications, setNewNotifications] = useState([]);
  const location = useLocation();
  const user = useSelector(selectUser);
  const chats = useSelector(selectChats);
  const notifications = useSelector(selectNotifications);
  const navigate = useNavigate();
  const theme = useSelector(selectTheme);
  const [cookies, setCookie] = useCookies(["theme"]);
  const [darkMode, setDarkMode] = useState(
    cookies.theme === "dark" ? true : false
  );

  useEffect(() => {
    if (cookies.theme === "dark") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, [cookies.theme]);

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
    const newMessagesArray = [];

    notifications.map((item) => {
      if (!item.seen) {
        newMessagesArray.push(item.id);
      }
      return null;
    });

    setNewNotifications(newMessagesArray);
  }, [notifications]);

  useEffect(() => {
    setCurrentScreen(location.pathname);
  }, [location]);

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.textColor,
      }}
      className="fixed shadow-md hidden xl:inline xl:left-0 xl:w-[300px] 2xl:left-20 2xl:w-[348px] top-14 z-50 rounded-lg"
    >
      <button
        style={{
          backgroundColor:
            currentScreen === "/"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(user?.currentJob ? `/jobs/${user.currentJob}` : "/")
        }
      >
        {currentScreen === "/" ? (
          <WorkIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <WorkOutlineIcon style={{ fontSize: 30, color: theme.textColor }} />
        )}
        <p className="text-lg font-[600] ml-4">Ish uchun e'lonlar</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/homes"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() => navigate("/homes")}
      >
        {currentScreen === "/homes" ? (
          <AddHomeWorkIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <AddHomeWorkOutlinedIcon
            style={{ fontSize: 30, color: theme.textColor }}
          />
        )}
        <p className="text-lg font-[600] ml-4">Uy ijarasi uchun e'lonlar</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/add" ||
            currentScreen === "/loading/add" ||
            currentScreen === "/add/newjob" ||
            currentScreen === "/add/newhome"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() => navigate(user?.emailVerified ? "/add" : "/loading/add")}
      >
        {currentScreen === "/add" ||
        currentScreen === "/loading/add" ||
        currentScreen === "/add/newjob" ||
        currentScreen === "/add/newhome" ? (
          <AddCircleIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <AddCircleOutlineIcon
            style={{ fontSize: 30, color: theme.textColor }}
          />
        )}
        <p className="text-lg font-[600] ml-4">E'lon qo'shish</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/chats" ||
            currentScreen === "/loading/chats" ||
            currentScreen === "/chats/blockedUsers"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(user?.emailVerified ? "/chats" : "/loading/chats")
        }
      >
        {currentScreen === "/chats" ||
        currentScreen === "/loading/chats" ||
        currentScreen === "/chats/blockedUsers" ? (
          <div className="relative">
            {newMessages.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full flex items-center justify-center m-1">
                <p className="text-xs text-white px-[5.1px] py-[1px] -mb-[1px]}">
                  {newMessages.length}
                </p>
              </div>
            )}
            <QuestionAnswerIcon
              style={{ fontSize: 30, color: theme.textColor }}
            />
          </div>
        ) : (
          <div className="relative">
            {newMessages.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full flex items-center justify-center m-1">
                <p className="text-xs text-white px-[5.1px] py-[1px] -mb-[1px]">
                  {newMessages.length}
                </p>
              </div>
            )}
            <QuestionAnswerOutlinedIcon
              style={{ fontSize: 30, color: theme.textColor }}
            />
          </div>
        )}
        <p className="text-lg font-[600] ml-4">Xabarlar</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/profile" || currentScreen === "/loading/profile"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(user?.emailVerified ? "/profile" : "/loading/profile")
        }
      >
        {currentScreen === "/profile" ||
        currentScreen === "/loading/profile" ? (
          <AccountCircleIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <AccountCircleOutlinedIcon
            style={{ fontSize: 30, color: theme.textColor }}
          />
        )}
        <p className="text-lg font-[600] ml-4">Foydalanuvchi</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/notifications"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(
            user?.emailVerified ? "/notifications" : "/loading/notifications"
          )
        }
      >
        {currentScreen === "/notifications" ||
        currentScreen === "/loading/notifications" ? (
          <div className="relative">
            <CircleNotificationsIcon
              style={{ fontSize: 30, color: theme.textColor }}
            />
            {newNotifications.length > 0 && (
              <div className="absolute right-0 top-0 bg-red-500 rounded-full px-[5px]">
                <p className="text-white text-xs">{newNotifications.length}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <CircleNotificationsOutlinedIcon
              style={{ fontSize: 30, color: theme.textColor }}
            />
            {newNotifications.length > 0 && (
              <div className="absolute right-0 top-0 bg-red-500 rounded-full px-[5px]">
                <p className="text-white text-xs">{newNotifications.length}</p>
              </div>
            )}
          </div>
        )}
        <p className="text-lg font-[600] ml-4">Bildirishnomalar</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/profile/jobsHistory"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(
            user?.emailVerified
              ? "/profile/jobsHistory"
              : "/loading/profile/jobsHistory"
          )
        }
      >
        {currentScreen === "/profile/jobsHistory" ||
        currentScreen === "/loading/profile/jobsHistory" ? (
          <WorkHistoryIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <WorkHistoryOutlinedIcon
            style={{ fontSize: 30, color: theme.textColor }}
          />
        )}
        <p className="text-lg font-[600] ml-4">Ishlar tarixi</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <button
        style={{
          backgroundColor:
            currentScreen === "/profile/homesHistory"
              ? theme.sidebarBtnBackground
              : theme.background,
        }}
        className={`rounded-lg outline-none flex items-center h-12 px-4 transition transform duration-200 ease-in-out w-full`}
        onClick={() =>
          navigate(
            user?.emailVerified
              ? "/profile/homesHistory"
              : "/loading/profile/homesHistory"
          )
        }
      >
        {currentScreen === "/profile/homesHistory" ||
        currentScreen === "/loading/profile/homesHistory" ? (
          <DomainAddIcon style={{ fontSize: 30, color: theme.textColor }} />
        ) : (
          <DomainAddIcon style={{ fontSize: 30, color: theme.textColor }} />
        )}
        <p className="text-lg font-[600] ml-4">Uy ijaralari tarixi</p>
      </button>
      <Divider
        sx={{
          bgcolor: theme.type === "light" ? "whitesmoke" : "darkgray",
        }}
      />
      <div className="rounded-lg overflow-hidden">
        <ListItemButton
          className="h-12 px-4 transition transform duration-200 ease-in-out w-full"
          onClick={() =>
            cookies.theme === "light" || !cookies.theme
              ? setCookie("theme", "dark", { path: "/" })
              : setCookie("theme", "light", { path: "/" })
          }
          component="a"
        >
          <Switch
            color={theme.type === "light" ? "default" : "primary"}
            size="small"
            style={{
              color: darkMode ? "white" : "black",
            }}
            checked={darkMode}
            inputProps={{ "aria-label": "controlled" }}
            className="-ml-1"
          />
          <p className="text-lg font-[600] ml-[10px]">Ilova Ranggi</p>
        </ListItemButton>
      </div>
    </div>
  );
}

export default SideBar;
