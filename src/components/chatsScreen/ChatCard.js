import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectChats } from "../../features/chatsSlice";
import { selectUser } from "../../features/userSlice";
import { useState } from "react";

function ChatCard({
  id,
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
  const chats = useSelector(selectChats);
  const user = useSelector(selectUser);
  const [newMessages, setNewMessages] = useState([]);

  useEffect(() => {
    const newMessagesArray = [];

    chats[id]?.messages.map((item) => {
      if (item.uid !== user.uid && !item.seen) {
        newMessagesArray.push(item.id);
      }
      return null;
    });

    setNewMessages(newMessagesArray);
  }, [chats, id, user.uid]);

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
      <div className="flex flex-col items-end">
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
        {newMessages.length > 0 && (
          <div className="bg-blue-500 rounded-full flex items-center justify-center m-1">
            <p className="text-xs text-white -mt-[0.5px] -ml-[0.1px] px-[6.1px] py-[2px]">
              {newMessages.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatCard;
