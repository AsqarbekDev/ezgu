import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

function ChatCard({
  uid,
  username,
  userImage,
  timestamp,
  lastMessage,
  lastImage,
  seen,
  mine,
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/chats/${uid}`)}
      className="bg-white border-b m-1 flex justify-between px-2 py-2 rounded-lg cursor-pointer"
    >
      <div className="flex items-center">
        <Avatar src={userImage} style={{ width: 50, height: 50 }} />
      </div>
      <div className="ml-2 mr-1 mt-[5px] truncate flex-1">
        <p className="font-[700] -mt-[5px] text-lg truncate flex-1">
          {username}
        </p>
        {lastImage ? (
          <img
            src={lastImage}
            className="h-5 w-5 object-cover rounded-md"
            alt=""
          />
        ) : (
          <p className="text-xs truncate flex-1">{lastMessage}</p>
        )}
      </div>
      <p className="text-xs text-gray-600 font-[600] mt-[5px] mr-1">
        {seen && mine ? (
          <DoneAllIcon
            style={{ fontSize: 14, marginTop: -3, marginRight: 2 }}
          />
        ) : mine ? (
          <DoneIcon style={{ fontSize: 14, marginTop: -3, marginRight: 2 }} />
        ) : null}
        {timestamp < dayjs().unix() - 86400
          ? dayjs.unix(timestamp).format("MM/DD/YYYY")
          : dayjs.unix(timestamp).format("HH:mm")}
      </p>
    </div>
  );
}

export default ChatCard;
