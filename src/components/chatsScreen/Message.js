import { Avatar } from "@mui/material";
import dayjs from "dayjs";
import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { db } from "../../firebase";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import { useRef } from "react";

function Message({
  message,
  mine,
  seen,
  timestamp,
  userImage,
  chatRoomID,
  messageID,
  setCurrentShowingDate,
  currentShowingDate,
  setShowAgain,
  showAgain,
  setShowDate,
  showDate,
  setTimestampDate,
  showAvatar,
}) {
  const mRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = (e) => {
      setTimestampDate(dayjs().unix());
      if (
        mRef.current.getBoundingClientRect().bottom < 56 ||
        mRef.current.getBoundingClientRect().top > 104
      ) {
      } else {
        if (currentShowingDate !== dayjs.unix(timestamp).format("DD/MM/YYYY")) {
          setCurrentShowingDate(dayjs.unix(timestamp).format("DD/MM/YYYY"));
          setShowDate(messageID);
        } else if (
          !showAgain &&
          !showDate &&
          currentShowingDate === dayjs.unix(timestamp).format("DD/MM/YYYY")
        ) {
          setShowAgain(messageID);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    message,
    timestamp,
    setCurrentShowingDate,
    currentShowingDate,
    showAgain,
    setShowAgain,
    messageID,
    showDate,
    setShowDate,
    setTimestampDate,
  ]);

  return (
    <div
      ref={mRef}
      className={`flex items-end mx-1 my-2 ${mine && "justify-end"}`}
    >
      {currentShowingDate &&
        !showAgain &&
        showDate === messageID &&
        currentShowingDate === dayjs.unix(timestamp).format("DD/MM/YYYY") &&
        currentShowingDate !==
          dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") && (
          <div className="fixed z-40 top-16 w-full flex justify-center">
            <div className="bg-black opacity-80 text-white rounded-lg">
              <p className="px-2 py-1">{currentShowingDate}</p>
            </div>
          </div>
        )}
      {showAgain === messageID &&
        currentShowingDate !==
          dayjs.unix(dayjs().unix()).format("DD/MM/YYYY") && (
          <div className="fixed z-40 top-16 w-full flex justify-center">
            <div className="bg-black opacity-80 text-white rounded-lg">
              <p className="px-2 py-1">{currentShowingDate}</p>
            </div>
          </div>
        )}
      {!mine && (
        <Avatar
          src={showAvatar ? userImage : null}
          style={{ width: 34, height: 34 }}
        />
      )}
      <p
        className={`${
          mine ? "bg-gray-300 text-black mr-1" : "bg-blue-500 text-white"
        } w-max ml-1 mb-[2px] flex flex-col max-w-[70%] px-3 pt-1 pb-[4px] rounded-2xl`}
      >
        <span className="overflow-hidden text-lg">
          {filterMessage(message)}
        </span>
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
