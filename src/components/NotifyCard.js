import { Avatar } from "@mui/material";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import dayjs from "dayjs";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import WorkIcon from "@mui/icons-material/Work";
import BlockIcon from "@mui/icons-material/Block";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

function NotifyCard({
  id,
  userID,
  userImage,
  userName,
  notifyName,
  message,
  messageType,
  timestamp,
  from,
  seen,
  notifyID,
}) {
  const navigate = useNavigate();
  const user = useSelector(selectUser);

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

  return (
    <div className="bg-white m-1 p-3 rounded-lg shadow-lg">
      <div className="flex items-center">
        <Avatar
          style={{ width: 30, height: 30 }}
          alt={userName}
          src={userImage}
        />
        <h5 className="font-[600] text-lg truncate flex-1 ml-2">{userName}</h5>
        {userID !== user.uid && (
          <div className="relative">
            <button
              onClick={() => navigate(`/chats/${userID}`)}
              className="absolute z-20 -top-[3px] right-[8px] rounded-sm overflow-hidden w-8 h-8"
            ></button>
            <SendIcon
              style={{ fontSize: 22 }}
              className="-rotate-45 -mt-2 mx-3"
            />
          </div>
        )}
        {messageType === "removed" || messageType === "unbanned" ? (
          <button
            onClick={() => navigate(`/jobs/${notifyID}`)}
            className="w-8 h-8 rounded-sm overflow-hidden -mb-[1px]"
          >
            <WorkIcon style={{ fontSize: 26 }} />
          </button>
        ) : messageType === "banned" ? (
          <div className="w-8 h-8 rounded-sm overflow-hidden -mb-[6px]">
            <BlockIcon style={{ fontSize: 26 }} />
          </div>
        ) : messageType === "deletedHome" ? null : (
          <button
            onClick={() => navigate("/profile/jobsHistory")}
            className="w-8 h-8 rounded-sm overflow-hidden -mb-[1px]"
          >
            <WorkHistoryIcon style={{ fontSize: 26 }} />
          </button>
        )}
        {from === "homes" && (
          <button
            onClick={() => navigate("/profile/homesHistory")}
            className="w-8 h-8 rounded-sm overflow-hidden -mb-[1px]"
          >
            <DomainAddIcon style={{ fontSize: 26 }} />
          </button>
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
            : "bg-black"
        } mt-2 mb-1`}
      ></div>
      <div>
        <div className="flex items-start">
          <h2 className="font-bold text-lg flex-1 overflow-hidden">
            {notifyName}
          </h2>
          <p className="mt-[2px] ml-3 text-sm font-bold text-[#4a4847]">
            {timestamp < dayjs().unix() - 86400
              ? dayjs.unix(timestamp).format("MM/DD/YYYY")
              : dayjs.unix(timestamp).format("HH:mm")}
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
              : "text-black"
          } overflow-hidden`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

export default NotifyCard;
