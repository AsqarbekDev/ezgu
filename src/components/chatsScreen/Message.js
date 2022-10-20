import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";

function Message({
  message,
  mine,
  seen,
  timestamp,
  userImage,
  chatRoomID,
  messageID,
}) {
  const filterMessage = (messageString) => {
    const filteredString = [];
    let string = messageString;
    const limitNumber = Math.round(window.innerWidth / 19);

    while (string !== "") {
      if (string.indexOf(" ") > limitNumber) {
        filteredString.push(string.slice(0, limitNumber));
        string = string.slice(limitNumber, string.length);
      } else if (string.length > limitNumber && string.indexOf(" ") === -1) {
        filteredString.push(string.slice(0, limitNumber));
        string = string.slice(limitNumber, string.length);
      } else if (string.indexOf(" ") === -1) {
        filteredString.push(string.slice(0, string.length));
        string = "";
      } else {
        filteredString.push(string.slice(0, string.indexOf(" ")));
        string = string.slice(string.indexOf(" ") + 1, string.length);
      }
    }
    const newString = filteredString.join(" ");

    return newString;
  };

  useEffect(() => {
    const updateSeen = () => {
      setTimeout(async () => {
        await updateDoc(doc(db, "chats", chatRoomID, "messages", messageID), {
          seen: true,
        });
      }, 1000);
    };
    if (!seen && !mine) {
      updateSeen();
    }
  }, [chatRoomID, messageID, seen, mine]);

  return (
    <div className={`flex items-end mx-1 my-2 ${mine && "justify-end"}`}>
      {!mine && <Avatar src={userImage} style={{ width: 34, height: 34 }} />}
      <p
        className={`${
          mine ? "bg-gray-300 text-black mr-1" : "bg-blue-500 text-white"
        } w-max ml-1 mb-[2px] flex flex-col max-w-[70%] px-3 pt-1 pb-[4px] rounded-2xl`}
      >
        <span className="overflow-hidden">{filterMessage(message)}</span>
        <span
          className={`${
            mine ? "text-gray-600" : "text-gray-300"
          } text-xs text-right font-[600]`}
        >
          {dayjs.unix(timestamp).format("HH:mm")}{" "}
          {seen && mine ? (
            <DoneAllIcon style={{ fontSize: 14, marginTop: -3 }} />
          ) : mine ? (
            <DoneIcon style={{ fontSize: 14, marginTop: -3 }} />
          ) : null}
        </span>
      </p>
    </div>
  );
}

export default Message;
