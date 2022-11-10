import { Avatar, IconButton } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import dayjs from "dayjs";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import WorkIcon from "@mui/icons-material/Work";
import BlockIcon from "@mui/icons-material/Block";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { selectTheme } from "../features/themeSlice";
import { selectLanguage } from "../features/languageSlice";
import ActionModul from "./ActionModul";
import { useState } from "react";

function NotifyCard({
  id,
  userID,
  userImage,
  userName,
  notifyName,
  messageType,
  timestamp,
  from,
  seen,
  notifyID,
}) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const theme = useSelector(selectTheme);
  const language = useSelector(selectLanguage);

  const [showDeleteModul, setShowDeleteModul] = useState(false);

  useEffect(() => {
    const updateSeen = () => {
      setTimeout(async () => {
        await updateDoc(doc(db, "notifications", id), {
          seen: true,
        });
      }, 1000);
    };
    if (!seen) {
      updateSeen();
    }
  }, [id, seen]);

  const deleteNotification = async () => {
    setShowDeleteModul(false);
    await deleteDoc(doc(db, "notifications", id));
  };

  return (
    <div
      style={{ backgroundColor: theme.background, color: theme.textColor }}
      className="bg-white m-1 p-3 rounded-lg shadow-lg"
    >
      {showDeleteModul && (
        <ActionModul
          inner
          text={language.notifications.deleteModulText}
          cancelFunction={(value) => setShowDeleteModul(value)}
          confirmFunction={deleteNotification}
        />
      )}
      <div className="flex items-center">
        <Avatar
          style={{ width: 30, height: 30 }}
          alt={userName}
          src={userImage}
        />
        <h5 className="font-[600] text-lg truncate flex-1 ml-2">{userName}</h5>
        <div className="-mb-1 mr-[2px]">
          <IconButton onClick={() => setShowDeleteModul(true)} size="small">
            <DeleteForeverIcon
              style={{ fontSize: 26, color: theme.textColor }}
            />
          </IconButton>
        </div>
        {userID !== user.uid && (
          <IconButton onClick={() => navigate(`/chats/${userID}`)} size="small">
            <SendIcon
              style={{ fontSize: 22, color: theme.textColor }}
              className="-rotate-45"
            />
          </IconButton>
        )}
        {messageType === "removed" || messageType === "unbanned" ? (
          <div className="-mb-1">
            <IconButton
              onClick={() => navigate(`/jobs/${notifyID}`)}
              size="small"
            >
              <WorkIcon style={{ fontSize: 26, color: theme.textColor }} />
            </IconButton>
          </div>
        ) : messageType === "banned" ? (
          <div className="-mb-1">
            <IconButton size="small">
              <BlockIcon style={{ fontSize: 26, color: theme.textColor }} />
            </IconButton>
          </div>
        ) : messageType === "deletedHome" ? null : (
          <div className="-mb-1">
            <IconButton
              size="small"
              onClick={() => navigate("/profile/jobsHistory")}
            >
              <WorkHistoryIcon
                style={{ fontSize: 26, color: theme.textColor }}
              />
            </IconButton>
          </div>
        )}
        {from === "homes" && (
          <div className="-mb-1">
            <IconButton
              size="small"
              onClick={() => navigate("/profile/homesHistory")}
            >
              <DomainAddIcon style={{ fontSize: 26, color: theme.textColor }} />
            </IconButton>
          </div>
        )}
      </div>
      <div
        className={`h-[0.1px] w-full ${
          messageType === "deleted" ||
          messageType === "removed" ||
          messageType === "banned" ||
          messageType === "deletedHome"
            ? "bg-red-700"
            : messageType === "success" || messageType === "mySuccess"
            ? "bg-green-700"
            : "bg-blue-700"
        } mt-2 mb-1`}
      ></div>
      <div>
        <div className="flex items-start">
          <h2 className="font-bold text-lg leading-6 flex-1 overflow-hidden">
            {notifyName}
          </h2>
          <p
            style={{ color: theme.iconColor }}
            className="mt-[2px] ml-3 text-sm font-bold"
          >
            {dayjs.unix(timestamp).format("HH:mm")}
            <span className="ml-2">
              {dayjs.unix(timestamp).format("DD/MM/YYYY") !==
                dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") &&
                dayjs.unix(timestamp).format("DD/MM/YYYY")}
            </span>
          </p>
        </div>
        <p
          className={`text-sm font-[600] ${
            messageType === "deleted" ||
            messageType === "removed" ||
            messageType === "banned" ||
            messageType === "deletedHome"
              ? "text-red-600"
              : messageType === "success" || messageType === "mySuccess"
              ? "text-green-600"
              : "text-blue-600"
          } overflow-hidden`}
        >
          {messageType === "mySuccess" && language.allNotifications.successJob}
          {messageType === "deletedHome" &&
            language.allNotifications.deletedHome}
          {messageType === "success" &&
            language.allNotifications.successNotification}
          {messageType === "deleted" &&
            language.allNotifications.deleteNotification}
          {messageType === "unbanned" &&
            language.allNotifications.unbanNotification}
          {messageType === "removed" &&
            language.allNotifications.removeNotification}
          {messageType === "banned" &&
            language.allNotifications.banNotification}
        </p>
      </div>
    </div>
  );
}

export default NotifyCard;
